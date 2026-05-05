import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import type { PlotDetails, Direction, PlotShape } from "./types"

const DIRECTIONS: { value: Direction; label: string }[] = [
  { value: "N", label: "North (N)" },
  { value: "NE", label: "North-East (NE)" },
  { value: "E", label: "East (E)" },
  { value: "SE", label: "South-East (SE)" },
  { value: "S", label: "South (S)" },
  { value: "SW", label: "South-West (SW)" },
  { value: "W", label: "West (W)" },
  { value: "NW", label: "North-West (NW)" },
]

const SHAPES: { value: PlotShape; label: string }[] = [
  { value: "rectangle", label: "Rectangle" },
  { value: "square", label: "Square" },
  { value: "L", label: "L-shaped" },
  { value: "corner", label: "Corner" },
]

interface PlotDetailsFormProps {
  value: PlotDetails
  onChange: (value: PlotDetails) => void
}

export function PlotDetailsForm({ value, onChange }: PlotDetailsFormProps) {
  function update<K extends keyof PlotDetails>(key: K, val: PlotDetails[K]) {
    onChange({ ...value, [key]: val })
  }

  const unitLabel = value.unit === "ft" ? "ft" : "m"

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="plot-length">Length ({unitLabel})</Label>
          <Input
            id="plot-length"
            type="number"
            min={1}
            value={value.length || ""}
            onChange={(e) => update("length", Number(e.target.value))}
            placeholder={`Length in ${unitLabel}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plot-width">Width ({unitLabel})</Label>
          <Input
            id="plot-width"
            type="number"
            min={1}
            value={value.width || ""}
            onChange={(e) => update("width", Number(e.target.value))}
            placeholder={`Width in ${unitLabel}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plot-unit">Unit</Label>
          <Select
            value={value.unit}
            onValueChange={(v) => update("unit", v as "ft" | "m")}
          >
            <SelectTrigger id="plot-unit" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ft">Feet (ft)</SelectItem>
              <SelectItem value="m">Meters (m)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="plot-facing">Facing</Label>
          <Select
            value={value.facing}
            onValueChange={(v) => update("facing", v as Direction)}
          >
            <SelectTrigger id="plot-facing" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIRECTIONS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="plot-shape">Shape</Label>
          <Select
            value={value.shape}
            onValueChange={(v) => update("shape", v as PlotShape)}
          >
            <SelectTrigger id="plot-shape" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHAPES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="plot-floors">Floors</Label>
          <Select
            value={String(value.floors)}
            onValueChange={(v) => update("floors", Number(v) as 1 | 2 | 3)}
          >
            <SelectTrigger id="plot-floors" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Floor</SelectItem>
              <SelectItem value="2">2 Floors</SelectItem>
              <SelectItem value="3">3 Floors</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
