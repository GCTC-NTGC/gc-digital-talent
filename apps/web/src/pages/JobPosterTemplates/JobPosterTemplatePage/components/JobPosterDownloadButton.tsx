import { useIntl } from "react-intl";
import { useMutation } from "urql";
import ArrowDownTrayIcon from "@heroicons/react/20/solid/ArrowDownTrayIcon";

import { graphql, Scalars } from "@gc-digital-talent/graphql";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { Button } from "@gc-digital-talent/ui";
import { useApiRoutes } from "@gc-digital-talent/auth";

import SpinnerIcon from "~/components/SpinnerIcon/SpinnerIcon";
import useAsyncFileDownload from "~/hooks/useAsyncFileDownload";

const DownloadJobPosterTemplateDoc_Mutation = graphql(/* GraphQL */ `
  mutation DownloadJobPosterTemplateDoc($id: UUID!) {
    downloadJobPosterTemplateDoc(id: $id)
  }
`);

interface JobPosterDownloadButtonProps {
  id: Scalars["UUID"]["output"];
}

const JobPosterDownloadButton = ({ id }: JobPosterDownloadButtonProps) => {
  const intl = useIntl();
  const paths = useApiRoutes();
  const [{ fetching: downloadingAsyncFile }, executeAsyncDownload] =
    useAsyncFileDownload();
  const [{ fetching: downloadingDoc }, executeDocDownload] = useMutation(
    DownloadJobPosterTemplateDoc_Mutation,
  );

  const handleDownloadError = () => {
    toast.error(intl.formatMessage(errorMessages.downloadRequestFailed));
  };

  const downloadDoc = () => {
    // Prevent duplicate downloads
    if (downloadingAsyncFile || downloadingDoc) return;

    executeDocDownload({ id })
      .then((res) => {
        if (res?.data?.downloadJobPosterTemplateDoc) {
          executeAsyncDownload({
            url: paths.userGeneratedFile(res.data.downloadJobPosterTemplateDoc),
            fileName: res.data.downloadJobPosterTemplateDoc,
          }).catch(handleDownloadError);
        } else {
          handleDownloadError();
        }
      })
      .catch(handleDownloadError);
  };

  const isDownloading = downloadingDoc || downloadingAsyncFile;

  return (
    <Button
      block
      mode="inline"
      onClick={downloadDoc}
      icon={isDownloading ? SpinnerIcon : ArrowDownTrayIcon}
      disabled={isDownloading}
    >
      {intl.formatMessage(commonMessages.download)}
    </Button>
  );
};

export default JobPosterDownloadButton;
