'use client';

import { type UseFormRegister, type FieldErrors } from 'react-hook-form';

import ErrorMsg from '../errorMsg';
import { BodyType } from '..';

export default function BtnSubmit({
  register,
  errors,
}: {
  register: UseFormRegister<BodyType>;
  errors: FieldErrors<BodyType>;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between gap-3 w-full">
        <input
          defaultValue={1}
          placeholder="Unidades"
          className="text-secudary font-medium text-[13px] text-center bg-e5e5e5 px-4 h-11 rounded-3xl w-[40%]"
          {...register('units')}
          onInput={event => {
            const currentTarget = event.currentTarget;
            let value = currentTarget.value.replace(/[^\d]/g, '');
            if (+value == 0) return (currentTarget.value = '');
            currentTarget.value = value;
          }}
        />
        <button
          type="submit"
          className="hover:scale-105 text-center transition-transform duration-200 px-4 h-11 rounded-3xl w-[55%] text-[13px] text-primary bg-ccba00 font-medium"
        >
          Comprar
        </button>
      </div>
      {errors.units && <ErrorMsg msg={errors.units.message} />}
    </div>
  );
}
