import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  productCategories : ProductCategory[];

  constructor(private productService:ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }
  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log("product categories : "+JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

}
