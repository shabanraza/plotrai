import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { NumberField, parseNumber } from '#/components/tools/calc-fields'
import { TextField } from '#/components/tools/trade-quote-page'
import { Button } from '#/components/ui/button'
import { FieldGroup } from '#/components/ui/field'
import { roomsAreaPerimeter } from '#/lib/quotation'

interface AreaRoom {
  id: string
  name: string
  length: string
  width: string
}

let nextId = 0

/** Rooms measured as length × width in feet, for floors and ceilings. */
export function useAreaRooms(firstRoom = 'Hall') {
  const [rooms, setRooms] = useState<Array<AreaRoom>>(() => [
    { id: 'area-0', name: firstRoom, length: '12', width: '10' },
  ])
  const { area, perimeter } = roomsAreaPerimeter(
    rooms.map((r) => ({ length: parseNumber(r.length), width: parseNumber(r.width) })),
  )
  const update = (id: string, patch: Partial<AreaRoom>) =>
    setRooms((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const node = (
    <div className="flex flex-col gap-6">
      {rooms.map((room) => (
        <div key={room.id} className="flex items-end gap-2">
          <FieldGroup className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-1">
              <TextField id={`${room.id}-n`} label="Room" value={room.name} onChange={(v) => update(room.id, { name: v })} />
            </div>
            <NumberField id={`${room.id}-l`} label="Length" suffix="ft" value={room.length} onChange={(v) => update(room.id, { length: v })} />
            <NumberField id={`${room.id}-w`} label="Width" suffix="ft" value={room.width} onChange={(v) => update(room.id, { width: v })} />
          </FieldGroup>
          {rooms.length > 1 && (
            <Button variant="ghost" size="icon" aria-label={`Remove ${room.name || 'room'}`} onClick={() => setRooms((rs) => rs.filter((r) => r.id !== room.id))}>
              <Trash2 />
            </Button>
          )}
        </div>
      ))}
      <div>
        <Button
          variant="outline"
          onClick={() =>
            setRooms((rs) => [...rs, { id: `area-${++nextId}`, name: `Room ${rs.length + 1}`, length: '', width: '' }])
          }
        >
          <Plus data-icon="inline-start" />
          Add room
        </Button>
      </div>
    </div>
  )
  return { node, areaSqFt: area, perimeterFt: perimeter }
}

/** A list of counts (points, fixtures) shown as a grid of number fields. */
export function useCounts<K extends string>(
  defs: ReadonlyArray<{ key: K; label: string; initial: string; suffix?: string }>,
) {
  const [values, setValues] = useState<Record<K, string>>(
    () => Object.fromEntries(defs.map((d) => [d.key, d.initial])) as Record<K, string>,
  )
  const counts = Object.fromEntries(
    defs.map((d) => [d.key, parseNumber(values[d.key])]),
  ) as Record<K, number>
  const node = (
    <FieldGroup className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {defs.map((d) => (
        <NumberField
          key={d.key}
          id={`count-${d.key}`}
          label={d.label}
          suffix={d.suffix ?? 'nos'}
          value={values[d.key]}
          onChange={(v) => setValues((s) => ({ ...s, [d.key]: v }))}
        />
      ))}
    </FieldGroup>
  )
  return { node, counts }
}
