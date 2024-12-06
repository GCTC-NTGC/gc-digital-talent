/*
 * Links to regex experimentation tool are provided for each regex pattern.
 * Please feel free to "Update" and liberally add candidate test strings.
 * If you make changes, they'll be most discoverable by updating the link below.
 */

// See: https://regex101.com/r/TEDtDo/1
export const keyStringRegex = /^[a-z]+[_a-z0-9]*$/;
// See: https://regex101.com/r/EAZ8ha/6
export const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;
// See: https://regex101.com/r/T8IYJU/6
// Note: This should be kept in sync with the check in the UpdateUserInputValidator
export const workEmailDomainRegex =
  /@([A-Za-z0-9-]+\.)*(gc\.ca|canada\.ca|elections\.ca|ccc\.ca|canadapost-postescanada\.ca|gg\.ca)$/i;
