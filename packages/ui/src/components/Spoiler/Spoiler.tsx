/* eslint-disable formatjs/no-literal-string-in-jsx */
import { useState } from "react";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

import Button from "../Button";
import Collapsible from "../Collapsible";

export interface SpoilerProps {
  // Accessible name for the "read more" button
  linkSuffix: string;
  // Text to be truncated to read more
  text: string;
  // Character count before cutoff
  characterCount?: number;
}

const Spoiler = ({ linkSuffix, text, characterCount = 32 }: SpoilerProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const truncated = text.slice(0, characterCount);

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-gap="base(0 x.25)"
      >
        <div>
          {!isOpen && <>{truncated}&hellip;</>}
          <Collapsible.Content>{text}</Collapsible.Content>
        </div>
        <Collapsible.Trigger asChild>
          <Button mode="inline" color="black" data-h2-flex-shrink="base(0)">
            {!isOpen
              ? intl.formatMessage(uiMessages.readMore, {
                  context: linkSuffix,
                })
              : intl.formatMessage(uiMessages.readLess, {
                  context: linkSuffix,
                })}
          </Button>
        </Collapsible.Trigger>
      </div>
    </Collapsible.Root>
  );
};

export default Spoiler;
