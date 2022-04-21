import * as React from "react";
import { useIntl } from "react-intl";
import { Button } from "@common/components";
import { imageUrl } from "@common/helpers/router";

import INDIGENOUSAPPRENTICESHIP_APP_DIR from "../../indigenousApprenticeshipConstants";

const HelloWorld: React.FunctionComponent = (props) => {
  const intl = useIntl();
  return (
    <div data-h2-overflow="b(x, hidden)">
      <div
        className="hero"
        data-h2-position="b(relative)"
        data-h2-overflow="b(all, hidden)"
      >
        <div data-h2-container="b(center, full)">
          <div
            data-h2-padding="b(all, l)"
            data-h2-display="b(flex)"
            data-h2-flex-direction="b(column)"
            data-h2-align-items="b(center)"
            data-h2-justify-content="b(space-between)"
          >
            <div className="hero__logo" data-h2-width="s(100) m(50)">
              <h1 data-h2-margin="b(top, xs)">
                <img
                  data-h2-width="b(100)"
                  src={imageUrl(
                    INDIGENOUSAPPRENTICESHIP_APP_DIR,
                    "logo-en-lg.png",
                  )}
                  alt={intl.formatMessage({
                    defaultMessage:
                      "IT Apprenticeship Program for Indigenous Peoples",
                    description:
                      "Homepage title for Indigenous Apprenticeship Program",
                  })}
                />
              </h1>
            </div>
            <div
              className="hero__apply"
              data-h2-display="b(flex)"
              data-h2-justify-content="b(center)"
              data-h2-width="m(25)"
            >
              <Button color="ia-primary" mode="solid" block>
                {intl.formatMessage({
                  defaultMessage: "Apply Now",
                  description: "Button text to apply for program",
                })}
              </Button>
            </div>
          </div>
        </div>
        <img
          className="hero__image"
          src={imageUrl(INDIGENOUSAPPRENTICESHIP_APP_DIR, "hero.jpg")}
          alt=""
          data-h2-position="b(absolute)"
        />
      </div>
      <div
        className="about-program"
        data-h2-container="m(center, m)"
        data-h2-margin="m(bottom, xxl)"
        data-h2-padding="b(all, l)"
        data-h2-position="b(relative)"
        data-h2-bg-color="b(white)"
        data-h2-radius="b(s)"
      >
        <div data-h2-display="m(flex)">
          <div
            className="about-program__image-wrapper"
            data-h2-position="b(relative)"
            data-h2-padding="b(right-left, m) m(left, l) m(right, xxl)"
          >
            <img
              src={imageUrl(
                INDIGENOUSAPPRENTICESHIP_APP_DIR,
                "indigenous-woman-smiling.jpg",
              )}
              className="about-program__image"
              alt=""
              data-h2-position="b(relative)"
              data-h2-radius="b(s)"
              data-h2-shadow="b(xs)"
            />
            <div
              className="circle circle--top-right"
              data-h2-position="b(absolute)"
              data-h2-bg-color="b(ia-pink)"
            ></div>
            <div
              className="circle circle--lg circle--bottom-left"
              data-h2-position="b(absolute)"
              data-h2-bg-color="b(ia-purple)"
            ></div>
            <img
              src={imageUrl(INDIGENOUSAPPRENTICESHIP_APP_DIR, "feathers.png")}
              className="about-program__feathers"
              alt=""
              data-h2-position="b(absolute)"
            />
          </div>
          <div>
            <h2
              className="about-program__title"
              data-h2-font-color="b(ia-darkpink)"
              data-h2-font-weight="b(700)"
            >
              {intl.formatMessage({
                defaultMessage: "About the Program",
                description: "Program information section title",
              })}
            </h2>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "The IT Apprenticeship Program for Indigenous Peoples is a Government of Canada initiative specifically for First Nations, Inuit, and Métis peoples. It is pathway to employment in the federal public service for Indigenous peoples who have a passion for Information Technology (IT).",
                description: "First paragraph about the program",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "By valuing and focusing on a person’s potential, rather than on their educational attainment level, the Program removes one of the biggest barriers that exists when it comes to employment within the digital economy. The Program has been developed by, with, and for Indigenous peoples from across Canada.  Its design incorporates the preferences and needs of Indigenous learners while recognizing the importance of community.",
                description: "Second paragraph about the program",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Apprentices who are involved in the program say that it is “life-changing”, that it represents “a chance to have a better life through technology”, and that “there are no barriers to succeeding in this program”.",
                description: "Third paragraph about the program",
              })}
            </p>
            <div data-h2-display="m(flex)">
              <div data-h2-width="m(50)" data-h2-margin="b(bottom, m) m(right, s)">
                <Button color="ia-primary" mode="solid" block>
                  {intl.formatMessage({
                    defaultMessage: "Apply Now",
                    description: "Button text to apply for program",
                  })}
                </Button>
              </div>
              <div data-h2-width="m(50)" data-h2-margin="b(bottom, m) m(left, s)">
                <Button color="ia-secondary" mode="outline" block>
                  {intl.formatMessage({
                    defaultMessage: "Learn More",
                    description: "Button text to learn more about the program",
                  })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelloWorld;
