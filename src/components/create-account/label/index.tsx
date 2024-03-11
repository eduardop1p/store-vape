'use client';

import { Dispatch, SetStateAction } from 'react';
import { UseFormTrigger, UseFormSetValue } from 'react-hook-form';

interface Props {
  title: string;
  id: string;
  optional?: boolean;
  registerName: string;
  checkedSN: boolean;
  setValue?: UseFormSetValue<any>;
  trigger?: UseFormTrigger<any>;
  setCheckedSN: Dispatch<SetStateAction<boolean>>;
}

export default function Label({
  title,
  id,
  optional,
  registerName,
  checkedSN,
  setValue,
  trigger,
  setCheckedSN,
}: Props) {
  return registerName === 'nAddress' ? (
    <div className="flex items-center gap-3">
      <label className="ml-1 text-sm font-medium text-secudary" htmlFor={id}>
        {title}{' '}
        {!optional && (
          <small className="text-sm font-medium text-red-600">*</small>
        )}
      </label>
      <div className="flex items-center gap-[6px]">
        <input
          type="radio"
          checked={checkedSN}
          className="cursor-pointer"
          onChange={() => {
            return '';
          }}
          onClick={() => {
            if (!setValue || !trigger) return;
            if (!checkedSN) {
              setValue('nAddress', 'S/N');
              setCheckedSN(true);
            } else {
              setValue('nAddress', '');
              setCheckedSN(false);
            }
            trigger('nAddress');
          }}
        />
        <span className="text-secudary text-sm">S/N</span>
      </div>
    </div>
  ) : (
    <label className="ml-1 text-sm font-medium text-secudary" htmlFor={id}>
      {title}{' '}
      {!optional && (
        <small className="text-sm font-medium text-red-600">*</small>
      )}
    </label>
  );
}
