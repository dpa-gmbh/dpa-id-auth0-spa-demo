import { IVpc, SubnetType } from "aws-cdk-lib/aws-ec2";
import {
  BaseService,
  FargateService,
  ICluster,
  TaskDefinition,
} from "aws-cdk-lib/aws-ecs";
import { IApplicationTargetGroup } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Construct } from "constructs";

export interface DpaIdAuth0SpaDemoServiceProperties {
  cluster: ICluster;
  taskDefinition: TaskDefinition;
  vpc: IVpc;
  stackSuffix: string;
}

export class DpaIdAuth0SpaDemoService extends Construct {
  private readonly service: BaseService;

  constructor(scope: Construct, props: DpaIdAuth0SpaDemoServiceProperties) {
    super(scope, "DpaIdAuth0SpaDemo");
    const { cluster, taskDefinition, vpc, stackSuffix } = props;

    this.service = new FargateService(this, "Service", {
      cluster,
      taskDefinition,
      serviceName: `dpa-id-auth0-spa-demo-service-${stackSuffix}`,
      vpcSubnets: vpc.selectSubnets({
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      }),
    });

    this.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 1,
    });
  }

  public attachToApplicationTargetGroup(
    targetGroup: IApplicationTargetGroup,
  ): void {
    this.service.attachToApplicationTargetGroup(targetGroup);
  }
}
