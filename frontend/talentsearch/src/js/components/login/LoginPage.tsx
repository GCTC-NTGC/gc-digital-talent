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

const boldText = (...chunks: React.ReactNode[]) => (
  <span data-h2-font-weight="base(800)">{chunks}</span>
);

const LoginPage: React.FC = () => {
  const intl = useIntl();
  const paths = useApiRoutes();
  const talentPaths = useTalentSearchRoutes();
  const loginPath = paths.login(talentPaths.profile(), getLocale(intl));

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
            description: "Title for the login page for applicant profiles.",
          })}
        </h1>
      </div>
      <div data-h2-container="base(center, s)" data-h2-margin="base(x3, 0)">
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
                "<b>Don't have a GC Key account?</b> <a>Register for one.</a>",
              description:
                "Instruction on what to do if user does not have a GC Key.",
            },
            {
              a: (...chunks) => keyRegistrationLink(loginPath, chunks),
              b: boldText,
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
