# 🧪 Playwright Testing Ticket for Activity Log Feature (Issue #15208)

## 🎯 Target Bug(s) / Feature

Feature: [Activity log for processes (#15208)](https://github.com/GCTC-NTGC/gc-digital-talent/issues/15208)

**Related PRs and Issues:**
- Parent Feature: #15208
- Design: https://www.figma.com/design/fn6LXNySdE5irUbvky9WRM/Activity-log---Pools--Communities-?node-id=249-9281&t=yK2XJZV9gjG8SUNU-4

## 🛠 Test Type

E2E Test (Playwright)

## 📍 Scope / Component

- **Component:** Process Activity Log
- **Area:** Process management, Activity tracking
- **Users:** Process Operator, Community Recruiter, Community Admin
- **Location:** `/apps/playwright/tests/admin/process-activity-log.spec.ts`

## ✅ Test Objective

Validate the comprehensive activity log functionality for processes, ensuring that all actions performed on job advertisements and candidates are properly recorded, displayed, timestamped, and filterable according to the requirements specified in issue #15208.

The tests should verify:
1. Recording and display of all required activity types
2. Proper timestamps on all activity entries
3. Filtering capabilities (by candidate, team member, date, action type)
4. Permission-based access to activity log
5. Data accuracy and integrity of logged activities

## 📝 Test Steps

### Test Suite 1: Activity Log Visibility and Access
**Objective:** Verify activity log tab exists and has proper permissions

#### Test 1.1: Activity log tab is visible for authorized users
1. Create a test process/pool
2. Log in as Process Operator
3. Navigate to process details page
4. Verify "Activity" or "Activity Log" tab is visible
5. Click on the Activity Log tab
6. Verify activity log page loads successfully

#### Test 1.2: Activity log permissions for different roles
1. Create a test process/pool
2. Test access for each role:
   - Process Operator (should have access)
   - Community Recruiter (should have access)
   - Community Admin (should have access)
   - Applicant/Candidate (should NOT have access)
   - Unauthenticated user (should NOT have access)
3. Verify appropriate access or error messages

### Test Suite 2: Job Advertisement Change Tracking
**Objective:** Verify changes to job advertisement are logged

#### Test 2.1: Record changes to job advertisement fields
1. Create and publish a test process
2. Log in as Process Operator
3. Navigate to process edit page
4. Make changes to various fields:
   - Process title
   - Process number
   - Description
   - Key tasks
   - Essential skills
   - Asset skills
   - Other job advertisement fields
5. Save changes (with justification if required)
6. Navigate to Activity Log tab
7. Verify each change is recorded with:
   - Field name that changed
   - User who made the change
   - Timestamp of the change
   - Change justification (if applicable)

#### Test 2.2: Track poster published event
1. Create a new draft process
2. Log in as Process Operator
3. Complete all required fields
4. Publish the process
5. Navigate to Activity Log tab
6. Verify "Process published" event is logged with:
   - User who published
   - Timestamp of publication
   - Event type clearly indicated

#### Test 2.3: Track changes with justifications
1. Create and publish a test process
2. Make changes to published process (triggers justification requirement)
3. Enter justification text
4. Save changes
5. Navigate to Activity Log
6. Verify:
   - Change is recorded
   - Justification text is displayed
   - User and timestamp are captured

### Test Suite 3: Application and Candidate Tracking
**Objective:** Verify application submissions and candidate status changes are logged

#### Test 3.1: Track new applications received
1. Create and publish a test process
2. Submit application as test candidate
3. Log in as Process Operator
4. Navigate to Activity Log
5. Verify new application event is recorded with:
   - Candidate name
   - Application submission timestamp
   - Event type clearly indicated

#### Test 3.2: Track candidate status changes - Qualified
1. Create process with test candidates
2. Log in as Process Operator
3. Change a candidate status to "Qualified"
4. Navigate to Activity Log
5. Verify status change is logged with:
   - Candidate name
   - Status change ("Qualified")
   - User who made the change
   - Timestamp

#### Test 3.3: Track candidate status changes - Disqualified
1. Create process with test candidates
2. Log in as Process Operator
3. Change a candidate status to "Disqualified"
4. Navigate to Activity Log
5. Verify status change is logged with:
   - Candidate name
   - Status change ("Disqualified")
   - User who made the change
   - Timestamp
   - Reason for disqualification (if applicable)

#### Test 3.4: Track candidate removal
1. Create process with test candidates
2. Log in as Process Operator
3. Remove a candidate from the process
4. Navigate to Activity Log
5. Verify removal is logged with:
   - Candidate name
   - "Candidate removed" event
   - User who performed removal
   - Timestamp
   - Reason (if applicable)

### Test Suite 4: Filtering Functionality
**Objective:** Verify activity log can be filtered by various criteria

#### Test 4.1: Filter by specific candidate
1. Create process with multiple test candidates
2. Perform various actions on different candidates
3. Navigate to Activity Log
4. Apply filter for specific candidate
5. Verify only activities related to that candidate are displayed
6. Clear filter and verify all activities return

#### Test 4.2: Filter by team member
1. Create process
2. Have multiple users (Process Operators) perform actions
3. Navigate to Activity Log
4. Apply filter for specific team member
5. Verify only activities by that user are displayed
6. Test filtering by different users
7. Clear filter and verify all activities return

#### Test 4.3: Filter by date (Nice to have)
1. Create process
2. Perform actions over time (or simulate different timestamps)
3. Navigate to Activity Log
4. Apply date range filter
5. Verify only activities within date range are displayed
6. Test various date ranges
7. Clear filter and verify all activities return

#### Test 4.4: Filter by action type (Nice to have)
1. Create process with various activity types
2. Navigate to Activity Log
3. Apply filter for specific action type (e.g., "Status changes", "Published", "Field updates")
4. Verify only activities of that type are displayed
5. Test different action types
6. Clear filter and verify all activities return

#### Test 4.5: Multiple filters combined
1. Create process with multiple activities
2. Navigate to Activity Log
3. Apply multiple filters simultaneously:
   - Specific candidate + specific team member
   - Date range + action type
   - All filters together
4. Verify correct activities are displayed
5. Clear filters one by one and verify results update correctly

### Test Suite 5: Timestamp Validation
**Objective:** Verify all activities are properly timestamped

#### Test 5.1: Timestamp accuracy
1. Create process
2. Perform an action (e.g., publish process)
3. Note the current time
4. Navigate to Activity Log
5. Verify the logged event timestamp matches the action time (within reasonable margin)
6. Verify timestamp format is consistent and user-friendly

#### Test 5.2: Chronological ordering
1. Create process
2. Perform multiple actions in sequence
3. Navigate to Activity Log
4. Verify activities are displayed in chronological order (most recent first or as per design)
5. Verify all timestamps are correctly ordered

### Test Suite 6: Data Integrity and Edge Cases
**Objective:** Verify activity log handles edge cases correctly

#### Test 6.1: Empty state
1. Create a new process
2. Navigate to Activity Log immediately (before any actions)
3. Verify appropriate empty state message or initial events (e.g., "Process created")

#### Test 6.2: Large number of activities
1. Create process
2. Generate many activities (simulate or perform multiple actions)
3. Navigate to Activity Log
4. Verify:
   - All activities are loaded (with pagination if applicable)
   - Performance is acceptable
   - No UI issues with large data sets

#### Test 6.3: Activity log after process deletion/archival
1. Create process
2. Perform several actions
3. Archive or delete the process (if applicable)
4. Verify activity log is still accessible or handled appropriately

#### Test 6.4: Concurrent user actions
1. Set up process
2. Have multiple users perform actions simultaneously
3. Navigate to Activity Log
4. Verify all actions from all users are logged correctly
5. Verify no conflicts or data loss

### Test Suite 7: Nice to Have Features (Optional/Future)
**Objective:** Test optional features if implemented

#### Test 7.1: Display new field values
1. Create and publish process
2. Change a field value (e.g., process title)
3. Navigate to Activity Log
4. Verify both old and new values are displayed (if implemented)

#### Test 7.2: Individual skill assessments tracking
1. Create process with candidates
2. Perform skill assessments on candidates
3. Navigate to Activity Log
4. Verify skill assessments are logged (if implemented)

#### Test 7.3: Assessment plan changes tracking
1. Create process
2. Modify assessment plan
3. Navigate to Activity Log
4. Verify assessment plan changes are logged (if implemented)

## 📋 Assertions

### Core Assertions (Must Have):
- **Activity Recording:**
  - ✅ All required activity types are recorded (field changes, publish events, application submissions, status changes, candidate removals)
  - ✅ Each activity entry contains: event description, user who performed action, timestamp
  - ✅ Activity log updates in real-time or near real-time after actions

- **Visibility:**
  - ✅ Activity log tab is present on all process pages
  - ✅ Activity log is accessible by Process Operator, Community Recruiter, and Community Admin
  - ✅ Activity log is NOT accessible by unauthorized users

- **Filtering (Must Have):**
  - ✅ Filter by specific candidate works correctly
  - ✅ Filter by team member works correctly
  - ✅ Filters can be cleared to show all activities
  - ✅ Filter results are accurate and complete

- **Timestamps:**
  - ✅ All activities have valid timestamps
  - ✅ Timestamps are displayed in user-friendly format
  - ✅ Activities are ordered chronologically

- **Job Advertisement Tracking:**
  - ✅ Field changes are recorded with field names
  - ✅ Publish events are clearly logged
  - ✅ Justifications for post-publish changes are captured and displayed

- **Candidate Tracking:**
  - ✅ New applications are logged
  - ✅ Status changes (qualified, disqualified, removed) are tracked
  - ✅ User responsible for status change is recorded

### Nice to Have Assertions:
- ⚪ New field values are displayed (not just field names)
- ⚪ Filter by date range works correctly
- ⚪ Filter by action type works correctly
- ⚪ Multiple filters can be combined
- ⚪ Skill assessments are tracked (if implemented)
- ⚪ Assessment plan changes are tracked (if implemented)

### UI/UX Assertions:
- ✅ Activity log UI matches design specifications
- ✅ Empty state is handled gracefully
- ✅ Large numbers of activities don't cause performance issues
- ✅ Pagination works correctly (if implemented)
- ✅ Loading states are displayed appropriately

## ✅ Acceptance Criteria

### For Test Implementation:
- [ ] All test suites (1-7) are implemented in Playwright
- [ ] Tests are organized in logical describe blocks
- [ ] Tests use proper fixtures and setup/teardown
- [ ] Tests are independent and can run in any order
- [ ] Tests include proper waits and assertions
- [ ] Tests handle async operations correctly
- [ ] Test data is cleaned up after each test

### For Test Execution:
- [ ] All tests pass consistently (no flaky tests)
- [ ] Tests can be run individually and as a suite
- [ ] Test execution time is reasonable (< 10 minutes for full suite)
- [ ] Tests generate clear error messages when they fail
- [ ] Tests integrate with existing CI/CD pipeline

### For Feature Validation:
- [ ] Activity log tab exists on all process pages
- [ ] All required activity types are being logged
- [ ] All activities include proper timestamps
- [ ] Filter by candidate works correctly
- [ ] Filter by team member works correctly
- [ ] Permissions are correctly enforced (operators/admins can access, applicants cannot)
- [ ] UI matches design specifications
- [ ] No console errors or warnings during activity log usage

### Code Quality:
- [ ] Tests follow existing Playwright test patterns in the repository
- [ ] Code is well-commented where necessary
- [ ] Test utilities are created for common operations
- [ ] Tests are maintainable and easy to understand

## 📚 Additional Context

### Existing Test Coverage:
- Basic activity log test exists at: `/apps/playwright/tests/admin/process-activity-log.spec.ts`
- Current test covers: field updates, change justifications, publish events
- This ticket aims to expand coverage to include all requirements from #15208

### Technical Considerations:
- Activity log uses GraphQL API for data fetching
- Consider using existing fixtures: `PoolPage`, `loginBySub`, `createAndPublishPool`
- Leverage existing utilities: `graphql.newContext()`, `me()`, `getSkills()`
- Follow patterns from existing admin tests

### Design Reference:
- Figma design: https://www.figma.com/design/fn6LXNySdE5irUbvky9WRM/Activity-log---Pools--Communities-?node-id=249-9281&t=yK2XJZV9gjG8SUNU-4
- Ensure UI selectors match the implemented design

### Test Data Requirements:
- Multiple test users with different roles
- Test processes/pools with various states (draft, published)
- Test candidates with different statuses
- Variety of activity types to test filtering

## 🏷️ Labels
- `Testing`
- `E2E`
- `playwright`
- `activity-log`

## 📌 Priority
**High** - This feature is part of the Activity Log MVP milestone and needs comprehensive test coverage before production release.
