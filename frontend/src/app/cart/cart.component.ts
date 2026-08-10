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
    <div class="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold">Your Cart</h2>
        <div *ngIf="cart.cartItems().length > 0" class="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full font-bold border border-red-200">
          ⏱️ <span class="text-sm">Items reserved for: <span class="text-lg">{{cart.getFormattedTime()}}</span></span>
        </div>
      </div>

      <div *ngIf="cart.cartItems().length > 0" class="mb-8 p-4 bg-pink-50 rounded-xl border border-pink-100">
        <div class="flex justify-between text-sm font-bold text-pink-800 mb-2">
          <span>Free Gift Pouch & Express Delivery</span>
          <span>{{ cart.totalPrice() >= 999 ? 'Unlocked! 🎁' : 'Add ₹' + (999 - cart.totalPrice()) + ' more!' }}</span>
        </div>
        <div class="w-full bg-pink-200 rounded-full h-2.5">
          <div class="bg-pink-600 h-2.5 rounded-full transition-all duration-500" [style.width.%]="getProgress()"></div>
        </div>
        <p class="text-right text-xs text-pink-600 mt-1">Target: ₹999</p>
      </div>

      <div *ngIf="cart.cartItems().length === 0" class="text-center py-12">
        <p class="text-xl text-gray-500 mb-6">Your cart is empty.</p>
        <a routerLink="/" class="bg-pink-600 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-700 transition-colors">Start Shopping</a>
      </div>

      <div *ngIf="cart.cartItems().length > 0">
        <div *ngFor="let item of cart.cartItems()" class="flex justify-between items-center py-4 border-b border-gray-200">
          <div>
            <h4 class="font-bold text-lg">{{item.name}}</h4>
            <p class="text-gray-500 text-sm">Qty: {{item.quantity}}</p>
          </div>
          <div class="font-bold text-xl">₹{{item.price * item.quantity}}</div>
        </div>

        <div class="mt-8 space-y-3">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{{cart.totalPrice()}}</span>
          </div>
          <div class="flex justify-between text-green-600 font-bold">
            <span>Voucher Applied (FIRSTGLOW200)</span>
            <span>-₹{{cart.discount()}}</span>
          </div>
          <div class="flex justify-between text-2xl font-bold pt-4 border-t border-gray-200">
            <span>Total</span>
            <span>₹{{cart.finalPrice()}}</span>
          </div>
        </div>

        <div class="mt-8">
          <a routerLink="/checkout" class="block w-full bg-pink-600 hover:bg-pink-700 text-white text-center font-bold py-4 rounded-xl text-lg shadow-lg transition-transform transform active:scale-95">
            Proceed to Checkout
          </a>
        </div>
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
