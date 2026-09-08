package com.example.isa.models;

import com.example.isa.validator.ContactNumberConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserModel {

    private Integer id;

    @NotBlank(message = "Ime je obavezno")
    @Size(min = 3, max = 50)
    private String firstName;

    @NotBlank(message = "Prezime je obavezno")
    @Size(min = 3, max = 50)
    private String lastName;

    @NotBlank(message = "Email je obavezan")
    @Email(message = "Email nije ispravan")
    private String email;

    @NotBlank(message = "Broj telefona je obavezan")
    @ContactNumberConstraint
    private String contactNumber;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Size(
            min = 8,
            max = 72,
            message = "Lozinka mora imati najmanje 8 karaktera"
    )
    private String password;
}