'use client';

import { ReactNode } from "react";
import { AppShell } from "./app-shell";
import PlasmicLoaderComponent from '@/components/plasmic/PlasmicLoader';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return <AppShell>{children}</AppShell>;
};

export default AppLayout;

// Add Plasmic loader to the root of your app
export function PlasmicRootProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <PlasmicLoaderComponent />
      {children}
    </>
  );
}
