Feature: Cart page
  As a shopper
  I want to review and change items in my cart
  So that I can fix quantities or keep shopping before checkout

  Background:
    Given the cart store is ready
    And the cart is empty

  Scenario: Viewing an empty cart shows the empty state
    When I visit the cart page
    Then I should see the empty cart message
    And I should see the "Continue Shopping" button

  Scenario: Cart page renders added products with quantities and total price
    Given the cart contains the following products:
      | id | title     | price | quantity |
      | 1  | Product A | 10.00 | 2        |
      | 2  | Product B | 5.50  | 1        |
    When I visit the cart page
    Then I should see a cart line for product id 1 with quantity 2
    And I should see a cart line for product id 2 with quantity 1
    And the cart summary item count should be 3
    And the cart summary total should be 25.50

  Scenario: Removing an item updates the cart list and total immediately
    Given the cart contains the following products:
      | id | title     | price | quantity |
      | 1  | Product A | 10.00 | 2        |
      | 2  | Product B | 5.50  | 1        |
    When I visit the cart page
    And I remove product id 1 from the cart page
    Then I should not see a cart line for product id 1
    And I should see a cart line for product id 2 with quantity 1
    And the cart summary item count should be 1
    And the cart summary total should be 5.50
    And the cart badge should show 1

  Scenario: Continue Shopping navigates to the home page
    When I visit the cart page
    And I click the "Continue Shopping" button
    Then the page URL should be "/"
