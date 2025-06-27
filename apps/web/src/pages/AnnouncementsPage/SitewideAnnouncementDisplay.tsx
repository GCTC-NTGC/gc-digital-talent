import { useIntl } from "react-intl";

import {
  DATETIME_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { SitewideAnnouncement } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";

import ToggleForm from "~/components/ToggleForm/ToggleForm";

import labels from "./labels";

interface SitewideAnnouncementDisplayProps {
  initialData: SitewideAnnouncement | null | undefined;
}

const SitewideAnnouncementDisplay = ({
  initialData,
}: SitewideAnnouncementDisplayProps) => {
  const intl = useIntl();
  if (!initialData) {
    return <ToggleForm.NullDisplay />;
  }

  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { isEnabled, publishDate, expiryDate, title, message } = initialData;
  const { en: titleEn, fr: titleFr } = title;
  const { en: messageEn, fr: messageFr } = message;
  return (
    <div className="grid gap-6 xs:grid-cols-2">
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(labels.isEnabled)}
        className="xs:col-span-2"
      >
        {isEnabled
          ? intl.formatMessage(commonMessages.yes)
          : intl.formatMessage(commonMessages.no)}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!publishDate}
        label={intl.formatMessage(labels.publishDateUtc)}
      >
        {publishDate ?? notProvided}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!publishDate}
        label={intl.formatMessage(labels.publishDateLocal)}
      >
        {publishDate
          ? formatDate({
              date: parseDateTimeUtc(publishDate),
              formatString: DATETIME_FORMAT_STRING,
              intl,
            })
          : notProvided}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!expiryDate}
        label={intl.formatMessage(labels.expiryDateUtc)}
      >
        {expiryDate ?? notProvided}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!expiryDate}
        label={intl.formatMessage(labels.expiryDateLocal)}
      >
        {expiryDate
          ? formatDate({
              date: parseDateTimeUtc(expiryDate),
              formatString: DATETIME_FORMAT_STRING,
              intl,
            })
          : notProvided}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!titleEn}
        label={intl.formatMessage(labels.titleEn)}
      >
        {titleEn ?? notProvided}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!titleFr}
        label={intl.formatMessage(labels.titleFr)}
      >
        {titleFr ?? notProvided}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!messageEn}
        label={intl.formatMessage(labels.messageEn)}
      >
        {messageEn ? (
          <RichTextRenderer node={htmlToRichTextJSON(messageEn)} />
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!messageFr}
        label={intl.formatMessage(labels.messageFr)}
      >
        {messageFr ? (
          <RichTextRenderer node={htmlToRichTextJSON(messageFr)} />
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
    </div>
  );
};

export default SitewideAnnouncementDisplay;
