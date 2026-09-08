package com.example.isa.mappers;

import com.example.isa.entities.Role;
import com.example.isa.models.RoleModel;

import java.util.List;

public class RoleMapper {

    public static Role toEntity(RoleModel model) {

        Role role = new Role();

        role.setId(model.getId());
        role.setName(model.getName());

        return role;
    }

    public static RoleModel toModel(Role entity) {

        return RoleModel.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }

    public static List<RoleModel> toModelList(List<Role> entities) {

        return entities.stream()
                .map(RoleMapper::toModel)
                .toList();
    }
}