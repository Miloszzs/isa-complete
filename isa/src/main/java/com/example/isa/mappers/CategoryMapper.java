package com.example.isa.mappers;

import com.example.isa.entities.Category;
import com.example.isa.models.CategoryModel;

import java.util.List;

public class CategoryMapper {

    public static CategoryModel toModel(Category entity) {
        return CategoryModel.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }

    public static List<CategoryModel> toModelList(List<Category> entities) {
        return entities.stream()
                .map(CategoryMapper::toModel)
                .toList();
    }
}