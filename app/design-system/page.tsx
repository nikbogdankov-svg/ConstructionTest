import type { Metadata } from "next";
import { DesignSystemPage } from "./_components/design-system-page";

export const metadata: Metadata = { title: "Design system" };

export default function Page() {
  return <DesignSystemPage />;
}
