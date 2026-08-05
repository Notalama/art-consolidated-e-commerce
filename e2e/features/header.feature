Feature: Site header navigation
  As a shopper
  I want a persistent header with brand, Home, and Cart
  So that I can move around the store and see my cart item count

  Background:
    Given the cart store is ready
    And the cart is empty

  Scenario: Header renders site title and navigation links
    Then I should see the site title "Arts Consolidated Store"
    And I should see a navigation link "Home" to "/"
    And I should see a navigation link "Cart" to "/cart"

  Scenario: Cart badge updates when items are added and removed
    Then the cart badge should not be visible
    When I add a product with id 1 titled "Essence Mascara" priced at 9.99
    Then the cart badge should show 1
    When I add a product with id 1 titled "Essence Mascara" priced at 9.99
    Then the cart badge should show 2
    When I add a product with id 2 titled "Eyeshadow Palette" priced at 19.99
    Then the cart badge should show 3
    When I remove the product with id 1 from the cart
    Then the cart badge should show 1
    When I remove the product with id 2 from the cart
    Then the cart badge should not be visible

  Scenario: Cart badge reflects quantity changes for the same product
    When I add a product with id 1 titled "Essence Mascara" priced at 9.99
    And I add a product with id 1 titled "Essence Mascara" priced at 9.99
    Then the cart badge should show 2
    When I decrease the quantity of product id 1 by 1
    Then the cart badge should show 1
    When I decrease the quantity of product id 1 by 1
    Then the cart badge should not be visible

  Scenario: Site title and cart links navigate correctly
    When I follow the navigation link "Cart"
    Then the page URL should be "/cart"
    And I should see the site title "Arts Consolidated Store"
    When I follow the navigation link "Home"
    Then the page URL should be "/"
