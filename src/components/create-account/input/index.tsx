'use client';

import {
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
  type UseFormSetValue,
  type UseFormTrigger,
  type UseFormSetError,
} from 'react-hook-form';
import { BodyTypePf } from '../pf';
import {
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  w?: string;
  setValue?: UseFormSetValue<BodyTypePf>;
  trigger?: UseFormTrigger<BodyTypePf>;
  setError?: UseFormSetError<BodyTypePf>;
  isLoading?: boolean;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
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
  w = 'w-full',
  setValue,
  trigger,
  setError,
  isLoading,
  setIsLoading,
}: Props) {
  let isRemoveKey = useRef(false);
  const [checkedSN, setCheckedSN] = useState(false);

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

  const handleInputCep = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    let value = input.value;

    value = value.replace(/[^\d]/g, '');

    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, '$1-$2');

    if (value.length > 8) handleGetCepApi(value);
    if (value.length > 9) {
      input.value = value.slice(0, 9);
      return;
    }

    input.value = value;
  };

  const handleInputN = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    let value = input.value;

    value = value.replace(/[^\d]/g, '');
    setCheckedSN(false);

    input.value = value;
  };

  const handleGetCepApi = async (cep: string) => {
    if (!setValue || !trigger || !setError || isLoading || !setIsLoading)
      return;

    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-cep?cep=${cep}`,
        {
          method: 'GET',
          cache: 'no-cache',
        }
      );
      if (!res.ok) throw new Error('error');
      const data = await res.json();
      setValue('city', data.city);
      setValue('state', data.uf);

      trigger('cep');
      trigger('city');
      trigger('state');
    } catch (err) {
      console.log(err);
      setError('cep', {
        message: 'CEP inválido',
      });
      setValue('city', '');
      setValue('state', '');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex gap-[5px] flex-col items-start ${w}`}>
      <div className="flex flex-col gap-1 items-start w-full">
        {registerName === 'nAddress' ? (
          <div className="flex items-center gap-3">
            <label
              className="ml-1 text-sm font-medium text-secudary"
              htmlFor={id}
            >
              {title}{' '}
              {!optional && (
                <small className="text-sm font-medium text-red-600">*</small>
              )}
            </label>
            <div className="flex items-center gap-[6px]">
              <input
                type="radio"
                checked={checkedSN}
                className="cursor-pointer"
                onChange={() => {
                  return '';
                }}
                onClick={() => {
                  if (!setValue || !trigger) return;
                  if (!checkedSN) {
                    setValue('nAddress', 'S/N');
                    setCheckedSN(true);
                  } else {
                    setValue('nAddress', '');
                    setCheckedSN(false);
                  }
                  trigger('nAddress');
                }}
              />
              <span className="text-secudary text-sm">S/N</span>
            </div>
          </div>
        ) : (
          <label
            className="ml-1 text-sm font-medium text-secudary"
            htmlFor={id}
          >
            {title}{' '}
            {!optional && (
              <small className="text-sm font-medium text-red-600">*</small>
            )}
          </label>
        )}
        {(registerName === 'fullName' || registerName === 'email' || registerName === 'complement') && ( // eslint-disable-line
          <input
            className={`w-full h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
          />
        )}
        {registerName === 'yourDate' && (
          <input
            className={`w-1/2 h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
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
            className={`w-1/2 h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
            onInput={handleInputCpf}
          />
        )}
        {registerName === 'number' && (
          <input
            className={`w-1/2 h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
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
              className={`w-full h-[50px] rounded-3xl pl-4 pr-9 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
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
              className={`w-full h-[50px] rounded-3xl pl-4 pr-9 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
              id={id}
              type={type}
              placeholder={placeholder}
              {...register(registerName)}
            />
            {children}
          </div>
        )}
        {registerName === 'cep' && (
          <input
            className={`w-1/2 h-[50px] rounded-3xl pl-4 pr-9 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
            onInput={handleInputCep}
          />
        )}
        {registerName == 'address' && (
          <input
            className={`w-full h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
          />
        )}
        {registerName == 'nAddress' && (
          <input
            className={`w-full h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
            onInput={handleInputN}
          />
        )}
        {registerName === 'neighborhood' && (
          <input
            className={`w-1/2 h-[50px] rounded-3xl pl-4 pr-9 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
          />
        )}
        {registerName === 'city' && (
          <input
            className={`w-1/2 h-[50px] rounded-3xl pl-4 pr-9 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
          />
        )}
        {registerName === 'state' && (
          <input
            className={`w-1/2 h-[50px] rounded-3xl pl-4 pr-9 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
          />
        )}
        {registerName === 'country' && (
          <input
            className={`w-1/2 h-[50px] cursor-default rounded-3xl pl-4 pr-9 text-[15px] font-normal text-gray-500 bg-primary transition-all duration-200`}
            id={id}
            defaultValue="Brasil"
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
            readOnly
          />
        )}
      </div>

      {errors[registerName] && (
        <div className="ml-1 text-xs font-medium text-red-600 leading-4">
          {errors[registerName]?.message}
        </div>
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
