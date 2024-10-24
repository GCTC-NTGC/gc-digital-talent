import { useIntl } from "react-intl";

import { Community } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import adminMessages from "~/messages/adminMessages";

interface CommunityDisplayProps {
  initialData: Community | null | undefined;
}

const CommunityDisplay = ({ initialData }: CommunityDisplayProps) => {
  const intl = useIntl();
  if (!initialData) {
    return <ToggleForm.NullDisplay />;
  }

  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { key, name, description } = initialData;
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="base(repeat(2, 1fr))"
    >
      <ToggleForm.FieldDisplay
        hasError={!name?.en}
        label={intl.formatMessage(adminMessages.nameEn)}
      >
        {name?.en ?? notProvided}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!name?.fr}
        label={intl.formatMessage(adminMessages.nameFr)}
      >
        {name?.fr ?? notProvided}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!description?.en}
        label={intl.formatMessage(adminMessages.descriptionEn)}
      >
        {description?.en ? (
          <RichTextRenderer node={htmlToRichTextJSON(description?.en)} />
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!description?.fr}
        label={intl.formatMessage(adminMessages.descriptionFr)}
      >
        {description?.fr ? (
          <RichTextRenderer node={htmlToRichTextJSON(description?.fr)} />
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!key}
        label={intl.formatMessage(adminMessages.key)}
      >
        {key || notProvided}
      </ToggleForm.FieldDisplay>
    </div>
  );
};

export default CommunityDisplay;
