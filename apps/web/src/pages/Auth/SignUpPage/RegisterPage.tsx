import { ReactNode, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import SparklesIcon from "@heroicons/react/20/solid/SparklesIcon";
import ChevronDoubleRightIcon from "@heroicons/react/24/solid/ChevronDoubleRightIcon";

import { Accordion, Container, Heading, Link } from "@gc-digital-talent/ui";
import { useApiRoutes } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";
import { useTheme } from "@gc-digital-talent/theme";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import canadaLoginStep1 from "~/assets/img/canada_login_registration_step_1_light.webp";
import canadaLoginStep1Dark from "~/assets/img/canada_login_registration_step_1_dark.webp";
import canadaLoginStep2 from "~/assets/img/canada_login_registration_step_2_light.webp";
import canadaLoginStep2Dark from "~/assets/img/canada_login_registration_step_2_dark.webp";
import canadaLoginStep3 from "~/assets/img/canada_login_registration_step_3_light.webp";
import canadaLoginStep3Dark from "~/assets/img/canada_login_registration_step_3_dark.webp";
import canadaLoginStep4 from "~/assets/img/canada_login_registration_step_4_light.webp";
import canadaLoginStep4Dark from "~/assets/img/canada_login_registration_step_4_dark.webp";
import canadaLoginStep5 from "~/assets/img/canada_login_registration_step_5_light.webp";
import canadaLoginStep5Dark from "~/assets/img/canada_login_registration_step_5_dark.webp";
import canadaLoginStep6 from "~/assets/img/canada_login_registration_step_6_light.webp";
import canadaLoginStep6Dark from "~/assets/img/canada_login_registration_step_6_dark.webp";
import canadaLoginStep7 from "~/assets/img/canada_login_registration_step_7_light.webp";
import canadaLoginStep7Dark from "~/assets/img/canada_login_registration_step_7_dark.webp";
import canadaLoginStep8 from "~/assets/img/canada_login_registration_step_8_light.webp";
import canadaLoginStep8Dark from "~/assets/img/canada_login_registration_step_8_dark.webp";
import canadaLoginStep9 from "~/assets/img/canada_login_registration_step_9_light.webp";
import canadaLoginStep9Dark from "~/assets/img/canada_login_registration_step_9_dark.webp";
import gckeyMessages from "~/messages/gckeyMessages";
import InstructionsStepCard, {
  InstructionsCardGrid,
} from "~/components/Instructions/RegisterInstructionStep";
import Caption from "~/components/BasicInformation/Caption";

const helpLink = (chunks: ReactNode, path: string) => (
  <Link href={path} state={{ referrer: window.location.href }}>
    {chunks}
  </Link>
);

const buildExternalLink = (path: string, chunks: ReactNode) => (
  <Link external href={path}>
    {chunks}
  </Link>
);

export const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const apiPaths = useApiRoutes();
  const [searchParams] = useSearchParams();
  const { key: themeKey, setKey: setThemeKey } = useTheme();
  const fromPath = searchParams.get("from");
  const iapMode =
    fromPath === paths.iap() || searchParams.get("personality") === "iap";
  const fallbackPath = paths.applicantDashboard();
  const loginPath = apiPaths.login(fromPath ?? fallbackPath, getLocale(intl));

  const pageTitle = intl.formatMessage({
    defaultMessage: "Register using CanadaLogin",
    id: "YrLqGs", //TODO
    description: "Page title for the registration page for applicant profiles",
  });

  const pageCrumbs = intl.formatMessage({
    defaultMessage: "Register",
    id: "Lg63Gp", // TODO
    description:
      "Breadcrumb text for the registration page for applicant profiles",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: pageCrumbs,
        url: paths.register(),
      },
    ],
  });

  useEffect(() => {
    if (iapMode && themeKey !== "iap") {
      setThemeKey("iap");
    }
  }, [iapMode, themeKey, setThemeKey]);

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} overlap={true} centered={true}>
        <div className="rounded-md bg-white px-6 py-12 shadow-sm dark:bg-gray-600">
          {!iapMode && (
            <div className="px-2">
              <Heading
                level="h3"
                size="h4"
                color="primary"
                icon={SparklesIcon}
                className="mt-0 font-normal"
              >
                {intl.formatMessage({
                  defaultMessage: "Welcome",
                  id: "qrd+vb", // TODO
                  description:
                    "Welcome heading at the top of the registration page",
                })}
              </Heading>
              <p className="pt-2 pl-2">
                {intl.formatMessage({
                  defaultMessage:
                    "You'll be leaving our site to register with CanadaLogin. We have prepared additional guidance in the next section to help.",
                  id: "xgrysZ", // TODO
                  description:
                    "Copy under welcome heading at the top of the registration page",
                })}
              </p>
              <div className="flex flex-col items-start gap-4 pt-6 pl-2 xs:flex-row xs:items-center">
                <Link
                  href={paths.registrationExperience()} // TODO
                  mode="solid"
                  color="primary"
                  utilityIcon={ChevronDoubleRightIcon}
                  external
                >
                  {intl.formatMessage({
                    defaultMessage: "Proceed to CanadaLogin",
                    id: "KorMJQ", // TODO
                    description:
                      "CanadaLogin sign up link text on the registration page",
                  })}
                </Link>
                <p className="m-0 flex items-center lg:pl-2">
                  <Link
                    href={paths.registrationExperience()} // TODO
                    mode="inline"
                    external
                    className="lg:ml-2"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Instructions on how to register",
                      id: "FnXbHv", // TODO
                      description:
                        "Heading for the instructions resource block on the registration page",
                    })}
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </Hero>

      <Container className="my-12">
        {!iapMode ? (
          <>
            <Heading level="h3" size="h4" className="mt-6 mb-6">
              {intl.formatMessage({
                defaultMessage: "Part 1: Create a CanadaLogin account",
                id: "Su2+bZ", // TODO
                description:
                  "Heading for section of the registration page showing the create steps",
              })}
            </Heading>

            <InstructionsCardGrid columns={3}>
              <InstructionsStepCard
                className="rounded-t-md rounded-b-none xs:rounded-l-md xs:rounded-r-none"
                img={{ src: canadaLoginStep1, darkSrc: canadaLoginStep1Dark }}
              >
                <p className="font-semibold">
                  {intl.formatMessage({
                    defaultMessage: "Head to CanadaLogin.",
                    id: "sRUaI5", // TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <p className="mt-4 font-semibold">
                  {intl.formatMessage({
                    defaultMessage: "Agree to the summary of terms.",
                    id: "qSNLSc", // TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <div className="mt-4">
                  <Caption>
                    {intl.formatMessage({
                      defaultMessage:
                        "If you've already used CanadaLogin on another service, you can enter your email and password and skip to step 2.",
                      id: "fqX7jB", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </Caption>
                </div>
              </InstructionsStepCard>

              <InstructionsStepCard
                className="rounded-none bg-gray-100/30 dark:bg-gray-700/50"
                img={{ src: canadaLoginStep2, darkSrc: canadaLoginStep2Dark }}
              >
                <p className="font-semibold">
                  {intl.formatMessage({
                    defaultMessage: "Enter your first and last name.",
                    id: "FD+jX4", // TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <div className="mt-4">
                  <Caption>
                    {intl.formatMessage({
                      defaultMessage:
                        "The name you use here will be on your GC Digital Talent profile.",
                      id: "8dctGM", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </Caption>
                </div>
              </InstructionsStepCard>

              <InstructionsStepCard
                className="rounded-t-none rounded-b-md xs:rounded-l-none xs:rounded-r-md"
                includeArrow={false}
                img={{ src: canadaLoginStep3, darkSrc: canadaLoginStep3Dark }}
              >
                <p className="font-semibold">
                  {intl.formatMessage({
                    defaultMessage: "Verify your personal email address.",
                    id: "Ip9S/o", // TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <p className="mt-4 font-semibold">
                  {intl.formatMessage({
                    defaultMessage:
                      "Enter the code sent to your email into CanadaLogin.",
                    id: "XLJuh+", // TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <div className="mt-4">
                  <Caption>
                    {intl.formatMessage({
                      defaultMessage:
                        "Using a personal email address will help ensure you don't lose access if you change jobs.",
                      id: "OG/Fbe", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </Caption>
                </div>
              </InstructionsStepCard>
            </InstructionsCardGrid>

            <Heading level="h3" size="h4" className="mt-14 mb-6">
              {intl.formatMessage({
                defaultMessage: "Part 2: Set up two-step verification",
                id: "OxuU1/", // TODO
                description:
                  "Heading for section of the registration page showing the create steps",
              })}
            </Heading>

            <InstructionsCardGrid columns={3}>
              <InstructionsStepCard
                className="rounded-t-md rounded-b-none xs:rounded-l-md xs:rounded-r-none"
                img={{ src: canadaLoginStep4, darkSrc: canadaLoginStep4Dark }}
              >
                <p className="font-semibold">
                  {intl.formatMessage({
                    defaultMessage: "Set up two-step verification.",
                    id: "D/Tcaj", //TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <p className="mt-10 font-semibold">
                  {intl.formatMessage({
                    defaultMessage: "Enter your personal phone number.",
                    id: "XUt7q+", // TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <div className="mt-6">
                  <Caption>
                    {intl.formatMessage({
                      defaultMessage:
                        "Using a personal phone number will help ensure you don't lose access if you change jobs.",
                      id: "QbJmAL", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </Caption>
                </div>
              </InstructionsStepCard>

              <InstructionsStepCard
                className="rounded-none bg-gray-100/30 dark:bg-gray-700/50"
                img={{ src: canadaLoginStep5, darkSrc: canadaLoginStep5Dark }}
              >
                <p className="font-semibold">
                  {intl.formatMessage({
                    defaultMessage:
                      "You will be sent a code to the number you provided.",
                    id: "QU8yQJ", // TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <p className="mt-4 font-semibold">
                  {intl.formatMessage({
                    defaultMessage: "Enter the code into CanadaLogin.",
                    id: "pTOGhN", // TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <div className="mt-6">
                  <Caption>
                    {intl.formatMessage({
                      defaultMessage:
                        "This code will be sent by either text or phone call, and will expire after ten minutes.",
                      id: "As56gg", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </Caption>
                </div>
              </InstructionsStepCard>

              <InstructionsStepCard
                className="rounded-t-none rounded-b-md xs:rounded-l-none xs:rounded-r-md"
                includeArrow={false}
                img={{ src: canadaLoginStep6, darkSrc: canadaLoginStep6Dark }}
              >
                <p className="font-semibold">
                  {intl.formatMessage({
                    defaultMessage:
                      "You've successfully created your CanadaLogin.",
                    id: "To1Tf5", // TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <p className="mt-4 font-semibold">
                  {intl.formatMessage({
                    defaultMessage:
                      "You will be returned to the GC Digital Talent platform.",
                    id: "FJU6Pr", // TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
              </InstructionsStepCard>
            </InstructionsCardGrid>

            <Heading level="h3" size="h4" className="mt-14 mb-6">
              {intl.formatMessage({
                defaultMessage: "Part 3: Access your account",
                id: "WsnfHy", // TODO
                description:
                  "Heading for section of the registration page showing the create steps",
              })}
            </Heading>

            <InstructionsCardGrid columns={3}>
              <InstructionsStepCard
                className="rounded-t-md rounded-b-none xs:rounded-l-md xs:rounded-r-none"
                img={{ src: canadaLoginStep7, darkSrc: canadaLoginStep7Dark }}
              >
                <p className="font-semibold">
                  {intl.formatMessage({
                    defaultMessage:
                      "View your details sent from CanadaLogin, linked to your GC Digital Talent profile.",
                    id: "IHcJGO", //TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <div className="mt-4">
                  <Caption>
                    {intl.formatMessage({
                      defaultMessage:
                        "You can manage your CanadaLogin profile and security setting on the CanadaLogin website.",
                      id: "dzXJ2h", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </Caption>
                </div>
              </InstructionsStepCard>

              <InstructionsStepCard
                className="rounded-none bg-gray-100/30 dark:bg-gray-700/50"
                img={{ src: canadaLoginStep8, darkSrc: canadaLoginStep8Dark }}
              >
                <p className="font-semibold">
                  {intl.formatMessage({
                    defaultMessage:
                      "Verify your Government of Canada work email to unlock employee tools.",
                    id: "jrDcs6", // TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <div className="mt-10">
                  <Caption>
                    {intl.formatMessage({
                      defaultMessage:
                        "This feature is only available to current Government of Canada employees.",
                      id: "Bo2POt", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </Caption>
                </div>
              </InstructionsStepCard>

              <InstructionsStepCard
                className="rounded-t-none rounded-b-md xs:rounded-l-none xs:rounded-r-md"
                includeArrow={false}
                img={{ src: canadaLoginStep9, darkSrc: canadaLoginStep9Dark }}
              >
                <p className="font-semibold">
                  {intl.formatMessage({
                    defaultMessage:
                      "Add your current work experience to your GC Digital Talent profile.",
                    id: "eg07u9", // TODO
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <div className="mt-10">
                  <Caption>
                    {intl.formatMessage({
                      defaultMessage:
                        "If you are a government employee this is the final step in-order to unlock your employee tools.",
                      id: "2bKnmd", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </Caption>
                </div>
              </InstructionsStepCard>
            </InstructionsCardGrid>

            <Heading
              icon={InformationCircleIcon}
              color="primary"
              level="h2"
              size="h3"
              className="mt-18 mb-6 font-normal"
            >
              {intl.formatMessage({
                defaultMessage: "Frequently Asked Questions (FAQs)",
                id: "AUtIo9",
                description:
                  "Heading for Frequently Asked Questions section on sign in page",
              })}
            </Heading>
            <Accordion.Root
              type="single"
              size="sm"
              mode="card"
              collapsible
              className="my-16"
            >
              <Accordion.Item value="one">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionWhatGCKey)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>{intl.formatMessage(gckeyMessages.answerWhatGCKey)}</p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="two">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionContactGCkey)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p className="mb-3">
                    {intl.formatMessage(gckeyMessages.answerContactGCkey1)}
                  </p>
                  <p className="mb-3">
                    {intl.formatMessage(gckeyMessages.answerContactGCkey2)}
                  </p>
                  <p className="mb-3">
                    <Link
                      color="black"
                      external
                      href="tel:1-855-438-1102"
                      aria-label="1 8 5 5 4 3 8 1 1 0 2"
                    >
                      1-855-438-1102
                    </Link>
                  </p>
                  <p className="mb-3">
                    {intl.formatMessage(gckeyMessages.answerContactGCkey3)}
                  </p>
                  <p className="mb-3">
                    <Link
                      color="black"
                      external
                      href="tel:1-855-438-1103"
                      aria-label="1 8 5 5 4 3 8 1 1 0 3"
                    >
                      1-855-438-1103
                    </Link>
                  </p>
                  <p className="mb-3">
                    {intl.formatMessage(gckeyMessages.answerContactGCkey4)}
                  </p>
                  <p className="mb-3">
                    <Link
                      color="black"
                      external
                      href="tel:1-800-2318-6290"
                      aria-label="1 8 0 0 2 3 1 8 6 2 9 0"
                    >
                      1-800-2318-6290
                    </Link>
                  </p>
                  <p>{intl.formatMessage(gckeyMessages.answerContactGCkey5)}</p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="three">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionAuthApp)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>{intl.formatMessage(gckeyMessages.answerAuthApp)}</p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="four">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionRecoveryCodes)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(gckeyMessages.answerRecoveryCodes, {
                      helpLink: (chunks: ReactNode) =>
                        helpLink(chunks, paths.support()),
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="five">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionAuthAlternative)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(gckeyMessages.answerAuthAlternative)}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="six">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionRemove2FA)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(gckeyMessages.answerRemove2FA, {
                      helpLink: (chunks: ReactNode) =>
                        helpLink(chunks, paths.support()),
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="seven">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionAuthCodes)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(gckeyMessages.answerAuthCodes, {
                      helpLink: (chunks: ReactNode) =>
                        helpLink(chunks, paths.support()),
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="eight">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionExistingAccount)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(gckeyMessages.answerExistingAccount)}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
            <p className="mt-6">
              {intl.formatMessage(gckeyMessages.moreQuestions, {
                helpLink: (chunks: ReactNode) =>
                  helpLink(chunks, paths.support()),
              })}
            </p>
          </>
        ) : (
          <>
            {/* IAP copy */}
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "You can sign in to your IT Apprenticeship Program for Indigenous Peoples profile using your existing GCKey, even if you've never used this platform before.",
                id: "6SfJEp",
                description:
                  "Instructions on how to sign in with GCKey - IAP variant",
              })}
            </p>
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "If you're unsure of whether you have an existing GCKey account, continue to the website and try signing in. If you can't remember your password, you can also reset it there.",
                id: "Z+gi2d",
                description:
                  "Instructions on what to do if user doesn't know if they have a GCKey - IAP variant",
              })}
            </p>
            <p className="mb-6">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<strong>Don't have a GCKey account?</strong> <a>Sign up for one</a>.",
                  id: "QsWizb",
                  description:
                    "Instruction on what to do if user does not have a GCKey",
                },
                {
                  a: (chunks: ReactNode) =>
                    buildExternalLink(loginPath, chunks),
                },
              )}
            </p>
            <p className="mb-12">
              {intl.formatMessage({
                defaultMessage:
                  "<strong>Heads up!</strong> Before we send you off to set up your GCKey credentials, we ask that you take another look at the program's eligibility criteria to ensure that you meet the requirements.",
                id: "ow71P8",
                description:
                  "A request for the user to review the IAP eligibility criteria",
              })}
            </p>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "If you have questions concerning this step, or if you are unsure about how to proceed, please feel free to reach out to our support team at <a>edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca</a>.",
                  id: "ltzA7w",
                  description:
                    "How to get help from the support team - IAP variant",
                },
                {
                  a: (chunks: ReactNode) =>
                    buildExternalLink(
                      "mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca",
                      chunks,
                    ),
                },
              )}
            </p>
          </>
        )}
      </Container>
    </>
  );
};

Component.displayName = "SignUpPage";

export default Component;
