Feature: Cart store
  As a shopper
  I want my cart state to update correctly and survive reloads
  So that I can build an order across pages in the same browser session

  Background:
    Given the cart store is ready
    And the cart is empty

  Scenario: Adding an item to an empty cart
    When I add a product with id 1 titled "Essence Mascara" priced at 9.99
    Then the cart should contain 1 unique product
    And the item with id 1 should have quantity 1
    And the total item count should be 1
    And the total price should be 9.99

  Scenario: Adding an existing item increments quantity
    Given the cart contains a product with id 1 titled "Essence Mascara" priced at 9.99 with quantity 1
    When I add a product with id 1 titled "Essence Mascara" priced at 9.99
    Then the cart should contain 1 unique product
    And the item with id 1 should have quantity 2
    And the total item count should be 2
    And the total price should be 19.98

  Scenario: Removing an item from cart
    Given the cart contains a product with id 1 titled "Essence Mascara" priced at 9.99 with quantity 2
    When I remove the product with id 1 from the cart
    Then the cart should be empty
    And the total item count should be 0
    And the total price should be 0.00

  Scenario: Calculating total count and total price accurately
    Given the cart contains the following products:
      | id | title     | price | quantity |
      | 1  | Product A | 10.00 | 2        |
      | 2  | Product B | 5.50  | 1        |
    Then the cart should contain 2 unique products
    And the total item count should be 3
    And the total price should be 25.50

  Scenario: Cart persistence across page reloads
    Given the cart contains a product with id 1 titled "Essence Mascara" priced at 9.99 with quantity 2
    When I reload the page
    Then the cart store is ready
    And the cart should contain 1 unique product
    And the item with id 1 should have quantity 2
    And the total item count should be 2
    And the total price should be 19.98
    And local storage should contain the key "cart-storage"
