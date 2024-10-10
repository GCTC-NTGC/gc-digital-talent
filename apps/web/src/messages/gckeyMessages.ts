import { defineMessages } from "react-intl";

const messages = defineMessages({
  questionRecoveryCodes: {
    defaultMessage:
      "What if I deleted the app or changed phone and I don't have the recovery codes?",
    id: "RDHbAx",
    description: "GCKey question for when user does not have recovery codes",
  },
  answerRecoveryCodes: {
    defaultMessage:
      "Although your login cannot be recovered, you can contact our <helpLink>support team</helpLink> for help with recovering your account.",
    id: "jMx7Kb",
    description: "GCKey answer for when user does not have recovery codes",
  },
  questionRemove2FA: {
    defaultMessage:
      "Can you remove the two-factor authentication from my account so I can reset it?",
    id: "Un0ubb",
    description:
      "GCKey question for ability to remove two-factor authentication",
  },
  answerRemove2FA: {
    defaultMessage:
      "We cannot remove two-factor authentication, but you can contact our <helpLink>support team</helpLink> for help with recovering your account.",
    id: "fQ7zxR",
    description: "GCKey answer for ability to remove two-factor authentication",
  },
  questionAuthCodes: {
    defaultMessage:
      "What can I do if my authenticator codes are no longer being accepted?",
    id: "L9IkrB",
    description:
      "GCKey question for when user authenticator codes not accepted",
  },
  answerAuthCodes: {
    defaultMessage:
      "Please contact our <helpLink>support team</helpLink> for help with recovering your account.",
    id: "vweW8X",
    description: "GCKey answer for when user authenticator codes not accepted",
  },
  questionExistingAccount: {
    defaultMessage: "Already have a GCKey account?",
    id: "W3KFtQ",
    description: "GCKey question for when user already has an account",
  },
  answerExistingAccount: {
    defaultMessage:
      "If you already have a GCKey account, you can sign into your GC Digital Talent profile using your existing GCKey, even if you've never used this platform before. If you're unsure whether you have an existing GCKey account, continue to the website and try signing in. If you can't remember your password, you can also reset it there.",
    id: "oiaUxW",
    description: "GCKey answer for when user already has an account",
  },
  questionWhatGCKey: {
    defaultMessage: "What is a GCKey?",
    id: "WDKT2K",
    description: "GCKey question for what is GCKey",
  },
  answerWhatGCKey: {
    defaultMessage:
      "A GCKey is a central credential not managed by the GC Digital Talent team. The Government of Canada offers it as a way for you to communicate securely with many online-enabled Government programs and services.",
    id: "7tpJaQ",
    description: "GCKey answer for what is GCKey",
  },
  questionContactGCkey: {
    defaultMessage: "Who do I contact if I have questions about GCKey?",
    id: "XXZ2i3",
    description: "GCKey question for who to contact about GCKey",
  },
  answerContactGCkey1: {
    defaultMessage:
      "If you have questions about GCKey, please contact the GCKey team at",
    id: "6Ru0Ha",
    description:
      "GCKey answer for who to contact about GCKey, introduction sentence",
  },
  answerContactGCkey2: {
    defaultMessage: "Canada and the United States",
    id: "CdS26V",
    description:
      "GCKey answer for who to contact about GCKey, Canada and United States area for phone number",
  },
  answerContactGCkey3: {
    defaultMessage: "Text Telephone (TTY/TDD)",
    id: "gImGmr",
    description:
      "GCKey answer for who to contact about GCKey, text telephone title",
  },
  answerContactGCkey4: {
    defaultMessage: "Outside Canada and the United States",
    id: "pB5bOl",
    description:
      "GCKey answer for who to contact about GCKey, outside Canada and United States area for phone number",
  },
  answerContactGCkey5: {
    defaultMessage:
      "Customer service representatives are available to assist you by phone year-round, 24 hours a day, 7 days a week.",
    id: "Tp7hml",
    description:
      "GCKey answer for who to contact about GCKey, contact availability",
  },
  questionAuthApp: {
    defaultMessage: "Which authenticator app should I install?",
    id: "5mrOBM",
    description: "GCKey question for which authenticator app to use",
  },
  answerAuthApp: {
    defaultMessage:
      "As the Government of Canada, we cannot recommend any specific third-party vendors or apps. Well-known digital vendors, such as Google Authenticator and Microsoft Authenticator, provide authenticator apps. Whichever app you choose, ensure that it comes from a reputable vendor.",
    id: "/N8Owk",
    description: "GCKey answer for which authenticator app to use",
  },
  questionAuthAlternative: {
    defaultMessage: "Can I use SMS or email authentication instead of an app?",
    id: "zsU6/U",
    description:
      "GCKey question for whether there is an alternative to an authenticator app",
  },
  answerAuthAlternative: {
    defaultMessage:
      "Currently, our site supports authentication only through an authenticator app.",
    id: "nKExgi",
    description:
      "GCKey answer for whether there is an alternative to an authenticator app",
  },
  moreQuestions: {
    defaultMessage:
      "Read all the FAQs and still stuck? <helpLink>Contact our team for help</helpLink>",
    id: "dm3BlY",
    description: "GCKey question and answer for more support",
  },
});

export default messages;
