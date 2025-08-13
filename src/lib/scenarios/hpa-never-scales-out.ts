import { Scenario } from "../types";

export const hpaNeverScalesOut: Scenario = {
  slug: "hpa-never-scales-out",
  title: "Horizontal Pod Autoscaler (HPA) never scales out despite high CPU usage",
  category: "Interview Cheat-Sheet: Autoscaling & Capacity Planning",
  content: `
• **Symptoms** – CPU on pods is at 85 %; \`kubectl get hpa\` shows \`CURRENT\` = \`2\` (desired) but \`TARGET\` = \`2\`; the HPA events say “failed to get cpu utilization: metric not available”.
• **Items encountered** – Metrics Server is not deployed or is outdated (v0.3.x); the API server’s \`--requestheader-client-ca-file\` flag is missing, blocking metrics aggregation; the Deployment’s \`targetCPUUtilizationPercentage\` is set to an unrealistic low value.
• **Fix** – 1️⃣ Deploy or upgrade **metrics‑server** (\`kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml\`). <br> 2️⃣ Verify API aggregation: \`kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1"\` returns data. <br> 3️⃣ Adjust HPA target (\`kubectl edit hpa <name>\`) to a realistic value (e.g., 70 %). <br> 4️⃣ Optionally enable **custom metrics** via Prometheus Adapter for more granular scaling.
• **Best‑practice checklist**  <br> – Run **\`kubectl top nodes\`** and **\`kubectl top pods\`** after installing metrics‑server. <br> – Keep HPA and **VPA** separate; they should not conflict on the same resource. <br> – Add an **idle‑replica** guard (\`minReplicas: 2\`) to avoid cold‑start latency.
`,
};