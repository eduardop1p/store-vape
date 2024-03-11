export default function validadeCnpj(cnpj: string) {
  // Remove todos os caracteres que não são números
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Verifica se o CNPJ tem 14 dígitos
  if (cnpj.length !== 14) {
    return false;
  }

  // Verifica se todos os dígitos são iguais e não formam um CNPJ válido
  if (/^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  // Calcula os dígitos verificadores
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += +numbers.charAt(size - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let resultado = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (resultado != +digits.charAt(0)) {
    return false;
  }

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += +numbers.charAt(size - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  resultado = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (resultado != +digits.charAt(1)) {
    return false;
  }

  return true;
}
