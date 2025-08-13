import { Scenario } from "../types";

export const secureMultiClusterArchitectureAws: Scenario = {
  slug: "secure-multi-cluster-architecture-aws",
  title: "Secure Multi-Cluster Architecture with AWS",
  category: "Enhanced Kubernetes Scenarios",
  content: `
**Scenario**:
- *Requirement*: Build a secure, geographically distributed EKS cluster for PCI-compliant workloads.
- *Encountered Issues*:
  - Cross-cluster secret leakage.
  - Network latency between regions (us-east-1 and eu-west-1).
  - Failed compliance audit (no encryption at rest).
- *Fix Applied*:
  1. **AWS Architecture**:
     - EKS clusters in separate regions with AWS Transit Gateway for connectivity.
     - AWS KMS for EBS encryption and EKS control-plane encryption.
  2. **Secrets Management**:
     - Integrated AWS Secrets Manager with Kubernetes Secrets Store CSI Driver.
     - IAM Roles for Service Accounts (IRSA) for least privilege access.
  3. **Network Isolation**:
     - Calico network policies enforcing ingress/egress rules.
     - VPC endpoints for EKS, S3, and Secrets Manager to avoid internet exposure.
- **Best Practices**:
  - Enable AWS Config rules for Kubernetes compliance (e.g., \`encrypted-volumes\`).
  - Use AWS Backup for EKS cluster snapshots.
  - Implement AWS WAF + Shield for cluster ingress protection.
`,
};