import { Scenario } from "../types";

export const migratingMonolithToKubernetesAws: Scenario = {
  slug: "migrating-monolith-to-kubernetes-aws",
  title: "Migrating a Monolith to Kubernetes on AWS",
  category: "Enhanced Kubernetes Scenarios",
  content: `
**Scenario**:
- *Requirement*: Migrate a legacy Java monolith (running on EC2) to EKS with zero downtime.
- *Encountered Issues*:
  - Data loss during pod restarts (no persistent storage).
  - Service discovery failures between pods.
  - Inefficient resource utilization (over-provisioned EC2 instances).
- *Fix Applied*:
  1. **State Storage**: Migrated database to Amazon RDS (Aurora) with Multi-AZ.
  2. **Kubernetes Architecture**:
     - Deployed monolith as a StatefulSet for stable IDs.
     - Used AWS EBS CSI driver for persistent volumes.
     - Implemented \`livenessProbe\` and \`readinessProbe\` to prevent crashes.
  3. **CI/CD Pipeline**:
     - Terraform for EKS cluster provisioning:
       \`\`\`hcl
       resource "aws_eks_cluster" "prod" {
         name     = "monolith-cluster"
         role_arn = aws_iam_role.eks.arn
         vpc_config {
           subnet_ids = aws_subnet.private[*].id
         }
       }
       \`\`\`
     - ArgoCD for GitOps deployments with AWS ECR for image storage.
  4. **Service Mesh**: Istio for traffic splitting (10% canary releases).
- **Best Practices**:
  - Use Kubernetes \`Deployment\` strategies (e.g., RollingUpdate) with maxSurge.
  - Implement AWS Security Groups for pod-level network policies.
  - Monitor with Prometheus/Grafana + AWS CloudWatch Container Insights.
`,
};