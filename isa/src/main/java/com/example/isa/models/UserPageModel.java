package com.example.isa.models;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserPageModel {
    private List<UserModel> users;
    private int totalPages;
    private Long totalElements;
}
