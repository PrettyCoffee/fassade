export interface Heading {
  id: string
  text: string
  level: 2 | 3
  element: HTMLHeadingElement
  children: Heading[]
}

const getUniqueId = (text: string, index: number, usedIds: Set<string>) => {
  const base =
    text
      .trim()
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-") || `heading-${index + 1}`
  let id = base
  let suffix = 2
  while (usedIds.has(id)) {
    id = `${base}-${suffix}`
    suffix += 1
  }
  return id
}

const isOfType = (
  element: Element,
  tag: "H2" | "H3",
): element is HTMLHeadingElement => element.tagName === tag

export const getHeadings = (scope: HTMLElement) => {
  const elements = [...scope.querySelectorAll<HTMLHeadingElement>("h2, h3")]
  const usedIds = new Set<string>()
  const headings = elements.reduce<Heading[]>((headings, element, index) => {
    const text = element.textContent
    if (!text) return headings

    element.id ||= getUniqueId(text, index, usedIds)
    usedIds.add(element.id)
    const heading = { id: element.id, text, element }

    if (isOfType(element, "H2")) {
      headings.push({ ...heading, level: 2, children: [] })
    } else if (isOfType(element, "H3")) {
      const last = headings.at(-1)
      last?.children.push({ ...heading, level: 3, children: [] })
    }

    return headings
  }, [])

  return { headings, elements }
}
