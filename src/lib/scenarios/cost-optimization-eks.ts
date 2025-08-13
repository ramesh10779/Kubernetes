import { Scenario } from "../types";

export const costOptimizationEks: Scenario = {
  slug: "cost-optimization-eks",
  title: "Cost Optimization of EKS",
  category: "Enhanced Kubernetes Scenarios",
  content: `
**Scenario**:
- *Requirement*: Reduce EKS costs by 40% without impacting production workloads.
- *Encountered Issues*:
  - Over-provisioned nodes (90% idle capacity).
  - Unoptimized Spot Instance interruptions.
  - Unused ECR images bloating storage costs.
- *Fix Applied*:
  1. **Node Optimization**:
     - Migrated to AWS Fargate for serverless pods (no node management).
     - Spot Instances with \`rebalance-reclamation: delete\` for auto-healing.
  2. **Terraform Cost Controls**:
     \`\`\`hcl
     resource "aws_eks_node_group" "spot" {
       cluster_name    = aws_eks_cluster.prod.name
       instance_types  = ["m5.large"]
       capacity_type   = "SPOT"
       scaling_config {
         desired_size = 3
         max_size     = 10
       }
     }
     \`\`\`
  3. **ECR Lifecycle Policies**:
     - Automated cleanup of untagged images older than 7 days.
- **Best Practices**:
  - Use AWS Cost Explorer + Kubecost for real-time cost tracking.
  - Implement ResourceQuotas and LimitRanges per namespace.
  - Schedule non-critical workloads during Spot Instance availability windows.
`,
};