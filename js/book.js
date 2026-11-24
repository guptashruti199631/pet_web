/* Book page: services (cart), doctor, pets, day & time -> confirm on WhatsApp */
(function () {
  'use strict';
  var P = window.PetCure;
  var PETS_KEY = 'petcure_pets';

  var DAYS = P.upcomingDays(6);
  var TIMES = P.TIMES;
  var CFG = window.CLINIC_CONFIG || {};
  var DOCTORS = ['Any available doctor'].concat((CFG.doctors || []).map(function (d) { return d.name; }));
  if (DOCTORS.length === 1) DOCTORS = DOCTORS.concat(['Dr. Harish', 'Dr. Aparna', 'Dr. Siddarth']);
  // [button label, price, name in booking, ?service= key]
  // [button label, default price, name in booking, ?service= key, price key in js/config.js]
  var CATALOG = [
    ['Check-up', 500, 'General check-up', 'checkup', 'checkup'], ['Puppy / kitten shot', 600, 'Puppy / kitten shot', 'vaccine', 'vaccine_shot'],
    ['Rabies', 400, 'Rabies', 'rabies', 'rabies'], ['Booster', 700, 'Adult booster', 'booster', 'booster'],
    ['Basic Bath', 700, 'Basic Bath', 'bath', 'basic_bath'], ['Full Groom', 1300, 'Full Groom', 'groom', 'full_groom'], ['Spa Day', 2000, 'Spa Day', 'spa', 'spa_day'],
    ['Dental', 1800, 'Dental care', 'dental', 'dental'], ['Blood test', 400, 'Blood tests', 'bloodtest', 'diagnostics']
  ];
  var PRICES = CFG.prices || {};
  CATALOG.forEach(function (c) { if (typeof PRICES[c[4]] === 'number') c[1] = PRICES[c[4]]; });

  function readPets() {
    try { var v = localStorage.getItem(PETS_KEY); return v ? JSON.parse(v) : []; } catch (e) { return []; }
  }
  function savePets() { try { localStorage.setItem(PETS_KEY, JSON.stringify(st.pets)); } catch (e) { /* ignore */ } }

  var params = new URLSearchParams(location.search);
  var docParam = parseInt(params.get('doctor'), 10);
  var st = {
    items: P.Cart.read() || [], pets: readPets(), newType: 'Dog',
    doctor: docParam > 0 && docParam < DOCTORS.length ? docParam : 0,
    day: 0, time: -1, first: true, total: 0
  };

  // ?service=groom etc. adds that service once (links from other pages)
  var svc = params.get('service');
  if (svc) {
    var c = CATALOG.filter(function (x) { return x[3] === svc; })[0];
    if (c && !st.items.some(function (i) { return i.name === c[2]; })) {
      st.items.push({ id: Date.now() + Math.random(), name: c[2], price: c[1], pet: -1 });
    }
    history.replaceState(null, '', location.pathname + (st.doctor ? '?doctor=' + st.doctor : ''));
  }
  if (st.pets.length === 1) st.items.forEach(function (i) { if (i.pet < 0) i.pet = 0; });
  P.Cart.save(st.items);

  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function pill(label, on, onClick, extra) {
    var b = el('button', 'pill' + (extra ? ' ' + extra : '') + (on ? ' on' : ''), label);
    b.type = 'button';
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.addEventListener('click', onClick);
    return b;
  }
  function setItems(items) { st.items = items; P.Cart.save(items); $('error').textContent = ''; render(); }

  function render() {
    var items = st.items, pets = st.pets;

    // Selected services
    $('cart-empty').hidden = items.length > 0;
    var list = $('cart-items'); list.innerHTML = '';
    items.forEach(function (it) {
      var box = el('div', 'cart-item');
      var top = el('div', 'between'); top.style.alignItems = 'center';
      top.appendChild(el('b', null, it.name)).style.fontSize = '18px';
      var right = el('span', 'row'); right.style.gap = '16px';
      right.appendChild(el('b', null, P.fmt(it.price)));
      var rm = el('button', 'icon-btn', '×'); rm.type = 'button'; rm.setAttribute('aria-label', 'Remove ' + it.name);
      rm.addEventListener('click', function () { setItems(items.filter(function (x) { return x.id !== it.id; })); });
      right.appendChild(rm); top.appendChild(right); box.appendChild(top);

      var row = el('div', 'row'); row.style.gap = '8px';
      row.appendChild(el('span', null, 'For:')).style.cssText = 'font-size:15px;font-weight:500';
      pets.forEach(function (p, pi) {
        row.appendChild(pill(p.name, it.pet === pi, function () {
          setItems(items.map(function (x) { return x.id === it.id ? Object.assign({}, x, { pet: pi }) : x; }));
        }, 'sm'));
      });
      if (it.pet < 0) row.appendChild(el('span', null, pets.length ? 'Choose a pet' : 'Add your pet in step 3')).style.cssText = 'font-size:14px;color:var(--gold-text)';
      box.appendChild(row);
      list.appendChild(box);
    });

    // Catalog
    var cat = $('catalog'); cat.innerHTML = '';
    CATALOG.forEach(function (c) {
      cat.appendChild(pill('+ ' + c[0] + ' · ' + P.fmt(c[1]), false, function () {
        setItems(items.concat([{ id: Date.now() + Math.random(), name: c[2], price: c[1], pet: pets.length === 1 ? 0 : -1 }]));
      }, 'add'));
    });

    // Doctor
    var dd = $('pick-doctor'); dd.innerHTML = '';
    DOCTORS.forEach(function (d, i) { dd.appendChild(pill(d, st.doctor === i, function () { st.doctor = i; render(); })); });

    // Pets
    var pl = $('pet-list'); pl.innerHTML = '';
    if (!pets.length) pl.appendChild(el('p', null, 'No pets yet. Add your first pet below.')).style.color = 'var(--muted)';
    pets.forEach(function (p, pi) {
      var chip = el('span', 'chip', p.name + ' (' + p.type + ')');
      var x = el('button', null, '×'); x.type = 'button'; x.setAttribute('aria-label', 'Remove ' + p.name);
      x.style.cssText = 'min-height:32px;min-width:32px;border:0;background:transparent;font-size:18px;cursor:pointer';
      x.addEventListener('click', function () {
        st.pets = pets.filter(function (_, k) { return k !== pi; }); savePets();
        setItems(items.map(function (it) {
          if (it.pet === pi) return Object.assign({}, it, { pet: -1 });
          if (it.pet > pi) return Object.assign({}, it, { pet: it.pet - 1 });
          return it;
        }));
      });
      chip.appendChild(x); pl.appendChild(chip);
    });
    var types = $('pet-types'); types.innerHTML = '';
    ['Dog', 'Cat', 'Other'].forEach(function (t) { types.appendChild(pill(t, st.newType === t, function () { st.newType = t; render(); })); });

    // Day & time
    var dy = $('pick-day'); dy.innerHTML = '';
    DAYS.forEach(function (d, i) { dy.appendChild(pill(d, st.day === i, function () { st.day = i; render(); })); });
    var tt = $('pick-time'); tt.innerHTML = '';
    TIMES.forEach(function (t, i) { tt.appendChild(pill(t, st.time === i, function () { st.time = i; $('error').textContent = ''; render(); })); });

    // Summary
    var sub = items.reduce(function (a, i) { return a + i.price; }, 0);
    var distinct = new Set(items.map(function (i) { return i.pet; }).filter(function (p) { return p >= 0; })).size;
    var d1 = st.first ? Math.round(sub * 0.2) : 0;
    var d2 = distinct >= 2 ? Math.round(sub * 0.1) : 0;
    var hasGroom = items.some(function (i) { return /Groom|Bath|Spa/.test(i.name); });
    $('o-doctor').textContent = DOCTORS[st.doctor];
    $('o-when').textContent = st.time < 0 ? 'Pick a time' : DAYS[st.day] + ', ' + TIMES[st.time];
    $('o-count').textContent = items.length;
    $('o-sub').textContent = P.fmt(sub);
    $('o-d1').textContent = d1 ? '−' + P.fmt(d1) : '₹0';
    $('o-d2').textContent = d2 ? '−' + P.fmt(d2) : '₹0';
    $('o-total').textContent = P.fmt(sub - d1 - d2);
    $('o-free').textContent = 'Health snapshot' + (hasGroom ? ', nail trim and ear cleaning' : '') + ', plus a follow-up call after treatment.';
    st.total = sub - d1 - d2;
  }

  $('pet-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('pn').value.trim();
    if (!name) { $('pn').focus(); return; }
    st.pets = st.pets.concat([{ name: name, type: st.newType }]); savePets();
    $('pn').value = '';
    if (st.pets.length === 1) setItems(st.items.map(function (i) { return i.pet < 0 ? Object.assign({}, i, { pet: 0 }) : i; }));
    else render();
  });

  $('first').addEventListener('change', function (e) { st.first = e.target.checked; render(); });

  $('confirm').addEventListener('click', function () {
    var err = $('error');
    var owner = $('ow').value.trim(), phone = $('ph').value.trim();
    if (!st.items.length) { err.textContent = 'Please choose at least one service.'; return; }
    if (!st.pets.length) { err.textContent = 'Please add your pet in step 3.'; return; }
    if (st.items.some(function (i) { return i.pet < 0; })) { err.textContent = 'Choose which pet each service is for.'; return; }
    if (st.time < 0) { err.textContent = 'Please pick a time.'; return; }
    if (!owner || !phone) { err.textContent = 'Please add your name and phone number.'; return; }
    err.textContent = '';

    var when = DAYS[st.day] + ', ' + TIMES[st.time];
    var fields = { 'Name': owner, 'Phone': phone, 'Doctor': DOCTORS[st.doctor], 'When': when };
    var g = $('d-groups'); g.innerHTML = '';
    st.pets.forEach(function (p, pi) {
      var mine = st.items.filter(function (i) { return i.pet === pi; });
      if (!mine.length) return;
      fields['Pet: ' + p.name + ' (' + p.type + ')'] = mine.map(function (i) { return i.name + ' (' + P.fmt(i.price) + ')'; }).join(', ');
      var box = el('div'); box.style.cssText = 'background:var(--cream);border-radius:14px;padding:16px 20px';
      box.appendChild(el('b', null, p.name + ' (' + p.type + ')'));
      box.appendChild(el('p', null, mine.map(function (i) { return i.name; }).join(', '))).style.fontSize = '15px';
      g.appendChild(box);
    });
    fields['First visit'] = st.first ? 'Yes (20% off)' : 'No';
    fields['Estimated total'] = P.fmt(st.total);

    // Open WhatsApp first, straight from the click, so the browser allows it
    var sent = P.sendBooking(st.items.length + ' service(s) with ' + DOCTORS[st.doctor] + ', ' + when, fields);

    $('d-when').textContent = when + ' with ' + DOCTORS[st.doctor] + '. We will call or message ' + phone + ' to confirm.';
    $('d-total').textContent = P.fmt(st.total);
    $('wa-link').href = sent.whatsappUrl;
    $('mail-link').href = sent.mailtoUrl;
    $('book-form').hidden = true; $('book-summary').hidden = true; $('book-done').hidden = false;
    st.items = []; P.Cart.save([]);
    $('book-done').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('reset').addEventListener('click', function () {
    st.time = -1;
    $('book-form').hidden = false; $('book-summary').hidden = false; $('book-done').hidden = true;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  render();
})();
