# Background
We used [Dependabot](https://github.com/dependabot) to manage the dependency updates on this project.  Currently, it is set to automatically open pull requests (PRs) every Monday for updated dependencies for NPM, Composer, Docker, and GitHub Actions.  These PRs are reviewed and merged by developers on the team.  We consider this a fairly low risk activity and encourage all developers on the team to participate.
# Strategy
 - Log into GitHub and find the [open Dependabot PRs](https://github.com/GCTC-NTGC/gc-digital-talent/pulls/app%2Fdependabot).
 - Select a PR to review.  It is recommended to start with the direct dependencies of the project and move on later to the non-direct ones.
 - Evaluate the PR against the merge criteria below.  It is recommended to leave a comment in the PR with the merge criteria you evaluated.
 - If you are satisfied with the PR, approve and merge it.  If not, leave a comment for the next reviewer.
# Merge Criteria
These are the suggested criteria with which to evaluate a PR  and decide if it is safe to merge.  They are suggestions only so use your own judgment and experience.  The criteria are broken into sections based on the type of version update (MAJOR.MINOR.PATCH) that the PRs represents.
### Patch Version Updates
 - All GitHub Actions processes completed successfully
 - No merge conflicts
 - Dependabot does not have a rebase pending
### Minor Version Updates
- The release notes for the dependency mention no breaking changes
### Major Version Updates
- I've checked out the branch, built it, and manually exercised it a bit.
