import { FormEvent } from 'react';

export default function inputCpf(event: FormEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  let value = input.value;
  value = value.replace(/[^\d]/g, '');

  if (value.length > 3) {
    value = value.replace(/^(\d{3})/, '$1.');
  }
  if (value.length > 7) {
    value = value.replace(/\D/g, '').replace(/^(\d{3})(\d{3})/, '$1.$2.');
  }
  if (value.length > 11) {
    value = value
      .replace(/\D/g, '')
      .replace(/^(\d{3})(\d{3})(\d{3})/, '$1.$2.$3-');
  }

  if (value.length > 14) {
    input.value = value.slice(0, 14);
    return;
  }

  input.value = value;
}
