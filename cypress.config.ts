import { defineConfig } from "cypress";

let userCreated = false;

export default defineConfig({
  projectId: "as7vff",

  e2e: {
    specPattern: "tests/e2e-cypress/tests/**/*.cy.{js,ts,jsx,tsx}",
    baseUrl: "http://localhost:3000",
    supportFile: "tests/e2e-cypress/support/e2e.ts",
    fixturesFolder: "tests/e2e-cypress/fixtures",
    screenshotsFolder: "tests/e2e-cypress/screenshots",
    experimentalRunAllSpecs: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      on('task', {
        checkUserCreated: () => userCreated,
        setUserCreated: () => {
          userCreated = true;
          return null;
        },
      });
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
