import React from "react";
import { useIntl } from "react-intl";

import { Link } from "@common/components";
import { getLocale } from "@common/helpers/localize";
import { imageUrl } from "@common/helpers/router";
import { useApiRoutes } from "@common/hooks/useApiRoutes";

import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";

const keyRegistrationLink = (path: string, ...chunks: React.ReactNode[]) => (
  <a href={path}>{chunks}</a>
);

const RegisterPage: React.FC = () => {
  const intl = useIntl();
  const profilePaths = useApplicantProfileRoutes();
  const paths = useApiRoutes();
  const loginPath = paths.login(profilePaths.myProfile(), getLocale(intl));

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
            defaultMessage: "Register using GC Key",
            id: "zILELf",
            description:
              "Title for the registration page for applicant profiles.",
          })}
        </h1>
      </div>
      <div data-h2-padding="base(x3, 0)">
        <div data-h2-container="base(center, small, x1) p-tablet(center, small, x2)">
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You can log into your Digital Talent profile using your existing GC Key, even if you've never used this platform before.",
              id: "c3CV4P",
              description: "Instructions on how to login with GC Key.",
            })}
          </p>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "If you're unsure whether you have an existing GC Key account, continue to the website and try logging in. If you can't remember your password, you can also reset it there.",
              id: "pcnr9A",
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
                a: (...chunks) => keyRegistrationLink(loginPath, chunks),
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
              <Link href={loginPath} external>
                {intl.formatMessage({
                  defaultMessage: "Log in instead",
                  id: "rUFZwt",
                  description: "Login link text on the registration page.",
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
                  defaultMessage: "Continue to GC Key and Register",
                  id: "9yMdpm",
                  description:
                    "GC Key registration link text on the registration page.",
                })}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
