import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject,Observable,BehaviorSubject } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems : CartItem[]=[];
  totalPrice : Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity : Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem : CartItem){

    //check if we already have the items in our cart
    let alreadyExistsInCart :boolean = false;
    let existingCartItem : CartItem = undefined!;

    //find the item in the cart based on item id 
    if(this.cartItems.length > 0)
    {
      // for(let tempCartItem of this.cartItems){
      //   if(theCartItem.id === tempCartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;

      //check if we found it 
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }
  computeCartTotals() {
    
    let totalPriceValue : number = 0;
    let totalQuantityvalue : number = 0;

    for(let tempCartItem of this.cartItems)
    {
      totalPriceValue += tempCartItem.quantity * tempCartItem.unitPrice;
      totalQuantityvalue += tempCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityvalue);
  }

  decrementQuantity(theCartItem:CartItem){

    theCartItem.quantity--;

    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
      this.computeCartTotals();
    }
    else{
      this.computeCartTotals();
    }

  }

  remove(theCartItem:CartItem){
    const tempCartItem = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id)!;
    
    if(tempCartItem >=0 ){
      
      this.cartItems.splice(tempCartItem,1);

      this.computeCartTotals();
    }
  }
}
