"use client";

import { ChevronDown, LogOut, RotateCcw, UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useMockQuery } from "@/lib/hooks/use-mock-query";
import { getCurrentUser, resetMemoryStore } from "@/lib/mock/api";

export function UserMenu() {
  const user = useMockQuery((signal) => getCurrentUser({ signal }), []);

  if (user.status === "loading") return <Skeleton className="size-10 rounded-full" />;
  if (user.status === "error") return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex min-h-control-md items-center gap-2 rounded-sm px-1.5 hover:bg-surface-hover focus-visible:focus-ring">
        <Avatar name={user.data.name} initials={user.data.initials} size="md" />
        <span className="hidden flex-col items-start leading-tight xl:flex">
          <span className="text-label">{user.data.name}</span>
          <span className="text-caption text-foreground-subtle">{user.data.role}</span>
        </span>
        <ChevronDown className="hidden size-icon-sm text-foreground-muted xl:block" aria-hidden />
        <span className="sr-only xl:hidden">Account menu for {user.data.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-64">
        <DropdownMenuLabel className="normal-case">
          <span className="block text-label text-foreground">{user.data.name}</span>
          <span className="block text-caption font-normal tracking-normal text-foreground-subtle">{user.data.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <UserRound aria-hidden /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            resetMemoryStore();
            toast.success("Demo data reset", { description: "Memory facts are back to their original state." });
          }}
        >
          <RotateCcw aria-hidden /> Reset demo data
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => toast("Signing out isn't available in the demo.")}>
          <LogOut aria-hidden /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
