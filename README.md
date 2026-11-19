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

## How bookings reach the clinic
When a customer confirms on the Appointment or Cart page:
1. **Email:** the booking is emailed to `petcure@gmail.com` through [FormSubmit](https://formsubmit.co) (free, no account needed). **The very first booking triggers an activation email from FormSubmit. Open it and click "Activate Form"**, otherwise later bookings won't be delivered.
2. **WhatsApp:** the confirmation screen shows a "Send booking on WhatsApp" button. It opens WhatsApp with the full booking typed out, addressed to the clinic's WhatsApp number.
3. **Phone:** "Call to book" buttons appear on every page (a bottom bar on mobile), the doctor cards, and the booking pages.

The phone, WhatsApp and email settings live at the top of `js/main.js` (`CLINIC`). The numbers also appear as `tel:` and `wa.me` links in the HTML, so search and replace them if they change.

## Run locally
No build step. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
```

## Before launch
The clinic details, doctors and prices are filled in. The reviews are still labelled samples, so swap in real customer reviews once you have them. Activate FormSubmit (see above) after the first test booking.
