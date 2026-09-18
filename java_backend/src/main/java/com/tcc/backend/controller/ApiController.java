package com.tcc.backend.controller;

import com.tcc.backend.model.Motorista;
import com.tcc.backend.repository.MotoristaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Permite o acesso do HTML local
public class ApiController {

    @Autowired
    private MotoristaRepository motoristaRepository;

    // Equivalente a: if ($acao === 'dados') -> mas aqui separamos por responsabilidade
    @GetMapping("/motoristas")
    public List<Motorista> getMotoristas() {
        return motoristaRepository.findAll();
    }

    // Equivalente a: if ($acao === 'salvar_motorista')
    @PostMapping("/motoristas")
    public Motorista salvarMotorista(@RequestBody Motorista motorista) {
        return motoristaRepository.save(motorista);
    }

    // Equivalente a: if ($acao === 'excluir_motorista')
    @DeleteMapping("/motoristas/{id}")
    public ResponseEntity<?> excluirMotorista(@PathVariable Long id) {
        motoristaRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
