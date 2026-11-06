import { Field, FieldDescription, FieldLabel } from '#/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '#/components/ui/input-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { formatQty, type LengthUnit } from '#/lib/finishing-calc'

/** Number input with an optional unit suffix, used by the quantity calculators. */
export function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  description,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  suffix?: string
  description?: string
  placeholder?: string
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix && (
          <InputGroupAddon align="inline-end">
            <InputGroupText className="text-sm">{suffix}</InputGroupText>
          </InputGroupAddon>
        )}
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

/** Feet or metres for every length on the page. */
export function UnitToggle({
  value,
  onChange,
}: {
  value: LengthUnit
  onChange: (unit: LengthUnit) => void
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as LengthUnit)}
      variant="outline"
      aria-label="Measurement unit"
      className="justify-start"
    >
      <ToggleGroupItem value="ft" className="min-h-10 px-4">
        Feet
      </ToggleGroupItem>
      <ToggleGroupItem value="m" className="min-h-10 px-4">
        Metres
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export interface QuantityRow {
  label: string
  value: number
  unit: string
  note?: string
}

/** Headline figure in a soft blue panel, then the full list of quantities. */
export function QuantityResult({
  headline,
  rows,
}: {
  headline: { label: string; value: string; caption?: string }
  rows: ReadonlyArray<QuantityRow>
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 rounded-xl bg-[var(--brand-light)] p-5 sm:p-6">
        <p className="text-sm font-medium text-[var(--foreground)]/75">
          {headline.label}
        </p>
        <p className="text-3xl font-semibold tracking-tight text-[var(--brand)] tabular-nums sm:text-4xl">
          {headline.value}
        </p>
        {headline.caption && (
          <p className="text-sm text-[var(--foreground)]/75">
            {headline.caption}
          </p>
        )}
      </div>
      {rows.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="py-3 whitespace-normal">
                  <span className="font-medium">{row.label}</span>
                  {row.note && (
                    <span className="block text-sm text-[var(--muted-foreground)]">
                      {row.note}
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-3 text-right font-semibold tabular-nums">
                  {formatQty(row.value)} {row.unit}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export function parseNumber(value: string): number {
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}
