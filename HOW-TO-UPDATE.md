# How to change doctors and prices

Everything is in **one file: `js/config.js`**. You don't need to touch any other file.

## Steps (in your web browser, about 2 minutes)
1. Open **github.com/guptashruti199631/pet_web**.
2. Click the **js** folder, then **config.js**.
3. Click the **pencil icon** (✏️ "Edit this file") at the top right of the file.
4. Make your change (examples below).
5. Click the green **Commit changes…** button, then **Commit changes** again.
6. Wait 1–2 minutes and refresh the website. The change appears on every page.

## Change a doctor
Find the doctor and replace the three lines. Keep the quote marks and the comma.
```
    {
      name: 'Dr. Meera',
      role: 'Exotic pets specialist',
      bio:  'Cares for rabbits, birds and small pets, and handles dental cleaning.'
    },
```
The letter in the circle (for example "M") updates by itself. Doctor 3 is the one
shown for rabbits, birds and small pets.

## Change a price
Change only the number. No ₹ sign, no commas inside the number.
```
    full_groom:       1450,
```
Every page updates: Services, Grooming & Vaccination, Pricing, the booking form and its totals.

## If something looks wrong after a change
Usually a quote mark or a comma got deleted. On GitHub, open **config.js → History**,
open the previous version, and copy it back. Or send the file to your developer.
