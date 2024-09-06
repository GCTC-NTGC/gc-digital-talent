import { useIntl } from "react-intl";
import { useMutation } from "urql";

import {
  graphql,
  InputMaybe,
  Language,
  Scalars,
  UserFilterInput,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  getLocale,
} from "@gc-digital-talent/i18n";
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

const DownloadUsersDoc_Mutation = graphql(/* GraphQL */ `
  mutation DownloadUsersDoc(
    $ids: [UUID!]!
    $anonymous: Boolean!
    $locale: Language
  ) {
    downloadUsersDoc(ids: $ids, anonymous: $anonymous, locale: $locale)
  }
`);

const DownloadUsersCsv_Mutation = graphql(/* GraphQL */ `
  mutation DownloadUsersCsv(
    $ids: [UUID!]
    $where: UserFilterInput
    $locale: Language
  ) {
    downloadUsersCsv(ids: $ids, where: $where, locale: $locale)
  }
`);

const useUserDownloads = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useApiRoutes();
  const [{ fetching: downloadingAsyncFile }, executeAsyncDownload] =
    useAsyncFileDownload();
  const [{ fetching: downloadingDoc }, executeDocMutation] = useMutation(
    DownloadUsersDoc_Mutation,
  );
  const [{ fetching: downloadingCsv }, executeCsvMutation] = useMutation(
    DownloadUsersCsv_Mutation,
  );
  const [{ fetching: downloadingSingleUserDoc }, executeSingleUserMutation] =
    useMutation(DownloadUserDoc_Mutation);

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

  const downloadDoc = ({
    ids,
    anonymous,
  }: {
    ids: Scalars["UUID"]["input"][];
    anonymous: boolean;
  }) => {
    executeDocMutation({
      ids,
      anonymous,
      locale: locale === "fr" ? Language.Fr : Language.En,
    })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  const downloadSingleUserDoc = ({
    id,
    anonymous,
  }: {
    id: Scalars["UUID"]["input"];
    anonymous: boolean;
  }) => {
    executeSingleUserMutation({ id, anonymous })
      .then((res) => {
        if (res?.data?.downloadUserDoc) {
          executeAsyncDownload({
            url: paths.userGeneratedFile(res.data.downloadUserDoc),
            fileName: res.data.downloadUserDoc,
          });
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
      locale: locale === "fr" ? Language.Fr : Language.En,
    })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  return {
    downloadDoc,
    downloadingDoc,
    downloadCsv,
    downloadingCsv,
    downloadSingleUserDoc,
    downloadingSingleUserDoc: downloadingSingleUserDoc || downloadingAsyncFile,
  };
};

export default useUserDownloads;
