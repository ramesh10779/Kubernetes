import { Scenario } from "../types";

export const costOptimizationIdleResources: Scenario = {
  slug: "cost-optimization-idle-resources",
  title: "Cost Optimization (Idle Resources)",
  category: "Comprehensive Kubernetes Scenarios",
  content: `
**Scenario**: Over-provisioned nodes costing $10k+/month during low-traffic periods.
**Items Encountered**:
- Nodes with <10% CPU utilization for weeks.
- Cluster autoscaler not scaling down due to pod disruption budgets.
- Unused PVCs consuming storage.
**Fix Applied**:
1. Identify idle resources:
   \`\`\`bash
   kubectl get nodes --no-headers | awk '$5 < 10 {print $1}'
   \`\`\`
2. Scale down HPA minReplicas:
   \`\`\`yaml
   minReplicas: 1
   \`\`\`
3. Clean unused PVCs:
   \`\`\`bash
   kubectl get pvc --all-namespaces --field-selector=status.phase=Released
   \`\`\`
**Best Practices**:
- Use **Karpenter** for right-sizing nodes.
- Implement **cluster autoscaler** with scale-down profiles.
- Deploy **cost management tools** (e.g., CloudHealth).
`,
};