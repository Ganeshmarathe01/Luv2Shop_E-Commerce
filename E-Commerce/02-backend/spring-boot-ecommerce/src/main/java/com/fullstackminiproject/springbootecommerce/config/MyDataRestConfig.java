package com.fullstackminiproject.springbootecommerce.config;

import com.fullstackminiproject.springbootecommerce.entity.Country;
import com.fullstackminiproject.springbootecommerce.entity.Product;
import com.fullstackminiproject.springbootecommerce.entity.ProductCategory;
import com.fullstackminiproject.springbootecommerce.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors){

        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT,HttpMethod.DELETE,HttpMethod.POST};

        //disable HTTP methods for Product:PUT, POST, DELETE
        disableHttpMethods(Product.class,config, theUnsupportedActions);

        //disable HTTP methods for ProductCategory:PUT, POST, DELETE
        disableHttpMethods(ProductCategory.class,config, theUnsupportedActions);

        //disable HTTP methods for Country:PUT, POST, DELETE
        disableHttpMethods(Country.class,config, theUnsupportedActions);

        //disable HTTP methods for State:PUT, POST, DELETE
        disableHttpMethods(State.class,config, theUnsupportedActions);

        //call internal methods to help access and expose ids
        exposeIds(config);
    }

    private static void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config
                .getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)))
                .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)));
    }

    private void exposeIds(RepositoryRestConfiguration config){

        //get a list of all entity classes from the entity manager
        Set<jakarta.persistence.metamodel.EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        //create an array of the entity type
        List<Class> entityClasses = new ArrayList<>();

        for(EntityType<?> entityType : entities){
            entityClasses.add(entityType.getJavaType());
        }

        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
