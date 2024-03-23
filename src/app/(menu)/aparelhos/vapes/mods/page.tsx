import SubCategory3 from '@/components/menu/category/subCategory3';

export default async function Page() {
  return (
    <SubCategory3
      categoryLink={{
        url: '/aparelhos',
        title: 'Aparelhos',
      }}
      subCategory2Link={{
        url: '/aparelhos/vapes',
        title: 'Vapes',
      }}
      subCategory3Title="Mods"
    />
  );
}
