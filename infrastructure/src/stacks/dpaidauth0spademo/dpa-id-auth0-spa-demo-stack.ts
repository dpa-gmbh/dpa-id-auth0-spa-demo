import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { ISecurityGroup, IVpc, SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster, ICluster } from "aws-cdk-lib/aws-ecs";
import {
  ApplicationListener,
  ApplicationLoadBalancer,
  ApplicationProtocol,
  ApplicationTargetGroup,
  IApplicationListener,
  ILoadBalancerV2,
  ListenerCondition,
  TargetType,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

import { Settings } from "../../config/configuration";
import { DpaIdAuth0SpaDemoDnsRecord } from "./dns-record";
import { DpaIdAuth0SpaDemoRole } from "./role";
import { DpaIdAuth0SpaDemoService } from "./service";
import { DpaIdFrontendTaskDefinition } from "./task-definition";

export interface DpaIdAuth0SpaDemoProperties extends StackProps {
  settings: Settings;
}

export class DpaIdAuth0SpaDemoStack extends Stack {
  private readonly dnsRecord: DpaIdAuth0SpaDemoDnsRecord;

  constructor(
    scope: Construct,
    id: string,
    props: DpaIdAuth0SpaDemoProperties,
  ) {
    super(scope, id, props);
    const { settings } = props;
    const { deploymentSettings } = settings;

    const hostedZone = HostedZone.fromHostedZoneAttributes(
      this,
      "DpaIdFrontendHostedZone",
      {
        hostedZoneId: settings.dnsSettings.hostedZoneId,
        zoneName: settings.dnsSettings.hostedZoneName,
      },
    );
    const recordName = settings.dnsSettings.recordName;
    const vpc = this.lookupVPC(settings.vpc.name);

    const applicationRole = new DpaIdAuth0SpaDemoRole(this);

    const taskdefinition = new DpaIdFrontendTaskDefinition(
      this,
      "ApplicationTaskDefinition",
      {
        applicationRole: applicationRole.instance,
        settings: deploymentSettings,
      },
    );
    const loadBalancerSecurityGroup = this.lookupLBSecurityGroup(
      settings.loadbalancerSettings.securityGroupId,
    );
    const loadBalancer = this.lookupLB(
      loadBalancerSecurityGroup,
      vpc,
      settings.loadbalancerSettings.loadbalancerArn,
      settings.loadbalancerSettings.loadbalancerCanonicalHostedZoneId,
      settings.loadbalancerSettings.loadbalancerDnsName,
    );
    const loadBalancerListener = this.lookupLBListener(
      loadBalancerSecurityGroup,
      settings.loadbalancerSettings.loadbalancerListenerArn,
    );
    const cluster = this.lookupCluster(
      vpc,
      settings.ecsClusterSettings.arn,
      settings.ecsClusterSettings.name,
    );

    this.dnsRecord = new DpaIdAuth0SpaDemoDnsRecord(this, {
      loadBalancer: loadBalancer,
      recordName,
      zone: hostedZone,
    });
    const service = new DpaIdAuth0SpaDemoService(this, {
      vpc,
      taskDefinition: taskdefinition.instance,
      cluster: cluster,
      stackSuffix: deploymentSettings.stageSuffix,
    });

    const targetGroup = new ApplicationTargetGroup(this, "AppTargetGroup", {
      vpc,
      targetType: TargetType.IP,
      protocol: ApplicationProtocol.HTTP,
      port: settings.deploymentSettings.applicationPort,
      deregistrationDelay: settings.deploymentSettings.deregistrationDelay,
      healthCheck: {
        path: "/",
        unhealthyThresholdCount: 3,
        healthyThresholdCount: 3,
        interval: Duration.seconds(30),
      },
    });

    service.attachToApplicationTargetGroup(targetGroup);

    loadBalancerListener.addTargetGroups("TargetGroup", {
      priority: settings.deploymentSettings.lbPriority,
      conditions: [ListenerCondition.hostHeaders([recordName])],
      targetGroups: [targetGroup],
    });
  }
  private lookupCluster(
    vpc: IVpc,
    clusterArn: string,
    clusterName: string,
  ): ICluster {
    return Cluster.fromClusterAttributes(this, "DpaIdAuth0SpaDemoCluster", {
      clusterArn,
      clusterName,
      vpc,
      securityGroups: [],
    });
  }

  private lookupVPC(vpcName: string): IVpc {
    return Vpc.fromLookup(this, "DpaIdAuth0SpaDemoVPC", { vpcName });
  }

  private lookupLBSecurityGroup(securityGroupId: string): ISecurityGroup {
    return SecurityGroup.fromSecurityGroupId(
      this,
      "DpaIdAuth0SpaDemoLoadbalancerSecurityGroup",
      securityGroupId,
    );
  }

  private lookupLB(
    securityGroup: ISecurityGroup,
    vpc: IVpc,
    loadBalancerArn: string,
    loadBalancerCanonicalHostedZoneId: string,
    loadBalancerDnsName: string,
  ): ILoadBalancerV2 {
    const { securityGroupId } = securityGroup;
    return ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(
      this,
      "DpaIdAuth0SpaDemo-LB",
      {
        loadBalancerArn,
        loadBalancerCanonicalHostedZoneId,
        loadBalancerDnsName,
        securityGroupId,
        vpc,
      },
    );
  }

  private lookupLBListener(
    securityGroup: ISecurityGroup,
    listenerArn: string,
  ): IApplicationListener {
    return ApplicationListener.fromApplicationListenerAttributes(
      this,
      "dpa-id-auth0-spa-demo-HTTPs-Listener",
      {
        listenerArn,
        securityGroup,
      },
    );
  }
}
