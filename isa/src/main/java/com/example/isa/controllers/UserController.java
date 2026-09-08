package com.example.isa.controllers;

import com.example.isa.mappers.UserMapper;
import com.example.isa.models.UserModel;
import com.example.isa.models.UserPageModel;
import com.example.isa.repositories.IUserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final IUserRepository userRepository;

    @GetMapping("/get-user-list")
    public List<UserModel> getUserList() {
        return UserMapper.toModelList(userRepository.findAll());
    }

    @GetMapping("/get-user-page-list")
    public UserPageModel getUserPageList(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        return UserMapper.toModelPagedList(
                userRepository.findAll(
                        PageRequest.of(pageNumber, pageSize)
                )
        );
    }

    @PostMapping("/create-user-body")
    public ResponseEntity<?> createUser(
            @RequestBody @Valid UserModel model,
            BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity
                    .badRequest()
                    .body("Neispravni podaci korisnika");
        }

        var saved = userRepository.save(UserMapper.toEntity(model));

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserMapper.toModel(saved));
    }
}