/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form';
import {
  Dispatch,
  FormEvent,
  FormEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { FaImages } from 'react-icons/fa';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { IoIosArrowDown } from 'react-icons/io';
import { upperFirst } from 'lodash';

import ImageSlides, { ImagesTypes } from './imageSlides';
import replaceCurrency from '@/services/replaceCurrency';
import AlertMsg, { OpenAlertType } from '@/components/alertMsg';
import Loading from '@/components/loading';
import useIsRemoveKey from '@/utils/useIsRemoveKey';
import formatPrice from '@/services/formatPrice';

const zodSchema = z.object({
  files: z
    .custom<FileList>()
    .refine(file => file.length, 'Uma imagem para o produto é obrigatória'),
  name: z.string().trim().min(1, 'Nome é obrigatótio'),
  mark: z.string().trim().min(1, 'Marca é obrigatótia'),
  basePrice: z
    .string()
    .refine(val => replaceCurrency(val), 'Um preço base é obrigatótio'),
  finalPrice: z.string(),
  pixPrice: z.string(),
  productDescount: z.string().optional(),
  pixDescount: z.string().optional(),
  stock: z.string().trim().min(1, 'Quantidate em estoque é obrigatótio'),
  category: z.string().trim().min(1, 'Uma categoria especifica é obrigatótia'),
  subcategory2: z.string().trim().optional(),
  subcategory3: z.string().trim().optional(),
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

export interface DescriptionType {
  title: string;
  tag: string;
  value?: string;
}

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
  const [description, setDescription] = useState<DescriptionType[]>([]);
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

  const { isRemoveKey } = useIsRemoveKey();

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
    const newProductDescount = replaceCurrency(body.productDescount!) / 10000;
    const newPixDescount = replaceCurrency(body.pixDescount!) / 10000;

    const newBasePrice = replaceCurrency(body.basePrice) / 100;
    const newFinalPrice = replaceCurrency(body.finalPrice) / 100;
    const newPixPrice = replaceCurrency(body.pixPrice) / 100;
    formData.append('name', upperFirst(body.name.toLowerCase()));
    formData.append('mark', body.mark.toUpperCase());
    formData.append('basePrice', newBasePrice.toString());
    formData.append('finalPrice', newFinalPrice.toString());
    formData.append('pixPrice', newPixPrice.toString());
    formData.append('productDescount', newProductDescount.toString());
    formData.append('pixDescount', newPixDescount.toString());
    formData.append('stock', body.stock);
    formData.append('status', JSON.stringify(body.status));
    formData.append('category', upperFirst(body.category.toLowerCase()));
    formData.append(
      'subcategory2',
      upperFirst(body.subcategory2?.toLowerCase())
    );
    formData.append(
      'subcategory3',
      upperFirst(body.subcategory3?.toLowerCase())
    );
    formData.append('description', JSON.stringify(description));
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
      setOpenAlert({
        msg: 'Internal server error',
        open: true,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
      document.documentElement.scrollTop = 0;
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

  const handleMaskBasePrice = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    let value = currentTarget.value.replace(/\D/g, '');
    value = formatPrice(+value / 100);
    setValue('basePrice', value);
    handleMaskFinalPrice();
  };

  const handleMaskFinalPrice = () => {
    let priceBase: string | number = replaceCurrency(watch('basePrice'));
    const productDescount = replaceCurrency(watch('productDescount')!) / 10000;
    const pixDescount = replaceCurrency(watch('pixDescount')!) / 10000;

    const finalPrice = priceBase * (1 - productDescount);
    const pixPrice = finalPrice * (1 - pixDescount);

    setValue('finalPrice', formatPrice(finalPrice / 100));
    setValue('pixPrice', formatPrice(pixPrice / 100));
  };

  const handleMaskPercentage = (
    event: FormEvent<HTMLInputElement>,
    registerName: keyof BodyType
  ) => {
    const currentTarget = event.currentTarget;

    if (!isRemoveKey) {
      let value = currentTarget.value.replace(/[^\d]/g, '');
      if (!value) return;
      const newValue = +value / 10000;
      const percentage = newValue.toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 2,
      });
      setValue(registerName, percentage);
      handleMaskFinalPrice();
    }
  };

  const handleMaskItems = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;

    if (!isRemoveKey) {
      let value = currentTarget.value.replace(/[^\d]/g, '');
      if (+value > 1) {
        setTimeout(() => {
          currentTarget.setSelectionRange(value.length - 6, value.length - 6);
        }, 0);
        value = `${value} Itens`;
      } else {
        setTimeout(() => {
          currentTarget.setSelectionRange(value.length - 5, value.length - 5);
        }, 0);
        value = `${value} Item`;
      }
      setValue('qtdItems', value);
    }
  };

  const handleMaskMl = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;

    if (!isRemoveKey) {
      let value = currentTarget.value;
      setTimeout(() => {
        currentTarget.setSelectionRange(value.length - 2, value.length - 2);
      }, 0);
      value = value.replace(/[^\d.]/g, '');
      value = `${value}ml`;
      setValue('ml', value);
    }
  };

  const handleMaskNicotina = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;

    if (!isRemoveKey) {
      let value = currentTarget.value;
      setTimeout(() => {
        currentTarget.setSelectionRange(value.length - 2, value.length - 2);
      }, 0);
      value = value.replace(/[^\d.]/g, '');
      value = `${value}mg`;
      setValue('nicotina', value);
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
            <Input
              errors={errors}
              label="Nome"
              placeholder="Nome do produto"
              register={register}
              registerName="name"
            />
            <Input
              errors={errors}
              label="Marca"
              placeholder="Marca do produto"
              register={register}
              registerName="mark"
            />
          </div>
          <div className="flex gap-4 w-full">
            <div className="w-full flex flex-col gap-2">
              <Input
                errors={errors}
                label="Categoria"
                placeholder="Categoria do produto"
                register={register}
                registerName="category"
              />
              {(watch('category') || watch('subcategory2')) && (
                <div className="w-[90%] ml-[10%] relative before:content-[''] before:absolute before:bg-gray-500 before:w-1 before:h-8 before:-top-2 before:right-2">
                  <Input
                    errors={errors}
                    label="Sub categoria 2 (opcional)"
                    placeholder="Sub categoria 2 do produto"
                    register={register}
                    registerName="subcategory2"
                  />
                </div>
              )}
              {(watch('subcategory2') || watch('subcategory3')) && (
                <div className="w-[80%] ml-[20%] relative before:content-[''] before:absolute before:bg-gray-500 before:w-1 before:h-8 before:-top-2 before:right-2">
                  <Input
                    errors={errors}
                    label="Sub categoria 3 (opcional)"
                    placeholder="Sub categoria 3 do produto"
                    register={register}
                    registerName="subcategory3"
                  />
                </div>
              )}
            </div>
            <Input
              errors={errors}
              label="Quantidade em estoque"
              placeholder="0 em estoque"
              register={register}
              registerName="stock"
              handleOnInput={(event) => event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '')} // eslint-disable-line
            />
          </div>
          <div className="flex gap-4 w-full">
            <Input
              errors={errors}
              label="Preço base R$"
              placeholder="R$ 0,00"
              register={register}
              registerName="basePrice"
              handleOnInput={handleMaskBasePrice}
            />
            <Input
              errors={errors}
              label="Desconto % (opcional)"
              placeholder="00,0%"
              register={register}
              registerName="productDescount"
              handleOnInput={event =>
                handleMaskPercentage(event, 'productDescount')
              }
            />
          </div>
          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <Input
                errors={errors}
                label="Desconto no pix % (opcional)"
                placeholder="00,0%"
                register={register}
                registerName="pixDescount"
                handleOnInput={event =>
                  handleMaskPercentage(event, 'pixDescount')
                }
              />
            </div>
            <div className="flex w-1/2 gap-2">
              <Input
                errors={errors}
                label="Preço final R$"
                placeholder="R$ 0,00"
                register={register}
                registerName="finalPrice"
                readOnly
              />
              <Input
                errors={errors}
                label="Preço final no pix R$"
                placeholder="R$ 0,00"
                register={register}
                registerName="pixPrice"
                readOnly
              />
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <Input
              errors={errors}
              label="Ohm do produto"
              placeholder="0.2?/Ohm"
              register={register}
              registerName="ohm"
            />
            <Input
              errors={errors}
              label="Quantidade de nicotina no produto em (mg)"
              placeholder="00mg"
              register={register}
              registerName="nicotina"
              handleOnInput={handleMaskNicotina}
            />
          </div>
          <div className="flex gap-4 w-full">
            <Input
              errors={errors}
              label="Variação de ml"
              placeholder="0ml"
              register={register}
              registerName="ml"
              handleOnInput={handleMaskMl}
            />
            <Input
              errors={errors}
              label="Quantidade de itens por produto"
              placeholder="0 itens"
              register={register}
              registerName="qtdItems"
              handleOnInput={handleMaskItems}
            />
          </div>

          <Description
            description={description}
            setDescription={setDescription}
          />

          <InputColorsAndFlavors
            valuesState={colors}
            register={register}
            setValuesState={setColors}
            setValue={setValue}
            watch={watch}
            title="Adcionar cores"
            placeholder="Cores opcionais"
            registerName="colors"
          />
          <InputColorsAndFlavors
            valuesState={flavors}
            register={register}
            setValuesState={setFlavors}
            setValue={setValue}
            watch={watch}
            title="Adcionar sabores"
            placeholder="Sabores opcionais"
            registerName="flavors"
          />

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
            id="add-product"
            className="rounded-lg mt-4 flex-none h-10 px-10 w-fit flex items-center justify-center font-normal text-primary text-sm bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
          >
            Adcionar produto
          </button>
        </div>
      </form>
    </>
  );
}

