import { getSheet } from "./get-sheet"
import { hash, type InjectionType } from "./hash"
import { parser, type StyleNode } from "./parser"

interface StylesConfig {
  type?: InjectionType
  append?: boolean
}

const merge = (a: StyleNode | StyleNode[string] | undefined, b: StyleNode) => {
  if (typeof a !== "object") return b

  return Object.entries(b).reduce((merged, [key, value]) => {
    if (typeof value === "object") {
      merged[key] = merge(merged[key], value)
    } else if (value) {
      merged[key] = value
    }
    return merged
  }, a)
}

export class Styles {
  private _class: string | undefined

  constructor(
    public readonly styles: StyleNode,
    private readonly config?: StylesConfig,
  ) {}

  /** Inject the styles into the dom and retrieve a css class. */
  public get class() {
    if (!this._class) {
      const { append, type } = this.config ?? {}
      this._class = hash(this.styles, getSheet(), append, type)
    }
    return this._class
  }

  /** Append with new styles, merging them deeply. */
  public append(styles: StyleNode) {
    return new Styles(merge(this.styles, styles), this.config)
  }

  /** Create a new instance with a different config. */
  public withConfig(config?: StylesConfig) {
    return new Styles(this.styles, config)
  }

  /** Convert to css style string. */
  public toString() {
    return parser.toString(this.styles)
  }
}
