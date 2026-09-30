import { hash, type InjectionType } from "./hash"
import { merge } from "./merge"
import { parser, type StyleNode } from "./parser"

interface StylesConfig {
  type?: InjectionType
  append?: boolean
}

export class Styles {
  private _class: string | undefined
  public readonly styles: StyleNode

  constructor(
    styles: StyleNode | string,
    private readonly config?: StylesConfig,
  ) {
    this.styles = typeof styles === "string" ? parser.toObject(styles) : styles
  }

  /** Inject the styles into the dom. */
  public inject() {
    if (this._class) return
    const { append, type } = this.config ?? {}
    this._class = hash(this.styles, append, type)
  }

  /** Retrieve a css class for the styles. */
  public get class() {
    if (!this._class) this.inject()
    return this._class ?? ""
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
