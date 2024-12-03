import { useIntl } from "react-intl";
import { useMutation } from "urql";

import {
  graphql,
  InputMaybe,
  Scalars,
  UserFilterInput,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { useApiRoutes } from "@gc-digital-talent/auth";

import useAsyncFileDownload from "./useAsyncFileDownload";

interface DownloadCsvArgs {
  ids?: Scalars["UUID"]["output"][];
  where?: InputMaybe<UserFilterInput>;
}

const DownloadUserDoc_Mutation = graphql(/* GraphQL */ `
  mutation DownloadUserDoc($id: UUID!, $anonymous: Boolean!) {
    downloadUserDoc(id: $id, anonymous: $anonymous)
  }
`);

const DownloadUsersZip_Mutation = graphql(/* GraphQL */ `
  mutation DownloadUsersZip($ids: [UUID!]!, $anonymous: Boolean!) {
    downloadUsersZip(ids: $ids, anonymous: $anonymous)
  }
`);

const DownloadUsersCsv_Mutation = graphql(/* GraphQL */ `
  mutation DownloadUsersCsv($ids: [UUID!], $where: UserFilterInput) {
    downloadUsersCsv(ids: $ids, where: $where)
  }
`);

const useUserDownloads = () => {
  const intl = useIntl();
  const paths = useApiRoutes();
  const [{ fetching: downloadingAsyncFile }, executeAsyncDownload] =
    useAsyncFileDownload();
  const [{ fetching: downloadingZip }, executeZipMutation] = useMutation(
    DownloadUsersZip_Mutation,
  );
  const [{ fetching: downloadingCsv }, executeCsvMutation] = useMutation(
    DownloadUsersCsv_Mutation,
  );
  const [{ fetching: downloadingDoc }, executeDocMutation] = useMutation(
    DownloadUserDoc_Mutation,
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

  const downloadZip = ({
    ids,
    anonymous,
  }: {
    ids: Scalars["UUID"]["input"][];
    anonymous: boolean;
  }) => {
    executeZipMutation({
      ids,
      anonymous,
    })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  const downloadDoc = ({
    id,
    anonymous,
  }: {
    id: Scalars["UUID"]["input"];
    anonymous: boolean;
  }) => {
    executeDocMutation({ id, anonymous })
      .then((res) => {
        if (res?.data?.downloadUserDoc) {
          executeAsyncDownload({
            url: paths.userGeneratedFile(res.data.downloadUserDoc),
            fileName: res.data.downloadUserDoc,
          }).catch(handleDownloadError);
        } else {
          handleDownloadError();
        }
      })
      .catch(handleDownloadRes);
  };

  const downloadCsv = ({ ids, where }: DownloadCsvArgs) => {
    executeCsvMutation({
      ids,
      where,
    })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  return {
    downloadZip,
    downloadingZip,
    downloadCsv,
    downloadingCsv,
    downloadDoc,
    downloadingDoc: downloadingDoc || downloadingAsyncFile,
  };
};

export default useUserDownloads;
