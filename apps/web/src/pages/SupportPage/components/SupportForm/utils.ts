import { Locales } from "@gc-digital-talent/i18n";
import { Logger } from "@gc-digital-talent/logger";

import { API_SUPPORT_ENDPOINT } from "~/constants/talentSearchConstants";

export const SUPPORT_TICKET_ERROR = {
  UNKNOWN: "UnknownError",
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
}

interface JSONResponse {
  serviceResponse?: string;
  errorDetail?: string;
}

export async function submitTicket(
  values: FormValues,
  logger: Logger,
  locale: Locales,
): Promise<boolean> {
  const response = await fetch(API_SUPPORT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
    body: JSON.stringify(values),
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
