/* Appointment booking — three-step form with live summary */
(function () {
  'use strict';
  var P = window.PetCure;

  var SERVICES = [['General check-up', 500], ['Vaccination', 600], ['Grooming', 700], ['Dental care', 1800], ['Diagnostics', 400]];
  var DOCTORS = ['Any available doctor', 'Dr. Harish', 'Dr. Aparna', 'Dr. Siddarth'];
  var DAYS = P.upcomingDays(6);
  var TIMES = P.TIMES;

  var params = new URLSearchParams(location.search);
  var clamp = function (v, max) { v = parseInt(v, 10); return isNaN(v) || v < 0 || v >= max ? 0 : v; };
  var st = { service: clamp(params.get('service'), SERVICES.length), doctor: clamp(params.get('doctor'), DOCTORS.length), day: 0, time: -1, first: true };

  var $ = function (id) { return document.getElementById(id); };

  function pills(el, labels, key) {
    el.innerHTML = '';
    labels.forEach(function (label, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pill' + (st[key] === i ? ' on' : '');
      b.setAttribute('aria-pressed', st[key] === i ? 'true' : 'false');
      b.textContent = label;
      b.addEventListener('click', function () { st[key] = i; if (key === 'time') $('error').textContent = ''; render(); });
      el.appendChild(b);
    });
  }

  function render() {
    pills($('pick-service'), SERVICES.map(function (s) { return s[0]; }), 'service');
    pills($('pick-doctor'), DOCTORS, 'doctor');
    pills($('pick-day'), DAYS, 'day');
    pills($('pick-time'), TIMES, 'time');

    var base = SERVICES[st.service][1];
    var disc = st.first ? Math.round(base * 0.2) : 0;
    $('s-service').textContent = SERVICES[st.service][0];
    $('s-doctor').textContent = DOCTORS[st.doctor];
    $('s-when').textContent = st.time < 0 ? 'Pick a time' : DAYS[st.day] + ', ' + TIMES[st.time];
    $('s-base').textContent = P.fmt(base);
    $('s-disc').textContent = st.first ? '−' + P.fmt(disc) : '₹0';
    $('s-total').textContent = P.fmt(base - disc);
  }

  function showSendStatus(sent) {
    $('wa-link').href = sent.whatsappUrl;
    var note = $('email-status');
    note.textContent = 'Sending your booking to the clinic…';
    sent.emailed.then(function (ok) {
      note.textContent = ok
        ? 'Your booking has been sent to the clinic. For a faster reply, send it on WhatsApp or give us a call.'
        : 'We could not send your booking automatically. Please tap "Send booking on WhatsApp" or call us to confirm.';
    });
  }

  $('first').addEventListener('change', function (e) { st.first = e.target.checked; render(); });

  $('confirm').addEventListener('click', function () {
    var owner = $('owner').value.trim(), phone = $('phone').value.trim(), pet = $('pet').value.trim();
    if (st.time < 0) { $('error').textContent = 'Please pick a time slot.'; return; }
    if (!owner || !phone) { $('error').textContent = 'Please add your name and phone number.'; return; }
    $('error').textContent = '';
    $('d-what').innerHTML = '';
    $('d-what').append(SERVICES[st.service][0] + ' with ' + DOCTORS[st.doctor], document.createElement('br'), DAYS[st.day] + ', ' + TIMES[st.time]);
    $('d-msg').textContent = 'We will call or message ' + phone + ' to confirm. See you and ' + (pet || 'your pet') + ' soon.';

    var base = SERVICES[st.service][1], disc = st.first ? Math.round(base * 0.2) : 0;
    var sent = P.sendBooking('Appointment: ' + SERVICES[st.service][0] + ', ' + DAYS[st.day] + ' ' + TIMES[st.time], {
      'Name': owner, 'Phone': phone, 'Pet': pet || '(not given)',
      'Service': SERVICES[st.service][0], 'Doctor': DOCTORS[st.doctor],
      'When': DAYS[st.day] + ', ' + TIMES[st.time],
      'First visit': st.first ? 'Yes (20% off)' : 'No',
      'Estimated total': P.fmt(base - disc)
    });
    showSendStatus(sent);
    $('booking-form').hidden = true;
    $('booking-summary').hidden = true;
    $('booking-done').hidden = false;
    ($('booking-done') || $('cart-done')).scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('reset').addEventListener('click', function () {
    st.time = -1;
    $('booking-form').hidden = false;
    $('booking-summary').hidden = false;
    $('booking-done').hidden = true;
    render();
  });

  render();
})();
