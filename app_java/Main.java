import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Menu menu = Menu.criarPadrao();

        try (Scanner leitorTeclado = new Scanner(System.in)) {
            menu.executar(leitorTeclado);
        }
    }
}

interface MenuOpcao {
    String getTitulo();
    void executar();

    default boolean encerraPrograma() {
        return false;
    }
}

class MenuItem implements MenuOpcao {
    private final String titulo;
    private final Runnable acao;
    private final boolean encerraPrograma;

    public MenuItem(String titulo, Runnable acao) {
        this(titulo, acao, false);
    }

    public MenuItem(String titulo, Runnable acao, boolean encerraPrograma) {
        this.titulo = titulo;
        this.acao = acao;
        this.encerraPrograma = encerraPrograma;
    }

    @Override
    public String getTitulo() {
        return titulo;
    }

    @Override
    public void executar() {
        acao.run();
    }

    @Override
    public boolean encerraPrograma() {
        return encerraPrograma;
    }
}

class Menu {
    private final java.util.List<MenuOpcao> opcoes = new java.util.ArrayList<>();

    public static Menu criarPadrao() {
        Menu menu = new Menu();
        menu.adicionarOpcao(new MenuItem("Criar", () -> System.out.println("Acao de criar executada.")));
        menu.adicionarOpcao(new MenuItem("Abrir", () -> System.out.println("Acao de abrir executada.")));
        menu.adicionarOpcao(new MenuItem("Editar", () -> System.out.println("Acao de editar executada.")));
        menu.adicionarOpcao(new MenuItem("Excluir", () -> System.out.println("Acao de excluir executada.")));
        menu.adicionarOpcao(new MenuItem("Sair", () -> System.out.println("Encerrando programa..."), true));
        return menu;
    }

    public void adicionarOpcao(MenuOpcao opcao) {
        opcoes.add(opcao);
    }

    public void executar(Scanner leitorTeclado) {
        boolean sair = false;

        while (!sair) {
            mostrarMenu();
            int opcaoEscolhida = lerOpcao(leitorTeclado);

            if (!validarOpcao(opcaoEscolhida)) {
                System.out.println("Opcao invalida. Tente novamente.");
                continue;
            }

            MenuOpcao opcao = opcoes.get(opcaoEscolhida - 1);
            System.out.println("Voce escolheu: " + opcao.getTitulo());
            opcao.executar();
            sair = opcao.encerraPrograma();
        }
    }

    private int lerOpcao(Scanner leitorTeclado) {
        while (true) {
            System.out.print("Escolha uma opcao: ");
            String entrada = leitorTeclado.nextLine();

            try {
                return Integer.parseInt(entrada.trim());
            } catch (NumberFormatException e) {
                System.out.println("Digite apenas numeros inteiros.");
            }
        }
    }

    private boolean validarOpcao(int numero) {
        return numero >= 1 && numero <= opcoes.size();
    }

    private void mostrarMenu() {
        System.out.println("\n=== MENU PRINCIPAL ===");
        for (int i = 0; i < opcoes.size(); i++) {
            System.out.println((i + 1) + " - " + opcoes.get(i).getTitulo());
        }
    }
}

class Menn {
    public static void main(String[] args) {
        Main.main(args);
    }
}