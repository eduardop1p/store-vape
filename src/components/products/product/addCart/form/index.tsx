import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SelectType } from '..';
import { VapeType } from '@/app/api/models/vape';
import { OpenAlertType } from '@/components/alertMsg';
import useSubmitAddCart from '@/utils/useSubmitAddCart';
import SelectPreferencesProduct from './selectPreferencesProduct';
import BtnSubmit from './btnSubmit';

export const zodSchema = z.object({
  fileName: z.string(),
  name: z.string(),
  flavor: z.string().min(1, 'Selecione um sabor').optional(),
  color: z.string().min(1, 'Selecione uma cor').optional(),
  units: z
    .string()
    .min(1, 'Escolha quantas unidades vai pedir')
    .transform(val => +val)
    .refine(val => val <= 100, 'Muitas unidades, escolha menos'),
  price: z.number(),
  createdIn: z.number(),
});

export type BodyType = z.infer<typeof zodSchema>;

export default function Form1({
  product,
  showAddCart,
  setOpenAlert,
}: {
  product: VapeType;
  showAddCart: boolean;
  setOpenAlert: Dispatch<SetStateAction<OpenAlertType>>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<BodyType>({ resolver: zodResolver(zodSchema) });

  const { handleFormSubmit } = useSubmitAddCart(setOpenAlert);

  const [flavors, setFlavors] = useState<SelectType>({
    active: false,
    activeValue: '',
    values: product.flavors,
  });
  const [colors, setColors] = useState<SelectType>({
    active: false,
    activeValue: '',
    values: product.colors,
  });

  useEffect(() => {
    if (!showAddCart) {
      setFlavors(state => ({ ...state, activeValue: '' }));
      setColors(state => ({ ...state, activeValue: '' }));
      reset();
    }
  }, [showAddCart, reset]);

  useEffect(() => {
    register('name', {
      value: product.name,
    });
    register('fileName', {
      value: product.fileNames[0],
    });
    register('price', {
      value: product.price,
    });
    register('createdIn', {
      value: Date.now(),
    });
    if (flavors.values?.length) setValue('flavor', flavors.activeValue);
    if (colors.values?.length) setValue('color', colors.activeValue);
  }, [register, product, flavors, colors, setValue]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-3"
    >
      <div
        className={`grid ${flavors.values?.length && colors.values?.length ? 'grid-cols-2' : 'grid-cols-1'} gap-3 w-full`}
      >
        {flavors.values?.length ? (
          <SelectPreferencesProduct
            preference={flavors}
            setPreference={setFlavors}
            title="Sabores"
            registerName="flavor"
            errors={errors}
            register={register}
            trigger={trigger}
          />
        ) : null}
        {colors.values?.length ? (
          <SelectPreferencesProduct
            preference={colors}
            setPreference={setColors}
            title="Cores"
            registerName="color"
            errors={errors}
            register={register}
            trigger={trigger}
          />
        ) : null}
      </div>
      <BtnSubmit register={register} errors={errors} />
    </form>
  );
}
