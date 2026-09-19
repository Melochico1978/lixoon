import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.WebSocket;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletionStage;
import java.util.function.Consumer;

public class ApiService {
    private static ApiService instance = null;
    private final String apiBaseURL = "https://api.lixoon.com.br/api/v1";
    private final String wsURL = "wss://ws.lixoon.com.br";
    private WebSocket socket = null;
    private final List<Consumer<String>> listeners = new ArrayList<>();
    private final HttpClient httpClient;
    private int reconnectAttempts = 0;

    private ApiService() {
        this.httpClient = HttpClient.newHttpClient();
        setupWebSocket();
    }

    public static synchronized ApiService getInstance() {
        if (instance == null) {
            instance = new ApiService();
        }
        return instance;
    }

    // Métodos HTTP usando java.net.http.HttpClient
    public String getCaminhoes() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiBaseURL + "/caminhoes"))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new RuntimeException("HTTP " + response.statusCode());
        }
        return response.body();
    }

    public String getCaminhaoProximo(double lat, double lng) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiBaseURL + "/caminhoes/proximo?lat=" + lat + "&lng=" + lng))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new RuntimeException("HTTP " + response.statusCode());
        }
        return response.body();
    }

    public String agendarColeta(String jsonBody) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiBaseURL + "/agendamentos"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new RuntimeException("HTTP " + response.statusCode());
        }
        return response.body();
    }

    public String getRotas() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiBaseURL + "/rotas"))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new RuntimeException("HTTP " + response.statusCode());
        }
        return response.body();
    }

    public String getHistoricoColetas() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiBaseURL + "/historico"))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new RuntimeException("HTTP " + response.statusCode());
        }
        return response.body();
    }

    // Health Check
    public String checkHealth() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiBaseURL.replace("/api/v1", "") + "/health"))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (Exception e) {
            return "{\"status\": \"DOWN\", \"error\": \"" + e.getMessage() + "\"}";
        }
    }

    // WebSocket com reconexão automática
    private void setupWebSocket() {
        connectWebSocket();
    }

    private void connectWebSocket() {
        httpClient.newWebSocketBuilder()
                .buildAsync(URI.create(wsURL), new WebSocket.Listener() {
                    @Override
                    public void onOpen(WebSocket webSocket) {
                        System.out.println("WebSocket conectado");
                        reconnectAttempts = 0;
                        socket = webSocket;
                        webSocket.request(1); // Essencial para receber as mensagens
                    }

                    @Override
                    public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
                        try {
                            String msg = data.toString();
                            emitLocationUpdate(msg);
                        } catch (Exception e) {
                            System.err.println("Erro ao processar mensagem WebSocket: " + e.getMessage());
                        }
                        webSocket.request(1); // Essencial para solicitar a próxima mensagem
                        return null;
                    }

                    @Override
                    public void onError(WebSocket webSocket, Throwable error) {
                        System.err.println("Erro no WebSocket: " + error.getMessage());
                    }

                    @Override
                    public CompletionStage<?> onClose(WebSocket webSocket, int statusCode, String reason) {
                        System.out.println("WebSocket desconectado");
                        handleReconnection();
                        return null;
                    }
                }).exceptionally(ex -> {
                    System.err.println("Erro ao conectar WebSocket: " + ex.getMessage());
                    handleReconnection();
                    return null;
                });
    }

    private void handleReconnection() {
        if (reconnectAttempts < 5) {
            reconnectAttempts++;
            long delay = Math.min(1000L * (long) Math.pow(2, reconnectAttempts), 30000L);
            System.out.println("Tentando reconectar em " + delay + "ms (tentativa " + reconnectAttempts + "/5)");
            new Thread(() -> {
                try {
                    Thread.sleep(delay);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
                connectWebSocket();
            }).start();
        } else {
            System.err.println("Número máximo de tentativas de reconexão atingido");
        }
    }

    public void subscribeToCaminhao(String caminhaoId) {
        if (socket != null && !socket.isInputClosed() && !socket.isOutputClosed()) {
            String msg = String.format("{\"action\": \"subscribe-locations\", \"ids\": [\"%s\"]}", caminhaoId);
            socket.sendText(msg, true);
        } else {
            System.err.println("WebSocket não está conectado. Tentando reconectar automaticamente no plano de fundo...");
            // A reconexão automática (`handleReconnection()`) já cuida de reestabelecer o WebSocket.
        }
    }

    public void unsubscribeFromCaminhao(String caminhaoId) {
        if (socket != null && !socket.isInputClosed() && !socket.isOutputClosed()) {
            String msg = String.format("{\"action\": \"unsubscribe-locations\", \"ids\": [\"%s\"]}", caminhaoId);
            socket.sendText(msg, true);
        } else {
            System.err.println("WebSocket não está conectado.");
        }
    }

    public void updateDriverLocation(String jsonData) {
        if (socket != null && !socket.isInputClosed() && !socket.isOutputClosed()) {
            socket.sendText(jsonData, true); 
        } else {
            System.err.println("WebSocket não está conectado. Não é possível atualizar localização.");
        }
    }

    // Event Emitter para atualizações de localização
    public void onLocationUpdate(Consumer<String> callback) {
        listeners.add(callback);
    }

    private void emitLocationUpdate(String data) {
        for (Consumer<String> cb : listeners) {
            cb.accept(data);
        }
    }
}
