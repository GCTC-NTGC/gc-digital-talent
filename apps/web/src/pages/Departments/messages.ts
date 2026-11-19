import { defineMessage, type PrimitiveType } from "react-intl";

export default {
  departmentNotFound: defineMessage<{ departmentId: PrimitiveType }>({
    defaultMessage: "Department {departmentId} not found.",
    id: "8Otaw9",
    description: "Message displayed for department not found.",
  }),
};
