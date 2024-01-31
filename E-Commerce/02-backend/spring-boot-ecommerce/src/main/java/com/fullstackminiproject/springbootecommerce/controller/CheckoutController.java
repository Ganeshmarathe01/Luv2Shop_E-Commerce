package com.fullstackminiproject.springbootecommerce.controller;

import com.fullstackminiproject.springbootecommerce.dto.Purchase;
import com.fullstackminiproject.springbootecommerce.dto.PurchaseResponse;
import com.fullstackminiproject.springbootecommerce.service.CheckoutService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService){
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase)
    {
        return checkoutService.placeOrder(purchase);
    }
}
