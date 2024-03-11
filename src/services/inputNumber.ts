import { FormEvent } from 'react';

export default function inputNumber(
  event: FormEvent<HTMLInputElement>,
  isRemoveKey: boolean
) {
  const input = event.currentTarget;
  let value = input.value;

  if (isRemoveKey) {
    input.value = value;
    return;
  }

  value = value.replace(/[^\d]/g, '');

  if (value.length) value = value.replace(/^(\d{1})/, '($1');
  if (value.length > 2)
    value = value.replace(/\D/g, '').replace(/^(\d{1})(\d{1})/, '($1$2) ');
  if (value.length > 10)
    value = value
      .replace(/\D/g, '')
      .replace(/^(\d{1})(\d{1})(\d{5})/, '($1$2) $3-');

  if (value.length > 15) {
    input.value = value.slice(0, 15);
    return;
  }

  input.value = value;
}
