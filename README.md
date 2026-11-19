# PetCure Clinic website

A static website for PetCure Clinic, a veterinary hospital and pet spa. It is built from the "PetCure Clinic – Website Design" spec.

## Pages (5)

| Page | File |
|---|---|
| Home | `index.html` |
| Services and doctors | `services.html` |
| Grooming & Vaccination | `care.html` |
| Pricing, offers and reviews | `pricing.html` |
| Book an appointment (services, doctor, pets, time) | `book.html` |

## Features
- Responsive layout, with a mobile menu below 1060px.
- "Add to booking" buttons on Services and Grooming & Vaccination. Selections are stored in `localStorage` (`petcure_cart`), and a count badge appears on the header's Book button.
- Multi-pet booking applies the first-visit (20%) and multi-pet (10%) discounts.
- Book page: choose services, a doctor, your pets and a time, with a live price summary. Deep links work, e.g. `book.html?service=groom` or `book.html?doctor=1`.
- Booking days are the next six days from today.

## How bookings reach the clinic
No third-party service or setup is needed, and every booking works the same way, first or fiftieth:
1. **WhatsApp:** "Confirm booking on WhatsApp" opens WhatsApp with the whole booking typed out (name, phone, pet, service, doctor, date and time, price), addressed to the clinic's WhatsApp number **98765 43210**. The customer taps **Send**.
2. **Phone:** Call buttons for **0123456789** are in the header on phones and tablets, on the booking pages and on the doctor cards.
3. **Email (backup):** if WhatsApp isn't available, the confirmation screen offers "send it by email", which opens the customer's email app addressed to petcure@gmail.com.

The phone, WhatsApp and email settings live at the top of `js/main.js` (`CLINIC`). The numbers also appear as `tel:` and `wa.me` links in the HTML.

## Publishing on GitHub Pages
Repo **Settings → Pages → Build and deployment**: Source "Deploy from a branch", branch `claude/nifty-pascal-1ht4kt`, folder `/ (root)`, then **Save**. The site goes live at `https://guptashruti199631.github.io/pet_web/` within a couple of minutes.

## Signboard
- `assets/signboard.svg`: the clinic front signboard design, a vector file that scales to any size. Give this to the sign maker.
- `assets/signboard-print.png`: a 4800 × 1680 px image of the same design for quick previews or printing.

## Run locally
No build step. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
```

## Before launch
The clinic details, doctors and prices are filled in. The reviews are still labelled samples, so swap in real customer reviews once you have them.
