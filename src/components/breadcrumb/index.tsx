import Breadcrumbs from '@mui/material/Breadcrumbs';
import Stack from '@mui/material/Stack';
import { ReactNode } from 'react';
import { GrNext } from 'react-icons/gr';

export default function CustomSeparator({ children }: { children: ReactNode }) {
  return (
    <Stack spacing={1}>
      <Breadcrumbs
        separator={
          <GrNext
            style={{
              color: '#ccba00',
              fill: '#ccba00',
            }}
            size={12}
          />
        }
      >
        {children}
      </Breadcrumbs>
    </Stack>
  );
}
