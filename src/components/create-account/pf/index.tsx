'use client';

import z from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../input';
import validadeCpf from '@/services/validateCpf';
import { useState } from 'react';
import ShowPassword, { ShowPasswordType } from '../showPassword';

const zodSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Campo obrigatório'),
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
      .min(1, 'Campo obrigatório')
      .refine(val => validadeCpf(val), 'CPF inválido'),
    number: z
      .string()
      .trim()
      .min(1, 'Campo obrigatório')
      .refine(
        val => /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/.test(val),
        'Número de celular inválido'
      ),
    email: z
      .string()
      .trim()
      .min(1, 'Campo obrigatório')
      .email('Email inválido'),
    password: z
      .string()
      .trim()
      .min(1, 'Campo obrigatório')
      .refine(
        val =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,})/.test(
            val
          ),
        'Senha fraca, confira os requisitos abaixo'
      ),
    repeatPassword: z.string().trim(),
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
  } = useForm<BodyTypePf>({
    resolver: zodResolver(zodSchema),
  });
  const [passwordType, setPasswordType] =
    useState<ShowPasswordType>('password');

  const handleFormSubmit: SubmitHandler<BodyTypePf> = async body => {
    console.log(body);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex gap-4 items-start p-7 rounded-2xl bg-gray-200 flex-col"
    >
      <h1 className="text-secudary font-medium text-2xl mb-2">
        Dados pessoais
      </h1>
      <div className="flex gap-4 items-start w-1/2">
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

      <button
        type="submit"
        className="h-[50px] mt-2 rounded-3xl px-8 bg-ccba00 text-primary text-sm font-medium hover:scale-105 transition-transform duration-200"
      >
        Criar conta
      </button>
    </form>
  );
}
