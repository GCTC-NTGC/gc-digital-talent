---
description: Write or edit GitHub issues for gc-digital-talent. Use when the user asks to create a ticket, write an issue, file a bug, draft a feature request, or work with GH issues/tickets for the project.
---

Write a GitHub issue for the gc-digital-talent project (GCTC-NTGC/gc-digital-talent) based on the following request:

$ARGUMENTS

## Instructions

Draft the issue body following every guideline below. Present the draft for review. Once approved, create it with `gh issue create --repo GCTC-NTGC/gc-digital-talent` using a HEREDOC for the body. Use the appropriate issue template via `--template` if one matches the ticket type.

Issue templates live in the repo at `.github/ISSUE_TEMPLATE/`. Read the relevant template YAML before drafting to match its exact field names and structure. Available templates: `accessibility.yml`, `bug_report.yml`, `copy.yml`, `documentation.yml`, `feature.yml`, `notification.yml`, `platform.yml`, `refactor.yml`, `spike.yml`, `testing.yml`, `user_interface.yml`, and `roadmap--epic-.md`.

When referring to people by name, use their role or team instead (e.g. "the product owner" not "Gray") — see memory for the exception about leadership attributions.

---

## Ticket Writing Guidelines

### Choosing the Right Type

| Type | Template | When to Use |
|------|----------|-------------|
| Bug `🐛` | bug_report | Something broken or behaving unexpectedly |
| Feature `✨` | feature | New functionality or changes to existing behavior |
| Refactor `♻️` | refactor | Improving code without changing user-facing behavior |
| Copy `🔤` | copy | Text/translation additions or corrections (auto-labeled `copy`) |
| Testing `🧪` | testing | Writing or updating automated tests |
| Accessibility `⌨` | accessibility | WCAG compliance or assistive technology issues (auto-labeled `accessibility`) |
| Platform `🛠️` | platform | Tooling, infrastructure, CI/CD, dependencies |

### Titles

- Keep under ~80 characters after the emoji prefix.
- Use backticks for code references: `` ✨ `TalentRequest` policies ``
- Lead with the user-visible problem or change, not the implementation: "🐛 Can't rollback migration" not "🐛 Fix column drop order in migration".
- Bug titles often start with the environment if scoped: "🐛 UAT | Follow-up date validation allows..."

### Acceptance Criteria

This is the most important section — every ticket must have it and it drives whether a PR gets merged.

- Always `- [ ]` checkbox format. 2–5 items is typical.
- Each criterion should be **testable and binary** — a reviewer can check the box or not.
- Write from the user/system perspective, not the implementation: "Migration can be successfully rolled back" not "Change column drop order".
- For refactors, include a non-regression criterion: "Candidate search and process candidates tables remain the same".
- For features with multiple surfaces, cover each one: table view, sidebar, sort, filter.

### Descriptions and Details

- **State the environment** (UAT, Local, Prod) when the behavior is environment-specific.
- **Name exact components, models, tables, and files.** The team references things like `SearchRequestsCandidatesTable`, `TalentRequest`, `pool_candidate_search_requests`, `apps/web/src/lang/fr.json`. Don't be vague.
- **Explain the "why" up front**, especially for refactors and features. One sentence on the user problem or business driver before getting into specifics: "Users only need access to a small subset of columns and have to always modify them when viewing candidates in a request."
- **For bugs, describe both the actual and expected behavior** in the first section — don't make the reader infer what "correct" looks like.

### Steps to Reproduce (Bugs)

- Numbered list, starting from a clear entry point ("Access to GC digital portal using a community admin role").
- Include the role/permissions needed.
- End with an "Observe that..." step describing the visible symptom.
- 4–6 steps is typical. Be precise enough that someone unfamiliar with the feature can follow along.

### Proposed Solution / Implementation

- **Be specific about files and code.** Reference exact file paths, component names, and link to existing code on GitHub when suggesting analogous patterns: "SEE: [Application sidebar](link) for inspiration".
- **For back-end model work, include a GraphQL schema snippet** showing the type definition with directives (`@belongsTo`, etc.).
- **When the approach is uncertain, present labeled options** ("Option 1 — soft delete", "Option 2 — refactor pivot") with a sentence on tradeoffs. Strike through options you've ruled out with reasoning.
- **Reference prior art** in the repo when solving a problem the team has solved before: "We actually ran into this same issue with the playwright action" + link.
- **Call out non-obvious constraints**: "We use a community-development-programs-talent-nomination pivot. So we can't simply delete the community-development-program record."
- Use `> [!NOTE]` callouts for important context that's easy to miss.

### Design References (Features)

- Format: `- Designer: @username` and `- [Figma link](url)`.
- Paste design screenshots inline — multiple screenshots showing different states (table view, sidebar, dialog, etc.) are common and expected.

### Localization

- The app is bilingual (English/French). Always consider French translations.
- French word counts run ~1.33x English — reference the constant `talentSearchConstants.FRENCH_WORDS_PER_ENGLISH_WORD` rather than hardcoding the multiplier.
- For copy tickets, provide exact replacement strings in a JSON code block matching the translation file format (key, defaultMessage, description).

### Cross-References and Work Splitting

- Link related issues with `#number`. Common phrasing: "Related to #16368", "The front-end work for this is described in #16612".
- Large features are typically split into separate tickets along these lines:
  - Migration (database/data changes)
  - Back-end (model, policies, GraphQL schema, tests)
  - Front-end (components, pages, table updates)
  - Testing (E2E / manual verification)
- Each split ticket should reference its siblings so the full scope is navigable.

### Testing Tickets

- Link the target feature or bug in the "Target Bug(s) / Feature" field.
- Test steps use `- [x]` checkboxes (checked when scenarios are written), labeled "Scenario 1:", "Scenario 2:", etc.
- Assertions use bold labels: `**Assertion 1:**`.
- Include both happy-path and negative scenarios (e.g., "Verify that the link education experience button is **not** present for the development program which is not completed").

### Tone and Formatting

- Direct and functional. No filler or preamble. State the problem, state the fix.
- Light informality is fine — the team occasionally uses emoji or humor in details sections.
- Empty optional fields: use `_No response_` rather than deleting the section header.
- Embed screenshots with `<img>` tags (width/height attributes included) or markdown image syntax. Attach files (spreadsheets, etc.) with `[filename](url)`.
