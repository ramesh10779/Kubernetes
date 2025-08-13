import { Scenario } from "../types";

export const multiClusterServiceMeshIncompatibility: Scenario = {
  slug: "multi-cluster-service-mesh-incompatibility",
  title: "Multi-Cluster Service Mesh Incompatibility",
  category: "Comprehensive Kubernetes Scenarios",
  content: `
**Scenario**: Failed federation between clusters due to mismatched Istio versions.
**Items Encountered**:
- \`xDS errors\` in Istio Pilot logs.
- Cross-cluster traffic failing with \`Connection refused\`.
- Pilot sync retries failing.
**Fix Applied**:
1. Align Istio versions across clusters:
   \`\`\`bash
   helm upgrade istio-base ./istio-1.18.0 -n istio-system
   \`\`\`
2. Reconfigure istiod with global discovery:
   \`\`\`yaml
   global:
     meshID: mesh1
     multiCluster:
       clusterName: cluster-a
   \`\`\`
3. Restart istio-pods and verify endpoints.
**Best Practices**:
- Use **GitOps** (ArgoCD) for consistent deployments.
- Test multi-cluster setups in dedicated environments.
- Monitor with **Kiali** and **Jaeger**.
`,
};