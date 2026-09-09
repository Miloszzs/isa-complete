package com.example.isa.repositories;

import com.example.isa.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IOrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByUserEmailOrderByOrderDateDesc(String email);

    List<Order> findAllByOrderByOrderDateDesc();
}