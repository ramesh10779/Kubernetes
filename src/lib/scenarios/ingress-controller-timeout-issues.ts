import { Scenario } from "../types";

export const ingressControllerTimeoutIssues: Scenario = {
  slug: "ingress-controller-timeout-issues",
  title: "Ingress Controller Timeout Issues",
  category: "Comprehensive Kubernetes Scenarios",
  content: `
**Scenario**: User-facing apps time out during high traffic due to Ingress controller (NGINX) misconfiguration.
**Items Encountered**:
- \`504 Gateway Timeout\` errors.
- Ingress controller pod CPU at 100%.
- Open connections maxed out.
**Fix Applied**:
1. Tune NGINX timeouts:
   \`\`\`yaml
   data:
     proxy-connect-timeout: "30"
     proxy-send-timeout: "600"
     proxy-read-timeout: "600"
   \`\`\`
2. Increase Ingress controller replicas:
   \`\`\`yaml
   spec:
     replicas: 5
   \`\`\`
3. Configure keep-alive timeouts in service annotations.
**Best Practices**:
- Use **PodDisruptionBudgets** for Ingress controllers.
- Implement **circuit breakers** in service meshes.
- Test with **locust**/vegeta before deployment.
`,
};