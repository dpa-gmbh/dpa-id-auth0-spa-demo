import { Construct } from "constructs";
import {
  Effect,
  IRole,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";

export class DpaIdAuth0SpaDemoRole {
  public readonly instance: IRole;

  constructor(scope: Construct) {
    const role = new Role(scope, "DpaIdAuth0SpaDemo-Role", {
      assumedBy: new ServicePrincipal("ecs-tasks.amazonaws.com"),
    });
    this.instance = role;

    DpaIdAuth0SpaDemoRole.allowAccessToParameterStore(role);
    this.instance = role;
  }

  private static allowAccessToParameterStore(role: Role) {
    const parentStack = Stack.of(role);
    const region = parentStack.region;
    const account = parentStack.account;

    role.addToPolicy(
      new PolicyStatement({
        resources: [
          `arn:aws:ssm:${region}:${account}:parameter/config/dpa-id-auth0-spa-demo*`,
        ],
        actions: ["ssm:GetParametersByPath"],
        effect: Effect.ALLOW,
      }),
    );
  }
}
