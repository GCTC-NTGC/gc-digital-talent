import React from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

import DropdownMenu from "@common/components/DropdownMenu/DropdownMenu";
import { Button } from "@common/components";
import Separator from "@common/components/Separator";

const localeMap = new Map([
  ["crg", "Michif"],
  ["crk", "Plains Cree"],
  ["ojw", "Western Ojibway"],
  ["mic", "Mikmaq"],
]);

const LanguageSelector = () => {
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();
  const locale = searchParams.get("locale");

  const currentLocale = localeMap.get(locale || "");

  const handleLocaleChange = (value: string) => {
    if (localeMap.get(value)) {
      setSearchParams({
        locale: value,
      });
    }
  };

  const unsetLocale = () => {
    if (locale) {
      searchParams.delete("locale");

      setSearchParams(searchParams);
    }
  };

  return (
    <div
      data-h2-background-color="base(ia-secondary)"
      data-h2-color="base(white)"
      data-h2-padding="base(x.5, 0)"
    >
      <div
        data-h2-align-items="base(center)"
        data-h2-display="base(flex)"
        data-h2-gap="base(0, x.75)"
        data-h2-justify-content="base(center)"
      >
        <p>
          {intl.formatMessage({
            id: "uoX7ou",
            defaultMessage: "This page is available in Indigenous languages",
            description:
              "Text displayed as label for Indigenous languages selector",
          })}
        </p>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button
              color="ia-primary"
              data-h2-align-items="base(center)"
              data-h2-display="base(flex)"
              data-h2-flex-shrink="base(0)"
              data-h2-gap="base(0, x.5)"
            >
              <span>
                {currentLocale ||
                  intl.formatMessage({
                    defaultMessage:
                      "Select<hidden> an Indigenous language</hidden>",
                    description:
                      "Button text displayed for Indigenous languages dropdown",
                    id: "kiH9nz",
                  })}
              </span>
              <Separator
                data-h2-background-color="base(white)"
                data-h2-height="base(1em)"
                orientation="vertical"
                decorative
              />
              <ChevronDownIcon
                data-h2-height="base(1em)"
                data-h2-width="base(1em)"
              />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup
              value={locale || undefined}
              onValueChange={handleLocaleChange}
            >
              {Array.from(localeMap).map(([key, value]) => (
                <DropdownMenu.RadioItem key={key} value={key}>
                  <DropdownMenu.ItemIndicator>
                    <CheckIcon />
                  </DropdownMenu.ItemIndicator>
                  {value}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      {locale && (
        <div
          data-h2-align-items="base(center)"
          data-h2-display="base(flex)"
          data-h2-gap="base(0, x.75)"
          data-h2-justify-content="base(center)"
        >
          <Button mode="inline" color="white" onClick={unsetLocale}>
            {intl.formatMessage({
              defaultMessage: "Go back to English",
              id: "t2Q+IG",
              description:
                "Button text for returning to default language from Indigenous language",
            })}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
