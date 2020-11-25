const config = require("../../config/index.json");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const { version } = require("../../package.json");

Sentry.init({
  dsn: config.sentry.DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  release: version,
  debug: process.env.NODE_ENV === "development",
});