interface TypeDescriptionType {
  active: boolean;
  activeValue: string;
  tag: 'h1' | 'h3' | 'p' | 'ul';
}
export const Description = ({
  description,
  setDescription,
}: {
  description: DescriptionType[];
  setDescription: Dispatch<SetStateAction<DescriptionType[]>>;
}) => {
  const [typeDescription, setTypeDescription] = useState<TypeDescriptionType>({
    active: false,
    activeValue: 'Titulo',
    tag: 'h1',
  });

  const handleAddElement = () => {
    setDescription(state => [
      ...state,
      { tag: typeDescription.tag, title: typeDescription.activeValue },
    ]);
  };

  useEffect(() => {
    if (description.length) {
      const lastIndex = description.length - 1;
      const elementDescription = document.querySelector(
        `#${description[lastIndex].tag}-${lastIndex}`
      ) as HTMLDivElement;
      document.documentElement.scrollTop = elementDescription.offsetTop - 130;
    }
  }, [description]);

  const handleRemoveElement = () => {
    if (description.length) {
      const newArr = description.slice(0, -1);
      setDescription(newArr);
    }
  };

  const Btn = ({ ...props }: TypeDescriptionType) => (
    <button
      type="button"
      onClick={() => {
        setTypeDescription({ ...props });
      }}
      className="text-[13px] p-2 leading-none hover:text-blue-400 duration-200 transition-colors font-normal text-primary text-left border-b-[1px] border-solid border-gray-400"
    >
      {props.activeValue}
    </button>
  );

  return (
    <div className="flex flex-col gap-1 w-full border border-solid border-3d3d3d rounded-lg p-4">
      <span className="text-3d3d3d text-sm font-medium">
        Descrição do produto
      </span>
      <div className="flex flex-col items-start gap-1 w-full">
        <div className="flex items-center gap-2 w-full">
          <div
            className={`relative p-2 w-full flex items-center justify-between gap-2 border border-solid border-3d3d3d cursor-pointer rounded-lg`} // eslint-disable-line
            tabIndex={0}
            onClick={() =>
              setTypeDescription(state => ({
                ...state,
                active: !state.active,
              }))
            }
            onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setTypeDescription(state => ({ ...state, active: false }));
            }}
          >
            <span className="text-sm font-normal text-3d3d3d">
              {typeDescription.activeValue}
            </span>
            <IoIosArrowDown size={18} fill="#3d3d3d" />
            <div
              className={`absolute top-11 z-[2] left-0 w-[85%] bg-3d3d3d shadow-2xl rounded-md flex-col ${typeDescription.active ? 'flex' : 'hidden'}`} // eslint-disable-lien
              onClick={event => event.stopPropagation()}
            >
              <Btn active={false} activeValue="Titulo" tag="h1" />
              <Btn active={false} activeValue="Sub titulo" tag="h3" />
              <Btn active={false} activeValue="Paragrafo" tag="p" />
              <Btn active={false} activeValue="Lista item" tag="ul" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center w-full">
          <button
            type="button"
            className="text-ellipsis overflow-hidden w-1/2 hover:scale-[1.02] duration-200 transition-transform bg-blue-500 p-2 text-primary font-normal text-[13px] rounded flex items-center justify-center"
            onClick={handleAddElement}
          >
            Criar
          </button>
          <button
            type="button"
            className="text-ellipsis overflow-hidden w-1/2 hover:scale-[1.02] duration-200 transition-transform bg-red-500 p-2 text-primary font-normal text-[13px] rounded flex items-center justify-center"
            onClick={handleRemoveElement}
          >
            Remover
          </button>
        </div>
      </div>
      {description.length ? (
        <div className="flex gap-1 flex-col">
          {description.map((val, i) => (
            <div key={i} className="flex gap-1 flex-col" id={`${val.tag}-${i}`}>
              <label className=" text-3d3d3d text-sm font-medium">
                {val.title}
              </label>
              {(val.tag.startsWith('h') || val.tag === 'ul') && (
                <input
                  onChange={event => {
                    const newArr = [...description];
                    newArr[i].value = event.currentTarget.value;
                    setDescription(newArr);
                  }}
                  className="w-full p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm border-3d3d3d"
                  placeholder={val.tag == 'h1' ? 'Titulo na descrição' : val.tag == 'h3' ? 'Sub titulo na descrição' : 'Item de lista na descrição'} // eslint-disable-line
                />
              )}
              {val.tag === 'p' && (
                <textarea
                  onChange={event => {
                    const newArr = [...description];
                    newArr[i].value = event.currentTarget.value;
                    setDescription(newArr);
                  }}
                  className="w-full resize-none p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm border-3d3d3d"
                  rows={12}
                  placeholder="Paragrafo na descrição"
                ></textarea>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const Input = ({
  label,
  register,
  placeholder,
  registerName,
  errors,
  handleOnInput,
  readOnly = false,
}: {
  label: string;
  placeholder: string;
  registerName: keyof BodyType;
  register: UseFormRegister<BodyType>;
  errors: FieldErrors<BodyType>;
  handleOnInput?: FormEventHandler<HTMLInputElement> | undefined;
  readOnly?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor={registerName}
        className=" text-3d3d3d text-sm font-medium"
      >
        {label}
      </label>
      <input
        type="text"
        id={registerName}
        placeholder={placeholder}
        className={`w-full p-3 rounded-lg ${readOnly ? 'text-gray-500' : 'text-3d3d3d'} font-normal border border-solid text-sm ${errors[registerName] ? 'border-red-600' : 'border-3d3d3d'}`} // eslint-disale-line
        {...register(registerName)}
        onInput={handleOnInput}
        readOnly={readOnly}
      />
      {errors[registerName] && <ErrorMsg msg={errors[registerName]?.message} />}
    </div>
  );
};

const InputColorsAndFlavors = ({
  register,
  watch,
  valuesState,
  setValuesState,
  setValue,
  registerName,
  title,
  placeholder,
}: {
  register: UseFormRegister<BodyType>;
  watch: UseFormWatch<BodyType>;
  valuesState: string[];
  setValuesState: Dispatch<SetStateAction<string[]>>;
  setValue: UseFormSetValue<BodyType>;
  registerName: keyof BodyType;
  title: string;
  placeholder: string;
}) => {
  const handleModifyTypeBtn = (type: 'submit' | 'button') => {
    const btn = document.querySelector('#add-product') as HTMLButtonElement; // eslint-disable-line
    btn.type = type;
  };

  const handleAddOptions = () => {
    if (watch(registerName)) {
      setValuesState(state => [
        ...state,
        upperFirst(watch(registerName)?.toString().toLowerCase()!),
      ]);
      setTimeout(() => {
        setValue(registerName, '');
      }, 0);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex items-end gap-3">
        <div className="flex flex-col gap-1 w-1/2">
          <label
            htmlFor={registerName}
            className=" text-3d3d3d text-sm font-medium"
          >
            {title}
          </label>
          <input
            type="text"
            id={registerName}
            placeholder={placeholder}
            className={`p-3 rounded-lg text-3d3d3d font-normal border border-solid text-sm border-3d3d3d`} // eslint-disale-line
            {...register(registerName, {
              onBlur() {
                handleModifyTypeBtn('submit');
              },
            })}
            onFocus={() => {
              handleModifyTypeBtn('button');
            }}
            onKeyDown={event => event.key === 'Enter' && handleAddOptions()}
          />
        </div>
        <button
          type="button"
          className="hover:scale-105 duration-200 transition-transform bg-blue-500 p-2 text-primary font-normal text-[13px] rounded flex items-center justify-center mb-1"
          onClick={handleAddOptions}
        >
          Adcionar
        </button>
        {valuesState.length ? (
          <button
            type="button"
            className="hover:scale-105 duration-200 transition-transform bg-red-500 p-2 text-primary font-normal text-[13px] rounded flex items-center justify-center mb-1"
            onClick={() => setValuesState(state => state.slice(0, -1))}
          >
            Remover
          </button>
        ) : null}
      </div>
      {valuesState.length ? (
        <p className="text-3d3d3d text-xs mt-1  font-normal">
          {'['} {valuesState.join(', ')} {']'}
        </p>
      ) : null}
    </div>
  );
};

const ErrorMsg = ({ msg }: { msg?: string }) => {
  return (
    <span className="-mt-[2px] text-xs font-normal text-red-600">{msg}</span>
  );
};
