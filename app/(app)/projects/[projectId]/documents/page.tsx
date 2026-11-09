import type { Metadata } from "next";
import { Suspense } from "react";
import { DocumentsLibrary } from "@/features/documents/documents-library";
import { DocumentsLoading } from "@/features/documents/documents-loading";

export const metadata: Metadata = { title: "Documents" };

/** Route files stay thin: read params, render the feature component. */
export default async function DocumentsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return (
    <Suspense fallback={<DocumentsLoading />}>
      <DocumentsLibrary projectId={projectId} />
    </Suspense>
  );
}
