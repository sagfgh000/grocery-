# **App Name**: GrocerEase

## Core Features:

- User Authentication: Firebase Authentication (email/password) for admin and cashier roles.
- Inventory Management UI: CRUD UI for products (add, edit, delete, upload image) including search, filter by category, and sort by stock/price.
- Smart Billing / Receipt System: A receipt will be printed on each sale with details, payment method, timestamp, and a QR code.
- Auto Profit Calculation: Compute profit = (selling_price - buying_price) * quantity if buying_price exists.
- Multiple Language Support (English + Bangla): Language toggle in the header (EN | বাংলা) with locale detection and manual override.
- Daily Sales Dashboard: Dashboard overview for the day, charts: sales over time (hourly for current day / daily for range) and product categories by revenue, including the functionality to select different date ranges.
- App Settings: Configure tax rate, currency, shop name/address, low-stock default threshold, and receipt header in settings.

## Style Guidelines:

- Primary color: A muted green (#8FBC8F) to evoke a sense of freshness and natural products.
- Background color: A light, desaturated off-white (#F5F5DC), close to beige to provide a neutral and clean backdrop.
- Accent color: A warm, contrasting light brown (#D2691E) for calls to action and important highlights, like sale items.
- Body and headline font: 'PT Sans', a humanist sans-serif, for a blend of modern look and warmth in both headlines and body text.
- Mobile-first, simple POS (Point of Sale) layout designed for quick cashier use. Widgets (cards) for KPIs on the dashboard.
- Clean and simple vector icons for product categories, dashboard metrics, and UI actions.
- Subtle transitions and animations for loading states, and user interactions (e.g., adding items to the cart).