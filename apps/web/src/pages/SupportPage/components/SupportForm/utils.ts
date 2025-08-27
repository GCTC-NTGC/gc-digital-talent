import { Logger } from "@gc-digital-talent/logger";

import { API_SUPPORT_ENDPOINT } from "~/constants/talentSearchConstants";

export const SUPPORT_TICKET_ERROR = {
  UNKNOWN: "UknownError",
  INVALID_EMAIL: "InvalidEmailError",
} as const;

class UnknownError extends Error {
  constructor(message: string) {
    super(message);
    this.name = SUPPORT_TICKET_ERROR.UNKNOWN;
  }
}

class InvalidEmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = SUPPORT_TICKET_ERROR.INVALID_EMAIL;
  }
}

export interface FormValues {
  user_id: string;
  name: string;
  email: string;
  description: string;
  subject: string;
  previous_url: string;
  user_agent: string;
  attachments: FileList;
}

interface JSONResponse {
  serviceResponse?: string;
  errorDetail?: string;
}

export async function submitTicket(
  values: FormValues,
  logger: Logger,
): Promise<boolean> {
  const formData = new FormData();

  formData.append("user_id", values.user_id);
  formData.append("name", values.name);
  formData.append("email", values.email);
  formData.append("description", values.description);
  formData.append("subject", values.subject);
  formData.append("previous_url", values.previous_url);
  formData.append("user_agent", values.user_agent);
  if (values.attachments.length == 1) {
    formData.append("attachment", values.attachments[0]);
  }

  const response = await fetch(API_SUPPORT_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const body: JSONResponse = (await response.json()) as JSONResponse;
  if (response.ok) {
    logger.info("Ticket successfully submitted");
    return true;
  } else {
    logger.error(`Failed to submit ticket: ${JSON.stringify(body)}`);

    const errorCode = `${response.status} - ${response.statusText}`;
    let error = new UnknownError(errorCode);
    if (
      body?.serviceResponse === "error" &&
      body?.errorDetail === "invalid_email"
    ) {
      error = new InvalidEmailError(errorCode);
    }

    return Promise.reject(error);
  }
}
