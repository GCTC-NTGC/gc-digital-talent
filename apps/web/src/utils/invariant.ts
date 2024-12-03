import { type Logger, defaultLogger } from "@gc-digital-talent/logger";

type LogMessage = string | (() => string);

const defaultMessage = "Condition failed";

interface LogInvariantArgs {
  logger?: Logger;
  message?: string;
}

function logInvariant({
  logger = defaultLogger,
  message = defaultMessage,
}: LogInvariantArgs): never {
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
