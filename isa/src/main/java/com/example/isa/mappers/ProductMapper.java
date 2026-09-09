package com.example.isa.mappers;

import com.example.isa.entities.Category;
import com.example.isa.entities.Product;
import com.example.isa.models.ProductModel;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class ProductMapper {

    public static ProductModel toModel(Product entity) {

        Set<Integer> categoryIds = entity.getCategories()
                .stream()
                .map(Category::getId)
                .collect(Collectors.toSet());

        return ProductModel.builder()
                .id(entity.getId())
                .name(entity.getName())
                .price(entity.getPrice())
                .userId(entity.getUser().getId())
                .categoryIds(categoryIds)
                .build();
    }

    public static List<ProductModel> toModelList(List<Product> entities) {
        return entities.stream()
                .map(ProductMapper::toModel)
                .toList();
    }
}