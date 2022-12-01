import React from "react";
import { useIntl } from "react-intl";

import Link, { ExternalLink } from "@common/components/Link";
import { getLocale } from "@common/helpers/localize";
import imageUrl from "@common/helpers/imageUrl";
import { useApiRoutes } from "@common/hooks/useApiRoutes";

import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import useRoutes from "../../hooks/useRoutes";

const keyRegistrationLink = (
  path: string,
  chunks: React.ReactNode,
): React.ReactNode => <a href={path}>{chunks}</a>;

const LoginPage: React.FC = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const apiPaths = useApiRoutes();
  const loginPath = apiPaths.login(paths.myProfile(), getLocale(intl));

  return (
    <>
      <div
        data-h2-padding="base(x1, x.5)"
        data-h2-color="base(dt-white)"
        data-h2-text-align="base(center)"
        style={{
          background: `url(${imageUrl(
            TALENTSEARCH_APP_DIR,
            "applicant-profile-banner.png",
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 data-h2-margin="base(x2, 0)">
          {intl.formatMessage({
            defaultMessage: "Login using GC Key",
            id: "Z3prc4",
            description: "Title for the login page for applicant profiles.",
          })}
        </h1>
      </div>
      <div data-h2-padding="base(x3, 0)">
        <div data-h2-container="base(center, small, x1) p-tablet(center, small, x2)">
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You can log into your Digital Talent profile using your existing GC Key, even if you’ve never used this platform before.",
              id: "K7wsxV",
              description: "Instructions on how to login with GC Key.",
            })}
          </p>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "If you’re unsure whether you have an existing GC Key account, continue to the website and try logging in. If you can’t remember your password, you can also reset it there.",
              id: "Q2+VXx",
              description:
                "Instructions on what to do if user doesn't know if they have a GC Key",
            })}
          </p>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "<strong>Don't have a GC Key account?</strong> <a>Register for one.</a>",
                id: "ofOoFQ",
                description:
                  "Instruction on what to do if user does not have a GC Key.",
              },
              {
                a: (chunks) => keyRegistrationLink(loginPath, chunks),
              },
            )}
          </p>
          <hr data-h2-margin="base(x2, 0)" />
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) l-tablet(row)"
            data-h2-align-items="base(center)"
            data-h2-justify-content="base(space-between)"
          >
            <p>
              <Link
                href={paths.home()}
                mode="outline"
                color="secondary"
                type="button"
              >
                {intl.formatMessage({
                  defaultMessage: "Cancel",
                  id: "OT0QP3",
                  description:
                    "Link text to cancel logging in and return to talent search home.",
                })}
              </Link>
            </p>
            <p>
              <ExternalLink
                href={loginPath}
                mode="solid"
                type="button"
                color="primary"
              >
                {intl.formatMessage({
                  defaultMessage: "Continue to GC Key and Login",
                  id: "CZcsxM",
                  description: "GC Key login link text on the login page.",
                })}
              </ExternalLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
