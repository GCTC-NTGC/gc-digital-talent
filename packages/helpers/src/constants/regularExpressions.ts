/*
 * Links to regex experimentation tool are provided for each regex pattern.
 * Please feel free to "Update" and liberally add candidate test strings.
 * If you make changes, they'll be most discoverable by updating the link below.
 */

// See: https://regex101.com/r/TEDtDo/1
export const keyStringRegex = /^[a-z]+[_a-z0-9]*$/;
// See: https://regex101.com/r/EAZ8ha/6
export const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;
// See: https://regex101.com/r/T8IYJU/7
// Note: This should be kept in sync with the check in the UpdateUserAsUserInputValidator
export const workEmailDomainRegex =
  /@([A-Za-z0-9-]+\.)*(gc\.ca|canada\.ca|elections\.ca|ccc\.ca|canadapost-postescanada\.ca|gg\.ca|scics\.ca|scc-csc\.ca|ccohs\.ca|cchst\.ca|edc\.ca|invcanada\.ca|parl\.ca|telefilm\.ca|bankofcanada\.ca|banqueducanada\.ca|ncc-ccn\.ca|bank-banque-canada\.ca|cef-cce\.ca|cgc\.ca|nfb\.ca|onf\.ca|canadacouncil\.ca|conseildesarts\.ca|humanrights\.ca|droitsdelapersonne\.ca|ingeniumcanada\.org|cjc-ccm\.ca|bdc\.ca|idrc\.ca|museedelhistoire\.ca|historymuseum\.ca|cdic\.ca|sadc\.ca|scc\.ca|clc\.ca|clc-sic\.ca|cntower\.ca|latourcn\.ca)$/i;
