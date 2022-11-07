/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/collapsible
 */
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

// Note: We don't really need to style these so just re-export them as is
const { Root, Trigger, Content } = CollapsiblePrimitive;

/**
 * @name Collapsible
 * @desc An interactive component which expands/collapses a panel.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/collapsible)
 */
const Collapsible = {
  /**
   * @name Root
   * @desc Contains all the parts of a collapsible.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/collapsible#root)
   */
  Root,
  /**
   * @name Trigger
   * @desc The button that toggles the collapsible.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/collapsible#trigger)
   */
  Trigger,
  /**
   * @name Content
   * @desc The component that contains the collapsible content.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/collapsible#content)
   */
  Content,
};

export default Collapsible;
