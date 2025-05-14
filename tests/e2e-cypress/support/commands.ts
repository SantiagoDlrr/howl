/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//



// cypress/support/commands.ts

Cypress.Commands.add('login', () => {

    cy.fixture('auth/sign-up-users').then((users) => {
        cy.visit('/auth?mode=login');
        const user = users.validUser;
        // cy.get('[data-testid="login-name"]').type(user.name);
        cy.get('[data-testid="login-email"]').type(user.email);
        cy.get('[data-testid="login-password"]').type(user.password);
        cy.get('button[type="submit"]').click();
        //wait for the page to load
      });


    // 1. Mock the session response
    // cy.intercept('GET', '/api/auth/session', {
    //   user: {
    //     id: 'test-user-123',
    //     email: 'test@example.com',
    //     name: 'Test User'
    //   },
    //   expires: '3000-01-01T00:00:00.000Z'
    // }).as('session');
  
    // // 2. Set auth cookie
    // // cy.setCookie('next-auth.session-token', '<real-token-here>');
    // cy.setCookie('authjs.session-token', 'fake-session-token');
  
    // // 3. Visit the page (simplified - no window manipulation)
    // cy.visit('/');

    
  });


  
  // Minimal type declaration
  declare global {
    namespace Cypress {
      interface Chainable {
        login(): void;
        mockTrpcQuery(procedure: string, data: any): Chainable<void>;
      }
    }
  }



// declare global {
//     namespace Cypress {
//         interface Chainable {
//             login(): Chainable<void>;
//             mockSession(): Chainable<void>;
//             mockTrpcQuery(procedure: string, data: any): Chainable<void>;
//             mockTrpcMutation(procedure: string, data: any): Chainable<void>;
//           }
//     }
//   }
  
//   Cypress.Commands.add('login', () => {
//     cy.mockSession();
//     // If you need to visit a page after login
//     cy.visit('/clients');
//   });
  
//   Cypress.Commands.add('mockSession', () => {
//     cy.intercept('/api/auth/session', { fixture: 'auth/session.json' }).as('session');
//     // Mock any other auth-related endpoints if needed
//   });

// //   Cypress.Commands.add('mockTrpcQuery', (procedure, data) => {
// //     cy.intercept('POST', '/api/trpc/*', (req) => {
// //         console.log('Intercepted request:', req)
// //       if (req.body[0].method === 'query' && 
// //           req.body[0].input.path === procedure) {
// //         req.reply({
// //           body: [{ result: { data } }],
// //         });
// //       }
// //     }).as(`trpcQuery:${procedure}`);
// //   });
  
//   Cypress.Commands.add('mockTrpcMutation', (procedure, data) => {
//     cy.intercept('POST', '/api/trpc/*', (req) => {
//       if (req.body[0].method === 'mutation' && 
//           req.body[0].input.path === procedure) {
//         req.reply({
//           body: [{ result: { data } }],
//         });
//       }
//     }).as(`trpcMutation:${procedure}`);
//   });


//   Cypress.Commands.add('mockTrpcQuery', (procedure, data) => {
//     cy.intercept('GET', `/api/trpc/${procedure}*`, (req) => {
//         // Parse the input from the URL if needed
//         const url = new URL(req.url);
//         const searchParams = new URLSearchParams(url.search);
//         const inputParam = searchParams.get('input');
//         let input = undefined;
        
//         if (inputParam) {
//           try {
//             input = JSON.parse(decodeURIComponent(inputParam));
//           } catch (e) {
//             console.error('Error parsing input:', e);
//           }
//         }
    
//         req.reply({
//           statusCode: 200,
//           body: {
//             result: {
//               data: data,
//               ...(input && { input }) // Include input if it exists
//             }
//           },
//           headers: {
//             'content-type': 'application/json'
//           }
//         });
//       }).as(`trpc:${procedure}`);





    //     cy.intercept('GET', '/api/trpc/*', (req) => {
//         const url = new URL(req.url, window.location.origin);
//         const path = url.pathname.split('/api/trpc/')[1]?.split('?')[0];
    
//         if (path === procedure) {
//           // Extract the `batch` input from the query
//           const searchParams = new URLSearchParams(url.search);
//           const batchInput = searchParams.get('batch');
    
//           // Example: parse ID from raw URL if batching adds ids (you can also use req.body or query if POST)
//           const id = Number(searchParams.get('id') || '0');
    
//           req.reply({
//             statusCode: 200,
//             body: [
//               {
//                 id,
//                 result: {
//                   data
//                 }
//               }
//             ]
//           });
//         }
//   }).as(`trpc:${procedure}`);
  
//   Cypress.Commands.add('mockTrpcQuery', (procedure, mockData) => {
//     cy.intercept('GET', '/api/trpc/*', (req) => {
//       const url = new URL(req.url, window.location.origin);
//       const rawInput = url.searchParams.get('input');
  
//       if (!rawInput) return;
  
//       try {
//         const parsedInput = JSON.parse(decodeURIComponent(rawInput));
//         const [call] = parsedInput;
  
//         const { id, params } = call;
  
//         if (params?.path === procedure) {
//           req.reply({
//             statusCode: 200,
//             body: [
//               {
//                 id,
//                 result: {
//                   data: mockData,
//                 },
//               },
//             ],
//           });
//         }
//       } catch (err) {
//         console.error('Failed to parse TRPC input:', err);
//       }
//     }).as(`trpc:${procedure}`);
//   });
   