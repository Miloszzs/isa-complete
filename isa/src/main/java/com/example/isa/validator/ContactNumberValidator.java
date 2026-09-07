package com.example.isa.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ContactNumberValidator implements ConstraintValidator<ContactNumberConstraint , String> {
    @Override
    public boolean isValid(String s,
                           ConstraintValidatorContext constraintValidatorContext) {
        return s != null && s.matches("[0-9]{9,13}");
    }
}
