import {
  CalendarRange,
  ClipboardCheck,
  FilePen,
  FileSpreadsheet,
  FileText,
  MessageCircleQuestion,
  NotebookPen,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { BadgeProps } from "@/components/ui/badge";
import type { DocumentType, Trade } from "@/lib/mock/types";

/** Display metadata for document types. Reuse this everywhere a type is shown (filters, viewer, chips). */
export const DOCUMENT_TYPE_META: Record<DocumentType, { label: string; plural: string; icon: LucideIcon; tone: NonNullable<BadgeProps["tone"]> }> = {
  specification: { label: "Specification", plural: "Specifications", icon: FileText, tone: "primary" },
  "site-diary": { label: "Site diary", plural: "Site diaries", icon: NotebookPen, tone: "neutral" },
  "meeting-minutes": { label: "Meeting minutes", plural: "Meeting minutes", icon: UsersRound, tone: "neutral" },
  "change-order": { label: "Change order", plural: "Change orders", icon: FilePen, tone: "warning" },
  rfi: { label: "RFI", plural: "RFIs", icon: MessageCircleQuestion, tone: "info" },
  "data-sheet": { label: "Data sheet", plural: "Data sheets", icon: FileSpreadsheet, tone: "outline" },
  "inspection-report": { label: "Inspection report", plural: "Inspection reports", icon: ClipboardCheck, tone: "success" },
  schedule: { label: "Schedule", plural: "Schedules", icon: CalendarRange, tone: "accent" },
};

export const TRADE_LABELS: Record<Trade, string> = {
  general: "General",
  groundworks: "Groundworks",
  concrete: "Concrete",
  structure: "Structure",
  facade: "Facade",
  windows: "Windows",
  mep: "MEP",
  roofing: "Roofing",
  finishes: "Finishes",
};
