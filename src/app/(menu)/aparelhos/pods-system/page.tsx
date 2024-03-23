import SubCategory2 from '@/components/menu/category/subCategory2';

export default async function Page() {
  return (
    <SubCategory2
      categoryLink={{
        url: '/aparelhos',
        title: 'Aparelhos',
      }}
      subCategory2Title="Pods system"
    />
  );
}
