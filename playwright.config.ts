import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "e2e-test-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never", outputFolder: "e2e-test-report" }]]
    : [["list"], ["html", { open: "never", outputFolder: "e2e-test-report" }]],
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "yarn start",
    env: {
      ...process.env,
      ROOTLY_MAIN_TOKEN: "playwright-main-token",
      ROOTLY_SANDBOX_TOKEN: "playwright-sandbox-token",
    },
    reuseExistingServer: !process.env.CI,
    stderr: "pipe",
    stdout: "pipe",
    timeout: 180_000,
    url: "http://localhost:3000",
  },
});
