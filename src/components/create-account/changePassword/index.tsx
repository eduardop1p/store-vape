'use client';

import { FaCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { type UseFormWatch } from 'react-hook-form';

export default function ChangePassword({
  watch,
  registerName,
}: {
  watch?: UseFormWatch<any>;
  registerName: string;
}) {
  return (
    registerName === 'password' &&
    watch && (
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
    )
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
