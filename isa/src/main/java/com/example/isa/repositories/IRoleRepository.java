package com.example.isa.repositories;

import com.example.isa.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRoleRepository extends JpaRepository<Role, Integer> {

    Role findByName(String name);
}