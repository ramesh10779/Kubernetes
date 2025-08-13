import { Scenario } from "../types";

export const networkPolicyMisconfiguration: Scenario = {
  slug: "network-policy-misconfiguration",
  title: "Network Policy Misconfiguration",
  category: "Comprehensive Kubernetes Scenarios",
  content: `
**Scenario**: Microservices unable to communicate after applying a network policy, causing \`Connection refused\`.
**Items Encountered**:
- Pods failing to connect to external APIs.
- Network policies blocking inter-pod traffic.
- CNI plugin logs (e.g., Calico) showing dropped packets.
**Fix Applied**:
1. Audit network policies:
   \`\`\`bash
   kubectl get networkpolicy -A -o yaml
   \`\`\`
2. Test connectivity with \`kubectl exec -it <pod> -- curl <service-url>\`.
3. Add egress rules for external services:
   \`\`\`yaml
   egress:
   - to: []
     ports:
     - protocol: TCP
       port: 443
   \`\`\`
**Best Practices**:
- Start with permissive policies, then restrict gradually.
- Use **Cilium** for advanced network policies.
- Implement **service meshes** (Istio) for L7 traffic management.
`,
};