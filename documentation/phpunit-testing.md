# Background

This project uses [PHPUnit](https://phpunit.de/) for backend tests. Tests live in `api/tests` and are split into two folders: `Unit` and `Feature`. This page explains where a new test file should go.

# Unit or Feature

## Unit — `tests/Unit/`

Use a Unit test when:

- The test checks **one piece of code on its own**, such as a policy, rule, builder or helper

Examples:

- `PoolPolicy` allows a community admin to update a published pool
- `UserBuilder` returns only the users a process operator may see

## Feature — `tests/Feature/`

Use a Feature test when:

- The test sends a **GraphQL query or mutation to the API** and checks the response, such as who is allowed, validation errors or the data returned
- The test runs an **artisan command**, or checks **backend work** such as notifications, generated files or the activity log

Feature tests only test the backend. They don't use a browser or the UI; that is covered by the Playwright tests.

Examples:

- A community recruiter sees only the talent requests for their own community
- The `send-notifications:application-deadline-approaching` command reminds applicants with a draft application three days before a pool closes

# Which Folder

Inside `tests/Unit/` and `tests/Feature/`, put the test in the folder of the feature it is about. Both use the same folder names:

- `Auth/` — login, roles and permissions
- `Pool/` — pools (processes), pool skills, assessment steps, screening and general questions
- `PoolCandidate/` — applications and candidates
- `TalentRequest/` — talent requests
- `TalentNomination/` — nomination events, nominations and nomination groups
- `User/` — user profiles, skills and employee profiles
- `Community/` — communities, community interests and development programs
- `Experience/` — work, education, award, community and personal experiences
- `Search/` — keyword search
- `ActivityLog/` — activity log
- `Generators/` — generated files: documents, spreadsheets and zips
- `Notifications/` — notifications
- `Snapshots/` — profile snapshots
- `GraphQL/Directives/` — custom GraphQL directives (Feature only)
- `Shared/` — general code not tied to one feature (Unit only)

Examples:

- A test for `PoolCandidatePolicy` goes in `tests/Unit/PoolCandidate/`
- A test for a mutation that updates a candidate goes in `tests/Feature/PoolCandidate/`

If a feature has only one test file, it can stay directly in `tests/Unit/` or `tests/Feature/`. When it gets a second file, create a folder for the feature and move both files into it.

# Rule of Thumb

First ask **"Does it test one piece of code on its own, or does it go through the API, a command or other backend work?"** to choose `Unit` or `Feature`. Then ask **"Which feature is it about?"** to choose the folder inside it.
