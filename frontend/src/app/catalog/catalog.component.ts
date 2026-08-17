import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Bestsellers</h2>
      <select class="border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:border-primary-500">
        <option>Best Value / Bestsellers</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
      </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div *ngFor="let p of products" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow flex flex-col">
        <div class="relative h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <img [src]="p.image" alt="product" class="object-cover w-full h-full" />
          <div *ngIf="p.stock <= 5" class="absolute top-2 left-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded shadow-sm border border-red-200">
            ⚡ Only {{p.stock}} left!
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col">
          <h3 class="text-xl font-bold mb-2">{{p.name}}</h3>
          <p class="text-gray-500 text-sm mb-4">{{p.category}}</p>

          <div class="flex items-end gap-3 mt-auto mb-4">
            <span class="text-2xl font-extrabold text-gray-900 dark:text-gray-100">₹{{p.selling_price_inr}}</span>
            <span class="text-gray-400 line-through text-lg">₹{{p.mrp_inr}}</span>
            <span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded shadow-sm border border-green-200">
              {{ getDiscountPercent(p.mrp_inr, p.selling_price_inr) }}% OFF
            </span>
          </div>

          <div class="flex gap-2">
            <button (click)="addToCart(p)" class="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 rounded shadow transition-colors">
              Add to Cart
            </button>
            <a [routerLink]="['/product', p.id]" class="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-100 font-bold py-2 rounded text-center shadow-sm transition-colors">
              Customize
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CatalogComponent implements OnInit {
  products: any[] = [];
  private snackBar = inject(MatSnackBar);

  constructor(private api: ApiService, private cart: CartService) {}

  ngOnInit() {
    this.api.getProducts().subscribe(res => {
      this.products = res;
    });
  }

  getDiscountPercent(mrp: number, sp: number): number {
    return Math.round(((mrp - sp) / mrp) * 100);
  }

  addToCart(p: any) {
    this.cart.addToCart({
      id: p.id,
      name: p.name,
      price: p.selling_price_inr,
      quantity: 1
    });
    this.snackBar.open(`${p.name} added to cart`, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
