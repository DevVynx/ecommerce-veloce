import { Header } from "@/shared/components/store/Header/Header";

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
