package com.example.isa.controllers;

import com.example.isa.mappers.RoleMapper;
import com.example.isa.mappers.UserMapper;
import com.example.isa.models.UserModel;
import com.example.isa.models.UserPageModel;
import com.example.isa.repositories.IRoleRepository;
import com.example.isa.repositories.IUserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;


    @GetMapping("/get-user-list")
    public List<UserModel> getUserList() {

        return UserMapper.toModelList(
                userRepository.findAll()
        );
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


    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(
            @PathVariable Integer id) {

        var user = userRepository.findById(id);

        if (user.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Korisnik nije pronadjen");
        }

        return ResponseEntity.ok(
                UserMapper.toModel(user.get())
        );
    }


    @Transactional
    @PostMapping("/create-user-body")
    public ResponseEntity<?> createUser(
            @RequestBody @Valid UserModel model,
            BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity
                    .badRequest()
                    .body("Neispravni podaci korisnika");
        }

        if (model.getPassword() == null ||
                model.getPassword().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Lozinka je obavezna");
        }

        var customerRole =
                roleRepository.findByName("CUSTOMER");

        if (customerRole == null) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("CUSTOMER uloga nije pronadjena");
        }

        var user = UserMapper.toEntity(model);

        // OVDE se plain-text password pretvara u BCrypt hash
        user.setPassword(
                passwordEncoder.encode(model.getPassword())
        );

        // Novi korisnik automatski dobija CUSTOMER rolu
        user.getRoles().add(customerRole);

        var saved = userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserMapper.toModel(saved));
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer id,
            @RequestBody @Valid UserModel model,
            BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity
                    .badRequest()
                    .body("Neispravni podaci korisnika");
        }

        var existingUser = userRepository.findById(id);

        if (existingUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Korisnik nije pronadjen");
        }

        var user = existingUser.get();

        user.setFirstName(model.getFirstName());
        user.setLastName(model.getLastName());
        user.setEmail(model.getEmail());
        user.setContactNumber(model.getContactNumber());

        var savedUser = userRepository.save(user);

        return ResponseEntity.ok(
                UserMapper.toModel(savedUser)
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Integer id) {

        if (!userRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Korisnik nije pronadjen");
        }

        userRepository.deleteById(id);

        return ResponseEntity.ok(
                "Korisnik je uspesno obrisan"
        );
    }


    // =========================
    // USER - ROLE MANY TO MANY
    // =========================

    @Transactional(readOnly = true)
    @GetMapping("/{userId}/roles")
    public ResponseEntity<?> getUserRoles(
            @PathVariable Integer userId) {

        var userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Korisnik nije pronadjen");
        }

        var user = userOptional.get();

        return ResponseEntity.ok(
                RoleMapper.toModelList(
                        new ArrayList<>(user.getRoles())
                )
        );
    }


    @Transactional
    @PutMapping("/{userId}/role/{roleId}")
    public ResponseEntity<?> addRoleToUser(
            @PathVariable Integer userId,
            @PathVariable Integer roleId) {

        var userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Korisnik nije pronadjen");
        }

        var roleOptional = roleRepository.findById(roleId);

        if (roleOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Uloga nije pronadjena");
        }

        var user = userOptional.get();
        var role = roleOptional.get();

        boolean alreadyHasRole = user.getRoles()
                .stream()
                .anyMatch(r -> r.getId().equals(roleId));

        if (alreadyHasRole) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Korisnik vec ima ovu ulogu");
        }

        user.getRoles().add(role);

        userRepository.save(user);

        return ResponseEntity.ok(
                RoleMapper.toModelList(
                        new ArrayList<>(user.getRoles())
                )
        );
    }


    @Transactional
    @DeleteMapping("/{userId}/role/{roleId}")
    public ResponseEntity<?> removeRoleFromUser(
            @PathVariable Integer userId,
            @PathVariable Integer roleId) {

        var userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Korisnik nije pronadjen");
        }

        if (!roleRepository.existsById(roleId)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Uloga nije pronadjena");
        }

        var user = userOptional.get();

        boolean removed = user.getRoles()
                .removeIf(role ->
                        role.getId().equals(roleId)
                );

        if (!removed) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Korisnik nema ovu ulogu");
        }

        userRepository.save(user);

        return ResponseEntity.ok(
                RoleMapper.toModelList(
                        new ArrayList<>(user.getRoles())
                )
        );
    }
}