import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { ApiService } from '../api.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

      <!-- Checkout Form -->
      <div class="md:w-2/3">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">Checkout</h2>
          <div class="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-3 py-1 rounded">
            ⏱️ {{cart.getFormattedTime()}}
          </div>
        </div>

        <!-- Smart Defaults Section -->
        <div class="bg-white p-6 rounded-xl shadow-md mb-6">
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2"><span class="bg-gray-800 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">1</span> Contact & Shipping</h3>
          <form #checkoutForm="ngForm" class="space-y-4">
            <div>
              <input type="email" name="email" [(ngModel)]="email" required email #emailCtrl="ngModel" placeholder="Email for Order Updates" class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none" [ngClass]="{'border-red-500': emailCtrl.invalid && emailCtrl.touched}">
              <p *ngIf="emailCtrl.invalid && emailCtrl.touched" class="text-red-500 text-xs mt-1">Please enter a valid email address.</p>
            </div>
            <div class="flex gap-4">
              <div class="w-1/2">
                <input type="text" name="pincode" [(ngModel)]="defaults.address_defaults.pincode" required pattern="[0-9]{6}" #pincodeCtrl="ngModel" placeholder="Pincode (6 digits)" class="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500" [ngClass]="{'border-red-500': pincodeCtrl.invalid && pincodeCtrl.touched}">
                <p *ngIf="pincodeCtrl.invalid && pincodeCtrl.touched" class="text-red-500 text-xs mt-1">Enter valid 6-digit Pincode.</p>
              </div>
              <div class="w-1/2">
                <input type="text" name="city" [(ngModel)]="defaults.address_defaults.city" required #cityCtrl="ngModel" placeholder="City" class="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500" [ngClass]="{'border-red-500': cityCtrl.invalid && cityCtrl.touched}">
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-1/2">
                <input type="text" name="state" [(ngModel)]="defaults.address_defaults.state" required #stateCtrl="ngModel" placeholder="State" class="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500" [ngClass]="{'border-red-500': stateCtrl.invalid && stateCtrl.touched}">
              </div>
              <div class="w-1/2">
                <input type="text" name="street" [(ngModel)]="defaults.address_defaults.street" required #streetCtrl="ngModel" placeholder="Street Address" class="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500" [ngClass]="{'border-red-500': streetCtrl.invalid && streetCtrl.touched}">
              </div>
            </div>

            <label class="flex items-center gap-2 font-medium text-gray-700 cursor-pointer mt-4">
              <input type="checkbox" checked class="w-5 h-5 text-pink-600 rounded">
              Billing address same as shipping
            </label>
          </form>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2"><span class="bg-gray-800 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">2</span> Payment Method</h3>
          <div class="space-y-3">
            <label class="flex items-center justify-between p-4 border border-pink-500 rounded-lg cursor-pointer bg-pink-50">
              <div class="flex items-center gap-3">
                <input type="radio" name="payment" [value]="'UPI / GPay'" [(ngModel)]="defaults.payment_preference" class="w-5 h-5 text-pink-600">
                <span class="font-bold">UPI / GPay</span>
              </div>
              <span class="bg-pink-200 text-pink-800 text-xs font-bold px-2 py-1 rounded">Recommended</span>
            </label>
            <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div class="flex items-center gap-3">
                <input type="radio" name="payment" value="Card" [(ngModel)]="defaults.payment_preference" class="w-5 h-5">
                <span class="font-medium">Credit / Debit Card</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="md:w-1/3">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-4">
          <h3 class="text-xl font-bold mb-4">Order Summary</h3>
          <div class="space-y-3 mb-6">
            <div *ngFor="let item of cart.cartItems()" class="flex justify-between text-sm">
              <span class="text-gray-600">{{item.name}} x{{item.quantity}}</span>
              <span class="font-medium">₹{{item.price * item.quantity}}</span>
            </div>
          </div>

          <div class="space-y-2 border-t border-gray-200 pt-4 mb-6 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span>₹{{cart.totalPrice()}}</span>
            </div>
            <div class="flex justify-between text-green-600 font-medium">
              <span>Voucher Discount</span>
              <span>-₹{{cart.discount()}}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Shipping</span>
              <span class="text-green-600 font-medium">Free</span>
            </div>
          </div>

          <div class="flex justify-between items-center text-xl font-bold border-t border-gray-300 pt-4 mb-6">
            <span>Total to Pay</span>
            <span>₹{{cart.finalPrice()}}</span>
          </div>

          <button (click)="initiateCheckout()" [disabled]="checkoutForm?.invalid || cart.cartItems().length === 0" class="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-transform transform active:scale-95 flex items-center justify-center gap-2">
            ⚡ Express Guest Checkout
          </button>
        </div>
      </div>
    </div>

    <!-- Razorpay Mock Modal -->
    <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col">
        <div class="bg-blue-600 p-4 text-white flex justify-between items-center">
          <span class="font-bold flex items-center gap-2">💳 Razorpay Sandbox</span>
          <span class="text-xs bg-blue-800 px-2 py-1 rounded">Test Environment</span>
        </div>
        <div class="p-6 text-center">
          <p class="text-gray-500 text-sm mb-1">Paying</p>
          <h2 class="text-4xl font-extrabold mb-6">₹{{cart.finalPrice()}}</h2>
          <div class="bg-gray-100 p-3 rounded-lg mb-6 flex items-center justify-between">
            <span class="text-sm text-gray-600">Simulated UPI ID</span>
            <span class="font-mono text-sm font-bold">{{rzpMock.prefill?.contact}}</span>
          </div>

          <div class="space-y-3">
            <button (click)="verifyPayment('SUCCESS')" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded shadow">
              ✅ Simulate Success
            </button>
            <button (click)="verifyPayment('FAILED')" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded shadow">
              ❌ Simulate Failure
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  defaults: any = { address_defaults: {} };
  email = '';
  showModal = false;
  currentOrderId = '';
  rzpMock: any = {};

  @ViewChild('checkoutForm') checkoutForm!: NgForm;

  constructor(public cart: CartService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getCheckoutDefaults().subscribe(res => {
      this.defaults = res;
    });
  }

  initiateCheckout() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.form.markAllAsTouched();
      return;
    }

    this.api.checkout({
      cart_items: this.cart.cartItems(),
      total_amount_inr: this.cart.finalPrice()
    }).subscribe(res => {
      this.currentOrderId = res.order_id;
      this.rzpMock = res.razorpay_mock;
      this.showModal = true;
    });
  }

  verifyPayment(status: string) {
    this.api.verifyPayment({
      order_id: this.currentOrderId,
      status: status
    }).subscribe(res => {
      this.showModal = false;
      if (status === 'SUCCESS') {
        this.cart.clearCart();
        this.router.navigate(['/order-confirmation'], { queryParams: { orderId: this.currentOrderId } });
      } else {
        alert('Payment failed. Please try again.');
      }
    });
  }
}
