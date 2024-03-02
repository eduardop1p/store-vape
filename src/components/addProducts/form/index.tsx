'use client';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { FaImages } from 'react-icons/fa';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { IoIosArrowDown } from 'react-icons/io';
import { upperCase, upperFirst } from 'lodash';

import ImageSlides, { ImagesTypes } from './imageSlides';
import replaceCurrency from '@/services/replaceCurrency';
import AlertMsg, { OpenAlertType } from '@/components/alertMsg';
import Loading from '@/components/loading';

const zodSchema = z.object({
  files: z
    .custom<FileList>()
    .refine(file => file.length, 'Uma imagem para o produto é obrigatória'),
  name: z.string().trim().min(1, 'Nome é obrigatótio'),
  mark: z.string().trim().min(1, 'Marca é obrigatótia'),
  price: z
    .string()
    .refine(val => val && replaceCurrency(val), 'Um preço é obrigatótio'),
  descount: z.string().optional(),
  stock: z.string().trim().min(1, 'Quantidate em estoque é obrigatótio'),
  category: z
    .string()
    .trim()
    .min(1, 'Uma categoria especificada é obrigatótio'),
  status: z.string().trim().optional(),
  flavors: z.string().trim().optional(),
  colors: z.string().trim().optional(),
  withBattery: z.boolean().optional(),
  ohm: z.string().trim().optional(),
  nicotina: z.string().trim().optional(),
  ml: z.string().trim().optional(),
  qtdItems: z.string().trim().optional(),
});

type BodyType = z.infer<typeof zodSchema>;

