'use client';

import z from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from './input';

const zodSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z.string().trim().min(1, 'Senha obrigatória'),
});

export type BodyLoginType = z.infer<typeof zodSchema>;

export default function FormLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BodyLoginType>({
    resolver: zodResolver(zodSchema),
  });

  const handleFormSubmit: SubmitHandler<BodyLoginType> = async body => {
    console.log(body);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex gap-4 items-start py-7 px-8 rounded-2xl bg-gray-200 flex-col w-1/2"
    >
      <div className="flex items-start gap-8 w-full">
        <div className="flex gap-4 flex-col w-full">
          <h1 className="text-secudary font-medium text-2xl mb-2">Login</h1>
          <div className="flex flex-col gap-3 w-full ">
            <Input
              errors={errors}
              id="email"
              placeholder="Email de login"
              register={register}
              registerName="email"
              title="Email"
              type="email"
            />
            <Input
              errors={errors}
              id="password"
              placeholder="Sua senha"
              register={register}
              registerName="password"
              title="Senha"
              type="password"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="h-[50px] mt-2 rounded-3xl px-12 bg-ccba00 text-primary text-sm font-medium hover:scale-105 transition-transform duration-200"
      >
        Login
      </button>
    </form>
  );
}
