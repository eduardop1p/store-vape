import Main from '@/components/main';
import Container90 from '@/components/container90';
import FormCreateAcount from '@/components/create-account';

export default function Page() {
  return (
    <Main>
      <Container90 className="gap-5">
        <h1 className="text-secudary font-medium text-3xl">
          Cadastro de novo cliente
        </h1>
        <FormCreateAcount />
      </Container90>
    </Main>
  );
}
