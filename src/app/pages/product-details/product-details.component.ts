import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
product: IProduct;
  constructor(private ActivatedRoute: ActivatedRoute, private prodService: ProductsService, private orderService: OrderService, public location: Location) { }

  ngOnInit(): void {
    this.getBlog();
  }

  private getBlog(): void{
    const id = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.prodService.getOneProduct(id).subscribe(
      data => {
        this.product = data;
      },
      err => {
        console.log(err); 
      }
    )
  }

  productCount(product: IProduct, status: boolean): void {
    if (status) product.count++;
    else {
      if (product.count > 1) product.count--;
    }
  }

  addToBasket(product: IProduct): void {
    this.orderService.addBasket(product);
    product.count = 1;
  }

}
