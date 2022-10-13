// Vendor dependencies
import React from "react";
import {
  CurrencyDollarIcon,
  BoltIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

// Local assets
import { Link, Pill } from "@common/components";
import Heading from "@common/components/Heading";
import "./RecruitmentCardStyles.css";

// Define the interface
export interface RecruitmentCardProps {
  data: {
    classification: string;
    title: string;
    description: string;
    salary: {
      min: string;
      max: string;
    };
    skills: string[];
    closing: string;
  };
}

// Create the page component
const RecruitmentCard: React.FC<RecruitmentCardProps> = ({
  data,
}): React.ReactElement => {
  return (
    <div
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-shadow="base(large)"
      data-h2-margin="base(0, 0, x1, 0)"
      data-h2-padding="base(x1) p-tablet(x1, x1, x1, x6) l-tablet(x2, x2, x2, x8)"
      data-h2-position="base(relative)"
      data-h2-radius="base(rounded)"
    >
      <div
        data-h2-position="base(absolute)"
        data-h2-offset="base(0, auto, auto, x.5) p-tablet(0, auto, auto, x2)"
      >
        <div
          data-h2-background-color="base(tm-blue)"
          data-h2-padding="base(x2, x.5, x1, x.5)"
          className="recruitment-flag"
        >
          <span
            data-h2-color="base(black)"
            data-h2-font-weight="base(700)"
            data-h2-font-size="base(h6) l-tablet(h4, 1.2)"
            data-h2-layer="base(2, relative)"
          >
            {data.classification}
          </span>
        </div>
      </div>
      <div data-h2-position="base(relative)">
        <div
          data-h2-padding="base(x.75, 0, 0, x3.5) p-tablet(0)"
          data-h2-display="p-tablet(flex)"
          data-h2-gap="base(x2)"
          data-h2-align-items="base(center)"
          data-h2-margin="base(0, 0, x1, 0)"
        >
          <Heading
            level="h3"
            data-h2-font-size="base(h4, 1.2)"
            data-h2-margin="base(0, 0, x1, 0) p-tablet(0)"
            style={{ wordBreak: "break-word" }}
          >
            {data.title}
          </Heading>
          <div
            data-h2-flex-grow="p-tablet(1)"
            data-h2-height="base(x.25)"
            data-h2-background-color="base(tm-blue)"
          />
        </div>
        <div
          data-h2-display="p-tablet(grid)"
          data-h2-gap="base(x3, x1)"
          data-h2-grid-template-columns="base(repeat(2, minmax(0, 1fr)))"
          data-h2-grid-template-rows="base(2fr)"
        >
          <p>{data.description}</p>
          <div
            data-h2-grid-column="base(2)"
            data-h2-grid-row="base(1/3)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
          >
            <p
              data-h2-margin="base(x1, 0) p-tablet(0, 0, x1, 0)"
              data-h2-flex-grow="base(1)"
            >
              <span data-h2-font-weight="base(700)">
                <span
                  data-h2-width="base(x1)"
                  data-h2-display="base(inline-block)"
                  data-h2-margin="base(0, x.5, 0, 0)"
                  data-h2-vertical-align="base(middle)"
                >
                  <CurrencyDollarIcon />
                </span>{" "}
                {/* Needs translation string */}
                Salary range:
              </span>{" "}
              <span
                data-h2-display="base(block) l-tablet(inline)"
                data-h2-padding="base(0, 0, 0, x1.7) l-tablet(0)"
              >
                {data.salary.min} - {data.salary.max}
              </span>
            </p>
            <p data-h2-margin="base(0, 0, x1, 0)" data-h2-flex-grow="base(1)">
              <span data-h2-font-weight="base(700)">
                <span
                  data-h2-width="base(x1)"
                  data-h2-display="base(inline-block)"
                  data-h2-margin="base(0, x.5, 0, 0)"
                  data-h2-vertical-align="base(middle)"
                >
                  <BoltIcon />
                </span>{" "}
                {/* Needs translation string */}
                Required skills:
              </span>
              <br />
              <div
                data-h2-padding="base(0, 0, 0, x1.7)"
                data-h2-display="base(flex)"
                data-h2-gap="base(x.25)"
                data-h2-flex-wrap="base(wrap)"
              >
                {data.skills.map((skill) => (
                  // Needs proper key
                  <Pill
                    key=""
                    color="blue"
                    mode="outline"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {skill}
                  </Pill>
                ))}
              </div>
            </p>
            <p
              data-h2-margin="base(0, 0, x1, 0) p-tablet(0, 0, x.5, 0)"
              data-h2-flex-grow="base(1)"
            >
              <span data-h2-font-weight="base(700)">
                <span
                  data-h2-width="base(x1)"
                  data-h2-display="base(inline-block)"
                  data-h2-margin="base(0, x.5, 0, 0)"
                  data-h2-vertical-align="base(middle)"
                >
                  <CalendarDaysIcon />
                </span>{" "}
                {/* Needs translation string */}
                Apply by:
              </span>{" "}
              <span
                data-h2-display="base(block) l-tablet(inline)"
                data-h2-padding="base(0, 0, 0, x1.7) l-tablet(0)"
              >
                {data.closing}
              </span>
            </p>
          </div>
          <div>
            <Link
              color="blue"
              mode="solid"
              type="button"
              weight="bold"
              // Needs a proper route
              href="#ADD-A-PATH"
              // Needs a translated string
              title="Login or register to submit your profile as an application to this process."
              data-h2-text-align="base(center)"
              data-h2-display="base(inline-block)"
            >
              {/* Needs a translated string */}
              Apply to this recruitment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default RecruitmentCard;
