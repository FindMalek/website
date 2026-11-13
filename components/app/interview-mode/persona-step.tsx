import { useState } from "react"
import { PERSONAS, type PersonaId } from "@/data/journey"

import { MAX_MATCH_INPUT_CHARS } from "@/lib/journey/match-schema"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type PersonaStepProps = {
  onStart: (persona: PersonaId, jobInput: string) => void
}

export function PersonaStep({ onStart }: PersonaStepProps) {
  const [persona, setPersona] = useState<PersonaId | null>(null)
  const [job, setJob] = useState("")

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        if (persona) onStart(persona, job)
      }}
    >
      <fieldset className="space-y-3">
        <legend className="font-heading text-xl font-semibold sm:text-2xl">
          Who is reading?
        </legend>
        <p className="text-muted-foreground text-sm">
          Pick the closest one and I will show the questions you probably have.
          Nothing here is required.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {PERSONAS.map((item, index) => (
            <label
              key={item.id}
              className="has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-ring hover:bg-muted/50 flex min-h-14 cursor-pointer flex-col justify-center rounded-xl border px-4 py-3 has-[:focus-visible]:ring-2"
            >
              <input
                type="radio"
                name="persona"
                value={item.id}
                checked={persona === item.id}
                onChange={() => setPersona(item.id)}
                className="sr-only"
                data-autofocus={index === 0 ? "" : undefined}
              />
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-muted-foreground text-xs">{item.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="interview-job">Job post or role (optional)</Label>
        <Textarea
          id="interview-job"
          value={job}
          onChange={(event) => setJob(event.target.value)}
          maxLength={MAX_MATCH_INPUT_CHARS}
          rows={4}
          placeholder="Paste the text or a link. I will show where I match and where I do not."
          className="min-h-24 resize-none text-base sm:text-sm"
        />
        <p className="text-muted-foreground text-xs">
          It is sent once to the model to read the role. I do not store it.
        </p>
      </div>

      <Button type="submit" size="lg" className="h-11" disabled={!persona}>
        Start
      </Button>
    </form>
  )
}
