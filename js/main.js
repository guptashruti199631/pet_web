/* PetCure Clinic — shared behaviour: nav, cart storage, toast */
(function () {
  'use strict';

  var CART_KEY = 'petcure_cart';

  /* ---- Clinic contact settings: change these in one place ---- */
  var CLINIC = {
    phone: '0123456789',            // number customers call to book
    phoneDisplay: '0123456789',
    whatsapp: '919876543210',       // WhatsApp number, with country code 91, no + or spaces
    email: 'petcure@gmail.com'      // booking emails are delivered here (via FormSubmit)
  };

  // Sends the booking to the clinic's email (FormSubmit) and returns a WhatsApp link with the same text.
  // The first booking ever sent triggers a one-time activation email from FormSubmit to CLINIC.email.
  function sendBooking(subject, fields) {
    var lines = Object.keys(fields).map(function (k) { return k + ': ' + fields[k]; });
    var text = 'New booking: PetCure Clinic\n' + subject + '\n\n' + lines.join('\n');
    var payload = Object.assign({ _subject: subject, _template: 'table', _captcha: 'false' }, fields);
    var request = fetch('https://formsubmit.co/ajax/' + encodeURIComponent(CLINIC.email), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
    return { emailed: request, whatsappUrl: 'https://wa.me/' + CLINIC.whatsapp + '?text=' + encodeURIComponent(text) };
  }

  var Cart = {
    read: function () {
      try { var v = localStorage.getItem(CART_KEY); return v ? JSON.parse(v) : null; }
      catch (e) { return null; }
    },
    save: function (items) {
      try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* storage unavailable */ }
      Cart.updateCount(items.length);
    },
    add: function (name, price) {
      var items = Cart.read() || [];
      items.push({ id: Date.now() + Math.random(), name: name, price: price, pet: -1 });
      Cart.save(items);
      showToast(name + ' added to cart');
    },
    updateCount: function (n) {
      if (n == null) { var c = Cart.read(); n = c ? c.length : 0; }
      document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = n; });
    }
  };

  function fmt(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  var toastTimer;
  function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      t.innerHTML = '<span></span><a href="cart.html">View cart</a>';
      document.body.appendChild(t);
    }
    t.querySelector('span').textContent = msg;
    // force reflow so the transition replays
    void t.offsetWidth;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3500);
  }

  // Next N clinic days, formatted like "Thu 19 Nov"
  function upcomingDays(n) {
    var out = [];
    var d = new Date();
    for (var i = 1; i <= n; i++) {
      var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      out.push(x.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', ''));
    }
    return out;
  }

  window.PetCure = { Cart: Cart, fmt: fmt, toast: showToast, upcomingDays: upcomingDays, CLINIC: CLINIC, sendBooking: sendBooking,
    TIMES: ['10:00 am', '11:30 am', '2:00 pm', '3:30 pm', '5:00 pm', '6:30 pm'] };

  document.addEventListener('DOMContentLoaded', function () {
    Cart.updateCount();

    // Mobile menu
    var toggle = document.querySelector('.menu-toggle');
    var links = document.getElementById('nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    // Header border on scroll
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // "Add to cart" buttons
    document.querySelectorAll('[data-add]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        Cart.add(btn.getAttribute('data-add'), Number(btn.getAttribute('data-price')));
      });
    });

    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  });
})();
