import { Configuration } from "./configuration.ts";
import { Master } from "./stages/master.ts";

export class ConfigManager {
  static createConfig(stage: string): Configuration {
    switch (stage) {
      case Master.STAGE:
        return new Master();
      default:
        throw new Error(`Stage '${stage}' is undefined.`);
    }
  }
}
