import SubCategory2 from '@/components/menu/category/subCategory2';

export default async function Page() {
  return (
    <SubCategory2
      categoryLink={{
        url: '/pod-descartavel',
        title: 'Pod descartável',
      }}
      subCategory2Title="Pod descartável 2500 a 5000 puffs"
    />
  );
}
