import { Injectable, signal, PLATFORM_ID, Inject, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isCustomBundle?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);
  discount = signal<number>(0);
  timeLeft = signal<number>(600); // 10 minutes (600s)
  timerInterval: any;
  isBrowser: boolean;

  totalPrice = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });

  finalPrice = computed(() => {
    const total = this.totalPrice();
    return Math.max(0, total - this.discount());
  });

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  addToCart(item: CartItem) {
    const items = [...this.cartItems()];
    const existing = items.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push(item);
    }
    this.cartItems.set(items);
    this.startTimer();
  }

  applyDiscount(amount: number) {
    this.discount.set(amount);
  }

  clearCart() {
    this.cartItems.set([]);
    this.discount.set(0);
    this.stopTimer();
  }

  private startTimer() {
    if (!this.isBrowser) return;
    if (this.timerInterval) return;
    this.timeLeft.set(600);
    this.timerInterval = setInterval(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(v => v - 1);
      } else {
        this.clearCart();
        alert('Cart reservation expired!');
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getFormattedTime(): string {
    const m = Math.floor(this.timeLeft() / 60);
    const s = this.timeLeft() % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
