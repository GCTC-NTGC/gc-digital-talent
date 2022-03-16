Feature: Admin interface

  # See: https://github.com/GCTC-NTGC/gc-digital-talent/pull/2082#issuecomment-1068524526
  Scenario: Changing tabs
    Given the following page is loaded: /some/admin/path
    And I try to click the tab "xxxxx"
    Then the tab loads

  # See: https://github.com/GCTC-NTGC/gc-digital-talent/pull/2082#issuecomment-1069091703
  Scenario: Logging in
    Given I'm on the login page
    And I sign in with "username" and "password"
    Then I should see some indication of being logged in

  Scenario: Logging out
    Given I'm logged in
    And I click the logout button
    Then I should see some indication of being logged out

  Scenario: Users list
    Given I'm logged in
    And I visit the users page
    Then I should see the list of users

  Scenario: Edit user
    Given I'm logged in
    And I visit the users page
    And I visit the edit page of the first user
    And I enter a new first name
    And I click submit
    Then I should see the new name on the users page
    
