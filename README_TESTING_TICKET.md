# Playwright Testing Ticket - Activity Log Feature

## Summary

I have created a comprehensive Playwright testing ticket document for the Activity Log feature (Issue #15208). This document can be used to create a GitHub issue that will guide the implementation of complete E2E test coverage for the feature.

## What was done

1. ✅ **Analyzed Issue #15208** - Reviewed the Activity log for processes feature requirements
2. ✅ **Reviewed Existing Tests** - Examined the current Playwright test at `/apps/playwright/tests/admin/process-activity-log.spec.ts`
3. ✅ **Studied Test Patterns** - Analyzed the repository's testing conventions and issue templates
4. ✅ **Created Comprehensive Testing Document** - Generated `PLAYWRIGHT_TESTING_ACTIVITY_LOG.md` with detailed test plans

## Document Contents

The testing ticket document (`PLAYWRIGHT_TESTING_ACTIVITY_LOG.md`) includes:

### 📋 7 Complete Test Suites:
1. **Activity Log Visibility and Access** - Permission and accessibility tests
2. **Job Advertisement Change Tracking** - Tests for field changes, publish events, and justifications
3. **Application and Candidate Tracking** - Tests for new applications and status changes
4. **Filtering Functionality** - Tests for filtering by candidate, team member, date, and action type
5. **Timestamp Validation** - Tests for timestamp accuracy and chronological ordering
6. **Data Integrity and Edge Cases** - Tests for empty states, large data sets, and concurrent actions
7. **Nice to Have Features** - Optional tests for future enhancements

### 📝 Detailed Test Steps:
- 25+ individual test scenarios
- Step-by-step test execution instructions
- Clear expected outcomes for each test

### ✅ Comprehensive Assertions:
- Must-have assertions for core functionality
- Nice-to-have assertions for optional features
- UI/UX validation criteria

### 🎯 Acceptance Criteria:
- Test implementation requirements
- Test execution standards
- Feature validation checklist
- Code quality guidelines

## Next Steps

### Option 1: Create GitHub Issue Manually
1. Go to: https://github.com/GCTC-NTGC/gc-digital-talent/issues/new/choose
2. Select "Testing" issue template
3. Copy relevant sections from `PLAYWRIGHT_TESTING_ACTIVITY_LOG.md`
4. Fill in the template fields with the content from the document
5. Add labels: `Testing`, `E2E`, `playwright`, `activity-log`
6. Link to parent issue #15208
7. Set priority to High

### Option 2: Use the Document as Reference
- Share the `PLAYWRIGHT_TESTING_ACTIVITY_LOG.md` file with your team
- Use it as a comprehensive test plan document
- QA team can use it to implement the tests incrementally
- Track progress directly in the document

## Key Features of the Testing Plan

### Comprehensive Coverage
- All requirements from Issue #15208 are covered
- Tests organized by functional area
- Both must-have and nice-to-have features included

### Follows Repository Patterns
- Uses existing fixtures (`PoolPage`, `loginBySub`)
- Leverages current utilities (`graphql.newContext()`, `createAndPublishPool`)
- Follows patterns from existing tests in `/apps/playwright/tests/admin/`

### Practical and Actionable
- Each test has clear, step-by-step instructions
- Assertions are specific and measurable
- Edge cases and error scenarios are considered

### Quality Focused
- Includes acceptance criteria for test quality
- Addresses test maintainability
- Considers CI/CD integration

## Related Files

- **Testing Document**: `/home/runner/work/gc-digital-talent/gc-digital-talent/PLAYWRIGHT_TESTING_ACTIVITY_LOG.md`
- **Existing Test**: `/home/runner/work/gc-digital-talent/gc-digital-talent/apps/playwright/tests/admin/process-activity-log.spec.ts`
- **Parent Issue**: https://github.com/GCTC-NTGC/gc-digital-talent/issues/15208
- **Design**: https://www.figma.com/design/fn6LXNySdE5irUbvky9WRM/Activity-log---Pools--Communities-

## Notes

- The feature (Issue #15208) was marked as closed on 2026-02-04
- There is already a basic Playwright test for activity log functionality
- This comprehensive testing document expands coverage to include all requirements
- Tests should be implemented incrementally based on priority
- Filter tests (especially "nice to have" filters) can be implemented as the UI supports them

## Recommendations

1. **Start with Must-Have Tests**: Implement Test Suites 1-3 first (visibility, advertisement tracking, candidate tracking)
2. **Then Add Filtering**: Implement Suite 4 for filtering by candidate and team member
3. **Add Timestamps**: Implement Suite 5 for timestamp validation
4. **Edge Cases Last**: Implement Suite 6 for data integrity and edge cases
5. **Nice to Have**: Implement Suite 7 only if/when those features are added to the UI

This approach ensures critical functionality is tested first while allowing for incremental test development.
