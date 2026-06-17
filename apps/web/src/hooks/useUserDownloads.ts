import { useIntl } from "react-intl";
import { useMutation } from "urql";

import type {
  UserFilterInput,
  TalentRequestTrackedUserFilterInput,
} from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { useApiRoutes } from "@gc-digital-talent/auth";

import useAsyncFileDownload from "./useAsyncFileDownload";

interface DownloadExcelArgs {
  ids?: string[];
  where?: UserFilterInput | null;
}

interface DownloadTrackedUsersExcelArgs {
  talentRequestId: string;
  where?: TalentRequestTrackedUserFilterInput | null;
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

const DownloadUsersExcel_Mutation = graphql(/* GraphQL */ `
  mutation DownloadUsersExcel($ids: [UUID!], $where: UserFilterInput) {
    downloadUsersExcel(ids: $ids, where: $where)
  }
`);

const DownloadTrackedUsersExcel_Mutation = graphql(/* GraphQL */ `
  mutation DownloadTrackedUsersExcel(
    $talentRequestId: UUID!
    $where: TalentRequestTrackedUserFilterInput
  ) {
    downloadTrackedUsersExcel(talentRequestId: $talentRequestId, where: $where)
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
  const [{ fetching: downloadingExcel }, executeExcelMutation] = useMutation(
    DownloadUsersExcel_Mutation,
  );
  const [
    { fetching: downloadingTrackedUsersExcel },
    executeTrackedUsersExcelMutation,
  ] = useMutation(DownloadTrackedUsersExcel_Mutation);
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
    ids: string[];
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
    id: string;
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
      .catch(handleDownloadError);
  };

  const downloadExcel = ({ ids, where }: DownloadExcelArgs) => {
    executeExcelMutation({
      ids,
      where,
    })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  const downloadTrackedUsersExcel = ({
    talentRequestId,
    where,
  }: DownloadTrackedUsersExcelArgs) => {
    executeTrackedUsersExcelMutation({ talentRequestId, where })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  return {
    downloadZip,
    downloadingZip,
    downloadExcel,
    downloadingExcel,
    downloadTrackedUsersExcel,
    downloadingTrackedUsersExcel,
    downloadDoc,
    downloadingDoc: downloadingDoc || downloadingAsyncFile,
  };
};

export default useUserDownloads;
