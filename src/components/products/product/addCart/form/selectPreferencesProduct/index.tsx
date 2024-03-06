'use client';

import { Dispatch, SetStateAction } from 'react';
import { FieldErrors, UseFormRegister, UseFormTrigger } from 'react-hook-form';
import { IoIosArrowDown } from 'react-icons/io';
import { SelectType } from '../..';
import ErrorMsg from '../errorMsg';
import { BodyType } from '..';

export default function SelectPreferencesProduct({
  preference,
  setPreference,
  title,
  registerName,
  errors,
  register,
  trigger,
}: {
  preference: SelectType;
  title: 'Sabores' | 'Cores';
  registerName: 'flavor' | 'color';
  setPreference: Dispatch<SetStateAction<SelectType>>;
  errors: FieldErrors<BodyType>;
  register: UseFormRegister<BodyType>;
  trigger: UseFormTrigger<BodyType>;
}) {
  if (typeof preference.values == 'undefined' || !preference.values.length)
    return;

  return (
    <div className={`flex gap-1 flex-col items-center`}>
      <h3 className="text-sm font-medium text-secudary text-center">{title}</h3>
      <div
        className="relative w-full"
        tabIndex={0}
        onBlur={event => {
          // nunca colocar evento de foco no mesmo elemento que foi setado evento de click
          if (!event.currentTarget.contains(event.relatedTarget))
            setPreference(state => ({ ...state, active: false }));
        }}
      >
        <div
          className=" bg-gray-600 hover:bg-gray-500 cursor-pointer duration-200 transition-colors flex items-center justify-between gap-2 px-4 h-11 rounded-3xl"
          onClick={() =>
            setPreference(state => ({ ...state, active: !state.active }))
          }
        >
          <input
            value={preference.activeValue}
            {...register(registerName, {
              validate: value => value === '1',
            })}
            placeholder="Selecionar"
            className="truncate text-primary bg-transparent text-[13px] font-normal cursor-pointer placeholder:text-primary"
            readOnly
          />

          <IoIosArrowDown
            size={14}
            fill="#fff"
            stroke="#fff"
            strokeWidth={5}
            className={`${preference.active ? 'rotate-180' : 'rotate-0'} flex-none duration-200 transition-transform`}
          />
        </div>
        {errors[registerName] && (
          <ErrorMsg msg={errors[registerName]?.message} />
        )}

        <div
          // bug do blur na porra do display resolvido aqui com altura e nunca com display hidden e visibilite
          className={`duration-200 transition-all flex absolute top-12 bg-gray-600 rounded-lg left-0 overflow-hidden w-full`}
          style={{
            height: preference.active
              ? preference.values.length > 4
                ? '110px'
                : `${preference.values.length * 28.3}px`
              : '0px',
            opacity: preference.active ? 1 : 0,
          }}
        >
          <div
            className={`w-full h-full  bg-inherit flex-col overflow-x-hidden overflow-y-auto`}
            onClick={event => event.stopPropagation()}
          >
            {preference.values.map((val, i) => (
              <button
                key={val}
                title={val}
                type="button"
                className={`truncate w-full whitespace-nowrap text-[13px] text-left font-normal px-3 py-1 text-primary ${preference.values && preference.values.length - 1 !== i && 'border-b border-solid border-b-gray-500'} hover:bg-gray-500 transition-colors duration-200 cursor-pointer`}
                onClick={() => {
                  setPreference(state => ({
                    ...state,
                    active: false,
                    activeValue: val,
                  }));
                  setTimeout(() => {
                    trigger(registerName);
                  }, 100);
                }}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
