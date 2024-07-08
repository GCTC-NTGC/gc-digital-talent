const emailAddressTypes = ["contact"] as const;

export type EmailAddressType = (typeof emailAddressTypes)[number];

export function isEmailAddressType(
  userInput: string,
): userInput is EmailAddressType {
  return (emailAddressTypes as readonly string[]).includes(userInput);
}
