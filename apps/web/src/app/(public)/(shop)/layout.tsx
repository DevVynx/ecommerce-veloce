import { Suspense } from "react";

import { Header } from "@/shared/components/Store/Header/Header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      {children}
    </>
  );
}
