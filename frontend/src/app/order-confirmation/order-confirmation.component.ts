import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto text-center py-12">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
        <span class="text-5xl">🎉</span>
      </div>

      <h1 class="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Order Confirmed!</h1>
      <p class="text-xl text-gray-600 mb-8">Thank you for shopping with us.</p>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 inline-block text-left w-full max-w-sm">
        <p class="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">ORDER ID</p>
        <p class="text-2xl font-mono font-bold text-gray-800 dark:text-gray-100">{{orderId}}</p>
      </div>

      <!-- Reciprocity: Bonus Offer -->
      <div class="bg-gradient-to-r from-primary-500 to-purple-500 p-8 rounded-2xl shadow-xl text-white transform transition-transform hover:scale-105 mb-8">
        <h3 class="text-2xl font-bold mb-3 flex items-center justify-center gap-2">🎁 Exclusive Bonus Offer!</h3>
        <p class="text-lg mb-6">Claim your Free Mini Sample Kit on your next order.</p>
        <button class="bg-white dark:bg-gray-800 text-primary-600 font-bold py-3 px-8 rounded-full shadow hover:bg-gray-50 dark:bg-gray-900 transition-colors">
          Claim Now
        </button>
      </div>

      <a routerLink="/" class="inline-block bg-gray-900 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors shadow">
        Continue Shopping
      </a>
    </div>
  `
})
export class OrderConfirmationComponent {
  orderId = '';
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || 'N/A';
    });
  }
}
