'use client';

import z from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import Input from '../input';
import validadeCpf from '@/services/validateCpf';
import ShowPassword, { ShowPasswordType } from '../showPassword';
import Loading from '@/components/loading';

const zodSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Nome completo obrigatório')
      .min(8, 'Nome muito curto'),
    yourDate: z
      .string()
      .trim()
      .refine(
        val => /^(\d{2})\/(\d{2})\/(\d{4})$/.test(val),
        'Data de nascimento inválida'
      )
      .optional(),
    cpf: z
      .string()
      .trim()
      .min(1, 'CPF obrigatório')
      .refine(val => validadeCpf(val), 'CPF inválido'),
    number: z
      .string()
      .trim()
      .min(1, 'Númeto de celular obrigatório')
      .refine(
        val => /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/.test(val),
        'Número de celular inválido'
      ),
    email: z
      .string()
      .trim()
      .min(1, 'Email obrigatório')
      .email('Email inválido'),
    password: z
      .string()
      .trim()
      .min(1, 'Senha obrigatória')
      .refine(
        val =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,})/.test(
            val
          ),
        'Senha fraca, confira os requisitos abaixo'
      ),
    repeatPassword: z.string().trim(),
    cep: z
      .string()
      .trim()
      .min(1, 'CEP obrigatório')
      .refine(val => /^\d{5}-\d{3}$/.test(val), 'Cep inválido'),
    address: z.string().trim().min(1, 'Endereço obrigatório'),
    nAddress: z.string().trim().min(1, 'Número residencial obrigatório'),
    complement: z.string().trim().optional(),
    neighborhood: z.string().trim().min(1, 'Bairro obrigatório'),
    city: z.string().trim().min(1, 'Cidade obrigatória'),
    state: z.string().trim().min(1, 'Estado obrigatório'),
  })
  .refine(val => val.password === val.repeatPassword, {
    message: 'Senhas não se coincidem',
    path: ['repeatPassword'],
  });

export type BodyTypePf = z.infer<typeof zodSchema>;

export default function FormPf() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    setError,
  } = useForm<BodyTypePf>({
    resolver: zodResolver(zodSchema),
  });
  const [passwordType, setPasswordType] =
    useState<ShowPasswordType>('password');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit: SubmitHandler<BodyTypePf> = async body => {
    console.log(body);
  };

  return (
    <>
      {isLoading && <Loading />}
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex gap-4 items-start py-7 px-8 rounded-2xl bg-gray-200 flex-col w-full"
      >
        <div className="flex items-start gap-8 w-full">
          <div className="flex gap-4 flex-col w-1/2">
            <h1 className="text-secudary font-medium text-2xl mb-2">
              Dados pessoais
            </h1>
            <div className="flex flex-col gap-3 w-full ">
              <Input
                id="name"
                title="Nome completo"
                register={register}
                registerName="fullName"
                placeholder="Seu nome completo"
                errors={errors}
              />
              <Input
                id="yourDate"
                title="Data nascimento"
                placeholder="Sua data de nascimento"
                register={register}
                optional
                registerName="yourDate"
                errors={errors}
              />
              <Input
                id="cpf"
                title="CPF"
                placeholder="Seu CPF"
                register={register}
                registerName="cpf"
                errors={errors}
              />
              <Input
                id="number"
                title="Número celular"
                placeholder="Seu número de celular"
                register={register}
                registerName="number"
                errors={errors}
              />
              <Input
                id="email"
                title="Email"
                placeholder="Seu email"
                register={register}
                registerName="email"
                errors={errors}
              />
              <Input
                id="password"
                title="Senha"
                placeholder="Crie sua senha de acesso"
                register={register}
                registerName="password"
                errors={errors}
                type={passwordType}
                watch={watch}
              >
                <ShowPassword
                  passwordType={passwordType}
                  setPasswordType={setPasswordType}
                  fill="fill-gray-500"
                  right="right-4"
                />
              </Input>
              <Input
                id="repeatPassword"
                title="Repetir senha"
                placeholder="Repita a senha para poder confimar"
                register={register}
                registerName="repeatPassword"
                errors={errors}
                type={passwordType}
                watch={watch}
              >
                <ShowPassword
                  passwordType={passwordType}
                  setPasswordType={setPasswordType}
                  fill="fill-gray-500"
                  right="right-4"
                />
              </Input>
            </div>
          </div>

          <div className="flex gap-4 flex-col w-1/2">
            <h1 className="text-secudary font-medium text-2xl mb-2">
              Dados de entrega
            </h1>
            <div className="flex flex-col gap-3 w-full ">
              <Input
                id="cep"
                title="Cep"
                register={register}
                registerName="cep"
                placeholder="Seu Cep"
                errors={errors}
                setError={setError}
                setValue={setValue}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
              <div className="flex items-start gap-4 w-full">
                <Input
                  id="address"
                  title="Endereço"
                  register={register}
                  registerName="address"
                  placeholder="Seu Endereço"
                  errors={errors}
                  w="w-[70%]"
                />
                <Input
                  id="nAddress"
                  title="N°"
                  register={register}
                  registerName="nAddress"
                  placeholder="Número ou S/N"
                  errors={errors}
                  w="w-[30%]"
                  setValue={setValue}
                  trigger={trigger}
                />
              </div>
              <Input
                id="complement"
                title="Complemento"
                register={register}
                registerName="complement"
                placeholder="Complemento Ex: Apartamento 1054 (Opcional)"
                errors={errors}
                optional
              />
              <Input
                id="neighborhood"
                title="Bairro"
                register={register}
                registerName="neighborhood"
                placeholder="Seu bairro"
                errors={errors}
              />
              <Input
                id="city"
                title="Cidade"
                register={register}
                registerName="city"
                placeholder="Sua cidade"
                errors={errors}
              />
              <Input
                id="state"
                title="Estado"
                register={register}
                registerName="state"
                placeholder="Seu estado"
                errors={errors}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="h-[50px] mt-2 rounded-3xl px-8 bg-ccba00 text-primary text-sm font-medium hover:scale-105 transition-transform duration-200"
        >
          Criar conta
        </button>
      </form>
    </>
  );
}
