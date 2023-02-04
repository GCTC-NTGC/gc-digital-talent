import React from "react";
import { useIntl } from "react-intl";
import { Client } from "urql";

import {
  Await,
  Navigate,
  useLoaderData,
  useParams,
  defer,
  LoaderFunction,
  redirect,
} from "react-router-dom";

import Loading from "@common/components/Pending/Loading";

import useRoutes from "~/hooks/useRoutes";
import { Scalars, CreateApplicationDocument } from "~/api/generated";

export type LoaderData = {
  application: {
    id: Scalars["UUID"];
  };
};

export type RouteParams = {
  poolId: Scalars["UUID"];
};

export const loader =
  (client: Client, userId: Scalars["UUID"]): LoaderFunction =>
  async ({ params, request }) => {
    const { poolId } = params;

    /**
     * We need to check for a user since this loader
     * runs before the `<RequireAuth />` logic.
     */
    const me = await client
      .query(`query IsLoggedIn { me { id } }`, {})
      .toPromise()
      .then((res) => res.data.me.id);

    // Redirect to login if we got this far (we shouldn't)
    if (!me.id) {
      redirect(`/login?from=${request.url}&locale=en`);
    }

    const application = client
      .mutation(CreateApplicationDocument, {
        poolId,
        userId,
      })
      .toPromise()
      .then((res) => res.data.createApplication);

    return defer({ application });
  };

/**
 * Note: This is not a real page
 * it exists only to create an application
 * and forward a user on
 */
const CreateApplication = () => {
  const { poolId } = useParams<RouteParams>();
  const data = useLoaderData() as LoaderData;
  const intl = useIntl();
  const routes = useRoutes();

  /**
   * Render the loading spinner while we do
   * the necessary work
   *
   * Note: This component should always redirect to a path
   * based on the logic, so no need to render anything but
   * a loading spinner
   */
  return (
    <React.Suspense
      fallback={
        <Loading>
          {intl.formatMessage({
            defaultMessage: "Creating application...",
            id: "KEGAaP",
            description:
              "Message to display when application creation is in process.",
          })}
        </Loading>
      }
    >
      <Await
        resolve={data.application}
        errorElement={<Navigate to={routes.pool(poolId)} replace />}
      >
        {(application: LoaderData["application"]) => (
          <Navigate to={routes.reviewApplication(application.id)} replace />
        )}
      </Await>
    </React.Suspense>
  );
};

export default CreateApplication;
