import { Scenario } from "../types";

export const networkpolicyBreaksIntraNamespaceCommunication: Scenario = {
  slug: "networkpolicy-breaks-intra-namespace-communication",
  title: "NetworkPolicy breaks intra‑namespace communication for a newly added microservice",
  category: "Interview Cheat-Sheet: Security & RBAC",
  content: `
• **Symptoms** – Pods can reach the internet but cannot ping other pods in the same namespace; \`kubectl exec\` shows “connection refused”.
• **Items encountered** – A default‑deny \`NetworkPolicy\` was applied at the namespace level, but the new microservice’s pods lack an ingress rule; the policy uses **namespaceSelector** but no **podSelector** for the new label set; the CNI plugin (Calico) has **policy enforcement mode** set to \`strict\` without proper egress rules.
• **Fix** – 1️⃣ Identify the active policies (\`kubectl get netpol -n <ns>\`). <br> 2️⃣ Add a rule to allow traffic from the new label set:
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-new-service
  namespace: <ns>
spec:
  podSelector:
    matchLabels:
      app: new-service
  ingress:
  - from:
    - podSelector: {}
\`\`\` <br> 3️⃣ Apply the policy (\`kubectl apply -f allow-new-service.yaml\`). <br> 4️⃣ Verify with \`kubectl exec\` and \`curl\`.
• **Best‑practice checklist**  <br> – Adopt **“default‑deny”** + **explicit allow** model for each namespace. <br> – Keep a **policy‑as‑code** repo; run \`kubeval\`/\`conftest\` in PR pipelines. <br> – Use **Calico’s \`policy-recommendations\`** command to auto‑suggest missing rules.
`,
};