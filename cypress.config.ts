import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "as7vff",

  e2e: {
    specPattern: "tests/e2e-cypress/tests/**/*.cy.{js,ts,jsx,tsx}",
    baseUrl: "http://localhost:3000",
    supportFile: "tests/e2e-cypress/support/e2e.ts",
    fixturesFolder: "tests/e2e-cypress/fixtures",
    screenshotsFolder: "tests/e2e-cypress/screenshots",
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
