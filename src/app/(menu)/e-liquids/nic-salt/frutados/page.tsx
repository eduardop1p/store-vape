import SubCategory3 from '@/components/menu/category/subCategory3';

export default async function Page() {
  return (
    <SubCategory3
      categoryLink={{
        url: '/e-liquids',
        title: 'E-liquids',
      }}
      subCategory2Link={{
        url: '/e-liquids/nic-salt',
        title: 'Nic salt',
      }}
      subCategory3Title="Frutados"
    />
  );
}
