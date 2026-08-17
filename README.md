Here is the neatly formatted `README.md` content, ready for you to copy and paste into your repository:

```markdown
# Indian Beauty UX POC - Frontend

This is the Angular frontend for the E-Commerce Proof of Concept, built with Tailwind CSS, Angular Material, and reactive state management (Signals).

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js**: v18+
*   **Angular CLI**: v19
*   **Python 3**: For backend dev server

### 1. Start the Backend
The backend serves the product catalog and handles checkout state.

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start

```

> **Note:** Navigate to `http://localhost:4200/` in your browser once the server is running.

---

## 🧪 Feature Testing Steps

Once the application is running, you can manually test the newly implemented UI & UX features:

### 1. Product Image Rendering

* Navigate to the Home/Catalog Page (`/`).
* **Verify:** Product images should now render clearly without the previous gray `opacity-50` overlay.

### 2. Global Cart Header Navigation

* Look at the top navigation bar.
* **Verify:** The "Admin" link should no longer be visible to public shoppers.
* Click "Add to Cart" on any standard product in the catalog.
* **Verify:** The Cart icon in the header should immediately display a red badge indicating **1** item. Clicking "Add to Cart" again will increment this badge.
* Click the Cart icon to navigate directly to the `/cart` page.

### 3. Custom Vanity Kit Builder Rules

* From the catalog, click the **Customize** button on a product to navigate to the product details page.
* Look at the "DIY Custom Vanity Kit Builder" section.
* **Verify Constraints:** Attempt to select checkboxes. The "Add Custom Kit to Cart" button will remain gray and disabled until exactly 3 items are selected. You cannot select more than 3.
* **Verify State:** Once 3 items are selected, the button turns vibrant and becomes active. Click it.
* **Verify Cart Output:** You will be redirected to the Cart. Ensure the item name includes your exact selections *(e.g., Matte Liquid Lipstick (Custom Vanity Kit: Variation A (Light), Variation B (Medium), Variation C (Dark)))*.

### 4. Dark Mode & Theme Color Selection

* Look at the top-right corner of the header navigation.
* **Test Dark Mode:** Click the ☀️ / 🌙 icon. The entire application (catalog, cart, checkout) should seamlessly switch between dark and light modes.
* **Test Theme Colors:** Click one of the three colored circles (Pink, Violet, Teal).
* **Verify:** The primary buttons, header, and accents should dynamically change to match the selected theme color.
* **Test Persistence:** Refresh the browser page. Your selected dark/light mode and theme color should persist securely via local storage.

```

```
