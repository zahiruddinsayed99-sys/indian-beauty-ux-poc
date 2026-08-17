import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 class="text-3xl font-bold flex items-center gap-3">
          <span class="bg-gray-800 text-white p-2 rounded-lg text-xl">🛡️</span>
          Admin Dashboard
        </h2>
        <button (click)="loadOrders()" class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded shadow-sm flex items-center gap-2">
          🔄 Refresh
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-900 text-gray-600 text-sm uppercase tracking-wider">
              <th class="p-4 font-bold rounded-tl-lg">Order ID</th>
              <th class="p-4 font-bold">Date/Time (IST)</th>
              <th class="p-4 font-bold">Items</th>
              <th class="p-4 font-bold">Amount</th>
              <th class="p-4 font-bold">Payment</th>
              <th class="p-4 font-bold">Status</th>
              <th class="p-4 font-bold rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let order of orders" class="hover:bg-gray-50 dark:bg-gray-900 transition-colors">
              <td class="p-4 font-mono text-sm font-bold">{{order.order_id}}</td>
              <td class="p-4 text-sm text-gray-600">{{order.created_at ? (order.created_at | date:'medium':'IST') : 'N/A'}}</td>
              <td class="p-4 text-sm text-gray-600">
                <div *ngFor="let item of order.items">{{item.name}} (x{{item.quantity}})</div>
              </td>
              <td class="p-4 font-bold text-gray-800 dark:text-gray-100">₹{{order.total_amount_inr}}</td>
              <td class="p-4">
                <span class="px-2 py-1 rounded text-xs font-bold"
                      [ngClass]="order.payment_status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                  {{order.payment_status === 'SUCCESS' ? 'Success' : 'Pending'}}
                </span>
              </td>
              <td class="p-4">
                <span class="px-2 py-1 rounded text-xs font-bold"
                      [ngClass]="{
                        'bg-blue-100 text-blue-700': order.status === 'Placed',
                        'bg-green-100 text-green-700': order.status === 'Delivered',
                        'bg-red-100 text-red-700': order.status === 'Cancelled'
                      }">
                  {{order.status}}
                </span>
              </td>
              <td class="p-4 flex gap-2">
                <button (click)="updateStatus(order.order_id, 'Delivered')" [disabled]="order.status === 'Delivered' || order.status === 'Cancelled'"
                        class="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold py-1 px-3 rounded">
                  Mark Delivered
                </button>
                <button (click)="updateStatus(order.order_id, 'Cancelled')" [disabled]="order.status === 'Delivered' || order.status === 'Cancelled'"
                        class="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-bold py-1 px-3 rounded">
                  Cancel
                </button>
              </td>
            </tr>
            <tr *ngIf="orders.length === 0">
              <td colspan="7" class="p-8 text-center text-gray-500">No orders found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  orders: any[] = [];

  constructor(private api: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.api.getAdminOrders().subscribe(res => {
      this.orders = res;
    });
  }

  updateStatus(id: string, status: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.updateOrderStatus(id, status).subscribe(() => {
          this.loadOrders();
        });
      }
    });
  }
}
