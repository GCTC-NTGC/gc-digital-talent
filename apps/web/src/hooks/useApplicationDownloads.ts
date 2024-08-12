import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { graphql, Language, Scalars } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  getLocale,
} from "@gc-digital-talent/i18n";

const DownloadApplicationsDoc_Mutation = graphql(/* GraphQL */ `
  mutation DownloadApplicationsDoc($ids: [UUID!]!, $locale: Language) {
    downloadApplicationsDoc(ids: $ids, locale: $locale)
  }
`);

const useApplicationDownloads = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const [{ fetching: downloadingDoc }, executeDocMutation] = useMutation(
    DownloadApplicationsDoc_Mutation,
  );

  const handleDownloadError = () => {
    toast.error(intl.formatMessage(errorMessages.downloadRequestFailed));
  };

  const handleDownloadRes = (hasData: boolean) => {
    if (hasData) {
      toast.info(intl.formatMessage(commonMessages.preparingDownload));
    } else {
      handleDownloadError();
    }
  };

  const downloadDoc = ({ ids }: { ids: Scalars["UUID"]["input"][] }) => {
    executeDocMutation({
      ids,
      locale: locale === "fr" ? Language.Fr : Language.En,
    })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  return { downloadDoc, downloadingDoc };
};

export default useApplicationDownloads;
