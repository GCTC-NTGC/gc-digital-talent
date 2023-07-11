# Definition of Done

- Step-by-step testing instructions
- At least one peer review approval
- If the route to a live page has been changed, a Permanent Redirect (301) has also been added to the `nginx` conf files
- Build pipeline successful, including passing tests for:
  - TypeScript linting
  - PHPUnit testing
  - Chromatic testing
  - CodeQL security vulnerability testing
  - End-to-end testing
  - Translation checks
  - `jest-axe` accessibility testing

## Accessibility
For more information about accessibility, refer to the [accessibility guidelines](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/documentation/accessibility.md).
