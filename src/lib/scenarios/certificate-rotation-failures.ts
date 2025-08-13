import { Scenario } from "../types";

export const certificateRotationFailures: Scenario = {
  slug: "certificate-rotation-failures",
  title: "Certificate Rotation Failures",
  category: "Comprehensive Kubernetes Scenarios",
  content: `
**Scenario**: API server certificates expired, causing \`connection refused\` errors for \`kubectl\`.
**Items Encountered**:
- \`kubectl get nodes\` returning \`The connection to the server <server> was refused\`.
- kube-controller-manager logs showing \`certificate has expired or is not yet valid\`.
**Fix Applied**:
1. Rotate API server certificates:
   \`\`\`bash
   kubectl get csr -o name | xargs -I {} kubectl certificate approve {}
   \`\`\`
2. Regenerate CA certificates:
   \`\`\`bash
   kubeadm alpha certs renew all --config=kubeadm-config.yaml
   \`\`\`
3. Restart control-plane components:
   \`\`\`bash
   kubectl delete pod -n kube-system <kube-apiserver-pod>
   \`\`\`
**Best Practices**:
- Automate certificate rotation with **cert-manager**.
- Monitor certificate expiry with **Prometheus alerts**.
- Use **kubeadm** for lifecycle management.
`,
};