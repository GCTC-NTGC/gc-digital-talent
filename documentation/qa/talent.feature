Feature: Talent interface

  # See: https://github.com/GCTC-NTGC/gc-digital-talent/pull/2082#issuecomment-1068524526
  Scenario: Scroll on a page
    Given the following page is loaded: /some/talent/path
    And I try to scroll down with the mouse wheel
    Then the page scrolls down

  # See: https://github.com/GCTC-NTGC/gc-digital-talent/pull/2082#issuecomment-1069091703
  Scenario: Candidates loaded
    Given I navigate to page: /talent
    Then I should not expect candidate estimate to be "0"

  Scenario: Candidate request
    Given I navigate to page: /talent
    And I click the "Request Candidates" link
    And I fill in some junk data
    And I click "Submit Request"
    Then I should see the toast: "Request created successfully!"
