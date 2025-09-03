#!/usr/bin/env node
import "source-map-support/register";

import * as cdk from "aws-cdk-lib";

import { ConfigManager } from "../src/config/config-manager";
import { Configuration } from "../src/config/configuration";
import { DpaIdAuth0SpaDemoStack } from "../src/stacks/dpaidauth0spademo/dpa-id-auth0-spa-demo-stack";

const app = new cdk.App();

const stage = process.env.STAGE || null;
// eslint-disable-next-line no-console
console.log("STAGE : " + stage);
if (!stage) throw new Error("STAGE is not set");

const config: Configuration = ConfigManager.createConfig(stage);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dpaIdAuth0SpaDemoStack = new DpaIdAuth0SpaDemoStack(
  app,
  "dpa-id-auth0-spa-demo-" + config.settings.deploymentSettings.stageSuffix,
  {
    env: config.env,
    settings: config.settings,
    tags: {
      project: "dpa-id-auth0-spa-demo",
      app: "dpa-id-auth0-spa-demo",
    },
    description: "dpaId Auth0 SPA Demo Service Stack.",
  },
);
