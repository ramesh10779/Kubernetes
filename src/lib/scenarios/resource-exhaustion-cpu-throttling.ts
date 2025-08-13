import { Scenario } from "../types";

export const resourceExhaustionCpuThrottling: Scenario = {
  slug: "resource-exhaustion-cpu-throttling",
  title: "Resource Exhaustion (CPU/Throttling)",
  category: "Comprehensive Kubernetes Scenarios",
  content: `
**Scenario**: Critical pods terminated due to CPU limits being exceeded in production.
**Items Encountered**:
- Pods evicted with \`Evicted\` status.
- CPU throttling logs in \`kubelet\`.
- HPA not scaling pods fast enough.
**Fix Applied**:
1. Identify resource bottlenecks:
   \`\`\`bash
   kubectl top pods --sort-by=cpu
   \`\`\`
2. Adjust resource requests/limits:
   \`\`\`yaml
   resources:
     requests:
       cpu: "500m"
     limits:
       cpu: "1000m"
   \`\`\`
3. Implement **burst scaling** with \`targetUtilizationPercentage\` in HPA.
**Best Practices**:
- Use **vertical pod autoscaler (VPA)** for resource recommendations.
- Set **default resource limits** via namespace limits.
- Monitor with **kubectl top nodes** and **kube-state-metrics**.
`,
};