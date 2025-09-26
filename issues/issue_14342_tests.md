### Issue Type: Tests

#### Description:
Implement Playwright end-to-end tests to verify the bug fix for issue #14342 ('Create Department screen is no longer working').

#### Test Steps:
1. Log in as Platform Admin.
2. Navigate to Departments and click create.
3. Fill in all mandatory fields and click 'Create Department'.
4. Verify that the department is successfully created and no console errors appear.

#### Acceptance Criteria:
- The department appears in the list.
- No errors in the UI.
- Creation is reflected in the backend.
