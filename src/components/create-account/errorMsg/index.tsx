'use client';

import { FieldErrors } from 'react-hook-form';

export default function ErrorMsg({
  errors,
  registerName,
}: {
  errors: FieldErrors<any>;
  registerName: string;
}) {
  return (
    errors[registerName] && (
      <div className="ml-1 text-xs font-medium text-red-600 leading-4">
        {errors[registerName]?.message?.toString()}
      </div>
    )
  );
}
