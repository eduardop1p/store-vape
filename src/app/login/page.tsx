import Main from '@/components/main';
import Container90 from '@/components/container90';
import FormLogin from '@/components/login';

export default function Page() {
  return (
    <Main>
      <Container90 className="gap-5 items-center">
        <h1 className="text-secudary font-medium text-3xl">Cliente login</h1>
        <FormLogin />
      </Container90>
    </Main>
  );
}
