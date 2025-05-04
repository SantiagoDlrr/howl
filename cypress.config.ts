import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: 'tests/e2e-cypress/tests/**/*.cy.{js,ts,jsx,tsx}',
    //baseUrl: 'https://howl-eight.vercel.app',
    baseUrl: 'http://localhost:3000',
    supportFile: 'tests/e2e-cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
