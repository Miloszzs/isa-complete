package com.example.isa.controllers;

import com.example.isa.entities.Category;
import com.example.isa.entities.Product;
import com.example.isa.mappers.ProductMapper;
import com.example.isa.models.ProductModel;
import com.example.isa.repositories.ICategoryRepository;
import com.example.isa.repositories.IProductRepository;
import com.example.isa.repositories.IUserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final IProductRepository productRepository;
    private final IUserRepository userRepository;
    private final ICategoryRepository categoryRepository;

    @GetMapping("/get-product-list")
    public List<ProductModel> getProductList() {
        return ProductMapper.toModelList(
                productRepository.findAll(Sort.by("id"))
        );
    }

    @PostMapping("/create-product-body")
    public ResponseEntity<?> createProduct(
            @RequestBody @Valid ProductModel model,
            BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.badRequest()
                    .body("Naziv proizvoda i korisnik su obavezni");
        }

        if (model.getId() != null) {
            return ResponseEntity.badRequest()
                    .body("ID se ne salje pri kreiranju proizvoda");
        }

        var user = userRepository.findById(model.getUserId());

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Korisnik nije pronadjen");
        }

        Set<Integer> categoryIds = model.getCategoryIds() == null
                ? new HashSet<>()
                : model.getCategoryIds();

        List<Category> categories =
                categoryRepository.findAllById(categoryIds);

        if (categories.size() != categoryIds.size()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Jedna ili vise kategorija nije pronadjena");
        }

        Product product = new Product();

        product.setName(model.getName().trim());
        product.setPrice(model.getPrice());
        product.setUser(user.get());
        product.setCategories(new HashSet<>(categories));

        Product savedProduct = productRepository.save(product);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ProductMapper.toModel(savedProduct));
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Integer id,
            @RequestBody @Valid ProductModel model,
            BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.badRequest()
                    .body("Naziv proizvoda i korisnik su obavezni");
        }

        if (model.getId() != null && !model.getId().equals(id)) {
            return ResponseEntity.badRequest()
                    .body("ID iz URL-a i ID iz tela zahteva se ne poklapaju");
        }

        var existingProduct = productRepository.findById(id);

        if (existingProduct.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Proizvod nije pronadjen");
        }

        var user = userRepository.findById(model.getUserId());

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Korisnik nije pronadjen");
        }

        Set<Integer> categoryIds = model.getCategoryIds() == null
                ? new HashSet<>()
                : model.getCategoryIds();

        List<Category> categories =
                categoryRepository.findAllById(categoryIds);

        if (categories.size() != categoryIds.size()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Jedna ili vise kategorija nije pronadjena");
        }

        Product product = existingProduct.get();

        product.setName(model.getName().trim());
        product.setPrice(model.getPrice());
        product.setUser(user.get());
        product.setCategories(new HashSet<>(categories));

        Product savedProduct = productRepository.save(product);

        return ResponseEntity.ok(
                ProductMapper.toModel(savedProduct)
        );
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {

        var existingProduct = productRepository.findById(id);

        if (existingProduct.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Proizvod nije pronadjen");
        }

        productRepository.delete(existingProduct.get());

        return ResponseEntity.ok()
                .body("Proizvod je uspesno obrisan");
    }
}