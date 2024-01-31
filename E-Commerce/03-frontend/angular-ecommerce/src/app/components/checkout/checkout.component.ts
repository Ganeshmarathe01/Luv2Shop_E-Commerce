import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { State } from 'src/app/common/state';
import { Country } from 'src/app/common/country';
import { Luv2shopformserviceService } from 'src/app/services/luv2shopformservice.service';
import { Luv2shopvalidators } from 'src/app/validators/luv2shopvalidators';
import { CartService } from 'src/app/services/cart.service';
import { Order } from 'src/app/common/order';
import { CartItem } from 'src/app/common/cart-item';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  totalPrice: number = 0;
  totalQuantity: number = 0;


  constructor(private formBuilder: FormBuilder,
    private luv2shopformservice: Luv2shopformserviceService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router : Router) { }


  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopvalidators.notOnlyWhiteSpaces]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopvalidators.notOnlyWhiteSpaces]),
        email: new FormControl('', [Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopvalidators.notOnlyWhiteSpaces]),
        state: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopvalidators.notOnlyWhiteSpaces]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{1,6}$'), Luv2shopvalidators.notOnlyWhiteSpaces])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopvalidators.notOnlyWhiteSpaces]),
        state: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopvalidators.notOnlyWhiteSpaces]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{1,6}$'), Luv2shopvalidators.notOnlyWhiteSpaces])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopvalidators.notOnlyWhiteSpaces]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{1,14}$'), Luv2shopvalidators.notOnlyWhiteSpaces]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{1,3}$'), Luv2shopvalidators.notOnlyWhiteSpaces]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      })
    });

    const startMonth = new Date().getMonth() + 1;

    //retrive the months using form-service
    this.luv2shopformservice.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      })

    //retrive the years using form-service
    this.luv2shopformservice.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      })

    this.luv2shopformservice.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    )
  }

  //handler method for check-box (billing add. is same as shipping add.)
  billingIsSameAsShipping(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
      .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      //this will update and populate the states for billing address based on the respective country 
      this.getStates('billingAddress');
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }

  //handler method for dropdown if current is selected
  //if current is selected then month's dropdown options must start from current month
  handleMonthsAndYears(year: any) {
    var selYear = +year;
    let thisYear = new Date().getFullYear();

    let startMonth;
    if (selYear === thisYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
      this.checkoutFormGroup.controls.creditCardExpirationMonth.markAsTouched;
    }

    //calling method from service class by passing current month
    //to update month's dropdown options from currnt month
    this.luv2shopformservice.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      })
  }


  //method to fetch states from api as per selected country in country dropdown
  getStates(formGroupName: string) {

    //variable for getting the form-group from which event has been generated
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    //using above form-group we fetch the country-code to pass in to getStates() method
    const countryCode = formGroup.value.country.code;

    //calling the service's method which returns list of states based on country-code passed
    this.luv2shopformservice.getStates(countryCode).subscribe(
      data => {
        //response will be stored in respective array based on form-group name being passed 
        // while change event is being generated at the template side   
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        //select first value as default
        formGroup.get('state').setValue(data[0]);
      }
    )
  }

  reviewCartDetails() {

    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
      }
    )

    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }
    )
  }


  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }

  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }


  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    console.log('in else of onSubmit');
    //set up order
    let order = new Order;

    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItem = this.cartService.cartItems;

    //set up order item
    let orderItems: OrderItem[] = cartItem.map(tempCartItem => new OrderItem(tempCartItem));

    //set up purchase
    let purchase = new Purchase();

    //set up customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //set up shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //set up billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase - order and orderitems 
    purchase.order = order;
    purchase.orderItems = orderItems;

    //call REST API via the checkout Service
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your Order has been received and confirmed.\nYour order tracking number is : ${response.orderTrackingNumber}`)
               console.log(response.orderTrackingNumber);

               this.resetCart();
      },
      error: err => {
        alert(`There was an error : ${err.message}`);
      }
    });
  }

  resetCart(){
    this.cartService.cartItems=[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl('/products');
  }

}
