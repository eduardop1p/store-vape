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
}

export default function Input({
  title,
  id,
  registerName,
  register,
  errors,
  optional,
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
    if (value.length > 9) {
      input.value = value.slice(0, 10);
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
        {registerName !== 'yourDate' && (
          <input
            className="w-full h-[50px] rounded-3xl px-4 text-[15px] font-medium text-secudary bg-gray-300 focus:shadow-sm focus:bg-primary transition-colors duration-200"
            id={id}
            type="text"
            {...register(registerName)}
          />
        )}
        {registerName === 'yourDate' && (
          <input
            className="w-full h-[50px] rounded-3xl px-4 text-[15px] font-medium text-secudary bg-gray-300 focus:shadow-sm focus:bg-primary transition-colors duration-200"
            id={id}
            type="text"
            {...register(registerName, {
              setValueAs(value) {
                if (!value) return undefined;
                return value;
              },
            })}
            onInput={handleInputYourDate}
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
