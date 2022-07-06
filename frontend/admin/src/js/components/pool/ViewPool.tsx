/* eslint-disable jsx-a11y/anchor-is-valid */
/* NOTE: This is temporary until we start the Candidates/Requests pages */
import * as React from "react";
import { useIntl } from "react-intl";
import {
  CheckIcon,
  ClipboardIcon,
  CogIcon,
  ExternalLinkIcon,
  HomeIcon,
  TicketIcon,
  UserGroupIcon,
  ViewGridIcon,
} from "@heroicons/react/outline";

import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import PageHeader from "@common/components/PageHeader";
import { commonMessages } from "@common/messages";
import { getLocale } from "@common/helpers/localize";

import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { IconLink } from "@common/components/Link";
import { Input } from "@common/components/form";
import { Button } from "@common/components";
import { IconButton } from "@common/components/Button";
import { FormProvider, useForm } from "react-hook-form";
import { useAdminRoutes } from "../../adminRoutes";
import { useGetPoolQuery } from "../../api/generated";
import type { Pool } from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

const Spacer = ({ children }: { children: React.ReactNode }) => (
  <span data-h2-margin="b(bottom-right, s)">{children}</span>
);

interface ViewPoolPageProps {
  pool: Pool;
}

export const ViewPoolPage = ({ pool }: ViewPoolPageProps): JSX.Element => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const adminPaths = useAdminRoutes();
  const form = useForm();
  const [linkCopied, setLinkCopied] = React.useState<boolean>(false);

  /** Reset link copied after 3 seconds */
  React.useEffect(() => {
    if (linkCopied) {
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    }
  }, [linkCopied, setLinkCopied]);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Pool Details",
    description: "Title for the page when viewing an individual pool.",
  });

  const poolName = pool.name ? pool.name[locale] : pageTitle;

  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "Home",
        description: "Breadcrumb title for the home page link.",
      }),
      href: adminPaths.home(),
      icon: <HomeIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    {
      title: intl.formatMessage({
        defaultMessage: "Pools",
        description: "Breadcrumb title for the pools page link.",
      }),
      href: adminPaths.poolTable(),
      icon: <ViewGridIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    {
      title: poolName,
    },
  ] as BreadcrumbsProps["links"];

  return (
    <DashboardContentContainer>
      <PageHeader icon={ViewGridIcon}>{poolName}</PageHeader>
      <Breadcrumbs links={links} />
      <div
        data-h2-display="b(flex)"
        data-h2-flex-wrap="b(wrap)"
        data-h2-margin="b(top-bottom, m)"
      >
        <Spacer>
          <IconLink
            mode="solid"
            color="secondary"
            type="button"
            href="#"
            icon={UserGroupIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Manage candidates",
              description:
                "Link text for button to manage candidates of a specific pool",
            })}
          </IconLink>
        </Spacer>
        <Spacer>
          <IconLink
            mode="solid"
            color="secondary"
            type="button"
            href="#"
            icon={TicketIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Manage requests",
              description:
                "Link text for button to manage requests of a specific pool",
            })}
          </IconLink>
        </Spacer>
        <Spacer>
          <IconLink
            mode="solid"
            color="secondary"
            type="button"
            href={adminPaths.poolUpdate(pool.id)}
            icon={CogIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Edit pool advertisement",
              description: "Link text for button to edit a specific pool",
            })}
          </IconLink>
        </Spacer>
      </div>
      <FormProvider {...form}>
        <h2 data-h2-margin="b(top, l)" data-h2-font-size="b(h3)">
          {intl.formatMessage({
            defaultMessage: "View pool advertisement",
            description: "Sub title for admin view pool page",
          })}
        </h2>
        <div data-h2-display="b(flex)" data-h2-align-items="b(flex-end)">
          <Spacer>
            <Input
              readOnly
              value={pool.id}
              hideOptional
              id="poolUrl"
              name="poolUrl"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "Pool advertisement",
                description: "Label for pool advertisement url field",
              })}
            />
          </Spacer>
          <Spacer>
            <IconButton
              data-h2-margin="b(bottom, xxs)"
              mode="outline"
              color="secondary"
              disabled={linkCopied}
              icon={linkCopied ? CheckIcon : ClipboardIcon}
              onClick={() => {
                // TO DO: Update with real URL once we get it
                navigator.clipboard.writeText(pool.id);
                setLinkCopied(true);
              }}
            >
              <span aria-live={linkCopied ? "assertive" : "off"}>
                {linkCopied
                  ? intl.formatMessage({
                      defaultMessage: "Link copied!",
                      description:
                        "Button text to be displayed after link was copied",
                    })
                  : intl.formatMessage({
                      defaultMessage: "Copy link",
                      description: "Button text to copy a url",
                    })}
              </span>
            </IconButton>
          </Spacer>
          <Spacer>
            <IconLink
              data-h2-margin="b(bottom, xxs)"
              mode="outline"
              color="secondary"
              type="button"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              icon={ExternalLinkIcon}
            >
              {intl.formatMessage({
                defaultMessage: "View pool advertisement",
                description:
                  "Link text to view the public facing pool advertisement",
              })}
            </IconLink>
          </Spacer>
        </div>
      </FormProvider>
    </DashboardContentContainer>
  );
};

interface ViewPoolProps {
  poolId: string;
}

const ViewPool: React.FC<ViewPoolProps> = ({ poolId }) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useGetPoolQuery({
    variables: { id: poolId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.pool ? (
        <ViewPoolPage pool={data.pool} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Pool {poolId} not found.",
                description: "Message displayed for pool not found.",
              },
              { poolId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export default ViewPool;
