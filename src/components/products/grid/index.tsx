import { VapeType } from '@/app/api/models/vape';
import Product from '../product';

export default function ProductsGrid({ vapeData }: { vapeData: VapeType[] }) {
  return (
    <div className="mt-12 grid grid-cols-4 gap-8">
      {vapeData.map((val, i) => (
        <Product key={i} product={val} />
      ))}
    </div>
  );
}
