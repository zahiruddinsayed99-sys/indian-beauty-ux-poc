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

  totalItems = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

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

  addCustomKit(product: any, selections: string[], customBundleId: string) {
    this.addToCart({
      id: customBundleId,
      name: `${product.name} (Custom Vanity Kit: ${selections.join(', ')})`,
      price: product.selling_price_inr,
      quantity: 1,
      isCustomBundle: true
    });
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

  updateQuantity(id: string, delta: number) {
    const items = [...this.cartItems()];
    const existing = items.find(i => i.id === id);
    if (existing) {
      existing.quantity += delta;
      if (existing.quantity <= 0) {
        this.removeItem(id);
        return;
      }
      this.cartItems.set(items);
    }
  }

  removeItem(id: string) {
    const items = this.cartItems().filter(i => i.id !== id);
    this.cartItems.set(items);
    if (items.length === 0) {
      this.clearCart();
    }
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
