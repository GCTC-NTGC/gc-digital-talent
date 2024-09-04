import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { graphql, Language, Scalars } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  getLocale,
} from "@gc-digital-talent/i18n";
import { useApiRoutes } from "@gc-digital-talent/auth";

import useAsyncFileDownload from "./useAsyncFileDownload";

const DownloadApplicationsDoc_Mutation = graphql(/* GraphQL */ `
  mutation DownloadApplicationsDoc($ids: [UUID!]!, $locale: Language) {
    downloadApplicationsDoc(ids: $ids, locale: $locale)
  }
`);

const DownloadApplicationDoc_Mutation = graphql(/* GraphQL */ `
  mutation DownloadApplicationDoc($id: UUID!) {
    downloadApplicationDoc(id: $id)
  }
`);

const useApplicationDownloads = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useApiRoutes();
  const [{ fetching: downloadingAsyncFile }, executeAsyncDownload] =
    useAsyncFileDownload();
  const [{ fetching: downloadingDoc }, executeDocMutation] = useMutation(
    DownloadApplicationsDoc_Mutation,
  );
  const [{ fetching: downloadingSingleDoc }, executeSingleDocMutation] =
    useMutation(DownloadApplicationDoc_Mutation);

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

  const downloadSingleDoc = ({ id }: { id: Scalars["UUID"]["input"] }) => {
    executeSingleDocMutation({ id })
      .then((res) => {
        if (res?.data?.downloadApplicationDoc) {
          executeAsyncDownload({
            url: paths.userGeneratedFile(res.data.downloadApplicationDoc),
            fileName: res.data.downloadApplicationDoc,
          });
        } else {
          handleDownloadError();
        }
      })
      .catch(handleDownloadError);
  };

  return {
    downloadDoc,
    downloadingDoc,
    downloadSingleDoc,
    downloadingSingleDoc: downloadingSingleDoc || downloadingAsyncFile,
  };
};

export default useApplicationDownloads;
