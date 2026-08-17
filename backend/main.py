from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="E-Commerce API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock DB
orders = []

import base64

def generate_svg_data_uri(name: str) -> str:
    # Generate a pseudo-random hue based on the product name
    hash_val = sum(ord(c) for c in name)
    hue = hash_val % 360
    color = f"hsl({hue}, 70%, 80%)"

    # Initials
    initials = "".join([w[0] for w in name.split() if w])[:2].upper()

    svg = f'''<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
      <rect width='400' height='300' fill='{color}'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='60' font-weight='bold' fill='#333' font-family='sans-serif'>{initials}</text>
    </svg>'''

    b64 = base64.b64encode(svg.encode('utf-8')).decode('utf-8')
    return f"data:image/svg+xml;base64,{b64}"

@app.get("/api/v1/products")
def get_products():
    return [
        {
            "id": "1",
            "name": "Matte Liquid Lipstick",
            "mrp_inr": 999,
            "selling_price_inr": 549,
            "category": "Cosmetics",
            "stock": 2,
            "image": generate_svg_data_uri("Matte Liquid Lipstick")
        },
        {
            "id": "2",
            "name": "Glow Highlighter Palette",
            "mrp_inr": 1499,
            "selling_price_inr": 899,
            "category": "Cosmetics",
            "stock": 15,
            "image": generate_svg_data_uri("Glow Highlighter Palette")
        },
        {
            "id": "3",
            "name": "Pro Beard Trimmer",
            "mrp_inr": 2499,
            "selling_price_inr": 1299,
            "category": "Grooming",
            "stock": 5,
            "image": generate_svg_data_uri("Pro Beard Trimmer")
        }
    ]

@app.get("/api/v1/checkout/defaults")
def get_checkout_defaults():
    return {
        "payment_preference": "UPI / GPay",
        "shipping_fee": 0,
        "address_defaults": {
            "pincode": "400001",
            "city": "Mumbai"
        }
    }

@app.get("/api/v1/discounts/welcome")
def get_welcome_discount():
    return {
        "voucher_code": "FIRSTGLOW200",
        "discount_amount_inr": 200
    }

class CustomRequest(BaseModel):
    base_product_id: str
    selections: List[str]

@app.post("/api/v1/products/customize")
def customize_product(req: CustomRequest):
    return {
        "custom_bundle_id": f"cb_{req.base_product_id}",
        "bundle_name": "Custom Vanity Kit",
        "selections": req.selections,
        "price_override_inr": 549  # Simplified mock
    }

class CheckoutRequest(BaseModel):
    cart_items: List[dict]
    total_amount_inr: int

@app.post("/api/v1/cart/checkout")
def checkout(req: CheckoutRequest):


    order_id = f"ord_{uuid.uuid4().hex[:8]}"
    order = {
        "order_id": order_id,
        "status": "Placed",
        "payment_status": "Pending",
        "total_amount_inr": req.total_amount_inr,
        "items": req.cart_items,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    orders.append(order)
    return {
        "order_id": order_id,
        "timestamp": order["created_at"],
        "razorpay_mock": {
            "key": "rzp_test_mock",
            "amount": req.total_amount_inr * 100,
            "currency": "INR",
            "name": "Indian Beauty Store",
            "prefill": {
                "contact": "success@razorpay"
            }
        }
    }

class VerifyRequest(BaseModel):
    order_id: str
    status: str

@app.post("/api/v1/payment/verify-sandbox")
def verify_payment(req: VerifyRequest):
    for order in orders:
        if order["order_id"] == req.order_id:
            order["payment_status"] = req.status
            return {"message": "Payment verified", "order": order}
    raise HTTPException(status_code=404, detail="Order not found")

@app.get("/api/v1/admin/orders")
def get_admin_orders():
    return orders

class UpdateOrderRequest(BaseModel):
    status: str

@app.patch("/api/v1/admin/orders/{order_id}")
def update_order_status(order_id: str, req: UpdateOrderRequest):
    for order in orders:
        if order["order_id"] == order_id:
            order["status"] = req.status
            return {"message": "Status updated", "order": order}
    raise HTTPException(status_code=404, detail="Order not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
