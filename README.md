# PetCure Clinic website

A static website for PetCure Clinic, a veterinary hospital and pet spa. It is built from the "PetCure Clinic – Website Design" spec.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Services and doctors | `services.html` |
| Grooming and spa | `grooming.html` |
| Vaccination | `vaccination.html` |
| Pricing, offers and reviews | `pricing.html` |
| Book an appointment | `appointment.html` |
| Cart and multi-pet booking | `cart.html` |

## Features
- Responsive layout, with a mobile menu below 1060px.
- "Add to cart" buttons on Services, Grooming and Vaccination. The cart is stored in `localStorage` (`petcure_cart`), and the count in the header updates.
- Cart page: assign services to pets, add or remove pets, pick a day and time. It applies the first-visit (20%) and multi-pet (10%) discounts.
- Appointment page: choose a service, doctor and time, with a live price summary. Deep links work, e.g. `appointment.html?service=2` or `?doctor=1`.
- Booking days are the next six days from today.

## Run locally
No build step. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
```

## Before launch
Replace the placeholders: address, phone, email, emergency number, doctor names and bios, the sample reviews and prices. Bookings are client-side only, so connect `confirm` in `js/appointment.js` and `js/cart.js` to a backend or form service to receive them.
