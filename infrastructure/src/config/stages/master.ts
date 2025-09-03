import { Duration } from "aws-cdk-lib";

import {
  Configuration,
  DeploymentSettings,
  DnsSettings,
  Settings,
} from "../configuration";

export class Master implements Configuration {
  public static readonly STAGE = "master";

  private static readonly BaseDomain = "dpa-id.de";
  private static readonly HostedZoneId = "Z2MRBHSLXAT5CM";

  stage = Master.STAGE;
  env = { account: "202797282286", region: "eu-central-1" };

  settings: Settings;

  constructor() {
    this.settings = this.createSettings();
  }

  public createSettings(): Settings {
    return {
      vpc: {
        name: "development-dpa-id",
      },
      ecsClusterSettings: this.createEcsClusterSettings(),
      loadbalancerSettings: this.createLoadbalancerSettings(),
      dnsSettings: this.createDnsSettings(),
      deploymentSettings: this.createDeploymentSettings(),
    };
  }

  private createLoadbalancerSettings() {
    return {
      securityGroupId: "sg-06d6fa1449018b133",
      loadbalancerArn:
        "arn:aws:elasticloadbalancing:eu-central-1:202797282286:loadbalancer/app/development-dpa-id-alb/86e923f20175cc16",
      loadbalancerCanonicalHostedZoneId: "Z215JYRZR1TBD5",
      loadbalancerDnsName:
        "development-dpa-id-alb-1800181711.eu-central-1.elb.amazonaws.com",
      loadbalancerListenerArn:
        "arn:aws:elasticloadbalancing:eu-central-1:202797282286:listener/app/development-dpa-id-alb/86e923f20175cc16/b11444453b64f67e",
    };
  }

  private createEcsClusterSettings() {
    return {
      arn: "arn:aws:ecs:eu-central-1:202797282286:cluster/dpa-id-services-devel-cluster",
      name: "dpa-id-services-devel-cluster",
    };
  }

  private createDnsSettings(): DnsSettings {
    const recordName = `spa-demo.${Master.BaseDomain}`;

    return {
      hostedZoneName: Master.BaseDomain,
      hostedZoneId: Master.HostedZoneId,
      recordName,
    };
  }

  private createDeploymentSettings(): DeploymentSettings {
    return {
      repositoryArn:
        "arn:aws:ecr:eu-central-1:202797282286:repository/dpa-id-auth0-spa-demo",
      applicationPort: 80,
      deregistrationDelay: Duration.seconds(5),
      lbPriority: getRandomInt(500, 600),
      imageTag: process.env.IMAGE_TAG,
      stageSuffix: "master",
      environment: {
        STAGE: "devel",
      },
    };
  }
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
