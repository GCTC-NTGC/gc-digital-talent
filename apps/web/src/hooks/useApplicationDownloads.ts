import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { graphql, Scalars } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { useApiRoutes } from "@gc-digital-talent/auth";

import useAsyncFileDownload from "./useAsyncFileDownload";

const DownloadApplicationsZip_Mutation = graphql(/* GraphQL */ `
  mutation DownloadApplicationsZip($ids: [UUID!]!) {
    downloadApplicationsZip(ids: $ids)
  }
`);

const DownloadApplicationDoc_Mutation = graphql(/* GraphQL */ `
  mutation DownloadApplicationDoc($id: UUID!) {
    downloadApplicationDoc(id: $id)
  }
`);

const useApplicationDownloads = () => {
  const intl = useIntl();
  const paths = useApiRoutes();
  const [{ fetching: downloadingAsyncFile }, executeAsyncDownload] =
    useAsyncFileDownload();
  const [{ fetching: downloadingZip }, executeZipMutation] = useMutation(
    DownloadApplicationsZip_Mutation,
  );
  const [{ fetching: downloadingDoc }, executeDocMutation] = useMutation(
    DownloadApplicationDoc_Mutation,
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

  const downloadZip = ({ ids }: { ids: Scalars["UUID"]["input"][] }) => {
    executeZipMutation({ ids })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  const downloadDoc = ({ id }: { id: Scalars["UUID"]["input"] }) => {
    executeDocMutation({ id })
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
    downloadZip,
    downloadingZip,
    downloadDoc,
    downloadingDoc: downloadingDoc || downloadingAsyncFile,
  };
};

export default useApplicationDownloads;
