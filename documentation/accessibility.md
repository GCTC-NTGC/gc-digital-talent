# Accessibility

The goal of this document is to explain the what tooling we have in place and testing methodologies to assist with ensuring all of our applications are accessible.

## Tooling / Automated Testing

There are plans to introduce multiple levels of automated a11y testing however, currently the only tooling we have in place is [`eslint-plugin-jsx-a11y`](https://www.npmjs.com/package/eslint-plugin-jsx-a11y).

### Linting

`eslint-plugin-jsx-ally` works with eslint to catch common problems related the markup of our application. If your IDE supports it, [setting up eslint](http://wiki.openbravo.com/wiki/How_To_Setup_ESLint_And_Prettier_In_Your_IDE) can be very beneficial to highlight these errors without the need to the the `lint` script.

If you are unable to setup eslint in your IDE, we recommend running `npm run lint --workspaces` before pushing your code to catch any markup related a11y warnings/errors early.

#### Ignoring Rules

While we encourage you to explore options in order to not ignore `eslint-plugin-jsx-ally`, sometimes this is not an option. When you do _need_ to ignore a rule, please comment on the reasoning so that other team members can understand why.

##### Example

In the following example, we have a `<nav>` element where we capture an `onKeyDown` event. In most cases, this would result in decreased a11y since `<nav>` is a non-interactive element and as such, should not accept any interactive events such as `onClick` or, in this case `onKeyDown`. However, we are accepting the `onKeyDown` here so that pressing the `esc` key can dismiss the element, improving the ux for keyboard only users. You can see, we have left a short comment to describe why we are ignoring the rule.

```tsx
<nav
  /**
   * Ignore `no-noninteractive-element-interactions` since
   * this is captured to close the element
   */
  onKeyDown={handleKeyDown}
/>
```

## E2E Testing

_Note:_ This may change but should remain similar.

### `cypress-axe`

We are doing automated a11y testing in our E2E testing with [`cypress-axe`](https://www.npmjs.com/package/cypress-axe). When writing tests your cypress tests, it is considered best practice to add `cy.checkA11y()` when changing the state of the application. Some examples (non-exhaustive) of when to check a11y with cypress are:

- Initial loading of a page/component
- After navigating to a new page
- After opening a modal
- After submitting a form (check errors/validation messages)

### Automated Audits

#### Lighthouse

Something simple you can do to catch some errors is by running [`lighthouse`](https://developer.chrome.com/docs/lighthouse/overview/#psi). This will run a version of `axe-core` on a single page and provide some feedback on areas you can improve on.

#### WAVE

Another tool you can use to assist in spotting warnings/errors is [WAVE](https://wave.webaim.org/). This is helpful since it adds labels on the elements where each errors occurs, making it easier to see where the issues exist.

## Manual Testing

Automated testing is helpful in catching a11y errors early when a computer can test for them. However, since a11y is for humans, there _must_ be a human element involved. That is why we should be manually testing our applications for a11y.

### Tools

There are some tools that can assist with this and make testing easier. Unfortunately, most tools that are of any use are paid.

- [axe DevTools](https://www.deque.com/axe/devtools/) - _free/paid_
  - Does an automated scan of your current page
  - Paid version will perform a guided keyboard only walk through of your application
- [JAWS](https://www.freedomscientific.com/Products/software/JAWS/) - _paid_
  - The most popular screen reader
  - Allows you to browse the application and experience it in a similar way to visually impaired users
- [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/) - _free_
  - Check your foreground and background colours for sufficient contrast ratio
  - Color Blindness Simulator
  - **Note:** This adheres to WCAG 2.0/2.1, with 3.0 there is a proposal to change to a [new formula](https://www.w3.org/TR/wcag-3.0/#visual-contrast-of-text) to better estimate colour perception

#### Methodology

When manually testing the application, it is good for you to ask yourself some questions so you can effectively find areas of concern. Some questions/tasks you should completed are:

- Can I navigate the page with _only_ a keyboard?
- When navigating with a keyboard, is it clear where I am on a page?
- Does pressing the `tab` key move my focus to the expected place on the page?
- Does the page maintain integrity when zooming up to 200%?
- Is it clear when key information is present to a user? (error message, alert)
- Close your eyes to simulate visual impairment
  - Are you aware of where you are on a page?
  - Are state changes clearly described to you?
- When using a dialog
  - Is your focus moved to the dialog on open?
  - Does the focus return to the element that triggered the opening of the dialog when closing?
- Are you able to freely navigate the application without being "trapped"?

## Final Thoughts

Remember, when developing new and existing features in order for the application to be accessible it must be perceivable, operable, understandable and robust.

### Perceivable

Information must be presented in a way that _anyone_ can perceive. Any contextual information must _not_ be invisible to any person. This means:

- Providing text alternatives for non-text content
- Provide content that can be presented in different ways while maintaining integrity and meaning
- Make content distinguishable

### Operable

Users can interact with the application in their preferred method (screen reader, sip/puff, touch screens, braille displays, keyboard).

- Keyboard Accessible
- Provide ways for users to navigate and find content
- Make it easy to use alternative inputs (sip/puff, touch screens)

### Understandable

Information within the application should be understandable for all users.

- Readable, use short, easy to read sentences. Avoid acronyms and complex language
- Make your application predictable (keep navigation consistent, avoid surprises)
- Provide instructions for inputs to help users avoid errors (required indicators, clear link labels)

### Robust

The applications must work in a variety of environments and user agents.

- The application is compatible with different browsers, assistive technologies
- Information is not lost when interacting with the application in different environments
  - Noisy (can't hear audio)
  - Bright (can't see colour combinations)
  - Quiet (can't use audio)
