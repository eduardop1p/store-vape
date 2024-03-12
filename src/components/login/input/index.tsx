'use client';

import { type UseFormRegister, type FieldErrors } from 'react-hook-form';

import { BodyLoginType } from '..';

interface Props {
  title: string;
  id: string;
  register: UseFormRegister<BodyLoginType>;
  errors: FieldErrors<BodyLoginType>;
  registerName: keyof BodyLoginType;
  placeholder: string;
  type?: string;
}

export default function Input({
  title,
  id,
  registerName,
  register,
  errors,
  placeholder,
  type = 'text',
}: Props) {
  return (
    <div className={`flex gap-[5px] flex-col items-start w-full`}>
      <div className="flex flex-col gap-1 items-start w-full">
        <label className="ml-1 text-sm font-medium text-secudary" htmlFor={id}>
          {title} <small className="text-sm font-medium text-red-600">*</small>
        </label>
        {(registerName === 'email' || registerName === 'password') && ( // eslint-disable-line
          <input
            className={`w-full h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
          />
        )}
      </div>
      {errors[registerName] && (
        <div className="ml-1 text-xs font-medium text-red-600 leading-4">
          {errors[registerName]?.message?.toString()}
        </div>
      )}
    </div>
  );
}
