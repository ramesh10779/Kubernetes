import { Scenario } from "../types";

export const blueGreenDeploymentFails: Scenario = {
  slug: "blue-green-deployment-fails",
  title: "Blue‑green deployment fails: new version never receives traffic",
  category: "Interview Cheat-Sheet: Application Deployment & Rollouts",
  content: `
* **Symptoms** – Service selector still points to old Pods; \`kubectl get svc -o yaml\` shows unchanged \`selector\`; new Pods in \`Running\` state but \`kubectl describe svc\` shows zero endpoints for the new labels.
* **Items encountered** – Mis‑typed label in Deployment, missing **service‑account** that creates the Service, outdated **selector** because of a manual edit, or a **NetworkPolicy** that blocks traffic to the new Pods.
* **Fix** –
  1️⃣ \`kubectl get deployment <new> -o yaml\` → verify \`spec.template.metadata.labels\`.  
  2️⃣ If label mismatch, edit the deployment (\`kubectl edit deployment <new>\`) to align with Service selector.  
  3️⃣ If the Service selector is wrong, patch it (\`kubectl patch svc <svc> -p '{"spec":{"selector":{"app":"myapp","version":"v2"}}}'\`).  
  4️⃣ Validate endpoints (\`kubectl get endpoints <svc>\`).  
  5️⃣ Optionally use **Istio VirtualService** or **Ingress** with weighted routing for a true blue‑green cut‑over.
* **Best‑practice checklist**  
  – Keep **label schema** (\`app\`, \`tier\`, \`version\`) consistent across Deployments, Services, and Ingress.  
  – Store Service selector in a **ConfigMap** and reference it in CI templates to avoid drift.  
  – Add a **smoke‑test pod** that curls the Service before traffic switch.
`,
};