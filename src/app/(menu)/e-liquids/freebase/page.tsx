import SubCategory2 from '@/components/menu/category/subCategory2';

export default async function Page() {
  return (
    <SubCategory2
      categoryLink={{
        url: '/e-liquids',
        title: 'E-liquids',
      }}
      subCategory2Title="Freebase"
    />
  );
}
