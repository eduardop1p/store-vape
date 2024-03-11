import { FormEvent } from 'react';

export default function inputYourDate(event: FormEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  let value = input.value;

  value = value.replace(/[^\d]/g, '');
  if (value.length > 2) {
    value = value.replace(/^(\d{2})/, '$1/');
  }
  if (value.length > 5) {
    value = value.replace(/\D/g, '').replace(/^(\d{2})(\d{2})/, '$1/$2/');
  }
  if (value.length > 10) {
    input.value = value.slice(0, 10);
    return;
  }

  input.value = value;
}
