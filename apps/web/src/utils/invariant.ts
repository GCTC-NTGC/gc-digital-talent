import { type Logger, defaultLogger } from "@gc-digital-talent/logger";

type LogMessage = string | (() => string);

const defaultMessage: string = "Condition failed";

type LogInvariantArgs = {
  logger?: Logger;
  message?: string;
};

function logInvariant({
  logger = defaultLogger,
  message = defaultMessage,
}: LogInvariantArgs) {
  logger.error(message);
  throw new Error(message);
}

function invariant(
  condition: boolean,
  message?: LogMessage,
  logger?: Logger,
): asserts condition {
  if (condition) return;

  logInvariant({
    message: typeof message === "function" ? message() : message,
    logger,
  });
}

export default invariant;
