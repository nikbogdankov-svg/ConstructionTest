"use client";

import * as React from "react";
import {
  Bell, Calendar, Check, ChevronDown, Copy, FileText, FolderOpen, Inbox, LogOut, MoreVertical, Pencil, Pin, Settings, Share2, Trash2,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Markdown } from "@/components/ui/markdown";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { SortableTableHead, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, type SortState } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Code, Heading, Text } from "@/components/ui/typography";
import { Demo, Section, ThemePanels } from "./showcase";

const TONES = ["neutral", "primary", "accent", "success", "warning", "danger", "info", "outline", "solid"] as const;

const MARKDOWN_SAMPLE = `The basement walls are **C32/40, exposure class XD3**, with a crystalline waterproofing admixture.

- Max water/cement ratio: **0.45**
- Minimum cover: \`45 mm\`

> Change order CO-004 supersedes the original C30/37.`;

export function DisplayShowcase() {
  const [tags, setTags] = React.useState(["Concrete", "Facade", "MEP"]);
  const [selected, setSelected] = React.useState<string[]>(["Specifications"]);
  const [page, setPage] = React.useState(4);
  const [sort, setSort] = React.useState<{ key: string; dir: SortState }>({ key: "date", dir: "desc" });
  const sortOf = (k: string): SortState => (sort.key === k ? sort.dir : false);
  const onSort = (k: string) => setSort((s) => ({ key: k, dir: s.key === k && s.dir === "asc" ? "desc" : "asc" }));

  return (
    <>
      <Section id="badge" title="Badge & Tag" description="Badge = static status. Tag = chip the user can toggle or remove (min 40px tall).">
        <ThemePanels>
          <Demo label="Badge tones">
            {TONES.map((t) => <Badge key={t} tone={t}>{t}</Badge>)}
          </Demo>
          <Demo label="Badge sizes · with dot · with icon">
            <Badge size="sm" tone="primary">Small</Badge>
            <Badge size="md" tone="primary">Medium</Badge>
            <Badge tone="success" dot>Active</Badge>
            <Badge tone="warning" dot>On hold</Badge>
            <Badge tone="info"><Calendar aria-hidden />Due 18 Nov</Badge>
          </Demo>
          <Demo label="Tag · toggle (aria-pressed) · removable · static · disabled · small">
            {["Specifications", "RFIs", "Site diaries"].map((t) => (
              <Tag key={t} selected={selected.includes(t)} onClick={() => setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))}>
                {t}
              </Tag>
            ))}
            {tags.map((t) => (
              <Tag key={t} onRemove={() => setTags((s) => s.filter((x) => x !== t))}>{t}</Tag>
            ))}
            <Tag icon={<FileText />}>Static</Tag>
            <Tag disabled onClick={() => {}}>Disabled</Tag>
            <Tag size="sm" onClick={() => {}}>Small</Tag>
          </Demo>
        </ThemePanels>
      </Section>

      <Section id="avatar" title="Avatar" description="Circles are people, squares are projects or companies. Initials fallback, no remote images.">
        <ThemePanels>
          <Demo label="Sizes" className="items-end">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => <Avatar key={s} size={s} name="Dana Whitlock" />)}
          </Demo>
          <Demo label="Tones · square · group">
            <Avatar name="Priya Nandakumar" tone="primary" />
            <Avatar name="Mateus Ferreira" tone="accent" />
            <Avatar name="Lena Okafor" tone="info" />
            <Avatar name="Rui Tanaka" tone="neutral" />
            <Avatar name="Aldermoor Court" initials="ALD" shape="square" size="lg" />
            <AvatarGroup max={3}>
              <Avatar name="Dana Whitlock" />
              <Avatar name="Priya Nandakumar" tone="accent" />
              <Avatar name="Lena Okafor" tone="info" />
              <Avatar name="Rui Tanaka" tone="neutral" />
              <Avatar name="Hugo Calder" />
            </AvatarGroup>
          </Demo>
        </ThemePanels>
      </Section>

      <Section id="card" title="Card" description="Default, raised, sunken, outline. Interactive cards are links with a hover and focus state.">
        <ThemePanels>
          <div className="grid gap-4 md:grid-cols-2">
            {(["default", "raised", "sunken", "outline"] as const).map((v) => (
              <Card key={v} variant={v}>
                <CardHeader>
                  <CardTitle>{v[0].toUpperCase() + v.slice(1)} card</CardTitle>
                  <CardDescription>Updated 2 days ago</CardDescription>
                </CardHeader>
                <CardContent>Facade mock-up approval is due on 21 Nov 2026.</CardContent>
                <CardFooter>
                  <Button size="sm" variant="secondary">Open</Button>
                  <Button size="sm" variant="ghost">Dismiss</Button>
                </CardFooter>
              </Card>
            ))}
            <Card interactive tabIndex={0} role="link" aria-label="Interactive card example">
              <CardHeader>
                <CardTitle>Interactive card</CardTitle>
                <CardDescription>Hover, press or tab to me.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </ThemePanels>
      </Section>

      <Section id="overlays" title="Dialog, AlertDialog, Sheet, Popover, Tooltip, Dropdown menu" description="Overlays render in a portal and follow the global theme toggle (top right). All are focus-trapped or roving, close on Escape and return focus to the trigger.">
        <ThemePanels>
          <Demo label="Triggers">
            <Dialog>
              <DialogTrigger asChild><Button variant="secondary">Open dialog</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit memory</DialogTitle>
                  <DialogDescription>Plumb uses this fact when answering questions about Aldermoor Court.</DialogDescription>
                </DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                  <FormField label="Fact" required><Textarea defaultValue="Level 4 slab pour moved to 18 Nov 2026." /></FormField>
                </DialogBody>
                <DialogFooter>
                  <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                  <DialogClose asChild><Button onClick={() => toast.success("Memory updated")}>Save changes</Button></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="danger"><Trash2 aria-hidden />Delete…</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this memory?</AlertDialogTitle>
                  <AlertDialogDescription>Plumb will stop using it in answers. You can&apos;t undo this.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep it</AlertDialogCancel>
                  <AlertDialogAction onClick={() => toast("Memory deleted")}>Delete memory</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {(["right", "left", "bottom"] as const).map((side) => (
              <Sheet key={side}>
                <SheetTrigger asChild><Button variant="secondary">Sheet · {side}</Button></SheetTrigger>
                <SheetContent side={side} size={side === "right" ? "lg" : "md"}>
                  <SheetHeader>
                    <SheetTitle>Side panel</SheetTitle>
                    <SheetDescription>Opens from the {side}. Full width on phones.</SheetDescription>
                  </SheetHeader>
                  <SheetBody>
                    <SkeletonText lines={6} />
                  </SheetBody>
                  <SheetFooter><Button>Primary action</Button></SheetFooter>
                </SheetContent>
              </Sheet>
            ))}

            <Popover>
              <PopoverTrigger asChild><Button variant="secondary">Popover<ChevronDown aria-hidden /></Button></PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-3">
                  <p className="text-label">Share this answer</p>
                  <Input defaultValue="https://plumb.example/a/8f2c" aria-label="Link" readOnly />
                  <Button size="sm"><Copy aria-hidden />Copy link</Button>
                </div>
              </PopoverContent>
            </Popover>

            <SimpleTooltip content="Tooltips explain icon-only controls">
              <Button variant="secondary">Hover or focus me</Button>
            </SimpleTooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton variant="secondary" label="More actions" tooltip={false}><MoreVertical aria-hidden /></IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Memory</DropdownMenuLabel>
                <DropdownMenuItem><Pencil aria-hidden />Edit<DropdownMenuShortcut>E</DropdownMenuShortcut></DropdownMenuItem>
                <DropdownMenuItem><Pin aria-hidden />Pin<DropdownMenuShortcut>P</DropdownMenuShortcut></DropdownMenuItem>
                <DropdownMenuCheckboxItem checked>Show in answers</DropdownMenuCheckboxItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger><Share2 aria-hidden />Share</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Copy link</DropdownMenuItem>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem disabled><Settings aria-hidden />Settings (disabled)</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="danger"><Trash2 aria-hidden />Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Demo>
        </ThemePanels>
      </Section>

      <Section id="tabs" title="Tabs" description="Line tabs for sections of a page; segmented for switching a view. Arrow keys move between tabs.">
        <ThemePanels>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="decisions">Decisions</TabsTrigger>
              <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
              <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
            </TabsList>
            <TabsContent value="all">All facts</TabsContent>
            <TabsContent value="decisions">Decisions only</TabsContent>
            <TabsContent value="deadlines">Deadlines only</TabsContent>
          </Tabs>
          <Tabs defaultValue="table">
            <TabsList variant="segmented" aria-label="View">
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>
          </Tabs>
        </ThemePanels>
      </Section>

      <Section id="table" title="Table" description="Sortable headers are real buttons with aria-sort. Wide tables scroll inside their frame. Use cards below md.">
        <ThemePanels>
          <Table>
            <TableCaption>Recent documents · click a header to sort</TableCaption>
            <TableHeader>
              <TableRow>
                <SortableTableHead sorted={sortOf("title")} onSort={() => onSort("title")}>Title</SortableTableHead>
                <SortableTableHead sorted={sortOf("type")} onSort={() => onSort("type")}>Type</SortableTableHead>
                <SortableTableHead sorted={sortOf("date")} onSort={() => onSort("date")}>Date</SortableTableHead>
                <TableHead className="text-right">Pages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow><TableCell className="font-bold">Concrete specification</TableCell><TableCell><Badge size="sm" tone="primary">Specification</Badge></TableCell><TableCell>12 Sep 2025</TableCell><TableCell className="text-right font-mono">6</TableCell></TableRow>
              <TableRow interactive><TableCell className="font-bold">RFI 017 — water/cement ratio (interactive row)</TableCell><TableCell><Badge size="sm" tone="info">RFI</Badge></TableCell><TableCell>3 Feb 2026</TableCell><TableCell className="text-right font-mono">2</TableCell></TableRow>
              <TableRow selected><TableCell className="font-bold">Change order 004 (selected row)</TableCell><TableCell><Badge size="sm" tone="warning">Change order</Badge></TableCell><TableCell>14 Mar 2026</TableCell><TableCell className="text-right font-mono">3</TableCell></TableRow>
            </TableBody>
          </Table>
        </ThemePanels>
      </Section>

      <Section id="feedback" title="Alert, Toast, Progress, Spinner, Skeleton" description="Alerts sit in the page; toasts confirm something the user just did. Never use colour alone — every tone has an icon.">
        <ThemePanels>
          <div className="flex flex-col gap-3">
            <Alert tone="info" title="Answers use documents up to 6 Nov">Newer uploads are still being read.</Alert>
            <Alert tone="success" title="Memory saved" onDismiss={() => {}} />
            <Alert tone="warning" title="This answer cites a superseded spec" action={<Button size="sm" variant="secondary">View change order</Button>}>
              CO-004 changed the concrete class on 14 Mar 2026.
            </Alert>
            <Alert tone="danger" title="Couldn't load documents" action={<Button size="sm" variant="secondary">Try again</Button>}>
              Check your connection and try again.
            </Alert>
            <Alert tone="neutral">Neutral message without a title.</Alert>
            <Alert tone="warning" layout="banner" title="You're offline. Answers may be out of date." />
          </div>
          <Demo label="Toast (click)">
            <Button variant="secondary" onClick={() => toast("Link copied")}>Default</Button>
            <Button variant="secondary" onClick={() => toast.success("Memory pinned", { description: "It now shows at the top of the list." })}>Success</Button>
            <Button variant="secondary" onClick={() => toast.warning("Slow connection", { description: "Answers may take longer." })}>Warning</Button>
            <Button variant="secondary" onClick={() => toast.error("Couldn't delete memory", { action: { label: "Retry", onClick: () => {} } })}>Error + action</Button>
            <Button variant="secondary" onClick={() => toast.info("New documents were added")}>Info</Button>
            <Button variant="secondary" onClick={() => toast("Memory deleted", { action: { label: "Undo", onClick: () => toast.success("Restored") } })}>Undo pattern</Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast.promise(new Promise((r) => setTimeout(r, 1500)), { loading: "Saving…", success: "Saved", error: "Couldn't save" })
              }
            >
              Promise
            </Button>
          </Demo>
          <div className="grid gap-4 md:grid-cols-2">
            <Progress label="Reading documents" value={64} showValue />
            <Progress label="Indeterminate" />
            <Progress value={30} tone="accent" size="lg" label="Large · accent" />
            <Progress value={100} tone="success" size="sm" label="Small · success" showValue />
          </div>
          <Demo label="Spinner sizes · tones" className="items-end">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => <Spinner key={s} size={s} tone="primary" />)}
            <Spinner tone="muted" />
          </Demo>
          <div className="flex items-start gap-4 rounded-md border-2 border-border bg-surface p-4">
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <div className="flex-1"><SkeletonText lines={3} /></div>
          </div>
        </ThemePanels>
      </Section>

      <Section id="empty-state" title="EmptyState" description="For empty lists, first-run, not found and errors. Always say what happened and what to do next.">
        <ThemePanels>
          <div className="grid gap-4 md:grid-cols-2">
            <EmptyState framed icon={<Inbox />} title="No memories yet" description="Pin a fact from any answer and it will show up here." actions={<Button>Ask a question</Button>} headingLevel="h3" />
            <EmptyState framed tone="danger" icon={<FolderOpen />} title="Couldn't load documents" description="Check your connection and try again." actions={<Button variant="secondary">Try again</Button>} headingLevel="h3" />
            <EmptyState framed size="sm" icon={<Bell />} title="Small" description="For panels and side sheets." headingLevel="h3" />
            <EmptyState size="sm" icon={<Check />} title="Unframed" description="Inside a card." headingLevel="h3" />
          </div>
        </ThemePanels>
      </Section>

      <Section id="navigation" title="Breadcrumbs, Pagination, PageHeader" description="">
        <ThemePanels>
          <Breadcrumbs items={[{ label: "Projects", href: "/projects" }, { label: "Aldermoor Court", href: "/projects/prj-aldermoor/documents" }, { label: "Documents" }]} />
          <Pagination page={page} pageCount={12} onPageChange={setPage} />
          <Pagination page={page} pageCount={12} onPageChange={setPage} compact />
          <PageHeader
            eyebrow="ALD"
            title="Page header"
            description="Title block with eyebrow, description, actions and the measuring-tape rule."
            actions={<><Button variant="secondary">Secondary</Button><Button>Primary</Button></>}
          />
        </ThemePanels>
      </Section>

      <Section id="misc" title="Separator, ScrollArea, Kbd, Accordion, Command" description="">
        <ThemePanels>
          <Demo label="Separator: solid · strong · ticks" className="flex-col items-stretch">
            <Separator />
            <Separator variant="strong" />
            <Separator variant="ticks" />
            <div className="flex h-8 items-center gap-3">Left<Separator orientation="vertical" />Right</div>
          </Demo>
          <Demo label="ScrollArea">
            <ScrollArea className="h-40 w-full max-w-md rounded-md border-2 border-border bg-surface">
              <ul className="p-4">
                {Array.from({ length: 20 }, (_, i) => <li key={i} className="py-1 text-body-sm">Site diary entry {i + 1}</li>)}
              </ul>
            </ScrollArea>
          </Demo>
          <Demo label="Kbd">
            <span className="flex items-center gap-1 text-body-sm">Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to search, <Kbd>Enter</Kbd> to send, <Kbd>Esc</Kbd> to close.</span>
          </Demo>
          <Accordion type="single" collapsible className="max-w-xl">
            <AccordionItem value="a"><AccordionTrigger>Decisions (3)</AccordionTrigger><AccordionContent>Grouped content goes here.</AccordionContent></AccordionItem>
            <AccordionItem value="b"><AccordionTrigger>Deadlines (2)</AccordionTrigger><AccordionContent>More content.</AccordionContent></AccordionItem>
            <AccordionItem value="c" disabled><AccordionTrigger>Contacts (disabled)</AccordionTrigger><AccordionContent>—</AccordionContent></AccordionItem>
          </Accordion>
          <Command className="max-w-md rounded-md border-2 border-border-strong bg-surface-raised">
            <CommandInput placeholder="Jump to…" />
            <CommandList>
              <CommandEmpty>Nothing matches.</CommandEmpty>
              <CommandGroup heading="Sections">
                <CommandItem><FileText aria-hidden />Documents</CommandItem>
                <CommandItem><Pin aria-hidden />Memory</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Account">
                <CommandItem><LogOut aria-hidden />Sign out</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </ThemePanels>
      </Section>

      <Section id="text" title="Typography components & Markdown" description="Heading, Text and Code components; Markdown renders answer-style content with brand styles.">
        <ThemePanels>
          <div className="flex flex-col gap-2">
            <Heading size="h1" as="p">Heading h1</Heading>
            <Heading size="h3" as="p">Heading h3</Heading>
            <Text tone="muted">Muted body text. <Code>ALD-SPEC-0310</Code></Text>
            <Text size="sm" tone="subtle">Small subtle text</Text>
            <Text size="overline" tone="primary">Overline</Text>
          </div>
          <Markdown className="max-w-prose rounded-md border-2 border-border bg-surface p-4">{MARKDOWN_SAMPLE}</Markdown>
        </ThemePanels>
      </Section>
    </>
  );
}
