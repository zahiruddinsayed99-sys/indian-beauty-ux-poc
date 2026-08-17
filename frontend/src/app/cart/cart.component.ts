import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold">Your Cart</h2>
        <div *ngIf="cart.cartItems().length > 0" class="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full font-bold border border-red-200">
          ⏱️ <span class="text-sm">Items reserved for: <span class="text-lg">{{cart.getFormattedTime()}}</span></span>
        </div>
      </div>

      <div *ngIf="cart.cartItems().length > 0" class="mb-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
        <div class="flex justify-between text-sm font-bold text-primary-800 mb-2">
          <span>Free Gift Pouch & Express Delivery</span>
          <span>{{ cart.totalPrice() >= 999 ? 'Unlocked! 🎁' : 'Add ₹' + (999 - cart.totalPrice()) + ' more!' }}</span>
        </div>
        <div class="w-full bg-primary-200 rounded-full h-2.5">
          <div class="bg-primary-600 h-2.5 rounded-full transition-all duration-500" [style.width.%]="getProgress()"></div>
        </div>
        <p class="text-right text-xs text-primary-600 mt-1">Target: ₹999</p>
      </div>

      <div *ngIf="cart.cartItems().length === 0" class="text-center py-12">
        <p class="text-xl text-gray-500 mb-6">Your cart is empty.</p>
        <a routerLink="/" class="bg-primary-600 text-white font-bold py-3 px-8 rounded-full hover:bg-primary-700 transition-colors">Start Shopping</a>
      </div>

      <div *ngIf="cart.cartItems().length > 0">
        <div *ngFor="let item of cart.cartItems()" class="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer" [routerLink]="['/product', item.id]">
              <span class="text-2xl">🛍️</span>
            </div>
            <div>
              <h4 class="font-bold text-lg cursor-pointer hover:text-primary-600 transition-colors" [routerLink]="['/product', item.id]">{{item.name}}</h4>
              <div class="flex items-center gap-3 mt-2">
                <button (click)="cart.updateQuantity(item.id, -1)" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors font-bold text-gray-600">-</button>
                <span class="font-medium w-4 text-center">{{item.quantity}}</span>
                <button (click)="cart.updateQuantity(item.id, 1)" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors font-bold text-gray-600">+</button>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <div class="font-bold text-xl">{{ (item.price * item.quantity) | currency:'INR':'symbol':'1.0-0' }}</div>
            <button (click)="cart.removeItem(item.id)" class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">Remove</button>
          </div>
        </div>
      </div>
        <div class="mt-8">
          <a routerLink="/checkout" class="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center font-bold py-4 rounded-xl text-lg shadow-lg transition-transform transform active:scale-95">
            Proceed to Checkout
          </a>
        </div>
      </div>
  `
})
export class CartComponent implements OnInit {
  constructor(public cart: CartService, private api: ApiService) {}

  ngOnInit() {
    if (this.cart.cartItems().length > 0 && this.cart.discount() === 0) {
      this.api.getWelcomeDiscount().subscribe(res => {
        this.cart.applyDiscount(res.discount_amount_inr);
      });
    }
  }

  getProgress() {
    return Math.min((this.cart.totalPrice() / 999) * 100, 100);
  }
}
