import { defineMessages } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

const messages = {
  saveContinue: commonMessages.saveAndContinue,
  ...defineMessages({
    saveQuit: {
      defaultMessage: "Save and quit for now",
      id: "U86N4g",
      description: "Action button to save and exit an application",
    },
    numberedStepIntro: {
      defaultMessage: "Step {stepOrdinal} (Intro)",
      id: "h8BHov",
      description:
        "Breadcrumb link text for a numbered application step introduction page",
    },
    reservedForIndigenous: {
      defaultMessage:
        "This opportunity is intended for Indigenous candidates only.",
      id: "/fvZtZ",
      description:
        "Error message displayed when a user's equity information does not match an opportunity",
    },
    postSecondaryEducation: {
      defaultMessage:
        "Graduation from a program of 2 years or more offered by a <link>recognized post-secondary institution</link>. The program must have a specialization in computer science, information technology, information management or another specialty relevant to this advertisement.",
      id: "tJLZYs",
      description:
        "Descriptive text explaining a valid post secondary education.",
    },
    appliedWorkExperience: {
      defaultMessage:
        "Combined experience in computer science, information technology, information management or another specialty relevant to this advertisement, including any of the following:",
      id: "0HPwnA",
      description:
        "Descriptive text explaining valid applied work experiences.",
    },
    onTheJobLearning: {
      defaultMessage: "On-the-job learning",
      id: "2FBdeQ",
      description: "Experience requirement, On the job.",
    },
    nonConventionalTraining: {
      defaultMessage: "Non-conventional training",
      id: "bW4lM0",
      description: "Experience requirement, non-conventional training.",
    },
    formalEducation: {
      defaultMessage: "Formal education",
      id: "LWtWs1",
      description: "Experience requirement, formal education.",
    },
    otherFieldExperience: {
      defaultMessage: "Other field related experience",
      id: "oIRkby",
      description: "Experience requirement, other.",
    },
    otherExperience: {
      defaultMessage:
        "Other related experience (e.g. personal, community, family)",
      id: "GSHQHG",
      description: "Experience requirement, other.",
    },
    confirmationLead: {
      defaultMessage:
        "You made it! By signing your name below you confirm that:",
      id: "i4CKlO",
      description:
        "Confirmation message before signature form on sign and submit page.",
    },
    confirmationReview: {
      defaultMessage: `"I've reviewed everything written in my application"`,
      id: "iIMpOW",
      description: "Signature list item on sign and submit page.",
    },
    confirmationCommunity: {
      defaultMessage: `"I understand that I am part of a community who trusts each other"`,
      id: "uooR1r",
      description: "Signature list item on sign and submit page.",
    },
    confirmationTrue: {
      defaultMessage: `"I promise that the information I've provided is true"`,
      id: "21QCEK",
      description: "Signature list item on sign and submit page.",
    },
    appliedWorkExpPMGroup: {
      defaultMessage:
        "An acceptable combination of education, training, and experience, or a satisfactory score on the Public Service Commission test approved as an alternative to a secondary school diploma.",
      id: "nBBKe/",
      description:
        "Descriptive text explaining valid a applied work experience for the PM classification group.",
    },
    appliedWorkExpEXGroup: {
      defaultMessage:
        "<link>Acceptable</link> combination of education, training and/or experience.",
      id: "2iXmbY",
      description:
        "Descriptive text explaining valid a applied work experience for the EX classification group.",
    },
    secondarySchoolHeading: {
      defaultMessage: "Secondary school diploma",
      id: "zdeoxH",
      description:
        "Heading for the education requirement option secondary school diploma.",
    },
    secondarySchoolDescription: {
      defaultMessage: "A secondary school diploma.",
      id: "9QZYMX",
      description:
        "Description for the education requirement option secondary school diploma.",
    },
    professionalDesignation: {
      defaultMessage:
        "<link>Eligibility</link> for a recognized professional designation in one of the provinces or territories of Canada.",
      id: "ynGRwF",
      description: "Description for the professional designation requirement.",
    },
    graduationWithDegree: {
      defaultMessage:
        "Graduation with a <degreeLink>degree</degreeLink> from a <postSecondaryLink>recognized post-secondary institution</postSecondaryLink>.",
      id: "DYhY7Y",
      description: "Description for the EX graduation with degree requirement.",
    },
    foreignDegree: {
      defaultMessage:
        "Have a degree from outside Canada? <foreignDegreeLink>Learn more about foreign degree equivalencies.</foreignDegreeLink>",
      id: "EYPaLh",
      description:
        "External link message for the EX graduation with degree requirement.",
    },
    educationRequirementECJustEducationHeading: {
      defaultMessage: "Degree in economics, sociology or statistics",
      id: "PbLJnr",
      description:
        "Heading for the `just education` option for EC education requirements",
    },
    educationRequirementECJustEducationDescription: {
      defaultMessage:
        "Graduation with a degree from a recognized post-secondary institution with acceptable specialization in economics, sociology or statistics.",
      id: "GurdF+",
      description:
        "Description for the `just education` option for EC education requirements",
    },
    educationRequirementECEducationPlusHeading: {
      defaultMessage: "Other degree with specialization",
      id: "WT+5to",
      description:
        "Heading for the `other education with specialization` option for EC education requirements",
    },
    educationRequirementECEducationPlusDescription: {
      defaultMessage:
        "A degree is still required. However, the specialization in economics, sociology, or statistics may also be obtained through an acceptable combination of education, training, or experience.",
      id: "IEp0sR",
      description:
        "Description for the `other education with specialization` option for EC education requirements",
    },
    finalDecision: {
      defaultMessage: "Final decision",
      id: "vtnz6B",
      description: "Label for an applications final decision",
    },
    screeningStage: {
      defaultMessage: "Screening stage",
      id: "OUcpGx",
      description: "Title for the screening stage of an application",
    },
    assessmentStage: {
      defaultMessage: "Assessment stage",
      id: "p7+/CC",
      description: "Title for the assessment stage of an application",
    },
    applicationStatus: {
      defaultMessage: "Application status",
      id: "Aw67A5",
      description: "Label for the status of an application",
    },
  }),
};

export default messages;
