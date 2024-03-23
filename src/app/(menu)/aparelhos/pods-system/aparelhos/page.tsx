import SubCategory3 from '@/components/menu/category/subCategory3';

export default async function Page() {
  return (
    <SubCategory3
      categoryLink={{
        url: '/aparelhos',
        title: 'Aparelhos',
      }}
      subCategory2Link={{
        url: '/aparelhos/pods-system',
        title: 'Pods system',
      }}
      subCategory3Title="Aparelhos"
    />
  );
}
