'use client';

import {
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
} from 'react-hook-form';
import { BodyTypePf } from '../pf';
import { FormEvent, ReactNode, useEffect, useRef } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

interface Props {
  title: string;
  id: string;
  register: UseFormRegister<BodyTypePf>;
  errors: FieldErrors<BodyTypePf>;
  registerName: keyof BodyTypePf;
  optional?: boolean;
  placeholder: string;
  type?: string;
  watch?: UseFormWatch<BodyTypePf>;
  children?: ReactNode;
}

export default function Input({
  title,
  id,
  registerName,
  register,
  errors,
  optional,
  placeholder,
  type = 'text',
  watch,
  children,
}: Props) {
  let isRemoveKey = useRef(false);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        isRemoveKey.current = true;
      } else {
        isRemoveKey.current = false;
      }
    };
    window.addEventListener('keydown', event => onKeydown(event));

    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

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

  const handleInputNumber = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    let value = input.value;

    if (isRemoveKey.current) {
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

    // value = value.replace(/^(\d{2})(\d)/, '($1) $2');
    // value = value.replace(/(\(\d{2}\) \d{5})(\d)/, '$1-$2');

    if (value.length > 15) {
      input.value = value.slice(0, 15);
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
        {(registerName === 'fullName' || registerName === 'email') && (
          <input
            className={`w-full h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 focus:bg-primary transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
          />
        )}
        {registerName === 'yourDate' && (
          <input
            className={`w-1/2 h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 focus:bg-primary transition-all duration-200`}
            id={id}
            type={type}
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
            className={`w-1/2 h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 focus:bg-primary transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
            onInput={handleInputCpf}
          />
        )}
        {registerName === 'number' && (
          <input
            className={`w-1/2 h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 focus:bg-primary transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
            onInput={handleInputNumber}
          />
        )}
        {registerName === 'password' && (
          <div className="relative w-[60%]">
            <input
              className={`w-full h-[50px] rounded-3xl pl-4 pr-9 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 focus:bg-primary transition-all duration-200`}
              id={id}
              type={type}
              placeholder={placeholder}
              {...register(registerName)}
            />
            {children}
          </div>
        )}
        {registerName === 'repeatPassword' && (
          <div className="relative w-[60%]">
            <input
              className={`w-full h-[50px] rounded-3xl pl-4 pr-9 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 focus:bg-primary transition-all duration-200`}
              id={id}
              type={type}
              placeholder={placeholder}
              {...register(registerName)}
            />
            {children}
          </div>
        )}
      </div>
      {errors[registerName] && (
        <span className="ml-1 text-xs font-medium text-red-600">
          {errors[registerName]?.message}
        </span>
      )}
      {registerName === 'password' && watch && (
        <div className="mt-1 flex flex-col gap-[1px] w-1/2 ml-1">
          <PasswordValidationRequired
            text="A senha contém no mínimo 5 caracteres"
            validate={regexTestMinLenth(watch('password'))}
          />
          <PasswordValidationRequired
            text="A senha contém no mínimo uma letra minúscula"
            validate={regexTestContainLowerCase(watch('password'))}
          />
          <PasswordValidationRequired
            text="A senha contém no mínimo uma letra maiúscula"
            validate={regexTestContainUpperCase(watch('password'))}
          />
          <PasswordValidationRequired
            text="A senha contém no mínimo um dígito numérico"
            validate={regexTestContainNumber(watch('password'))}
          />
          <PasswordValidationRequired
            text="A senha contém no mínimo um caractere especial da lista: !@#$%^&*"
            validate={regexTestContainCaractere(watch('password'))}
          />
        </div>
      )}
    </div>
  );
}

const PasswordValidationRequired = ({
  text,
  validate,
}: {
  text: string;
  validate: boolean;
}) => {
  return (
    <div
      className={` text-[10px] ${validate ? 'text-green-600' : 'text-red-600'} font-normal mb-[2px]`}
    >
      {text}
      {validate ? (
        <FaCheck
          className="inline-block fill-green-600 flex-none ml-1"
          size={14}
        />
      ) : (
        <IoClose
          className="inline-block fill-red-600 flex-none ml-1"
          size={14}
        />
      )}
    </div>
  );
};

const regexTestMinLenth = (val: string) =>
  val ? /^(?=.{5,})/.test(val) : false;

const regexTestContainLowerCase = (val: string) =>
  val ? /^(?=.*[a-z])/.test(val) : false;

const regexTestContainUpperCase = (val: string) =>
  val ? /^(?=.*[A-Z])/.test(val) : false;

const regexTestContainNumber = (val: string) =>
  val ? /^(?=.*[0-9])/.test(val) : false;

const regexTestContainCaractere = (val: string) =>
  val ? /^(?=.*[!@#$%^&*])/.test(val) : false;
