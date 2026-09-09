package com.example.isa.controllers;

import com.example.isa.entities.Order;
import com.example.isa.entities.OrderItem;
import com.example.isa.entities.Product;
import com.example.isa.entities.User;
import com.example.isa.models.CreateOrderItemModel;
import com.example.isa.models.CreateOrderModel;
import com.example.isa.repositories.IOrderRepository;
import com.example.isa.repositories.IProductRepository;
import com.example.isa.repositories.IUserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final IOrderRepository orderRepository;
    private final IProductRepository productRepository;
    private final IUserRepository userRepository;


    @PostMapping("/create")
    @Transactional
    public ResponseEntity<?> createOrder(
            @RequestBody @Valid CreateOrderModel model,
            BindingResult result,
            Authentication authentication) {

        // 1. Validacija zahteva
        if (result.hasErrors()) {
            return ResponseEntity.badRequest()
                    .body("Porudzbina nije validna");
        }

        // 2. Provera da li je korisnik prijavljen
        if (authentication == null ||
                authentication.getName() == null) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Korisnik nije prijavljen");
        }

        // Email dolazi iz JWT tokena
        String email = authentication.getName();

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Korisnik nije pronadjen");
        }

        // 3. Kreiranje porudzbine
        Order order = new Order();

        order.setUser(user);
        order.setCustomerEmail(user.getEmail());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("CREATED");

        BigDecimal totalPrice = BigDecimal.ZERO;


        // 4. Obrada svih stavki iz korpe
        for (CreateOrderItemModel requestedItem : model.getItems()) {

            Product product = productRepository
                    .findById(requestedItem.getProductId())
                    .orElse(null);

            if (product == null) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(
                                "Proizvod sa ID-em " +
                                        requestedItem.getProductId() +
                                        " nije pronadjen"
                        );
            }

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(product);

            // Snapshot podaci
            orderItem.setProductName(product.getName());
            orderItem.setUnitPrice(product.getPrice());

            orderItem.setQuantity(
                    requestedItem.getQuantity()
            );

            order.getItems().add(orderItem);


            // cena stavke = cena proizvoda * kolicina
            BigDecimal itemTotal =
                    product.getPrice().multiply(
                            BigDecimal.valueOf(
                                    requestedItem.getQuantity()
                            )
                    );

            totalPrice =
                    totalPrice.add(itemTotal);
        }


        // 5. Ukupna cena porudzbine
        order.setTotalPrice(totalPrice);


        // 6. Save Order + OrderItems
        Order savedOrder =
                orderRepository.save(order);


        // 7. Jednostavan odgovor za test
        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "orderId",
                savedOrder.getId()
        );

        response.put(
                "customerEmail",
                savedOrder.getCustomerEmail()
        );

        response.put(
                "orderDate",
                savedOrder.getOrderDate()
        );

        response.put(
                "totalPrice",
                savedOrder.getTotalPrice()
        );

        response.put(
                "status",
                savedOrder.getStatus()
        );

        response.put(
                "itemsCount",
                savedOrder.getItems().size()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @GetMapping("/my-orders")
    @Transactional
    public ResponseEntity<?> getMyOrders(
            Authentication authentication) {

        if (authentication == null ||
                authentication.getName() == null) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Korisnik nije prijavljen");
        }

        String email = authentication.getName();

        var orders =
                orderRepository.findByUserEmailOrderByOrderDateDesc(email);

        var response = orders.stream()
                .map(order -> {

                    Map<String, Object> orderData =
                            new LinkedHashMap<>();

                    orderData.put(
                            "orderId",
                            order.getId()
                    );

                    orderData.put(
                            "customerEmail",
                            order.getCustomerEmail()
                    );

                    orderData.put(
                            "orderDate",
                            order.getOrderDate()
                    );

                    orderData.put(
                            "totalPrice",
                            order.getTotalPrice()
                    );

                    orderData.put(
                            "status",
                            order.getStatus()
                    );


                    var items = order.getItems()
                            .stream()
                            .map(item -> {

                                Map<String, Object> itemData =
                                        new LinkedHashMap<>();

                                itemData.put(
                                        "orderItemId",
                                        item.getId()
                                );

                                itemData.put(
                                        "productId",
                                        item.getProduct() != null
                                                ? item.getProduct().getId()
                                                : null
                                );

                                itemData.put(
                                        "productName",
                                        item.getProductName()
                                );

                                itemData.put(
                                        "quantity",
                                        item.getQuantity()
                                );

                                itemData.put(
                                        "unitPrice",
                                        item.getUnitPrice()
                                );

                                return itemData;
                            })
                            .toList();


                    orderData.put(
                            "items",
                            items
                    );

                    return orderData;
                })
                .toList();


        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    @Transactional
    public ResponseEntity<?> getAllOrders() {

        var orders =
                orderRepository.findAllByOrderByOrderDateDesc();

        var response = orders.stream()
                .map(order -> {

                    Map<String, Object> orderData =
                            new LinkedHashMap<>();

                    orderData.put(
                            "orderId",
                            order.getId()
                    );

                    orderData.put(
                            "customerEmail",
                            order.getCustomerEmail()
                    );

                    orderData.put(
                            "orderDate",
                            order.getOrderDate()
                    );

                    orderData.put(
                            "totalPrice",
                            order.getTotalPrice()
                    );

                    orderData.put(
                            "status",
                            order.getStatus()
                    );


                    var items = order.getItems()
                            .stream()
                            .map(item -> {

                                Map<String, Object> itemData =
                                        new LinkedHashMap<>();

                                itemData.put(
                                        "orderItemId",
                                        item.getId()
                                );

                                itemData.put(
                                        "productId",
                                        item.getProduct() != null
                                                ? item.getProduct().getId()
                                                : null
                                );

                                itemData.put(
                                        "productName",
                                        item.getProductName()
                                );

                                itemData.put(
                                        "quantity",
                                        item.getQuantity()
                                );

                                itemData.put(
                                        "unitPrice",
                                        item.getUnitPrice()
                                );

                                return itemData;
                            })
                            .toList();


                    orderData.put(
                            "items",
                            items
                    );

                    return orderData;
                })
                .toList();


        return ResponseEntity.ok(response);
    }

}