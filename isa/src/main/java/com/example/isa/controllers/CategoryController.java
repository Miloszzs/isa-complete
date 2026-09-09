package com.example.isa.controllers;

import com.example.isa.entities.Category;
import com.example.isa.mappers.CategoryMapper;
import com.example.isa.models.CategoryModel;
import com.example.isa.repositories.ICategoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    private final ICategoryRepository categoryRepository;

    @GetMapping("/get-category-list")
    public List<CategoryModel> getCategoryList() {
        return CategoryMapper.toModelList(
                categoryRepository.findAll(Sort.by("id"))
        );
    }

    @PostMapping("/create-category-body")
    public ResponseEntity<?> createCategory(
            @RequestBody @Valid CategoryModel model,
            BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.badRequest()
                    .body("Naziv kategorije je obavezan i moze imati najvise 255 karaktera");
        }

        if (model.getId() != null) {
            return ResponseEntity.badRequest()
                    .body("ID se ne salje pri kreiranju kategorije");
        }

        Category category = new Category();
        category.setName(model.getName().trim());

        Category savedCategory = categoryRepository.save(category);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CategoryMapper.toModel(savedCategory));
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Integer id,
            @RequestBody @Valid CategoryModel model,
            BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.badRequest()
                    .body("Naziv kategorije je obavezan i moze imati najvise 255 karaktera");
        }

        if (model.getId() != null && !model.getId().equals(id)) {
            return ResponseEntity.badRequest()
                    .body("ID u telu zahteva se ne poklapa sa ID-em u URL-u");
        }

        var existingCategory = categoryRepository.findById(id);

        if (existingCategory.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Kategorija nije pronadjena");
        }

        Category category = existingCategory.get();
        category.setName(model.getName().trim());

        Category savedCategory = categoryRepository.save(category);

        return ResponseEntity.ok(CategoryMapper.toModel(savedCategory));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        var existingCategory = categoryRepository.findById(id);

        if (existingCategory.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Kategorija nije pronadjena");
        }

        try {
            categoryRepository.delete(existingCategory.get());
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Kategorija ne moze da se obrise dok je povezana sa proizvodima");
        }

        return ResponseEntity.noContent().build();
    }

}