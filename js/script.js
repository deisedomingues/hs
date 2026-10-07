'use strict';

const VIP_GROUP_URL = '';
const WHATSAPP_NUMBER = '5511963300147';
const makeWhatsAppUrl = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
const defaultMessage = 'Olá! Gostaria de saber mais sobre os serviços da HS Estética & Massoterapia.';

for (const link of document.querySelectorAll('[data-whatsapp], [data-service]')) {
  link.href = makeWhatsAppUrl(link.dataset.service ? `Olá! Gostaria de saber mais sobre ${link.dataset.service}.` : defaultMessage);
}

document.getElementById('year').textContent = new Date().getFullYear();

const vipLink = document.querySelector('[data-vip]');
const vipNote = document.getElementById('vip-note');
let vipUrl;
try {
  const url = new URL(VIP_GROUP_URL.trim());
  if (url.protocol === 'https:' && url.hostname === 'chat.whatsapp.com' && url.pathname.length > 1) vipUrl = url.href;
} catch {}
vipLink.href = vipUrl || makeWhatsAppUrl('Olá! Gostaria de receber o convite para o Grupo VIP HS.');
vipLink.firstChild.textContent = vipUrl ? 'Entrar no grupo ' : 'Pedir convite ';
vipNote.textContent = vipUrl ? 'Abra o convite pelo WhatsApp.' : 'Peça seu convite pelo WhatsApp.';

function validateName(field) {
  field.setCustomValidity(field.value.trim() ? '' : 'Por favor, informe seu nome.');
}

function openWhatsApp(message, retryId, feedbackId) {
  const url = makeWhatsAppUrl(message);
  document.getElementById(retryId).href = url;
  window.open(url, '_blank', 'noopener,noreferrer');
  const feedback = document.getElementById(feedbackId);
  feedback.hidden = false;
  feedback.scrollIntoView({ block: 'nearest' });
}

const contactForm = document.getElementById('contact-form');
const nameField = document.getElementById('name');
const messageField = document.getElementById('message');

contactForm.addEventListener('input', () => {
  nameField.setCustomValidity('');
  messageField.setCustomValidity('');
  document.getElementById('form-feedback').hidden = true;
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  validateName(nameField);
  messageField.setCustomValidity(messageField.value.trim() ? '' : 'Por favor, escreva sua mensagem.');
  if (!contactForm.reportValidity()) return;
  openWhatsApp(`Olá, meu nome é ${nameField.value.trim()}.\n\n${messageField.value.trim()}`, 'whatsapp-retry', 'form-feedback');
});

const bookingDialog = document.getElementById('booking-dialog');
const bookingForm = document.getElementById('booking-form');
const bookingName = document.getElementById('booking-name');
const procedureError = document.getElementById('procedure-error');

document.getElementById('open-booking').addEventListener('click', () => {
  bookingDialog.showModal();
  document.body.classList.add('dialog-open');
});
document.getElementById('close-booking').addEventListener('click', () => bookingDialog.close());
bookingDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

bookingForm.addEventListener('input', () => {
  bookingName.setCustomValidity('');
  document.getElementById('booking-feedback').hidden = true;
  if (bookingForm.querySelector('input[name="procedure"]:checked')) procedureError.hidden = true;
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  validateName(bookingName);
  if (!bookingForm.reportValidity()) return;
  const procedures = [...bookingForm.querySelectorAll('input[name="procedure"]:checked')].map((input) => input.value);
  if (!procedures.length) {
    procedureError.hidden = false;
    bookingForm.querySelector('input[name="procedure"]').focus();
    return;
  }
  procedureError.hidden = true;
  const unit = bookingForm.querySelector('input[name="booking-unit"]:checked');
  if (!unit) return;
  const message = `Olá, meu nome é ${bookingName.value.trim()}.\n\nGostaria de agendar os seguintes cuidados:\n${procedures.map((procedure) => `• ${procedure}`).join('\n')}\n\nLocal de preferência:\n${unit.value}\n\nPodemos combinar um horário?`;
  openWhatsApp(message, 'booking-retry', 'booking-feedback');
});