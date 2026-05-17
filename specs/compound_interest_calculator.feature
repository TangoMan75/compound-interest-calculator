Feature: Compound Interest Calculation
  As an Individual Saver
  I want to calculate the future value of my savings using compound interest
  So that I can visualize my wealth growth over time through an interactive graph

  Background:
    Given the user is on the Compound Interest Calculator PWA
    And the calculator form is empty

  Scenario: Successful calculation with valid inputs
    Given the user enters "1000" as the starting amount
    And the user enters "5" as the annual interest rate
    And the user enters "10" as the duration in years
    When the user clicks the "Calculate" button
    Then the system should calculate the future balance as "1628.89"
    And a growth graph should be displayed on the page
    And the page should not reload

  Scenario: Real-time graph update on input change
    Given the user has already performed a calculation
    When the user changes the interest rate to "7"
    Then the graph should automatically update to reflect the new projection
    And the new future balance should be displayed as "1967.15"

  Scenario Outline: Validation of numeric inputs
    Given the user enters "<input_value>" into the "<field>" field
    When the user attempts to calculate
    Then an error message should appear saying "<error_message>"
    And no graph should be displayed

    Examples:
      | field           | input_value | error_message                       |
      | starting amount | -500        | Amount cannot be negative           |
      | interest rate   | abc         | Please enter a valid percentage     |
      | duration        | 0           | Duration must be at least 1 year    |

  Scenario: Mobile Responsiveness for PWA
    Given the user is accessing the app on a mobile device
    Then the input form and the growth graph should stack vertically
    And all touch targets should be easily clickable