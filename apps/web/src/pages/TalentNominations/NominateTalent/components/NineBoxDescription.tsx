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
          "We recommend this employee be nominated for development opportunities",
        id: "5WRfMY",
        description:
          "Nine-box recommendation title for low performance and low leadership potential",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee might benefit from a focus in improvement. Low performance and limited leadership growth potential may require reassignment or performance management.",
        id: "F8y1Em",
        description:
          "Nine-box recommendation description for low performance and low leadership potential",
      }),
    },
    [NineBoxRating.Moderate]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this employee be nominated for development opportunities",
        id: "8Ge1Ni",
        description:
          "Nine-box recommendation title for low performance and moderate leadership potential",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee's performance is below expectations but their leadership potential is evident. They might benefit from targeted support and development opportunities.",
        id: "Uwoinr",
        description:
          "Nine-box recommendation description for low performance and moderate leadership potential",
      }),
    },
    [NineBoxRating.High]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this employee be nominated for development opportunities and lateral movement",
        id: "6NKzMy",
        description:
          "Nine-box recommendation title for low performance and high leadership potential",
      }),
      body: defineMessage({
        defaultMessage:
          "Gems are nominees that are performing below expectation by possess high leadership potential. They may benefit from coaching clearer goals, or role realignment to unlock their capabilities.",
        id: "bneVEC",
        description:
          "Nine-box recommendation description for low performance and high leadership potential",
      }),
    },
  },
  [NineBoxRating.Moderate]: {
    [NineBoxRating.Low]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this employee be nominated for development opportunities",
        id: "hBp8jr",
        description:
          "Nine-box recommendation title for moderate performance and low leadership potential",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee meets performance expectations and contributes steadily but has not yet demonstrated leadership potential. They are best suited for reliable leadership in operations.",
        id: "KpMuPk",
        description:
          "Nine-box recommendation description for moderate performance and low leadership potential",
      }),
    },
    [NineBoxRating.Moderate]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this employee be nominated for development opportunities and lateral movement",
        id: "0TWmTz",
        description:
          "Nine-box recommendation title for moderate performance and moderate leadership potential",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee is reliable and effective in their current role and has moderate potential for growth. They could take on more complex leadership roles with support and focused development.",
        id: "o96aNX",
        description:
          "Nine-box recommendation description for moderate performance and moderate leadership potential",
      }),
    },
    [NineBoxRating.High]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this employee be nominated for development opportunities, lateral movement and advancement",
        id: "2/HHJN",
        description:
          "Nine-box recommendation title for moderate performance and high leadership potential",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee is a solid performer with strong potential for leadership. They are likely ready for strategic development and medium to long term succession pipelines.",
        id: "ZCNqvU",
        description:
          "Nine-box recommendation description for moderate performance and high leadership potential",
      }),
    },
  },
  [NineBoxRating.High]: {
    [NineBoxRating.Low]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this employee be nominated for development opportunities and lateral movement",
        id: "kU1xVy",
        description:
          "Nine-box recommendation title for high performance and low leadership potential",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee is an expert contributor - they are highly effective in their current role and have deep expertise. They may not seek or be suited for expanded leadership but they are critical in their domain.",
        id: "FOVOHH",
        description:
          "Nine-box recommendation description for high performance and low leadership potential",
      }),
    },
    [NineBoxRating.Moderate]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this employee be nominated for development opportunities, lateral movement and advancement",
        id: "nGm0lD",
        description:
          "Nine-box recommendation title for high performance and moderate leadership potential",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee consistently delivers results and shows capacity for broader leadership. They may be ready for stretch assignments or cross-functional roles and medium to long term succession pipelines.",
        id: "dxBfv7",
        description:
          "Nine-box recommendation description for high performance and moderate leadership potential",
      }),
    },
    [NineBoxRating.High]: {
      title: defineMessage({
        defaultMessage:
          "We recommend this employee be nominated for development opportunities, lateral movement and advancement",
        id: "t13Jli",
        description:
          "Nine-box recommendation title for high performance and high leadership potential",
      }),
      body: defineMessage({
        defaultMessage:
          "This nominee excels in their current role and demonstrates exceptional leadership potential. They're an ideal candidate for short-term role-specific succession planning and medium to long term succession pipelines.",
        id: "7Ep9gj",
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
