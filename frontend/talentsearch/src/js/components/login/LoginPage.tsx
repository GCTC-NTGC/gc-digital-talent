import React from "react";
import { useIntl } from "react-intl";

import { Link } from "@common/components";
import { getLocale } from "@common/helpers/localize";
import { imageUrl } from "@common/helpers/router";
import { useApiRoutes } from "@common/hooks/useApiRoutes";

import { useTalentSearchRoutes } from "../../talentSearchRoutes";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";

const keyRegistrationLink = (path: string, ...chunks: React.ReactNode[]) => (
  <a href={path}>{chunks}</a>
);

const LoginPage: React.FC = () => {
  const intl = useIntl();
  const paths = useApiRoutes();
  const talentPaths = useTalentSearchRoutes();
  const loginPath = paths.login(talentPaths.profile(), getLocale(intl));

  return (
    <>
      <div
        data-h2-padding="b(top-bottom, m) b(right-left, s)"
        data-h2-font-color="b(white)"
        data-h2-text-align="b(center)"
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
        <h1 data-h2-margin="b(top-bottom, l)">
          {intl.formatMessage({
            defaultMessage: "Login using GC Key",
            description: "Title for the login page for applicant profiles.",
          })}
        </h1>
      </div>
      <div data-h2-container="b(center, s)" data-h2-margin="b(top-bottom, xl)">
        <p>
          {intl.formatMessage({
            defaultMessage:
              "You can log into your Digital Talent profile using your existing GC Key, even if you’ve never used this platform before.",
            description: "Instructions on how to login with GC Key.",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "If you’re unsure whether you have an existing GC Key account, continue to the website and try logging in. If you can’t remember your password, you can also reset it there.",
            description:
              "Instructions on what to do if user doesn't know if they have a GC Key",
          })}
        </p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "<strong>Don't have a GC Key account?</strong> <a>Register for one.</a>",
              description:
                "Instruction on what to do if user does not have a GC Key.",
            },
            {
              a: (...chunks) => keyRegistrationLink(loginPath, chunks),
            },
          )}
        </p>
        <hr data-h2-margin="b(top-bottom, l)" />
        <div
          data-h2-display="b(flex)"
          data-h2-flex-direction="b(column) m(row)"
          data-h2-align-items="b(center)"
          data-h2-justify-content="b(space-between)"
        >
          <p>
            <Link href={loginPath} mode="outline" color="primary" type="button">
              {intl.formatMessage({
                defaultMessage: "Cancel",
                description:
                  "Link text to cancel logging in and return to talent search home.",
              })}
            </Link>
          </p>
          <p>
            <Link
              href={loginPath}
              mode="solid"
              type="button"
              color="primary"
              external
            >
              {intl.formatMessage({
                defaultMessage: "Continue to GC Key and Login",
                description: "GC Key login link text on the login page.",
              })}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
