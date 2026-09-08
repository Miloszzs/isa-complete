package com.example.isa.controllers;

import com.example.isa.mappers.RoleMapper;
import com.example.isa.models.RoleModel;
import com.example.isa.repositories.IRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/role")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RoleController {

    private final IRoleRepository roleRepository;

    @GetMapping("/get-role-list")
    public List<RoleModel> getRoleList() {

        return RoleMapper.toModelList(
                roleRepository.findAll()
        );
    }
}