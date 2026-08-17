import { Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation', component: OrderConfirmationComponent },
  { path: 'admin', component: AdminComponent },
];
