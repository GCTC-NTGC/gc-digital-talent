import { NotFoundError } from "@gc-digital-talent/helpers";

export function clientLoader() {
  throw new NotFoundError();
}

export default function CatchAll() {
  return null;
}
