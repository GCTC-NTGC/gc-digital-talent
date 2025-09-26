### Description
Implement Playwright end-to-end tests to verify that the bug described in #14342 (Create Department screen is no longer working) is fixed and that creating a Department works as expected.

### Test Steps
1. Log in as Platform Admin.
2. Navigate to Departments and click create.
3. Fill in all mandatory fields and click "Create Department".
4. Verify that the department is successfully created and no console errors appear.

### Acceptance Criteria
- The department appears in the list after creation.
- No errors are shown in the UI or in the console.
- Creation is reflected in the backend (if possible to verify via API or UI).

Reference: #14342