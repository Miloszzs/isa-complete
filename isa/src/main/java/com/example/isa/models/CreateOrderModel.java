package com.example.isa.models;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderModel {

    @NotEmpty(message = "Porudzbina mora imati najmanje jedan proizvod")
    @Valid
    private List<CreateOrderItemModel> items;
}