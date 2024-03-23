import SubCategory2 from '@/components/menu/category/subCategory2';

export default async function Page() {
  return (
    <SubCategory2
      categoryLink={{
        url: '/acessorios',
        title: 'Acessórios',
      }}
      subCategory2Title="Algodão para vape"
    />
  );
}
