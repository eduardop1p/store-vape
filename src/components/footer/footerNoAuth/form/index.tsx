'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

const zodSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  email: z.string().email('Email inválido'),
});

type BodyType = z.infer<typeof zodSchema>;

export default function FormFooterNoAuth() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<BodyType>({
    resolver: zodResolver(zodSchema),
  });

  const handleFormSubmit: SubmitHandler<BodyType> = async body => {
    console.log(body);
    // back-end
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex gap-4">
      <div className="flex flex-col gap-1">
        <input
          type="text"
          id="name"
          placeholder="Digite seu nome"
          {...register('name')}
          className="hover:bg-00000025 focus:bg-primary focus:text-secudary transition-colors duration-150 text-sm font-normal text-primary bg-ffffff1F h-[50px] rounded-3xl px-5 placeholder:text-gray-300"
        />
        {errors.name && <ErrorMsg msg={errors.name.message} />}
      </div>
      <div className="flex flex-col gap-1">
        <input
          type="text"
          id="email"
          placeholder="Digite seu email"
          {...register('email')}
          className="hover:bg-00000025 focus:bg-primary focus:text-secudary transition-colors duration-150 text-sm font-normal text-primary bg-ffffff1F h-[50px] rounded-3xl px-5 placeholder:text-gray-300"
        />
        {errors.email && <ErrorMsg msg={errors.email.message} />}
      </div>
      <button
        type="submit"
        className="text-primary bg-secudary font-normal text-[15px] h-[50px] px-5 rounded-3xl hover:scale-105 hover:bg-gray-800 transition-all duration-300"
      >
        INSCREVA-SE
      </button>
    </form>
  );
}

const ErrorMsg = ({ msg }: { msg: string | undefined }) => {
  return <span className="ml-1 text-xs font-normal text-red-600">{msg}</span>;
};
