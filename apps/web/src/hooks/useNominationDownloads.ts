import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { graphql, Scalars } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";
import { useApiRoutes } from "@gc-digital-talent/auth";

import useAsyncFileDownload from "./useAsyncFileDownload";

const DownloadNominationDoc_Mutation = graphql(/* GraphQL */ `
  mutation DownloadNominationDoc($id: UUID!) {
    downloadNominationDoc(id: $id)
  }
`);

const useNominationDownloads = () => {
  const intl = useIntl();
  const paths = useApiRoutes();
  const [{ fetching: downloadingAsyncFile }, executeAsyncDownload] =
    useAsyncFileDownload();
  const [{ fetching: downloadingDoc }, executeDocMutation] = useMutation(
    DownloadNominationDoc_Mutation,
  );

  const handleDownloadError = () => {
    toast.error(intl.formatMessage(errorMessages.downloadRequestFailed));
  };

  const downloadDoc = ({ id }: { id: Scalars["UUID"]["input"] }) => {
    executeDocMutation({ id })
      .then(async (res) => {
        if (res?.data?.downloadNominationDoc) {
          await executeAsyncDownload({
            url: paths.userGeneratedFile(res.data.downloadNominationDoc),
            fileName: res.data.downloadNominationDoc,
          });
        } else {
          handleDownloadError();
        }
      })
      .catch(handleDownloadError);
  };

  return {
    downloadDoc,
    downloadingDoc: downloadingDoc || downloadingAsyncFile,
  };
};

export default useNominationDownloads;
