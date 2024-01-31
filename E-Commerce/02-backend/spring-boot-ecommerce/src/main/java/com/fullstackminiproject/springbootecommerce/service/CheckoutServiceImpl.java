package com.fullstackminiproject.springbootecommerce.service;

import com.fullstackminiproject.springbootecommerce.dao.CustomerRepository;
import com.fullstackminiproject.springbootecommerce.dto.Purchase;
import com.fullstackminiproject.springbootecommerce.dto.PurchaseResponse;
import com.fullstackminiproject.springbootecommerce.entity.Customer;
import com.fullstackminiproject.springbootecommerce.entity.Order;
import com.fullstackminiproject.springbootecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;
    public CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }

    @Override
    //this will enable the transactional behaviour for this method
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        //retrieve the order info. from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(order::add);

        //populate order with shippingAddress and billingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate customer with order
        Customer customer =purchase.getCustomer();
        customer.add(order);
        //save into database
        customerRepository.save(customer);

        //return the response

        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
