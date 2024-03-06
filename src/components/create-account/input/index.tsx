'use client';

import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { BodyTypePf } from '../pf';
import { FormEvent } from 'react';

interface Props {
  title: string;
  id: string;
  register: UseFormRegister<BodyTypePf>;
  errors: FieldErrors<BodyTypePf>;
  registerName: keyof BodyTypePf;
  optional?: boolean;
  placeholder: string;
}

export default function Input({
  title,
  id,
  registerName,
  register,
  errors,
  optional,
  placeholder,
}: Props) {
  const handleInputYourDate = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    let value = input.value;

    value = value.replace(/[^\d]/g, '');
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (value.length > 5) {
      value = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d{2})(\d)/, '$1/$2/$3');
    }
    if (value.length > 10) {
      input.value = value.slice(0, 10);
      return;
    }

    input.value = value;
  };

  const handleInputCpf = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    let value = input.value;
    value = value.replace(/[^\d]/g, '');

    if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    }
    if (value.length > 7) {
      value = value
        .replace(/\D/g, '')
        .replace(/^(\d{3})(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 11) {
      value = value
        .replace(/\D/g, '')
        .replace(/^(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4');
    }

    if (value.length > 14) {
      input.value = value.slice(0, 14);
      return;
    }

    input.value = value;
  };

  return (
    <div className="flex- gap-[2px] flex-col items-start w-full">
      <div className="flex flex-col gap-1 items-start w-full">
        <label className="ml-1 text-sm font-medium text-secudary" htmlFor={id}>
          {title}{' '}
          {!optional && (
            <small className="text-sm font-medium text-red-600">*</small>
          )}
        </label>
        {registerName !== 'yourDate' && registerName !== 'cpf' && (
          <input
            className="w-full h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-gray-300 focus:shadow-sm focus:bg-primary transition-colors duration-200"
            id={id}
            type="text"
            placeholder={placeholder}
            {...register(registerName)}
          />
        )}
        {registerName === 'yourDate' && (
          <input
            className="w-1/2 h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-gray-300 focus:shadow-sm focus:bg-primary transition-colors duration-200"
            id={id}
            type="text"
            placeholder={placeholder}
            {...register(registerName, {
              setValueAs(value) {
                if (!value) return undefined;
                return value;
              },
            })}
            onInput={handleInputYourDate}
          />
        )}
        {registerName === 'cpf' && (
          <input
            className="w-1/2 h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-gray-300 focus:shadow-sm focus:bg-primary transition-colors duration-200"
            id={id}
            type="text"
            placeholder={placeholder}
            {...register(registerName)}
            onInput={handleInputCpf}
          />
        )}
      </div>
      {errors[registerName] && (
        <span className="ml-1 text-xs font-medium text-red-600">
          {errors[registerName]?.message}
        </span>
      )}
    </div>
  );
}
