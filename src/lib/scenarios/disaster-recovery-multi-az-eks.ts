import { Scenario } from "../types";

export const disasterRecoveryMultiAzEks: Scenario = {
  slug: "disaster-recovery-multi-az-eks",
  title: "Disaster Recovery for Multi-AZ EKS",
  category: "Enhanced Kubernetes Scenarios",
  content: `
**Scenario**:
- *Requirement*: Achieve RTO < 15 mins for a global SaaS application.
- *Encountered Issues*:
  - AZ failure causing pod disruptions.
  - Data inconsistency during failover.
  - Manual failover taking > 2 hours.
- *Fix Applied*:
  1. **AWS Architectural Design**:
     - Multi-AZ EKS cluster with 3 subnets across 2 AZs.
     - Amazon EFS for shared storage (Multi-AZ deployment).
     - Route 53 failover routing with health checks.
  2. **Automation**:
     - AWS Backup + Velero for cross-region cluster replication:
       \`\`\`bash
       velero backup create dr-backup --include-namespaces=production
       \`\`\`
     - Terraform for infrastructure-as-code (IaC) to rebuild AZ in < 10 mins.
  3. **Data Consistency**:
     - Aurora Global Database for multi-region read replicas.
- **Best Practices**:
  - Run monthly disaster drills with AWS Control Tower.
  - Use AWS FIS (Fault Injection Simulator) to validate recovery.
  - Implement SLOs/SLIs for HA (e.g., > 99.95% uptime).
`,
};