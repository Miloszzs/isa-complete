package com.example.isa.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductModel {

    private Integer id;

    @NotBlank(message = "Naziv proizvoda je obavezan")
    @Size(
            max = 255,
            message = "Naziv proizvoda moze imati najvise 255 karaktera"
    )
    private String name;

    @NotNull(message = "Cena proizvoda je obavezna")
    @DecimalMin(
            value = "0.01",
            message = "Cena proizvoda mora biti veca od 0"
    )
    private BigDecimal price;

    @NotNull(message = "Korisnik je obavezan")
    private Integer userId;

    @Builder.Default
    private Set<Integer> categoryIds = new HashSet<>();
}