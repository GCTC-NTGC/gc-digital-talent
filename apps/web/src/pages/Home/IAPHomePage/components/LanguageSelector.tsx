import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";
import CheckIcon from "@heroicons/react/24/solid/CheckIcon";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";

import { DropdownMenu, Button } from "@gc-digital-talent/ui";

const LanguageSelector = () => {
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();
  const locale = searchParams.get("locale");

  const localeMap = new Map([
    [
      "crg",
      intl.formatMessage({
        id: "zAl7ZH",
        defaultMessage: "Michif",
        description: "Name of Michif language",
      }),
    ],
    [
      "crk",
      intl.formatMessage({
        id: "Jdlnz6",
        defaultMessage: "ᓀᐦᐃᔭᐍᐏᐣ nēhiyawēwin (Plains Cree)",
        description: "Name of Plains Cree language",
      }),
    ],
    [
      "ojw",
      intl.formatMessage({
        id: "Hi7hnj",
        defaultMessage: "Anishinaabemowin (Western Ojibwe)",
        description: "Name of Western Ojibwe language",
      }),
    ],
    [
      "mic",
      intl.formatMessage({
        id: "GVeb32",
        defaultMessage: "Mi'kmaw",
        description: "Name of Mi'kmaw language",
      }),
    ],
  ]);

  const currentLocale = localeMap.get(locale ?? "");

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
    <div className="bg-secondary p-3 text-white">
      <div className="flex items-center justify-center gap-x-4.5">
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
            <Button color="primary" utilityIcon={ChevronDownIcon}>
              {currentLocale ??
                intl.formatMessage({
                  defaultMessage:
                    "Select<hidden> an Indigenous language</hidden>",
                  description:
                    "Button text displayed for Indigenous languages dropdown",
                  id: "kiH9nz",
                })}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup
              value={locale ?? undefined}
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
        <div className="flex items-center justify-center gap-x-4.5">
          <Button mode="inline" color="white" onClick={unsetLocale} fixedColor>
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
