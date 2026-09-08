package com.example.isa.mappers;

import com.example.isa.entities.User;
import com.example.isa.models.UserModel;
import com.example.isa.models.UserPageModel;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;

public class UserMapper {

    public static User toEntity(UserModel model) {

        User user = new User();

        user.setId(model.getId());
        user.setFirstName(model.getFirstName());
        user.setLastName(model.getLastName());
        user.setEmail(model.getEmail());
        user.setContactNumber(model.getContactNumber());

        return user;
    }

    public static UserModel toModel(User entity) {

        return UserModel.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .contactNumber(entity.getContactNumber())
                .build();
    }

    public static List<UserModel> toModelList(List<User> entities) {

        var list = new ArrayList<UserModel>();

        for (var entity : entities) {
            list.add(toModel(entity));
        }

        return list;
    }

    public static UserPageModel toModelPagedList(Page<User> pageEntity) {

        return UserPageModel.builder()
                .users(toModelList(pageEntity.getContent()))
                .totalPages(pageEntity.getTotalPages())
                .totalElements(pageEntity.getTotalElements())
                .build();
    }
}