export default function AddProductsForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<BodyType>({
    resolver: zodResolver(zodSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<ImagesTypes[]>([]);
  const [showStatus, setShowStatus] = useState(false);
  const [flavors, setFlavors] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [openAlert, setOpenAlert] = useState<OpenAlertType>({
    open: false,
    msg: '',
    severity: 'success',
  });
  const [withBattery, setWithBattery] = useState({
    check1: false,
    check2: false,
    check3: true,
  });
  let isRemoveKey = useRef(false);

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

  useEffect(() => {
    register('status', {
      value: '',
    });
    register('withBattery', {
      value: false,
    });
  }, [register, withBattery]);

  const handleFormSubmit: SubmitHandler<BodyType> = async body => {
    if (isLoading) return;

    const formData = new FormData();
    previewImages.forEach(val => formData.append('productFiles', val.blob));
    const newDescount = replaceCurrency(body.descount!) / 100;
    const newPrice = replaceCurrency(body.price) / 100;
    formData.append('name', upperCase(body.name));
    formData.append('mark', body.mark.toUpperCase());
    formData.append('price', newPrice.toString());
    formData.append('descount', (newDescount / 100).toString());
    formData.append('stock', body.stock);
    formData.append('status', JSON.stringify(body.status));
    formData.append('category', upperFirst(body.category));
    formData.append('flavors', JSON.stringify(flavors));

    formData.append('colors', JSON.stringify(colors));
    formData.append('withBattery', JSON.stringify(body.withBattery));
    formData.append('ohm', JSON.stringify(upperFirst(body.ohm)));
    formData.append('nicotina', JSON.stringify(upperFirst(body.nicotina)));
    formData.append('ml', JSON.stringify(upperFirst(body.ml)));
    formData.append('qtdItems', JSON.stringify(body.qtdItems));

    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/add-products`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setOpenAlert({
          msg: data.error,
          open: true,
          severity: 'error',
        });
        return;
      }

      setOpenAlert({
        msg: data.success,
        open: true,
        severity: 'success',
      });
      setPreviewImages([]);
      setFlavors([]);
      setColors([]);
      setWithBattery({
        check1: false,
        check2: false,
        check3: true,
      });
      reset();
    } catch (err) {
      console.log(err);
      setOpenAlert({
        msg: 'Internal server error',
        open: true,
        severity: 'error',
      });
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImages = (files: FileList) => {
    if (!files) return;
    const newFiles = Array.from(files).map(val => ({
      blob: val,
      url: URL.createObjectURL(val),
    }));
    setPreviewImages(newFiles);
  };

  const handleMaskMoney = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    let value = currentTarget.value.replace(/\D/g, '');
    if (!value) return;
    value = (+value / 100).toLocaleString('pt-BR', {
      currency: 'BRL',
      style: 'currency',
    });
    currentTarget.value = value;
  };

  const handleMaskPercentage = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;

    if (!isRemoveKey.current) {
      let value = currentTarget.value.replace(/[^\d]/g, '');
      if (!value) return;
      const newValue = +value / 100;
      const percentage = (newValue / 100).toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 2,
      });
      setValue('descount', percentage);
    }
  };

  const handleMaskItems = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;

    if (!isRemoveKey.current) {
      let value = currentTarget.value.replace(/[^\d]/g, '');
      if (!value) return;
      if (+value > 1) {
        value = `${value} Itens`;
      } else {
        value = `${value} Item`;
      }
      setValue('qtdItems', value);
    }
  };

  return (
    <>
      <AlertMsg openAlert={openAlert} setOpenAlert={setOpenAlert} />
      {isLoading && <Loading />}
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex justify-between w-full"
      >
        <div
          className={`relative w-1/2 flex min-h-screen bg-efefef items-center justify-center`} // eslint-disable-line
        >
          {previewImages.length ? (
            <div className={`absolute inset-0 w-full h-full px-10 py-4`}>
              <button
                type="button"
                className="flex items-center justify-center w-[45px] h-[45px] rounded-full bg-red-600 absolute right-3 top-3 z-[5] cursor-pointer"
                onClick={() => setPreviewImages([])}
              >
                <RiDeleteBin7Fill size={25} fill="#fff" className="flex-none" />
              </button>

              <ImageSlides
                setPreviewImages={setPreviewImages}
                imgs={previewImages}
              />
            </div>
          ) : (
            <div className={`flex flex-col items-center`}>
              <FaImages size={80} fill="#3d3d3d" />
              <span className="text-sm font-normal text-3d3d3d mb-1">
                Click add files
              </span>
              {errors.files && <ErrorMsg msg={errors.files.message!} />}
              <label
                className="w-full h-full inset-0 block cursor-pointer absolute"
                htmlFor="files"
              ></label>
              <input
                type="file"
                id="files"
                {...register('files', {
                  onChange(event) {
                    handleAddImages(event.target.files);
                  },
                })}
                onClick={event => (event.currentTarget.value = '')}
                accept="image/*"
                className="hidden"
                multiple
              />
            </div>
          )}
        </div>

        <div className="w-1/2 bg-primary min-h-screen flex flex-col gap-4 p-8">
          <h1 className="text-2xl font-normal text-3d3d3d text-center">
            Informações do produto
          </h1>
          <div className="flex gap-4 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="name"
                className=" text-3d3d3d text-sm font-medium"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                placeholder="Nome do produto"
                className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm ${errors.name ? 'border-red-600' : 'border-3d3d3d'}`} // eslint-disale-line
                {...register('name')}
              />
              {errors.name && <ErrorMsg msg={errors.name.message!} />}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="mark"
                className=" text-3d3d3d text-sm font-medium"
              >
                Marca
              </label>
              <input
                type="text"
                id="mark"
                placeholder="Marca do produto"
                className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm ${errors.mark ? 'border-red-600' : 'border-3d3d3d'}`} // eslint-disale-line
                {...register('mark')}
              />
              {errors.mark && <ErrorMsg msg={errors.mark.message!} />}
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="category"
                className=" text-3d3d3d text-sm font-medium"
              >
                Categoria
              </label>
              <input
                type="text"
                id="category"
                placeholder="Categoria do produto"
                className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm ${errors.category ? 'border-red-600' : 'border-3d3d3d'}`} // eslint-disale-line
                {...register('category')}
              />
              {errors.category && <ErrorMsg msg={errors.category.message!} />}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="price"
                className=" text-3d3d3d text-sm font-medium"
              >
                Preço R$
              </label>
              <input
                type="text"
                id="price"
                placeholder="R$ 0,00"
                className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm ${errors.price ? 'border-red-600' : 'border-3d3d3d'}`} // eslint-disale-line
                {...register('price')}
                onInput={handleMaskMoney}
              />
              {errors.price && <ErrorMsg msg={errors.price.message!} />}
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="stock"
                className=" text-3d3d3d text-sm font-medium"
              >
                Quantidade em estoque
              </label>
              <input
                type="text"
                id="stock"
                placeholder="0 em estoque"
                className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm ${errors.stock ? 'border-red-600' : 'border-3d3d3d'}`} // eslint-disale-line
                {...register('stock')}
                onInput={(event) => event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '')} // eslint-disable-line
              />
              {errors.stock && <ErrorMsg msg={errors.stock.message!} />}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="descount"
                className=" text-3d3d3d text-sm font-medium"
              >
                Desconto %
              </label>
              <input
                type="text"
                id="descount"
                placeholder="00,0%"
                className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm border-3d3d3d`} // eslint-disale-line
                {...register('descount')}
                onInput={handleMaskPercentage}
              />
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="ohm" className=" text-3d3d3d text-sm font-medium">
                Ohm do produto
              </label>
              <input
                type="text"
                id="ohm"
                placeholder="0.2?/Ohm"
                className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm border-3d3d3d`} // eslint-disale-line
                {...register('ohm')}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="nicotina"
                className=" text-3d3d3d text-sm font-medium"
              >
                Quantidade de nicotina no produto em (mg)
              </label>
              <input
                type="text"
                id="nicotina"
                placeholder="00mg"
                className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm border-3d3d3d`} // eslint-disale-line
                {...register('nicotina')}
              />
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="ml" className=" text-3d3d3d text-sm font-medium">
                Variação de ml
              </label>
              <input
                type="text"
                id="ml"
                placeholder="0ml"
                className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm border-3d3d3d`} // eslint-disale-line
                {...register('ml')}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="qtdItems"
                className=" text-3d3d3d text-sm font-medium"
              >
                Quantidade de itens por produto
              </label>
              <input
                type="text"
                id="qtdItems"
                placeholder="0 itens"
                className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm border-3d3d3d`} // eslint-disale-line
                {...register('qtdItems')}
                onInput={handleMaskItems}
                onBlur={handleMaskItems}
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-1">
            <div className="flex items-end gap-3">
              <div className="flex flex-col gap-1 w-1/2">
                <label
                  htmlFor="colors"
                  className=" text-3d3d3d text-sm font-medium"
                >
                  Adcionar cores
                </label>
                <input
                  type="text"
                  id="colors"
                  placeholder="Sabores opcionais"
                  className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm border-3d3d3d`} // eslint-disale-line
                  {...register('colors')}
                />
              </div>
              <button
                type="button"
                className="hover:scale-105 duration-200 transition-transform bg-blue-500 p-2 text-primary font-normal text-[13px] rounded flex items-center justify-center mb-1"
                onClick={() => {
                  if (watch('colors')) {
                    setColors(state => [...state, upperFirst(watch('colors'))]);
                    setTimeout(() => {
                      setValue('colors', '');
                    }, 50);
                  }
                }}
              >
                Adcionar
              </button>
              {colors.length ? (
                <button
                  type="button"
                  className="hover:scale-105 duration-200 transition-transform bg-red-500 p-2 text-primary font-normal text-[13px] rounded flex items-center justify-center mb-1"
                  onClick={() => setColors(state => state.slice(0, -1))}
                >
                  Remover
                </button>
              ) : null}
            </div>
            {colors.length ? (
              <p className="text-3d3d3d text-xs mt-1  font-normal">
                {'['} {colors.join(', ')} {']'}
              </p>
            ) : null}
          </div>

          <div className="w-full flex flex-col gap-1">
            <div className="flex items-end gap-3">
              <div className="flex flex-col gap-1 w-1/2">
                <label
                  htmlFor="flavors"
                  className=" text-3d3d3d text-sm font-medium"
                >
                  Adcionar sabores
                </label>
                <input
                  type="text"
                  id="flavors"
                  placeholder="Sabores opcionais"
                  className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm border-3d3d3d`} // eslint-disale-line
                  {...register('flavors')}
                />
              </div>
              <button
                type="button"
                className="hover:scale-105 duration-200 transition-transform bg-blue-500 p-2 text-primary font-normal text-[13px] rounded flex items-center justify-center mb-1"
                onClick={() => {
                  if (watch('flavors')) {
                    setFlavors(state => [
                      ...state,
                      upperFirst(watch('flavors')),
                    ]);
                    setTimeout(() => {
                      setValue('flavors', '');
                    }, 50);
                  }
                }}
              >
                Adcionar
              </button>
              {flavors.length ? (
                <button
                  type="button"
                  className="hover:scale-105 duration-200 transition-transform bg-red-500 p-2 text-primary font-normal text-[13px] rounded flex items-center justify-center mb-1"
                  onClick={() => setFlavors(state => state.slice(0, -1))}
                >
                  Remover
                </button>
              ) : null}
            </div>
            {flavors.length ? (
              <p className="text-3d3d3d text-xs mt-1 font-normal">
                {'['} {flavors.join(', ')} {']'}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`relative p-[10px] w-[115px] flex items-center justify-between gap-2 border border-solid border-3d3d3d cursor-pointer rounded-lg`} // eslint-disable-line
              tabIndex={0}
              onClick={() => setShowStatus(!showStatus)}
              onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setShowStatus(false);
              }}
            >
              <span className="text-sm font-normal text-3d3d3d">
                {!watch('status') ? 'Status' : watch('status')}
              </span>
              <IoIosArrowDown size={18} fill="#3d3d3d" />
              <div
                className={`absolute top-11 z-[2] left-0 w-[85%] bg-3d3d3d shadow-2xl rounded-md flex-col ${showStatus ? 'flex' : 'hidden'}`} // eslint-disable-lien
                onClick={event => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setValue('status', 'Destaque');
                    setShowStatus(false);
                  }}
                  className="text-[13px] p-2 leading-none hover:text-blue-400 duration-200 transition-colors font-normal text-primary text-left border-b-[1px] border-solid border-gray-400"
                >
                  Destaque
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue('status', 'Novidade');
                    setShowStatus(false);
                  }}
                  className="text-[13px] p-2 leading-none hover:text-blue-400 duration-200 transition-colors font-normal text-primary text-left"
                >
                  Novidade
                </button>
              </div>
            </div>
            {watch('status') && (
              <RiDeleteBin7Fill
                size={18}
                className="cursor-pointer fill-red-500"
                onClick={() => setValue('status', '')}
              />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="stock" className=" text-3d3d3d text-sm font-medium">
              Com bateria
            </label>
            <div className="flex gap-2 items-center">
              <div className="flex gap-1 items-center">
                <input
                  type="checkbox"
                  checked={withBattery.check1}
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    setValue('withBattery', true);
                    setWithBattery(() => ({
                      check1: true,
                      check2: false,
                      check3: false,
                    }));
                  }}
                />
                <span className="text-[13px] font-normal text-secudary">
                  Sim
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <input
                  type="checkbox"
                  checked={withBattery.check2}
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    setValue('withBattery', false);
                    setWithBattery(() => ({
                      check1: false,
                      check2: true,
                      check3: false,
                    }));
                  }}
                />
                <span className="text-[13px] font-normal text-secudary">
                  Não
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <input
                  type="checkbox"
                  checked={withBattery.check3}
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    setValue('withBattery', false);
                    setWithBattery(() => ({
                      check1: false,
                      check2: false,
                      check3: true,
                    }));
                  }}
                />
                <span className="text-[13px] font-normal text-secudary">
                  Outro
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg mt-4 flex-none h-10 px-10 w-fit flex items-center justify-center font-normal text-primary text-sm bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
          >
            Adcionar produto
          </button>
        </div>
      </form>
    </>
  );
}

const ErrorMsg = ({ msg }: { msg: string }) => {
  return (
    <span className="-mt-[2px] text-xs font-normal text-red-600">{msg}</span>
  );
};
