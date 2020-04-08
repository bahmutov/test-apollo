import React from 'react'
import App from './App'
import {mount} from 'cypress-react-unit-test'
import ApolloClient from "apollo-boost";

describe('App', () => {
  it('loads real thing', () => {
    mount(<App />)
    // it might take a while to load real data from remote server
    cy.get('[data-cy=book]', {timeout: 20000})
      .should('have.length.gte', 1)
  })

  beforeEach(() => {
    cy.fixture('books')
      .then(JSON.stringify)
      .as('booksText')
  })

  it('can mock window fetch', function () {
    cy.stub(window, 'fetch').withArgs("https://test/")
      .resolves({
        text: cy.stub().resolves(this.booksText).as('text')
      }).as('fetch')

    const client = new ApolloClient({
      uri: "https://test/"
    });
    mount(<App apolloClient={client} />)
    cy.get('[data-cy=book]').should('have.length', 2)
  })
})
