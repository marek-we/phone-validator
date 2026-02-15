import './stimulus_bootstrap.js';
import './styles/app.css';

const form = document.querySelector('#phone-form');
const phoneInput = form.querySelector('#phone-number');
const statusEl = form.querySelector('#phone-form--status');
let sendingForm = false;

const clearFormErrors = form => {
  statusEl.textContent = '';
  statusEl.style.display = 'none';
  statusEl.classList.remove('error');

  form.querySelectorAll('.field-error').forEach(errorText => {
    errorText.remove();
  });

  form.querySelectorAll('.has-error').forEach(field => {
    field.classList.remove('has-error');
    field.removeAttribute('aria-invalid');
  });
}

const showFieldError = (form, field, message) => {
  if (!field) return;

  field.classList.add('has-error');
  field.setAttribute('aria-invalid', 'true');

  const errorEl = document.createElement('div');
  errorEl.className = 'field-error';
  errorEl.textContent = message;

  field.closest('.form-row').insertBefore(errorEl, field.nextSibling);
}

const validateForm = form => {
  if (phone.getNumber().trim() === '') {
    showFieldError(form, phoneInput, 'Phone number is required');

    return false;
  }

  return true;
}

const phone = window.intlTelInput(phoneInput, {
  initialCountry: 'ee',
  separateDialCode: true,
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (sendingForm) {
    return;
  }

  clearFormErrors(form);

  if (!validateForm(form)) {
    return;
  }

  sendingForm = true;

  let formData = new FormData(form);
  formData.set('phone', phone.getNumber());

  const response = await fetch('/validate-phone', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json().catch( () => {
    statusEl.textContent = 'Something went wrong. Please try again.';
    statusEl.style.display = 'block';
    statusEl.classList.add('error');

    return null;
  });

  sendingForm = false;

  if (data.status === 'error') {
    showFieldError(form, phoneInput, data.message);

    return;
  }

  form.reset();

  statusEl.textContent = data.message;
  statusEl.style.display = 'block';
});
