'use client';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { FaImages } from 'react-icons/fa';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { IoIosArrowDown } from 'react-icons/io';

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
    .any()
    .transform(val => replaceCurrency(val) / 100)
    .refine(val => val, 'Um preço é obrigatótio'),
  descount: z.string().optional(),
  stock: z.string().trim().min(1, 'Quantidate em estoque é obrigatótio'),
  status: z.string().trim().optional(),
  category: z
    .string()
    .trim()
    .min(1, 'Uma categoria especificada é obrigatótio'),
  flavors: z.array(z.string()).optional(),
});

type BodyType = z.infer<typeof zodSchema>;

export default function AddProductsForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<BodyType>({
    resolver: zodResolver(zodSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<ImagesTypes[]>([]);
  const [showStatus, setShowStatus] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [flavorsSt, setFlavorsSt] = useState<string[]>([]);
  const [openAlert, setOpenAlert] = useState<OpenAlertType>({
    open: false,
    msg: '',
    severity: 'success',
  });
  let isRemoveKey = useRef(false);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Delete')
        isRemoveKey.current = true;
    };
    window.addEventListener('keydown', event => onKeydown(event));

    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

  const handleFormSubmit: SubmitHandler<BodyType> = async body => {
    if (isLoading) return;

    const formData = new FormData();
    Array.from(body.files).forEach(val => formData.append('productFiles', val));
    const newDescount = replaceCurrency(body.descount!) / 100;
    formData.append('name', body.name);
    formData.append('mark', body.mark);
    formData.append('price', body.price.toString());
    formData.append('descount', (newDescount / 100).toString());
    formData.append('stock', body.stock);
    formData.append('status', body.status || '');
    formData.append('category', body.category);
    formData.append('flavors', body.flavors?.join(',') || '');

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
    } catch (err) {
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
      const newValue = +value / 100;
      const percentage = (newValue / 100).toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 2,
      });
      setValue('descount', percentage);
      return;
    }
    isRemoveKey.current = false;
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

              <ImageSlides imgs={previewImages} />
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
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className=" text-3d3d3d text-sm font-medium">
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
          <div className="flex flex-col gap-1">
            <label htmlFor="mark" className=" text-3d3d3d text-sm font-medium">
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

          <div className="flex flex-col gap-1">
            <label htmlFor="price" className=" text-3d3d3d text-sm font-medium">
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

          <div className="flex flex-col gap-1">
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

          <div className="flex flex-col gap-1">
            <label htmlFor="stock" className=" text-3d3d3d text-sm font-medium">
              Estoque
            </label>
            <input
              type="text"
              id="stock"
              placeholder="Quantidade em estoque"
              className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm ${errors.stock ? 'border-red-600' : 'border-3d3d3d'}`} // eslint-disale-line
              {...register('stock')}
              onInput={(event) => event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '')} // eslint-disable-line
            />
            {errors.stock && <ErrorMsg msg={errors.stock.message!} />}
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
            <div className="flex items-center gap-4">
              <div
                className={`relative p-[10px] flex items-center justify-between gap-2 border border-solid ${errors.category ? 'border-red-600' : 'border-3d3d3d'} cursor-pointer rounded-lg`} // eslint-disable-line
                tabIndex={0}
                onClick={() => setShowCategories(!showCategories)}
                onBlur={event => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    setShowCategories(false);
                }}
              >
                {!watch('category') && (
                  <label
                    htmlFor="category"
                    className="absolute text-sm font-normal text-3d3d3d whitespace-nowra bg-transparent pointer-events-none"
                  >
                    Categoria do produto
                  </label>
                )}
                <input
                  type="text"
                  id="category"
                  className="text-sm font-normal text-3d3d3d whitespace-nowrap bg-transparent pointer-events-none"
                  {...register('category')}
                  readOnly
                />
                <IoIosArrowDown size={18} fill="#3d3d3d" />
                <div
                  className={`absolute top-11 left-0 w-[85%] bg-3d3d3d shadow-2xl rounded-md flex-col ${showCategories ? 'flex' : 'hidden'}`} // eslint-disable-lien
                  onClick={event => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setValue('category', 'Pod Descartável');
                      setShowCategories(false);
                      trigger('category');
                    }}
                    className="text-[13px] p-2 leading-none hover:text-blue-400 duration-200 transition-colors font-normal text-primary text-left border-b-[1px] border-solid border-gray-400"
                  >
                    Pod Descartável
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('category', 'E-Liquids');
                      setShowCategories(false);
                      trigger('category');
                    }}
                    className="text-[13px] p-2 leading-none hover:text-blue-400 duration-200 transition-colors font-normal text-primary text-left border-b-[1px] border-solid border-gray-400"
                  >
                    E-Liquids
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('category', 'Acessórios');
                      setShowCategories(false);
                      trigger('category');
                    }}
                    className="text-[13px] p-2 leading-none hover:text-blue-400 duration-200 transition-colors font-normal text-primary text-left border-b-[1px] border-solid border-gray-400"
                  >
                    Acessórios
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('category', 'Vapes de ervas');
                      setShowCategories(false);
                      trigger('category');
                    }}
                    className="text-[13px] p-2 leading-none hover:text-blue-400 duration-200 transition-colors font-normal text-primary text-left border-b-[1px] border-solid border-gray-400"
                  >
                    Vapes de ervas
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('category', 'Ofertas especial');
                      setShowCategories(false);
                      trigger('category');
                    }}
                    className="text-[13px] p-2 leading-none hover:text-blue-400 duration-200 transition-colors font-normal text-primary text-left border-b-[1px] border-solid border-gray-400"
                  >
                    Ofertas especial
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('category', 'Aparelhos');
                      setShowCategories(false);
                      trigger('category');
                    }}
                    className="text-[13px] p-2 leading-none hover:text-blue-400 duration-200 transition-colors font-normal text-primary text-left"
                  >
                    Aparelhos
                  </button>
                </div>
              </div>
              {watch('category') && (
                <RiDeleteBin7Fill
                  size={18}
                  className="cursor-pointer fill-red-500"
                  onClick={() => {
                    setValue('category', '');
                    trigger('category');
                  }}
                />
              )}
            </div>
            {errors.category && <ErrorMsg msg={errors.category.message!} />}
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
                  className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm ${errors.flavors ? 'border-red-600' : 'border-3d3d3d'}`} // eslint-disale-line
                  {...register('flavors', {
                    setValueAs(value) {
                      return [...flavorsSt, value];
                    },
                  })}
                />
                {errors.flavors && <ErrorMsg msg={errors.flavors.message!} />}
              </div>
              <button
                type="button"
                className="hover:scale-105 duration-200 transition-transform bg-blue-500 p-2 text-primary font-normal text-[13px] rounded flex items-center justify-center mb-1"
                onClick={() => {
                  const elFlavors =
                    document.querySelector<HTMLInputElement>('#flavors');
                  if (elFlavors?.value) {
                    setFlavorsSt(state => [...state, elFlavors.value]);
                    setTimeout(() => {
                      elFlavors.value = '';
                    }, 100);
                  }
                }}
              >
                Adcionar
              </button>
              {flavorsSt.length ? (
                <button
                  type="button"
                  className="hover:scale-105 duration-200 transition-transform bg-red-500 p-2 text-primary font-normal text-[13px] rounded flex items-center justify-center mb-1"
                  onClick={() => {
                    setFlavorsSt(state => state.slice(0, -1));
                    setValue('flavors', []);
                  }}
                >
                  Remover
                </button>
              ) : null}
            </div>
            {flavorsSt.length ? (
              <p className="text-3d3d3d text-xs  font-normal">
                | {flavorsSt.join(' | ')} |
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="rounded-lg flex-none h-10 px-10 w-fit flex items-center justify-center font-normal text-primary text-sm bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
          >
            Adcionar
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
