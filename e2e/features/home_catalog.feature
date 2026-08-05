Feature: Home product catalog
  As a shopper
  I want to browse products on the home page
  So that I can open a product and learn more about it

  Scenario: User sees a product list on the home page
    When I visit the home page
    Then I should see the products heading
    And I should see at least 1 product card

  Scenario: Product cards display title, image, price, and rating
    When I visit the home page
    Then the first product card should show a title
    And the first product card should show an image
    And the first product card should show a price
    And the first product card should show a rating

  Scenario: User clicks a product card and opens the product detail route
    When I visit the home page
    And I open the product card with id 1
    Then the page URL should be "/products/1"
