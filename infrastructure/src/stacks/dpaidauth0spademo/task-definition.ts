import { RemovalPolicy } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-ecr";
import {
  ContainerDependencyCondition,
  ContainerImage,
  FargateTaskDefinition,
  LogDriver,
  Protocol,
  Secret as ECSSecret,
} from "aws-cdk-lib/aws-ecs";
import { IRole } from "aws-cdk-lib/aws-iam";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

import { DeploymentSettings } from "../../config/configuration";

export interface TaskDefinitionProperties {
  applicationRole: IRole;
  settings: DeploymentSettings;
}

export class DpaIdFrontendTaskDefinition extends Construct {
  public readonly instance: FargateTaskDefinition;
  private readonly laceworkMemoryPercentage = 10;
  private readonly memoryLimit = 512; // Default memory limit

  constructor(scope: Construct, id: string, props: TaskDefinitionProperties) {
    super(scope, id);

    /**
     * Creating role for application.
     */
    const logGroup = new LogGroup(this, "AppLogGroup", {
      logGroupName: `/dpa-id-auth0-spa-demo/${props.settings.stageSuffix}`,
      retention: RetentionDays.SIX_MONTHS,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.instance = new FargateTaskDefinition(this, "TaskDefinition", {
      taskRole: props.applicationRole,
      memoryLimitMiB: this.memoryLimit,
    });

    const environment = props.settings.environment;
    const appContainer = this.instance.addContainer("Container", {
      image: ContainerImage.fromEcrRepository(
        Repository.fromRepositoryArn(
          this,
          "ecr-repo",
          props.settings.repositoryArn,
        ),
        props.settings.imageTag,
      ),
      portMappings: [
        {
          containerPort: props.settings.applicationPort,
          protocol: Protocol.TCP,
        },
      ],
      environment: {
        LaceworkServerUrl: "https://agent.euprodn.lacework.net",
        LaceworkConfig: `{"memlimit":"${Math.floor(
          (this.memoryLimit * this.laceworkMemoryPercentage) / 100,
        )}M"}`,
        ...environment,
      },
      containerName: `dpa-id-auth0-spa-demo-Container-${props.settings.stageSuffix}`,
      logging: LogDriver.awsLogs({
        streamPrefix: "dpaidauth0spademo",
        logGroup,
      }),
      essential: true,
      secrets: {
        LaceworkAccessToken: ECSSecret.fromSecretsManager(
          Secret.fromSecretNameV2(
            this,
            "LaceworkAccessToken",
            "LaceworkAccessToken",
          ),
        ),
      },
      entryPoint: [
        "/var/lib/lacework-backup/lacework-sidecar.sh",
        "/usr/bin/entrypoint.sh",
      ],
    });

    const laceworkContainer = this.instance.addContainer("lacework-collector", {
      containerName: `lacework-collector`,
      image: ContainerImage.fromEcrRepository(
        Repository.fromRepositoryArn(
          this,
          "LaceworkRepositoy",
          "arn:aws:ecr:eu-central-1:478324715856:repository/lacework/datacollector",
        ),
        "latest-sidecar",
      ),
      logging: LogDriver.awsLogs({
        streamPrefix: `lacework-collector`,
        logRetention: RetentionDays.ONE_MONTH,
      }),
      essential: false,
    });

    appContainer.addVolumesFrom({
      readOnly: true,
      sourceContainer: `lacework-collector`,
    });

    appContainer.addContainerDependencies({
      container: laceworkContainer,
      condition: ContainerDependencyCondition.SUCCESS,
    });
  }
}
