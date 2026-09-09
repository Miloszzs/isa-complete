package com.example.isa.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryModel {

    private Integer id;

    @NotBlank(message = "Naziv kategorije je obavezan")
    @Size(
            max = 255,
            message = "Naziv kategorije moze imati najvise 255 karaktera"
    )
    private String name;
}