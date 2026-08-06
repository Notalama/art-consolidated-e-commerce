Feature: Product details page
  As a shopper
  I want to view a product’s details and add it to my cart once
  So that I can finish quantity changes on the cart page

  Background:
    Given the cart store is ready
    And the cart is empty

  Scenario: Viewing product details for a valid product id
    When I visit the product details page for id 1
    Then I should see the product details title
    And I should see the product details image
    And I should see the product details description
    And I should see the product details price
    And I should see the product details discount
    And I should see the product details rating
    And I should see the "Add to Cart" button

  Scenario: Adding a product once replaces Add to Cart with Already in cart
    When I visit the product details page for id 1
    Then the cart badge should not be visible
    And I should see the "Add to Cart" button
    When I click the "Add to Cart" button
    Then the cart badge should show 1
    And I should see the "Already in cart" link
    And I should not see the "Add to Cart" button

  Scenario: Already in cart navigates to the cart page
    Given the cart contains a product with id 1 titled "Essence Mascara" priced at 9.99 with quantity 1
    When I visit the product details page for id 1
    Then I should see the "Already in cart" link
    When I follow the "Already in cart" link
    Then the page URL should be "/cart"

  Scenario: Invalid product id shows the not found page
    When I visit the product details page for id 999999
    Then I should see the not found page
