import * as React from "react";
import { motion } from "framer-motion";
import { useIntl } from "react-intl";
import { PoolCandidate, PoolCandidateStatus } from "~/api/generated";
import { Accordion, Heading, Well } from "@gc-digital-talent/ui";
import { isFuture, isPast, parseISO } from "date-fns";
import QualifiedRecruitmentCard from "./QualifiedRecruitmentCard";

interface AnimatedContentProps
  extends React.ComponentPropsWithoutRef<typeof Accordion.Content> {
  isOpen: boolean;
}

const animationVariants = {
  open: {
    height: "auto",
    opacity: 1,
  },
  closed: {
    height: 0,
    opacity: 0,
  },
};

const AnimatedContent = React.forwardRef<
  React.ElementRef<typeof Accordion.Content>,
  AnimatedContentProps
>(({ isOpen, children, ...rest }, forwardedRef) => (
  <Accordion.Content asChild forceMount ref={forwardedRef} {...rest}>
    <motion.div
      className="Accordion__Content"
      animate={isOpen ? "open" : "closed"}
      variants={animationVariants}
      transition={{ duration: 0.2, type: "tween" }}
    >
      {children}
    </motion.div>
  </Accordion.Content>
));

export type Application = Omit<PoolCandidate, "pool" | "user">;

interface QualifiedRecruitmentsProps {
  applications: Application[];
}

type AccordionItems = Array<"active" | "expired" | "">;

const QualifiedRecruitments = ({
  applications,
}: QualifiedRecruitmentsProps) => {
  const intl = useIntl();

  const activeRecruitments = applications.filter(
    ({ status, archivedAt, expiryDate }) => {
      const expiry = expiryDate ? parseISO(expiryDate) : null;
      return (
        status !== PoolCandidateStatus.Expired &&
        archivedAt === null &&
        (expiry ? isFuture(expiry) : true)
      );
    },
  );

  const expiredRecruitments = applications.filter(({ expiryDate }) => {
    const expiry = expiryDate ? parseISO(expiryDate) : null;

    return expiry ? isPast(expiry) : false;
  });

  const [currentAccordionItems, setCurrentAccordionItems] =
    React.useState<AccordionItems>([
      activeRecruitments.length > 0 ? "active" : "",
      expiredRecruitments.length > 0 ? "expired" : "",
    ]);

  return (
    <section>
      <div>
        <Heading level="h2" data-h2-font-weight="base(400)">
          {intl.formatMessage({
            defaultMessage: "My qualified recruitments",
            id: "wYe3P2",
            description:
              "Heading for my qualified recruitments section on the applicant dashboard.",
          })}
        </Heading>
        <p data-h2-margin="base(x1, 0, 0, 0)">
          {intl.formatMessage({
            defaultMessage:
              "Recruitments are pools of talent that Government of Canada managers can hire from. This section lists all recruitments you’re a part of, categorized into two groups:",
            id: "qU2ffO",
            description:
              "Description for my qualified recruitments section on the applicant dashboard.",
          })}
        </p>
        <ul
          data-h2-margin="base(x1, 0, 0, 0)"
          data-h2-padding="base(0, 0, x2, x1)"
        >
          <li>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "<strong>Active</strong> recruitments are processes that are currently being hired from. You can control whether your profile shows up when a manager requests talent from this group of people.",
                id: "jdTHer",
                description:
                  "Active list item for my qualified recruitments section on the applicant dashboard.",
              })}
            </p>
          </li>
          <li>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "<strong>Expired</strong> recruitments are processes that have ended either because they’ve become stale or because a new, more up-to-date recruitment has replaced them. You will not show up in results related to expired recruitments.",
                id: "qYjmRp",
                description:
                  "Expired list item for my qualified recruitments section on the applicant dashboard.",
              })}
            </p>
          </li>
        </ul>
      </div>
      <div>
        <Accordion.Root
          type="multiple"
          mode="simple"
          value={currentAccordionItems}
          onValueChange={(newValue: AccordionItems) => {
            setCurrentAccordionItems(newValue);
          }}
        >
          {/* Active Recruitments */}
          <Accordion.Item value="active">
            <Accordion.Trigger headerAs="h3">
              {intl.formatMessage({
                defaultMessage: "Active recruitments",
                id: "lfZeyc",
                description:
                  "Heading for active recruitments accordion on the applicant dashboard.",
              })}
            </Accordion.Trigger>
            <AnimatedContent isOpen={currentAccordionItems.includes("active")}>
              {activeRecruitments.length > 0 ? (
                activeRecruitments.map((activeRecruitment) => (
                  <QualifiedRecruitmentCard
                    key={activeRecruitment.id}
                    application={activeRecruitment}
                  />
                ))
              ) : (
                <Well data-h2-text-align="base(center)">
                  <p
                    data-h2-font-size="base(h5)"
                    data-h2-font-weight="base(700)"
                    data-h2-margin="base(0, 0, x.25, 0)"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Recruitments you've been accepted into will appear here.",
                      id: "VUjh3i",
                      description:
                        "Text displayed in active qualified recruitments section when empty.",
                    })}
                  </p>
                  <p data-h2-font-size="base(h6)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Recruitments in this section are actively being hired from.",
                      id: "eGPSG3",
                      description:
                        "Additional text displayed in active qualified recruitments section when empty.",
                    })}
                  </p>
                </Well>
              )}
            </AnimatedContent>
            {/* Expired Recruitments */}
          </Accordion.Item>
          <Accordion.Item value="expired">
            <Accordion.Trigger headerAs="h3">
              {intl.formatMessage({
                defaultMessage: "Expired recruitments",
                id: "6cH+cX",
                description:
                  "Heading for expired recruitments accordion on the applicant dashboard.",
              })}
            </Accordion.Trigger>
            <AnimatedContent isOpen={currentAccordionItems.includes("expired")}>
              {expiredRecruitments.length > 0 ? (
                expiredRecruitments.map((expiredRecruitment) => (
                  <QualifiedRecruitmentCard
                    key={expiredRecruitment.id}
                    application={expiredRecruitment}
                  />
                ))
              ) : (
                <Well data-h2-text-align="base(center)">
                  <p
                    data-h2-font-size="base(h5)"
                    data-h2-font-weight="base(700)"
                    data-h2-margin="base(0, 0, x.25, 0)"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Recruitments that are no longer active will appear here.",
                      id: "Cx0rjV",
                      description:
                        "Text displayed in active qualified recruitments section when empty.",
                    })}
                  </p>
                  <p data-h2-font-size="base(h6)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Recruitments in this section are no longer being considered for hiring purposes.",
                      id: "A5CLzi",
                      description:
                        "Additional text displayed in active qualified recruitments section when empty.",
                    })}
                  </p>
                </Well>
              )}
            </AnimatedContent>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </section>
  );
};

export default QualifiedRecruitments;
