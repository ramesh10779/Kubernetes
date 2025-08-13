import { Scenario } from "../types";

export const federatedDeploymentOldVersion: Scenario = {
  slug: "federated-deployment-old-version",
  title: "Federated deployment rolled out to prod but one cluster still has the old version",
  category: "Interview Cheat-Sheet: Multi‑Cluster & Governance",
  content: `
* **Symptoms** – \`kubectl get deploy -A\` shows version \`v1.2.3\` in most clusters, but cluster‑C still reports \`v1.2.2\`; service health metrics are degraded only in that region.
* **Items encountered** – The **kubefed** controller missed the update because the **APIService** endpoint was unreachable (network partition); the **ClusterRole** for the federation controller lacked \`patch\` permission; the cluster‑C had a **taint** that prevented the rollout pod from being scheduled.
* **Fix** –
  1️⃣ Verify the federation status (\`kubectl get federationcontrolplane -A\`).  
  2️⃣ Manually trigger a sync (\`kubectl patch federateddeployment <name> -p '{"spec":{"template":{"metadata":{"annotations":{"kubefed.io/last-sync":"$(date +%s)"}}}}}'\`).  
  3️⃣ Ensure cluster‑C API endpoint is reachable (\`curl https://<clusterC‑apiserver>/healthz\`).  
  4️⃣ Add missing \`patch\` permission to the federation controller’s ClusterRole.  
  5️⃣ Remove the taint or add a toleration to the rollout pod.
* **Best‑practice checklist**  
  – Use **progressive rollout** with \`Canary\` or \`Argo Rollout\` across clusters, not immediate full sync.  
  – Monitor **federation health** with Prometheus \`kubefed_sync_success_total\`.  
  – Keep a **cluster‑specific override** file to handle one‑off taints without breaking the global manifest.
`,
};