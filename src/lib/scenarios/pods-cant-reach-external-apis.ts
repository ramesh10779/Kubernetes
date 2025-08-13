import { Scenario } from "../types";

export const podsCantReachExternalApis: Scenario = {
  slug: "pods-cant-reach-external-apis",
  title: "Pods can’t reach external APIs – DNS resolution fails intermittently",
  category: "Interview Cheat-Sheet: Networking & Service Mesh",
  content: `
• **Symptoms** – \`nslookup api.example.com\` inside a pod returns **SERVFAIL**; \`kubectl exec\` shows \`/etc/resolv.conf\` points to \`10.96.0.10\` (kube‑dns) but the CoreDNS logs contain “error loading zone”.
• **Items encountered** – CoreDNS ConfigMap (\`Corefile\`) missing the **forward** plugin for the corporate DNS, \`max_concurrent\` limit hit, node‑level \`iptables\` NAT rules conflicting with the cloud provider’s egress, or the **EKS VPC DNS** resolver quotas exhausted.
• **Fix** – 1️⃣ \`kubectl -n kube-system edit configmap coredns\` → add \`forward . 8.8.8.8\` or corporate DNS servers. <br> 2️⃣ Increase \`max_concurrent\` (\`10\` → \`200\`). <br> 3️⃣ If egress is blocked, add a **NAT Gateway** or **Egress IP** policy. <br> 4️⃣ Restart CoreDNS pods (\`kubectl rollout restart deployment coredns -n kube-system\`). <br> 5️⃣ Run \`dig @10.96.0.10 api.example.com\` to confirm.
• **Best‑practice checklist**  <br> – Keep a **separate CoreDNS ConfigMap** per environment (dev/stage/prod). <br> – Use **stub domains** for internal zones to avoid recursion latency. <br> – Enable **metrics** (\`prometheus\` plugin) to watch DNS query latency.
`,
};