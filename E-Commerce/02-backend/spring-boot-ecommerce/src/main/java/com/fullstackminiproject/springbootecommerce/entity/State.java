package com.fullstackminiproject.springbootecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="state")
//Lombok's annotation for auto-generating boilerplate code like
//getters, setters, toString
@Data
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    //In a One-to-Many/Many-to-One relationship,
    // the owning side is usually defined on the many side of the relationship.
    // It’s usually the side that owns the foreign key.
    @ManyToOne
    //below states that State entity will have the foreign key column by name country_id
    //which refers to the primary attribute id of our Country entity
    @JoinColumn(name="country_id")
    private Country country;
}
