package com.fullstackminiproject.springbootecommerce.service;

import com.fullstackminiproject.springbootecommerce.dto.Purchase;
import com.fullstackminiproject.springbootecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
