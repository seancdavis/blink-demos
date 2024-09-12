import { partials, type PartialName } from './partial-data.ts'

type RenderPartialOptions = {
  name: PartialName
  data: Record<string, string>
}

export function renderPartial(options: RenderPartialOptions): string {
  let { name, data } = options
  if (!name || !(name in partials)) name = '__undefined__'
  return partials[name as PartialName].replace(/{{\s*(\w+)\s*}}/g, (_, key) => data[key] || '')
}
