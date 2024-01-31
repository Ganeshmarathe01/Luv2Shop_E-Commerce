package com.fullstackminiproject.springbootecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.id.factory.internal.AutoGenerationTypeStrategy;

import java.util.List;

@Entity
@Table(name = "country")
//Lombok's annotation for auto-generating getters and setters
@Getter
@Setter
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "country")
    //below annotation will ignore the states column while showing json using end-point
    @JsonIgnore
    private List<State> states;
}
