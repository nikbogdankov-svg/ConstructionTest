"use client";

import * as React from "react";
import { ArrowRight, Download, MessageSquareText, Pin, Plus, Search, Send, Trash2, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { IconButton, iconButtonVariants } from "@/components/ui/icon-button";
import { Input, inputVariants } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";
import { Demo, Labeled, Section, ThemePanels, forceState } from "./showcase";

const BUTTON_VARIANTS = ["primary", "accent", "secondary", "subtle", "ghost", "danger", "link"] as const;
const ICON_VARIANTS = ["primary", "accent", "secondary", "ghost", "danger"] as const;
const TRADES = [
  { value: "concrete", label: "Concrete" },
  { value: "facade", label: "Facade" },
  { value: "windows", label: "Windows" },
  { value: "mep", label: "MEP", description: "Mechanical, electrical, plumbing" },
  { value: "groundworks", label: "Groundworks" },
  { value: "roofing", label: "Roofing", disabled: true },
];

export function InputsShowcase() {
  const [trade, setTrade] = React.useState<string | null>("concrete");
  const [checked, setChecked] = React.useState<boolean | "indeterminate">("indeterminate");
  return (
    <>
      <Section id="button" title="Button" description="One primary per screen. Accent (lime) is reserved for the single most important on-site action. Destructive actions use danger and are confirmed.">
        <ThemePanels>
          <Demo label="Variants">
            {BUTTON_VARIANTS.map((v) => (
              <Button key={v} variant={v}>
                {v === "link" ? "View source" : v[0].toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </Demo>
          <Demo label="Sizes · sm 40 / md 48 / lg 56" className="items-end">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Demo>
          <Demo label="With icons · full width">
            <Button>
              <Plus aria-hidden /> New fact
            </Button>
            <Button variant="secondary">
              <Download aria-hidden /> Export
            </Button>
            <Button variant="accent">
              Ask Plumb <Send aria-hidden />
            </Button>
            <Button variant="ghost">
              Continue <ArrowRight aria-hidden />
            </Button>
            <div className="w-full max-w-sm">
              <Button fullWidth size="lg">
                Full width
              </Button>
            </div>
          </Demo>
          <div className="overflow-x-auto">
            <table className="w-full min-w-176 border-separate border-spacing-2 text-left">
              <thead>
                <tr className="text-overline uppercase text-foreground-subtle">
                  <th>Variant</th><th>Default</th><th>Hover</th><th>Active</th><th>Focus-visible</th><th>Disabled</th><th>Loading</th>
                </tr>
              </thead>
              <tbody>
                {BUTTON_VARIANTS.map((v) => {
                  const base = buttonVariants({ variant: v });
                  return (
                    <tr key={v}>
                      <td className="font-mono text-caption text-foreground-muted">{v}</td>
                      <td><Button variant={v}>Save</Button></td>
                      <td><Button variant={v} className={forceState(base, "hover")} tabIndex={-1}>Save</Button></td>
                      <td><Button variant={v} className={forceState(base, "active")} tabIndex={-1}>Save</Button></td>
                      <td><Button variant={v} className={forceState(base, "focus")} tabIndex={-1}>Save</Button></td>
                      <td><Button variant={v} disabled>Save</Button></td>
                      <td><Button variant={v} loading loadingText="Saving…">Save</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ThemePanels>
      </Section>

      <Section id="icon-button" title="IconButton" description="Square, same heights as Button. `label` is required: it becomes the aria-label and the tooltip.">
        <ThemePanels>
          <Demo label="Variants">
            {ICON_VARIANTS.map((v) => (
              <Labeled key={v} label={v}>
                <IconButton variant={v} label={v === "danger" ? "Delete" : "Pin"}>
                  {v === "danger" ? <Trash2 aria-hidden /> : <Pin aria-hidden />}
                </IconButton>
              </Labeled>
            ))}
            <Labeled label="round">
              <IconButton variant="primary" shape="round" label="Send">
                <Send aria-hidden />
              </IconButton>
            </Labeled>
          </Demo>
          <Demo label="Sizes" className="items-end">
            <IconButton variant="secondary" size="sm" label="Search"><Search aria-hidden /></IconButton>
            <IconButton variant="secondary" size="md" label="Search"><Search aria-hidden /></IconButton>
            <IconButton variant="secondary" size="lg" label="Search"><Search aria-hidden /></IconButton>
          </Demo>
          <Demo label="States (secondary): default · hover · active · focus · disabled · loading">
            {(["default", "hover", "active", "focus"] as const).map((s) => (
              <IconButton
                key={s}
                variant="secondary"
                label={s}
                tooltip={false}
                tabIndex={s === "default" ? 0 : -1}
                className={s === "default" ? "" : forceState(iconButtonVariants({ variant: "secondary" }), s)}
              >
                <MessageSquareText aria-hidden />
              </IconButton>
            ))}
            <IconButton variant="secondary" label="Disabled" disabled><MessageSquareText aria-hidden /></IconButton>
            <IconButton variant="secondary" label="Loading" loading><MessageSquareText aria-hidden /></IconButton>
          </Demo>
        </ThemePanels>
      </Section>

      <Section id="input" title="Input & Textarea" description="2px borders, 48px tall, placeholder text passes AA. Errors always come with text, never colour alone.">
        <ThemePanels>
          <Demo label="Sizes" className="grid gap-3 md:grid-cols-3">
            <Input size="sm" placeholder="Small · 40px" aria-label="Small input" />
            <Input size="md" placeholder="Medium · 48px" aria-label="Medium input" />
            <Input size="lg" placeholder="Large · 56px" aria-label="Large input" />
          </Demo>
          <Demo label="States: default · hover · focus · invalid · disabled · read-only" className="grid gap-3 md:grid-cols-3">
            <Input placeholder="Default" aria-label="Default" />
            <Input placeholder="Hover" aria-label="Hover" tabIndex={-1} className={forceState(inputVariants(), "hover")} />
            <Input placeholder="Focus-visible" aria-label="Focus" tabIndex={-1} className={forceState(inputVariants(), "focus")} />
            <Input defaultValue="C30/37" aria-label="Invalid" aria-invalid />
            <Input defaultValue="Disabled" aria-label="Disabled" disabled />
            <Input defaultValue="ALD-SPEC-0310" aria-label="Read-only" readOnly />
          </Demo>
          <Demo label="With icon / trailing element" className="grid gap-3 md:grid-cols-2">
            <Input leadingIcon={<Search />} placeholder="Search documents" aria-label="Search documents" type="search" />
            <Input
              leadingIcon={<Search />}
              defaultValue="basement waterproofing"
              aria-label="Search with clear"
              trailing={<IconButton size="sm" label="Clear search" tooltip={false}><X aria-hidden /></IconButton>}
            />
            <Input type="date" aria-label="Date" defaultValue="2026-11-18" />
            <Input type="number" aria-label="Slab thickness" defaultValue={250} trailing={<span className="pr-3 text-body-sm">mm</span>} />
          </Demo>
          <Demo label="Textarea · default · auto-resize · invalid · disabled" className="grid gap-3 md:grid-cols-2">
            <Textarea placeholder="Describe what changed on site…" aria-label="Notes" />
            <Textarea autoResize rows={1} placeholder="Auto-resizes up to 10 rows — type several lines" aria-label="Auto resize" />
            <Textarea aria-label="Invalid" aria-invalid defaultValue="Too short" />
            <Textarea aria-label="Disabled" disabled defaultValue="Locked after sign-off" />
          </Demo>
        </ThemePanels>
      </Section>

      <Section id="form-field" title="Label & FormField" description="FormField wires label, hint and error to the control (id, aria-describedby, aria-invalid) automatically.">
        <ThemePanels>
          <div className="grid gap-6 md:grid-cols-2">
            <FormField label="Fact" hint="One sentence. Plumb will remember it for this project." required>
              <Input placeholder="Level 4 slab pour moved to 18 Nov" />
            </FormField>
            <FormField label="Concrete class" error="Use the EN 206 format, for example C32/40.">
              <Input defaultValue="C32-40" />
            </FormField>
            <FormField label="Notes" optional hint="Visible to the whole project team.">
              <Textarea />
            </FormField>
            <FormField label="Category" disabled hint="Locked while syncing.">
              <Select defaultValue="decision">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="decision">Decision</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <Demo label="Label: default · required · optional · disabled">
            <Label>Project</Label>
            <Label required>Due date</Label>
            <Label optional>Notes</Label>
            <Label disabled>Archived</Label>
          </Demo>
        </ThemePanels>
      </Section>

      <Section id="select" title="Select & Combobox" description="Select for short fixed lists; Combobox when the list is long enough to need typing.">
        <ThemePanels>
          <div className="grid gap-6 md:grid-cols-3">
            <FormField label="Category">
              <Select defaultValue="deadline">
                <SelectTrigger><SelectValue placeholder="Choose a category" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Memory</SelectLabel>
                    <SelectItem value="decision">Decision</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="change">Change</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectItem value="other" disabled>Other (disabled)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Placeholder">
              <Select>
                <SelectTrigger><SelectValue placeholder="Choose a trade" /></SelectTrigger>
                <SelectContent>
                  {TRADES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Invalid" error="Pick a trade.">
              <Select>
                <SelectTrigger><SelectValue placeholder="Choose a trade" /></SelectTrigger>
                <SelectContent>
                  {TRADES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Trade (combobox)" hint="Type to filter.">
              <Combobox options={TRADES} value={trade} onValueChange={setTrade} placeholder="Any trade" />
            </FormField>
            <FormField label="Combobox, empty">
              <Combobox options={TRADES} value={null} onValueChange={() => {}} placeholder="Any trade" />
            </FormField>
            <FormField label="Combobox, disabled" disabled>
              <Combobox options={TRADES} value="facade" onValueChange={() => {}} />
            </FormField>
          </div>
        </ThemePanels>
      </Section>

      <Section id="choice" title="Checkbox, Radio group, Switch" description="24px controls inside 48px rows: easy to hit with gloves.">
        <ThemePanels>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col">
              <p className="text-label text-foreground-muted">Checkbox</p>
              <Checkbox label="Unchecked" />
              <Checkbox label="Checked" defaultChecked />
              <Checkbox label="Indeterminate (click me)" checked={checked} onCheckedChange={setChecked} />
              <Checkbox label="With description" description="Also notify the project manager." />
              <Checkbox label="Invalid" aria-invalid />
              <Checkbox label="Disabled" disabled />
              <Checkbox label="Disabled checked" disabled defaultChecked />
            </div>
            <div className="flex flex-col">
              <p className="text-label text-foreground-muted">Radio group</p>
              <RadioGroup defaultValue="week" aria-label="Date range">
                <RadioGroupItem value="week" label="Last 7 days" />
                <RadioGroupItem value="month" label="Last 30 days" description="Includes weekends" />
                <RadioGroupItem value="all" label="All time" />
                <RadioGroupItem value="custom" label="Custom (disabled)" disabled />
              </RadioGroup>
            </div>
            <div className="flex flex-col">
              <p className="text-label text-foreground-muted">Switch</p>
              <Switch label="Off" />
              <Switch label="On" defaultChecked />
              <Switch label="Large" size="lg" defaultChecked description="56px wide for on-site use" />
              <Switch label="Disabled" disabled />
              <Switch label="Disabled on" disabled defaultChecked />
            </div>
          </div>
          <p className={cn("text-body-sm text-foreground-muted")}>Tab to any control to see the hi-vis focus ring.</p>
        </ThemePanels>
      </Section>
    </>
  );
}
