import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number=1;
  previousCategoryId: number=1;
  searchMode: boolean = false; 

  thePageSize: number = 5;
  theTotalElements: number = 0;
  thePageNumber: number=1; 

  previousKeyword: string = "";

  constructor(private productService: ProductService,private cartService : CartService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      () => {
        this.listProducts();
      }
    )
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }
  handleSearchProducts() {
    const theKeyword = this.route.snapshot.paramMap.get("keyword")!;

    if(this.previousKeyword != theKeyword)
    {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    this.productService.searchProductsPaginated(this.thePageNumber-1,
                                                this.thePageSize,
                                                theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {
    //this .has() retuns boolean based on the param availability
    const hasCategoryId = this.route.snapshot.paramMap.has("id");

    //this.route.snapshot.paramMap.get('id') returns param as a string 
    //check has category id then convert the id from string to number using the '+'
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      //if no category id specified assign default
      this.currentCategoryId = 1;
    }

    //check if the previous category id is equal to the current category id
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }

    this.previousCategoryId =this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}`,`thePageNumber=${this.thePageNumber}`)


    this.productService.getPageChangeDetails(this.thePageNumber-1,this.thePageSize,
      this.currentCategoryId).subscribe(this.processResult());

    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data => {
    //     this.products = data;
    //     console.log(data);
    //   }
    // )
  }

  public changePageSize(pageSize:String){
      this.thePageSize=+pageSize;
      this.thePageNumber=1;
      this.listProducts();
  }

  processResult(){
    return (data:any)=>{  
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      };
  }

  addToCart(product:Product){
    
    const theCartItem = new CartItem(product);

    this.cartService.addToCart(theCartItem);
    
  } 
}
