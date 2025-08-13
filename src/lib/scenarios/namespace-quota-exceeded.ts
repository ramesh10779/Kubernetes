import { Scenario } from "../types";

export const namespaceQuotaExceeded: Scenario = {
  slug: "namespace-quota-exceeded",
  title: "Namespace Quota Exceeded",
  category: "Comprehensive Kubernetes Scenarios",
  content: `
**Scenario**: Development teams can’t deploy new pods due to resource quotas being exhausted.
**Items Encountered**:
- \`Insufficient cpu\` errors in pod events.
- Quota status showing \`used:cpu > hard:cpu\`.
- Persistent volume claims stuck in \`Pending\`.
**Fix Applied**:
1. Check quota usage:
   \`\`\`bash
   kubectl get resourcequota <quota-name> -o yaml
   \`\`\`
2. Adjust quotas or request deletion of non-critical resources:
   \`\`\`bash
   kubectl delete deployment <non-critical-app>
   \`\`\`
3. Add resource limits to namespace:
   \`\`\`yaml
   limits:
     - default:
         cpu: "500m"
         memory: "1Gi"
   \`\`\`
**Best Practices**:
- Use **ResourceQuota** and **LimitRange** per namespace.
- Implement **cost monitoring** with **kube-cost**.
- Enforce **admission controllers** (e.g., Kyverno) for resource policies.
`,
};