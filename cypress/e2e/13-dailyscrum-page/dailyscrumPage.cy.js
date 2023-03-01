/// <reference types="cypress" />
import projectsData from '../../fixtures/projects.json';
import boardData from '../../fixtures/board.json';
import dailyScrum from '../../fixtures/dailyScrum.json';
import dailyScrumUpdate from '../../fixtures/dailyScrumUpdate.json';
describe('Project page', () => {
  beforeEach(() => {
    let projectList = projectsData;
    cy.intercept('GET', '**/projects', projectList).as('fetch-projects');
    cy.visit('/login');
    cy.login('kitman200220022002@gmail.com', '12345678');
    cy.wait('@fetch-projects');
    cy.intercept('GET', '**/board/**', boardData).as('fetch-board');
    cy.get('[data-testid="evan"]').dblclick();
    cy.wait('@fetch-board');
  });

  it('Test should close dailyscrum page', () => {
    cy.get('[data-testid="dailyscrum-btn"]').then((items) => {
      items[0].click();
    });
    cy.get('[data-testid="dailyscrum-close"]').click();
    cy.get('[data-testid="dailyscrum-header"]').should('not.exist');
  });
  it('Test should click no and type reason', () => {
    cy.intercept('GET', '**/dailyScrums/*/*/*/*', dailyScrum).as('fetch-dailyScrums');
    cy.get('[data-testid="dailyscrum-btn"]').then((items) => {
      items[0].click();
    });
    cy.wait('@fetch-dailyScrums');
    cy.get('[type="radio"]').check();
    cy.get('[data-testid="dailyscrum-reason-6371d4176d614a9131b97e6f"]').type('I need support');
  });
  it('Test cancel should close dailyscrum page', () => {
    cy.get('[data-testid="dailyscrum-btn"]').then((items) => {
      items[0].click();
    });
    cy.get('[data-testid="dailyscrum-cancel"]').click();
    cy.get('[data-testid="dailyscrum-header"]').should('not.exist');
  });
  it('Test should drag progress bar to 80%', () => {
    cy.intercept('GET', '**/dailyScrums/*/*/*/*', dailyScrum).as('fetch-dailyScrums');
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    cy.get('[data-testid="dailyscrum-btn"]').then((items) => {
      items[0].click();
    });
    cy.wait('@fetch-dailyScrums');
    cy.get('[data-testid="dailyscrum-progress-bar-6371d4176d614a9131b97e6f"]').then(($range) => {
      const range = $range[0];
      nativeInputValueSetter.call(range, 80);
      range.dispatchEvent(new Event('change', { value: 80, bubbles: true }));
    });
    cy.get('[data-testid="dailyscrum-progress-6371d4176d614a9131b97e6f"]').contains('80%');
  });
  it('Test should submit data', () => {
    cy.intercept('GET', '**/dailyScrums/*/*/*/*', dailyScrum).as('fetch-dailyScrums');
    cy.intercept('PATCH', '**/dailyScrums/*', dailyScrumUpdate).as('update-dailyScrums');
    cy.get('[data-testid="dailyscrum-btn"]').then((items) => {
      items[0].click();
    });
    cy.wait('@fetch-dailyScrums');
    cy.get('[type="radio"]').check();
    cy.get('[data-testid="dailyscrum-reason-6371d4176d614a9131b97e6f"]').type('I need support');
    cy.get('[data-testid="dailyscrum-submit"]').click();
  });
});
