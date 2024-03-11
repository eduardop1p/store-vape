export default function inputCep(value: string) {
  value = value.replace(/[^\d]/g, '');

  if (value.length > 5) value = value.replace(/^(\d{5})/, '$1-');

  if (value.length > 9) {
    return value.slice(0, 9);
  }

  return value;
}
