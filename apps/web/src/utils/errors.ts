import { CombinedError } from "urql";

export function rejectMutation(error?: CombinedError) {
  return Promise.reject(new Error(error?.message ?? "unknown request error"));
}
