---
description: Quickly capture a roadmap item as a GitHub issue for gc-digital-talent. Use when the user asks to create, capture or write up a roadmap item, roadmap issue or epic idea — usually from a pasted message, notes or a conversation. Use this instead of write-ticket for roadmap items.
---

Capture a roadmap item for the gc-digital-talent project (GCTC-NTGC/gc-digital-talent) based on the following request:

$ARGUMENTS

## Purpose

A roadmap issue is a **quick, high-level capture** so the team knows what the idea is. It is not a spec. Don't flesh it out beyond what the source material says, don't propose solutions, and don't add acceptance criteria, framing, risks or work splitting. That happens later, once the item is picked up.

Do **not** use the `Roadmap (Epic)` template in `.github/ISSUE_TEMPLATE/roadmap--epic-.md`.

## Format

Use exactly these three sections, in this order, and nothing else:

```markdown
## Overview

<2–4 sentences: what we want and why. Lead with the problem or opportunity.>

## Requirements

- <What the source says is needed, wanted or preferred. Keep the source's own priority words ("ideally", "worth extra effort", "nice to have").>

## Questions

- [ ] <Decisions still to be made, unknowns, and people or teams to check with before starting.>
```

- **Requirements** come only from the source material. Don't invent new ones.
- **Questions** are where the value is: pull out every decision the source leaves open, every "maybe" or "I don't know", and every check-in it mentions. A few obvious gaps the source doesn't mention are fine, but keep them short and few.
- Plain bullets. Short headings inside a section only if the list gets long.
- Keep the whole issue skimmable — usually under 40 lines.

## Tone and style

Match the voice of the team's other tickets (see the write-ticket skill):

- Direct and functional. No filler or preamble. State the problem, state what's wanted.
- Explain the "why" up front: one sentence on the user problem or business driver before the details.
- Light informality is fine.
- Use backticks for code, model, URL and environment references (e.g. `training.talent.canada.ca`, `TalentRequest`).
- State the environment (UAT, Prod, etc.) when the idea is environment-specific.
- Link related issues with `#number`.

## Title

A short, plain name for the initiative, e.g. "Training server for GC Talent". No `[Roadmap]` prefix — the issue type marks it.

## People

Refer to people by role or team, not name (e.g. "the product owner", "the PSRS team"), unless the user asks to keep names.

## Creating the issue

Present the title and body for review. Once approved, create it:

```bash
gh issue create --repo GCTC-NTGC/gc-digital-talent \
  --type Roadmap \
  --project "Product Roadmap - GC Talent" \
  --title "<title>" \
  --body "$(cat <<'EOF'
<body>
EOF
)"
```

Report the issue link when done.
