/* Write a review: rating + feedback, sent to the clinic on WhatsApp (email as backup) */
(function () {
  'use strict';
  var P = window.PetCure;
  var $ = function (id) { return document.getElementById(id); };
  var form = $('review-form');
  if (!form) return;

  var LABELS = ['', 'Poor', 'Below average', 'Good', 'Very good', 'Excellent'];
  var service = '';

  function rating() {
    var r = form.querySelector('input[name="rating"]:checked');
    return r ? Number(r.value) : 0;
  }

  form.querySelectorAll('input[name="rating"]').forEach(function (r) {
    r.addEventListener('change', function () {
      $('rating-label').textContent = LABELS[rating()];
      $('rv-error').textContent = '';
    });
  });

  form.querySelectorAll('[data-service]').forEach(function (b) {
    b.addEventListener('click', function () {
      service = service === b.dataset.service ? '' : b.dataset.service;
      form.querySelectorAll('[data-service]').forEach(function (x) {
        var on = x.dataset.service === service;
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  });

  $('rv-text').addEventListener('input', function (e) {
    $('rv-count').textContent = e.target.value.length + ' / 600';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = $('rv-error');
    var name = $('rv-name').value.trim();
    var pet = $('rv-pet').value.trim();
    var text = $('rv-text').value.trim();
    var stars = rating();
    if (!stars) { err.textContent = 'Please choose a star rating.'; return; }
    if (!name) { err.textContent = 'Please add your name.'; $('rv-name').focus(); return; }
    if (text.length < 10) { err.textContent = 'Please write a few words about your visit.'; $('rv-text').focus(); return; }
    err.textContent = '';

    var starText = '★★★★★'.slice(0, stars) + '☆☆☆☆☆'.slice(0, 5 - stars);
    var fields = {
      'Rating': starText + ' (' + stars + '/5, ' + LABELS[stars] + ')',
      'Name': name,
      'Pet': pet || '(not given)',
      'Service': service || '(not given)',
      'Review': text,
      'OK to show on website': $('rv-consent').checked ? 'Yes' : 'No'
    };
    var lines = Object.keys(fields).map(function (k) { return k + ': ' + fields[k]; });
    var msg = 'New review - PetCure Clinic\n\n' + lines.join('\n');
    var waUrl = 'https://wa.me/' + P.CLINIC.whatsapp + '?text=' + encodeURIComponent(msg);
    var mailUrl = 'mailto:' + P.CLINIC.email + '?subject=' + encodeURIComponent('Review from ' + name + ' (' + stars + '/5)') + '&body=' + encodeURIComponent(msg);

    // Open WhatsApp straight from the click so the browser allows it
    var win = window.open(waUrl, '_blank');
    if (win) { try { win.opener = null; } catch (x) { /* ignore */ } }

    $('rv-wa').href = waUrl;
    $('rv-mail').href = mailUrl;
    form.hidden = true;
    $('review-done').hidden = false;
    $('review-done').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  $('rv-reset').addEventListener('click', function () {
    form.reset();
    service = '';
    form.querySelectorAll('[data-service]').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
    $('rating-label').textContent = 'Tap a star';
    $('rv-count').textContent = '0 / 600';
    $('review-done').hidden = true;
    form.hidden = false;
  });
})();
