'use client';

import z from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../input';

const zodSchema = z.object({
  fullName: z.string().trim().min(1, 'Campo obrigatório'),
  yourDate: z
    .string()
    .trim()
    .refine(
      val => /^(\d{2})\/(\d{2})\/(\d{4})$/.test(val),
      'Data de nascimento inválida'
    )
    .optional(),
  cpf: z.string().trim().min(1, 'Campo obrigatório'),
  number1: z.string().trim(),
  number2: z.string().trim().min(1, 'Campo obrigatório'),
  email: z.string().trim().min(1, 'Campo obrigatório').email('Email inválido'),
  password: z.string().trim().min(1, 'Campo obrigatório'),
});

export type BodyTypePf = z.infer<typeof zodSchema>;

export default function FormPf() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BodyTypePf>({
    resolver: zodResolver(zodSchema),
  });

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
            errors={errors}
          />
          <Input
            id="yourDate"
            title="Data nascimento"
            register={register}
            optional
            registerName="yourDate"
            errors={errors}
          />
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
