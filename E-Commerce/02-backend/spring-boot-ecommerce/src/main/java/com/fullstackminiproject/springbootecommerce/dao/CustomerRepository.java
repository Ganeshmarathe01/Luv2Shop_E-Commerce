package com.fullstackminiproject.springbootecommerce.dao;

import com.fullstackminiproject.springbootecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long> {
}
