import { defineMessage, useIntl } from "react-intl";
import type { MessageDescriptor } from "react-intl";

import { NineBoxRating } from "@gc-digital-talent/graphql";
import { Notice } from "@gc-digital-talent/ui";

interface NineBoxMessages {
  title: MessageDescriptor;
  body: MessageDescriptor;
}

const messages: Record<
  NineBoxRating,
  Record<NineBoxRating, NineBoxMessages>
> = {
  [NineBoxRating.Low]: {
    [NineBoxRating.Low]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this person participate in development opportunities",
        id: "Z2/I99",
        description: "Nine-box recommendation title for development",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee would benefit from focused development and performance support. They may require performance management or reassignment to a role better aligned with their strengths and capabilities. Development is recommended rather than a nomination for a lateral movement or advancement.",
        id: "VaiX1a",
        description:
          "Nine-box recommendation description for low performance and low leadership potential",
      }),
    },
    [NineBoxRating.Moderate]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this person participate in development opportunities",
        id: "Z2/I99",
        description: "Nine-box recommendation title for development",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee's performance is below expectations, but their leadership potential is evident. Targeted support and coaching could build readiness for leadership responsibilities. Development is recommended rather than a nomination for a lateral movement or advancement.",
        id: "RE2oVS",
        description:
          "Nine-box recommendation description for low performance and moderate leadership potential",
      }),
    },
    [NineBoxRating.High]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this person be nominated for lateral movement",
        id: "QwoLNe",
        description:
          "Nine-box recommendation title for development and lateral",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee’s performance is below expectations, but they demonstrate high leadership potential. A lateral move to a role better aligned with their strengths, combined with coaching and clear objectives, could unlock potential.",
        id: "WWTY2/",
        description:
          "Nine-box recommendation description for low performance and high leadership potential",
      }),
    },
  },
  [NineBoxRating.Moderate]: {
    [NineBoxRating.Low]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this person participate in development opportunities",
        id: "Z2/I99",
        description: "Nine-box recommendation title for development",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee meets performance expectations but has not yet demonstrated leadership potential. They are well suited to roles that value operational reliability, expertise and delivery. Development is recommended rather than a nomination for a lateral movement or advancement.",
        id: "qfTGNi",
        description:
          "Nine-box recommendation description for moderate performance and low leadership potential",
      }),
    },
    [NineBoxRating.Moderate]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this person be nominated for lateral movement",
        id: "QwoLNe",
        description:
          "Nine-box recommendation title for development and lateral",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee is reliable and effective in their current role and demonstrates moderate potential for growth. A lateral move to a role offering greater complexity or scope, supported by focused development, could broaden their experience and build their leadership capabilities.",
        id: "8VO06T",
        description:
          "Nine-box recommendation description for moderate performance and moderate leadership potential",
      }),
    },
    [NineBoxRating.High]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this person be nominated for lateral movement or advancement",
        id: "0SY3xR",
        description:
          "Nine-box recommendation title for development and lateral and advancement",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee is a strong performer with significant leadership potential. Lateral movement and advancement opportunities can provide strategic development, broaden leadership experience, and prepare them for medium- to long-term succession opportunities.",
        id: "M4O7dx",
        description:
          "Nine-box recommendation description for moderate performance and high leadership potential",
      }),
    },
  },
  [NineBoxRating.High]: {
    [NineBoxRating.Low]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this person be nominated for lateral movement",
        id: "QwoLNe",
        description:
          "Nine-box recommendation title for development and lateral",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee is highly effective in their current role and brings deep expertise that is critical to their domain. A lateral move that leverages or expands their expertise could provide meaningful development and organizational value, particularly where broader leadership responsibilities are not their preferred or best-fit path.",
        id: "b99hey",
        description:
          "Nine-box recommendation description for high performance and low leadership potential",
      }),
    },
    [NineBoxRating.Moderate]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this person be nominated for lateral movement or advancement",
        id: "0SY3xR",
        description:
          "Nine-box recommendation title for development and lateral and advancement",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee consistently delivers results and demonstrates the capacity for broader leadership. Stretch assignments, lateral moves, and advancement opportunities can broaden their experience and accelerate their readiness for medium- to long-term succession opportunities.",
        id: "Hr7xF2",
        description:
          "Nine-box recommendation description for high performance and moderate leadership potential",
      }),
    },
    [NineBoxRating.High]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this person be nominated for lateral movement or advancement",
        id: "0SY3xR",
        description:
          "Nine-box recommendation title for development and lateral and advancement",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee excels in their current role and demonstrates exceptional leadership potential. They should be considered a priority for advancement and role-specific succession planning, including opportunities to assume greater responsibility in the short term and inclusion in medium- to long-term succession pipelines.",
        id: "cU9OEC",
        description:
          "Nine-box recommendation description for high performance and high leadership potential",
      }),
    },
  },
};

interface NineBoxDescriptionProps {
  performance?: NineBoxRating;
  leadershipPotential?: NineBoxRating;
}

const NineBoxDescription = ({
  performance,
  leadershipPotential,
}: NineBoxDescriptionProps) => {
  const intl = useIntl();

  if (!performance || !leadershipPotential) {
    return null;
  }

  const { title, body } = messages[performance][leadershipPotential];

  return (
    <Notice.Root>
      <Notice.Title as="h3">{intl.formatMessage(title)}</Notice.Title>
      <Notice.Content>
        <p>{intl.formatMessage(body)}</p>
      </Notice.Content>
    </Notice.Root>
  );
};

export default NineBoxDescription;
