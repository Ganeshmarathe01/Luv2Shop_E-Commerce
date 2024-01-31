package com.fullstackminiproject.springbootecommerce.dto;

import com.fullstackminiproject.springbootecommerce.entity.Address;
import com.fullstackminiproject.springbootecommerce.entity.Customer;
import com.fullstackminiproject.springbootecommerce.entity.Order;
import com.fullstackminiproject.springbootecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Order order;
    private Address billingAddress;
    private Address shippingAddress;
    private Set<OrderItem> orderItems;
}
