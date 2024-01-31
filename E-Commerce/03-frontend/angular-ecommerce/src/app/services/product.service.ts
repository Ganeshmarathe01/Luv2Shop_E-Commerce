import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category";

  constructor(private httpClient: HttpClient) { }

  getProductList(currentCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string) {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginated(thePage: number,
    thePageSize: number,
    theKeyword: string): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                      +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl)
}


  private getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductDetails(id: number): Observable<Product> {
    return this.httpClient.get<Product>(this.baseUrl + `/${id}`).pipe(
      map(response => response)
    );
  }

  getPageChangeDetails(thePage: number,
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProduct> {
      const searchUrl=this.baseUrl+`/search/findByCategoryId?id=${theCategoryId}`
                        +`&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

