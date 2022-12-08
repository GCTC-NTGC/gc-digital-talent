import React from "react";
import { useIntl } from "react-intl";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

import Button from "../Button";
import Collapsible from "../Collapsible";

const ExperienceHelpMessage = () => {
  const intl = useIntl();
  return (
    <>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          id: "lgAkmv",
          defaultMessage:
            "Help us understand your abilities by linking experiences on our résumé to this skill. For each experience you add, you will be provided space to describe how you demonstrated that skill within context of the experience.",
          description: "Help text for experience selection field",
        })}
      </p>
      <Collapsible.Root>
        <Collapsible.Trigger asChild>
          <Button
            type="button"
            mode="inline"
            color="black"
            data-h2-font-weight="base(400)"
            data-h2-display="base(flex)"
            data-h2-align-items="base(center)"
            data-h2-justify-content="base(flex-start)"
            data-h2-gap="base(x.25, 0)"
            data-h2-transform="
        base:children[.Chevron](rotate(0deg))
        base:selectors[[data-state='open']]:children[.Chevron](rotate(90deg))"
          >
            <ChevronRightIcon
              data-h2-color="base(tm-blue)"
              data-h2-width="base(x1)"
              data-h2-height="base(x1)"
              data-h2-font-weight="base(700)"
              data-h2-transition="base(all, 100ms, ease)"
              className="Chevron"
            />
            <span>
              {intl.formatMessage({
                defaultMessage: "How to best describe a skill experience",
                id: "pwjcY4",
                description:
                  "Button text to open help text for describing a skill experience",
              })}
            </span>
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content data-h2-margin="base(x.5, 0, 0, 0)">
          <p>Lorem ipsum</p>
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
};

export default ExperienceHelpMessage;
