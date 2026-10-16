import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: "http://127.0.0.1:8091", channel: "chrome", headless: true },
  webServer: {
    command: "python -m http.server 8091 --bind 127.0.0.1",
    url: "http://127.0.0.1:8091",
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "ignore",
  },
});
