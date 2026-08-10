import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mb-4">
      <a routerLink="/" class="text-pink-600 hover:underline flex items-center gap-1 font-medium">← Back to Catalog</a>
    </div>

    <div *ngIf="product" class="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8">
      <div class="md:w-1/2">
        <div class="h-96 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          <img [src]="product.image" alt="Product" class="object-cover w-full h-full opacity-50" />
        </div>
      </div>

      <div class="md:w-1/2 flex flex-col">
        <h2 class="text-4xl font-bold mb-2">{{product.name}}</h2>

        <div *ngIf="product.stock <= 5" class="text-red-500 font-bold mb-4 bg-red-50 p-2 rounded inline-block self-start shadow-sm border border-red-100">
          ⚡ High Demand! Only {{product.stock}} left in stock
        </div>

        <div class="flex items-end gap-4 mb-8">
          <span class="text-4xl font-extrabold text-gray-900">₹{{product.selling_price_inr}}</span>
          <span class="text-gray-400 line-through text-2xl">₹{{product.mrp_inr}}</span>
          <span class="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded shadow-sm border border-green-200">
            {{ getDiscountPercent(product.mrp_inr, product.selling_price_inr) }}% OFF
          </span>
        </div>

        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 shadow-inner">
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
            <span class="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center">DIY</span>
            Custom Vanity Kit Builder
          </h3>
          <p class="text-sm text-gray-600 mb-4">Select exactly 3 variations to build your perfect custom kit.</p>

          <div class="space-y-3">
            <label *ngFor="let opt of options" class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-pink-500 transition-colors shadow-sm">
              <input type="checkbox"
                     [value]="opt"
                     (change)="toggleSelection(opt)"
                     [disabled]="!selectedOptions.includes(opt) && selectedOptions.length >= 3"
                     class="w-5 h-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded" />
              <span class="font-medium text-gray-700">{{opt}}</span>
            </label>
          </div>

          <div class="mt-4 flex justify-between items-center text-sm font-bold text-gray-700">
            <span>Selected: {{selectedOptions.length}}/3</span>
            <span *ngIf="selectedOptions.length === 3" class="text-green-600">Kit Complete! ✨</span>
          </div>
        </div>

        <button (click)="addToCart()" [disabled]="selectedOptions.length !== 3"
                class="mt-auto w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                [ngClass]="selectedOptions.length === 3 ? 'bg-pink-600 hover:bg-pink-700 text-white' : 'bg-gray-300 text-gray-500'">
          {{ selectedOptions.length === 3 ? 'Add Custom Kit to Cart' : 'Select 3 items to continue' }}
        </button>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: any;
  options = ['Variation A (Light)', 'Variation B (Medium)', 'Variation C (Dark)', 'Attachment X', 'Attachment Y'];
  selectedOptions: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cart: CartService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.getProducts().subscribe(res => {
      this.product = res.find(p => p.id === id);
    });
  }

  getDiscountPercent(mrp: number, sp: number): number {
    return Math.round(((mrp - sp) / mrp) * 100);
  }

  toggleSelection(opt: string) {
    if (this.selectedOptions.includes(opt)) {
      this.selectedOptions = this.selectedOptions.filter(o => o !== opt);
    } else {
      if (this.selectedOptions.length < 3) {
        this.selectedOptions.push(opt);
      }
    }
  }

  addToCart() {
    if (this.selectedOptions.length === 3) {
      this.api.customizeProduct({
        base_product_id: this.product.id,
        selections: this.selectedOptions
      }).subscribe(res => {
        this.cart.addToCart({
          id: res.custom_bundle_id,
          name: `${this.product.name} (Custom Vanity Kit)`,
          price: this.product.selling_price_inr,
          quantity: 1,
          isCustomBundle: true
        });
        this.router.navigate(['/cart']);
      });
    }
  }
}
