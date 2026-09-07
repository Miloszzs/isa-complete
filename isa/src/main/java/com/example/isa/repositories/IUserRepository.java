package com.example.isa.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.isa.entities.User;

public interface IUserRepository extends JpaRepository <User , Integer> {
    User findByEmail(String email);
    //Optional<User> findByEmail(String email);
}