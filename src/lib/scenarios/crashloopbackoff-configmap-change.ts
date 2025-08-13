import { Scenario } from "../types";

export const crashloopbackoffConfigmapChange: Scenario = {
  slug: "crashloopbackoff-configmap-change",
  title: "CrashLoopBackOff after ConfigMap change – pods don’t pick up the new config",
  category: "Interview Cheat-Sheet: Application Deployment & Rollouts",
  content: `
• **Symptoms** – \`kubectl logs <pod>\` shows parsing error, but the ConfigMap was updated successfully (\`kubectl describe cm <cm>\`).
• **Items encountered** – ConfigMap mounted as a **volume** (read‑only) – changes are reflected only after the pod restarts; application does not watch file‑system for changes; a **binary‑encoded** ConfigMap (e.g., base64) was edited manually causing corruption.
• **Fix** – 1️⃣ If the app can reload on SIGHUP, send signal (\`kubectl exec <pod> -- kill -HUP 1\`). <br> 2️⃣ Otherwise, force a rolling restart (\`kubectl rollout restart deployment/<dep>\`). <br> 3️⃣ If you need immediate in‑place update, use **ProjectedVolume** with \`watch: true\` (K8s 1.21+). <br> 4️⃣ Validate the new config (\`kubectl exec <pod> -- cat /etc/config/...\`).
• **Best‑practice checklist**  <br> – Prefer **environment variables** for small config; they are refreshed on pod restart automatically. <br> – Set **\`restartPolicy: OnFailure\`** only when you want the pod to self‑heal; otherwise use Deployments to control restarts. <br> – Version the ConfigMap (\`app-config-v001\`) and reference that version in the Deployment to make changes explicit.
`,
};