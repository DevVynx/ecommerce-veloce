import { Header } from "@/shared/components/store/Header/Header";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
