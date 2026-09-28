import { type InjectionType } from "../core/hash"
import { type StyleNode } from "../core/parser/types"

interface BaseProps {
  /** The type of injection which is being built. */
  injection?: InjectionType
}

interface StartProps extends BaseProps {
  /** Root selector of the styles which are about to be created. */
  selector?: string
  /** Initial object representing the styles, before running hooks. */
  node: StyleNode
  /** Current object which will be used when building the styles. */
  result?: StyleNode
}
type StartHook = (props: StartProps) => StyleNode | void

interface BlockProps extends BaseProps {
  /** Selector of the block. */
  selector: string
  /** Object representing the styles of the block. */
  node: StyleNode
  /** Content (rules and other blocks) of the current block. */
  content: string
  /** Current output which will represent the block. */
  result?: string
}
type BuildBlockHook = (props: BlockProps) => string | void

interface RuleProps extends BaseProps {
  /** Key of the current rule. */
  key: string
  /** Value of the current rule. */
  value: string
  /** Current output which will represent the rule. */
  result?: string
}
type BuildRuleHook = (props: RuleProps) => string | void

interface EndProps extends BaseProps {
  /** The finalized output which is going to be written in the HTML dom. */
  result: string
}
type EndHook = (props: EndProps) => string | void

export interface Plugin {
  /** Name of the plugin. */
  name: string
  /** Hook to be called before building styles. */
  start?: StartHook
  /** Hook to be called for each style block. */
  buildBlock?: BuildBlockHook
  /** Hook to be called for each style rule. */
  buildRule?: BuildRuleHook
  /** Hook to be called after building styles. */
  end?: EndHook
}
