export {}

describe("RealBeans", () => {
  beforeEach(() => {
    cy.visit("https://r1009675-realbeans.myshopify.com/")
    cy.get("#password").type("rowohm")
    cy.get("button").contains("Enter").click()
  })

  context("Catalog Page", () => {
    beforeEach(() => {    
      cy.get("#HeaderMenu-catalog").contains("Catalog").click()
      cy.location("pathname").should("equal", "/collections/all")
    })

    context("The product catalog page shows the correct items you entered.", () => {
      it("Roasted coffee beans 5kg", () => {
        cy.get("#product-grid").find("li").contains("Roasted coffee beans 5kg")
      })

      it("Blended coffee 5kg", () => {
        cy.get("#product-grid").find("li").contains("Blended coffee 5kg")
      })
    })

    const getProductTitles = () =>
      cy.get("#product-grid li .card__heading a").then(($els) =>
        Cypress._.map($els, (el) => el.innerText.trim())
      )

    it("Sorting products (e.g., by price) actually changes their order.", () => {
      getProductTitles().then((beforeTitles) => {
        cy.intercept('GET', '**/collections/**').as('sortRequest')
        cy.get("select#SortBy").select("price-ascending")
        cy.wait('@sortRequest')
        cy.wait(1000)
        getProductTitles().then((afterTitles) => {
          expect(afterTitles).to.not.deep.equal(beforeTitles)
        })
      })
    })

    context("Product detail pages display the right descriptions, prices, and imagenames.", () => {
      context("Roasted coffee beans 5kg", () => {
        beforeEach(() => {
          cy.get("#product-grid").find("#CardLink-template--25058918891903__product-grid-15098996818303").contains("Roasted coffee beans 5kg").click()
          cy.location("pathname").should("equal", "/products/roasted-coffee-beans-5kg")
        })

        it("Product description", () => {
          cy.get(".product__description").contains("Our best and sustainable real roasted beans.")
        })

        it("Product price: Robusta", () => {
          cy.get('input[type="radio"][value="Robusta"]').check({ force: true })
          cy.get('span.price-item.price-item--regular').contains("40")
        })

        it("Product price: Excelsa", () => {
          cy.get('input[type="radio"][value="Excelsa"]').check({ force: true })
          cy.get('span.price-item.price-item--regular').contains("50")
        })

        it("Product price: Arabica", () => {
          cy.get('input[type="radio"][value="Arabica"]').check({ force: true })
          cy.get('span.price-item.price-item--regular').contains("55")
        })

        it("Product price: Liberica", () => {
          cy.get('input[type="radio"][value="Liberica"]').check({ force: true })
          cy.get('span.price-item.price-item--regular').contains("55")
        })

        it("Product image name", () => {
          cy.get('img').should('have.attr', 'src').and('include', 'RealBeansRoastedBag.png')
        })
      })

      context("Blended coffee 5kg", () => {
        beforeEach(() => {
          cy.get("#product-grid").find("#CardLink-template--25058918891903__product-grid-15099029619071").contains("Blended coffee 5kg").click()
          cy.location("pathname").should("equal", "/products/blended-coffee-5kg")
        })

        it("Product description", () => {
          cy.get(".product__description").contains("RealBeans coffee, ready to brew.")
        })

        it("Product price: Robusta", () => {
          cy.get('input[type="radio"][value="Robusta"]').check({ force: true })
          cy.get('span.price-item.price-item--regular').contains("55")
        })

        it("Product price: Excelsa", () => {
          cy.get('input[type="radio"][value="Excelsa"]').check({ force: true })
          cy.get('span.price-item.price-item--regular').contains("60")
        })

        it("Product price: Arabica", () => {
          cy.get('input[type="radio"][value="Arabica"]').check({ force: true })
          cy.get('span.price-item.price-item--regular').contains("60")
        })

        it("Product price: Liberica", () => {
          cy.get('input[type="radio"][value="Liberica"]').check({ force: true })
          cy.get('span.price-item.price-item--regular').contains("65")
        })

        it("Product image name", () => {
          cy.get('img').should('have.attr', 'src').and('include', 'RealBeansBlendBag.png')
        })
      })
    })
  })

  context('Home page', () => {
    it('Intro text', () => {
      cy.get(".banner__text").contains("Since 1801, RealBeans has roasted premium coffee in Antwerp for Europe’s finest cafes. Ethically sourced beans, crafted with care.")
    })

    context("Product list", () => {
      it("Roasted coffee beans 5kg", () => {
        cy.get("#Slider-template--25058918924671__featured_collection").find("li").contains("Roasted coffee beans 5kg")
      })

      it("Blended coffee 5kg", () => {
        cy.get("#Slider-template--25058918924671__featured_collection").find("li").contains("Blended coffee 5kg")
      })
    })
  })

  context('About page', () => {
    it("History paragraph", () => {
      cy.get("#HeaderMenu-about-us").contains("About Us").click()
      cy.location("pathname").should("equal", "/pages/about-me")
      cy.get('body').contains("From a small Antwerp grocery to a European coffee staple, RealBeans honors tradition while innovating for the future. Our beans are roasted in-house, shipped from Antwerp or Stockholm, and loved across the continent.")
    })
  })
})