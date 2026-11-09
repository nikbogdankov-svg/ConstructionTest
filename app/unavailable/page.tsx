import type { Metadata } from "next";
import { SystemUnavailable } from "@/components/patterns/system-unavailable";

export const metadata: Metadata = { title: "Unavailable" };

export default function UnavailablePage() {
  return <SystemUnavailable />;
}
