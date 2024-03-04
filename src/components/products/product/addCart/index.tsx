/* eslint-disable react/display-name */
'use client';

import { VapeType } from '@/app/api/models/vape';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosArrowDown, IoIosClose } from 'react-icons/io';
import z from 'zod';
import {
  useForm,
  SubmitHandler,
  type FieldErrors,
  type UseFormRegister,
  type UseFormTrigger,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isEqual } from 'lodash';

import { useOpenCartContext } from '@/utils/openCartContext/useContext';
import { OpenAlertType } from '@/components/alertMsg';
import { CartType } from '@/utils/cartContext/context';
import { useCartContext } from '@/utils/cartContext/useContext';

interface SelectType {
  active: boolean;
  activeValue: string;
  values?: string[];
}

const zodSchema = z.object({
  fileName: z.string(),
  name: z.string(),
  flavor: z.string().min(1, 'Selecione um sabor'),
  color: z.string().min(1, 'Selecione uma cor'),
  units: z
    .string()
    .min(1, 'Escolha quantas unidades vai pedir')
    .transform(val => +val),
  price: z.number(),
});

type BodyType = z.infer<typeof zodSchema>;

export default function AddCart({
  product,
  showAddCart,
  setShowAddCart,
  setOpenAlert,
}: {
  product: VapeType & { productPrice: number };
  showAddCart: boolean;
  setShowAddCart: Dispatch<SetStateAction<boolean>>;
  setOpenAlert: Dispatch<SetStateAction<OpenAlertType>>;
}) {
  const { setShowCart } = useOpenCartContext();
  const { setCart } = useCartContext();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<BodyType>({ resolver: zodResolver(zodSchema) });

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
    const cartDataLocalStorage = localStorage.getItem('cart');
    if (cartDataLocalStorage) setCart(JSON.parse(cartDataLocalStorage));
  }, [setCart]);

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
      value: product.productPrice,
    });
    setValue('flavor', flavors.activeValue);
    setValue('color', colors.activeValue);
  }, [register, product, flavors, colors, setValue]);

  const handleFormSubmit: SubmitHandler<BodyType> = body => {
    const cart = document.querySelector('#cart') as HTMLDivElement;
    const cartDataLocalStorage = localStorage.getItem('cart');
    if (!cartDataLocalStorage) {
      localStorage.setItem('cart', JSON.stringify([body]));
    } else {
      const cartData: CartType[] = JSON.parse(cartDataLocalStorage);
      if (cartData.some(val => isEqual(val, body))) {
        setOpenAlert({
          msg: 'Produto já foi adicionado ao carrinho',
          open: true,
          severity: 'success',
        });
        setShowCart(true);
        cart.focus();
        return;
      }
      if (cartData.length > 20) {
        setOpenAlert({
          msg: 'Carrinho lotado, exclua itens para adicionar novos',
          open: true,
          severity: 'error',
        });
        setShowCart(true);
        cart.focus();
        return;
      }

      cartData.push(body);
      localStorage.setItem('cart', JSON.stringify(cartData));
      setCart(cartData);
    }
    setOpenAlert({
      msg: 'Produto adicionado ao carrinho',
      open: true,
      severity: 'success',
    });
    setShowCart(true);
    cart.focus();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={`${showAddCart ? 'translate-y-0' : 'translate-y-[100%]'} rounded-2xl px-4 pt-8 pb-4 h-fit duration-200 transition-transform absolute w-full bg-primary flex flex-col justify-center gap-3 bottom-0 left-0`}
      >
        <button
          className="absolute top-0 right-2"
          type="button"
          onClick={() => setShowAddCart(false)}
        >
          <IoIosClose
            size={30}
            className="hover:fill-red-600 fill-3d3d3d transition-colors duration-200"
          />
        </button>

        <div
          className={`grid ${flavors.values?.length && colors.values?.length ? 'grid-cols-2' : 'grid-cols-1'} gap-3 w-full`}
        >
          {flavors.values?.length && colors.values?.length ? (
            <>
              <SelectPreferencesProduct
                preference={flavors}
                setPreference={setFlavors}
                title="Sabores"
                registerName="flavor"
                errors={errors}
                register={register}
                trigger={trigger}
              />
              <SelectPreferencesProduct
                preference={colors}
                setPreference={setColors}
                title="Cores"
                registerName="color"
                errors={errors}
                register={register}
                trigger={trigger}
              />
            </>
          ) : null}
          {flavors.values?.length && !colors.values?.length ? (
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
          {!flavors.values?.length && colors.values?.length ? (
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
        <div className="flex flex-col">
          <div className="flex justify-between gap-3 w-full">
            <input
              defaultValue={1}
              placeholder="Unidades"
              className="text-secudary font-medium text-[13px] text-center bg-e5e5e5 px-4 h-11 rounded-3xl w-[40%]"
              {...register('units')}
              onInput={event => {
                const currentTarget = event.currentTarget;
                let value = currentTarget.value.replace(/[^\d]/g, '');
                if (+value == 0) return (currentTarget.value = '');
                currentTarget.value = value;
              }}
            />
            <button
              type="submit"
              className="hover:scale-105 text-center transition-transform duration-200 px-4 h-11 rounded-3xl w-[60%] text-[13px] text-primary bg-ccba00 font-medium"
            >
              Comprar
            </button>
          </div>
          {errors.units && <ErrorMsg msg={errors.units.message} />}
        </div>
      </form>
      <button
        type="button"
        className={`${!showAddCart && 'hover:scale-105 duration-200 transition-transform'} flex items-center justify-center bg-secudary h-[50px] rounded-3xl w-1/2`}
        onClick={() => setShowAddCart(!showAddCart)}
      >
        <FaShoppingCart fill="#fff" size={23} className="flex-none" />
      </button>
    </>
  );
}

const SelectPreferencesProduct = ({
  preference,
  setPreference,
  title,
  registerName,
  errors,
  register,
  trigger,
}: {
  preference: SelectType;
  title: 'Sabores' | 'Cores';
  registerName: 'flavor' | 'color';
  setPreference: Dispatch<SetStateAction<SelectType>>;
  errors: FieldErrors<BodyType>;
  register: UseFormRegister<BodyType>;
  trigger: UseFormTrigger<BodyType>;
}) => {
  if (typeof preference.values == 'undefined' || !preference.values.length)
    return;

  return (
    <div className={`flex gap-1 flex-col items-center`}>
      <h3 className="text-sm font-medium text-secudary text-center">{title}</h3>
      <div
        className="relative w-full"
        tabIndex={0}
        onBlur={event => {
          // nunca colocar evento de foco no mesmo elemento que foi setado evento de click
          if (!event.currentTarget.contains(event.relatedTarget))
            setPreference(state => ({ ...state, active: false }));
        }}
      >
        <div
          className=" bg-gray-600 hover:bg-gray-500 cursor-pointer duration-200 transition-colors flex items-center justify-between gap-2 px-4 h-11 rounded-3xl"
          onClick={() =>
            setPreference(state => ({ ...state, active: !state.active }))
          }
        >
          <input
            value={preference.activeValue}
            {...register(registerName)}
            placeholder="Selecionar"
            className="truncate text-primary bg-transparent text-[13px] font-normal cursor-pointer placeholder:text-primary"
            readOnly
          />

          <IoIosArrowDown
            size={14}
            fill="#fff"
            stroke="#fff"
            strokeWidth={5}
            className={`${preference.active ? 'rotate-180' : 'rotate-0'} flex-none duration-200 transition-transform`}
          />
        </div>
        {errors[registerName] && (
          <ErrorMsg msg={errors[registerName]?.message} />
        )}

        <div
          // bug do blur na porra do display resolvido aqui com altura e nunca com display hidden e visibilite
          className={`duration-200 transition-all flex absolute top-12 bg-gray-600 rounded-lg left-0 overflow-hidden w-full`}
          style={{
            height: preference.active
              ? preference.values.length > 4
                ? '110px'
                : `${preference.values.length * 28.3}px`
              : '0px',
            opacity: preference.active ? 1 : 0,
          }}
        >
          <div
            className={`w-full h-full  bg-inherit flex-col overflow-x-hidden overflow-y-auto`}
            onClick={event => event.stopPropagation()}
          >
            {preference.values.map((val, i) => (
              <button
                key={val}
                title={val}
                type="button"
                className={`truncate w-full whitespace-nowrap text-[13px] text-left font-normal px-3 py-1 text-primary ${preference.values && preference.values.length - 1 !== i && 'border-b border-solid border-b-gray-500'} hover:bg-gray-500 transition-colors duration-200 cursor-pointer`}
                onClick={() => {
                  setPreference(state => ({
                    ...state,
                    active: false,
                    activeValue: val,
                  }));
                  setTimeout(() => {
                    trigger(registerName);
                  }, 100);
                }}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ErrorMsg = ({ msg }: { msg?: string }) => {
  return (
    <div className="ml-[10px] mt-1 text-[11px] font-normal text-red-600">
      {msg}
    </div>
  );
};
