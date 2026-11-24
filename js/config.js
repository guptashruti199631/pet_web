/* =====================================================================
   PETCURE CLINIC SETTINGS: the only file you need to edit
   ---------------------------------------------------------------------
   Change a doctor or a price here, save (commit), and every page of the
   website updates in 1–2 minutes. You never need to touch the other files.

   RULES (so nothing breaks):
   - Keep the quote marks '  ' around text.
   - Prices are plain numbers: 1500, not '₹1,500' and not 1,500.
   - Keep the commas at the end of each line.
   ===================================================================== */

window.CLINIC_CONFIG = {

  /* ---------------- DOCTORS (exactly 3) ----------------
     If a doctor leaves, replace their name, role and bio with the new
     doctor's. Doctor 3 is the one shown for rabbits, birds and small pets. */
  doctors: [
    {
      name: 'Dr. Harish',
      role: 'Senior veterinary surgeon',
      bio:  'Leads our surgery and general medicine team, from routine sterilisation to soft-tissue surgery with careful pain control.'
    },
    {
      name: 'Dr. Aparna',
      role: 'Small animal physician',
      bio:  'Looks after preventive care, vaccinations and skin conditions, and loves helping first-time pet parents.'
    },
    {
      name: 'Dr. Siddarth',
      role: 'Dental care and exotic pets',
      bio:  'Handles dental cleaning and oral health, and cares for rabbits, birds and other small pets.'
    }
  ],

  /* ---------------- PRICES (in rupees) ---------------- */
  prices: {
    // Consultation & care
    checkup:          500,   // General check-up
    surgery:          4000,  // Surgery / sterilisation (starting price)
    dental:           1800,  // Dental care / scaling
    diagnostics:      400,   // Basic blood tests & diagnostics (starting price)
    boarding:         600,   // Boarding, per night

    // Vaccination
    vaccine_shot:     600,   // Puppy / kitten shot (per dose)
    rabies:           400,   // Rabies, with certificate
    booster:          700,   // Adult booster (yearly)
    lifestyle:        650,   // Lifestyle vaccines, e.g. kennel cough (starting price)
    vaccine_bundle:   2400,  // Yearly vaccination bundle

    // Grooming packages (small dog or cat)
    basic_bath:       700,
    full_groom:       1300,
    spa_day:          2000,

    // Grooming: extra charge by size
    size_medium:      300,   // 8–20 kg
    size_large:       600,   // 20–35 kg
    size_giant:       900,   // 35 kg+

    // Grooming add-ons
    flea_tick:        450,
    medicated_shampoo: 300,
    teeth_scaling:    350,
    coat_colouring:   600,
    pickup_drop:      250
  }
};
