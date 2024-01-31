package com.fullstackminiproject.springbootecommerce.dao;

import com.fullstackminiproject.springbootecommerce.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200")
//path="countries" will expose the end-point /countries
//The @RepositoryRestResource annotation is optional and is used to customize the REST endpoint.
//If we decided to omit it,
// Spring would automatically create an endpoint.
@RepositoryRestResource(collectionResourceRel = "countries", path = "countries")
public interface CountryRepository extends JpaRepository<Country,Integer> {
}
