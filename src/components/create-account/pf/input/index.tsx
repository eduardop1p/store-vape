'use client';

import {
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
  type UseFormSetValue,
  type UseFormTrigger,
  type UseFormSetError,
} from 'react-hook-form';
import {
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

import { BodyTypePf } from '..';
import ChangePassword from '../../changePassword';
import ErrorMsg from '../../errorMsg';
import inputYourDate from '@/services/inputYourDate';
import inputCpf from '@/services/inputCpf';
import useIsRemoveKey from '@/utils/useIsRemoveKey';
import inputNumber from '@/services/inputNumber';
import inputCep from '@/services/inputCep';
import getCep from '@/services/getCep';
import Label from '../../label';

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
  const [checkedSN, setCheckedSN] = useState(false);

  const { isRemoveKey } = useIsRemoveKey();

  const handleInputN = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    let value = input.value;

    value = value.replace(/[^\d]/g, '');
    setCheckedSN(false);

    input.value = value;
  };

  const handleInputCep = async (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    const value = currentTarget.value;
    if (!setValue || !trigger || !setError || isLoading || !setIsLoading)
      return;

    currentTarget.value = inputCep(value);
    if (value.length > 8) {
      setIsLoading(true);
      const data = await getCep(value.slice(0, 9));
      if (data.err) {
        setError('cep', {
          message: data.err,
        });
      }
      setValue('city', data.city);
      setValue('state', data.uf);

      setIsLoading(false);
      if (!data.err) trigger('cep');
      trigger('city');
      trigger('state');
    }
  };

  return (
    <div className={`flex gap-[5px] flex-col items-start ${w}`}>
      <div className="flex flex-col gap-1 items-start w-full">
        <Label
          checkedSN={checkedSN}
          id={id}
          registerName={registerName}
          setCheckedSN={setCheckedSN}
          setValue={setValue}
          title={title}
          trigger={trigger}
          optional={optional}
        />
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
            onInput={inputYourDate}
          />
        )}
        {registerName === 'cpf' && (
          <input
            className={`w-1/2 h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
            onInput={inputCpf}
          />
        )}
        {registerName === 'number' && (
          <input
            className={`w-1/2 h-[50px] rounded-3xl px-4 text-[15px] font-normal text-secudary bg-primary focus:shadow-effect-1 transition-all duration-200`}
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(registerName)}
            onInput={event => inputNumber(event, isRemoveKey)}
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

      <ErrorMsg errors={errors} registerName={registerName} />
      <ChangePassword watch={watch} registerName={registerName} />
    </div>
  );
}
