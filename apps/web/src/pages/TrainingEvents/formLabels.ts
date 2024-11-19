import { defineMessages } from "react-intl";

import adminMessages from "~/messages/adminMessages";

const formLabels = defineMessages({
  titleEn: {
    defaultMessage: "Title (English)",
    id: "MHZ1CD",
    description: "The title, in English",
  },
  titleFr: {
    defaultMessage: "Title (French)",
    id: "55Me4a",
    description: "The title, in French",
  },
  courseLanguage: {
    defaultMessage: "Course language",
    id: "358F+g",
    description: "The language of the training event",
  },
  format: {
    defaultMessage: "Format",
    id: "/fVA+0",
    description: "The format of the training event",
  },
  registrationDeadline: {
    defaultMessage: "Registration deadline",
    id: "fbRvL4",
    description: "The registration deadline of the training event",
  },
  trainingStartDate: {
    defaultMessage: "Training start date",
    id: "ej13jn",
    description: "The training start date of the training event",
  },
  trainingEndDate: {
    defaultMessage: "Training end date",
    id: "guY0Ld",
    description: "The training end date of the training event",
  },
  descriptionEn: adminMessages.descriptionEn,
  descriptionFr: adminMessages.descriptionFr,
  applicationUrlEn: {
    defaultMessage: "Application URL (English)",
    id: "scK7Nc",
    description: "The English application URL of the training event",
  },
  applicationUrlFr: {
    defaultMessage: "Application URL (French)",
    id: "p+X+Yq",
    description: "The French application URL of the training event",
  },
});

export default formLabels;
