import { Scenario } from "../types";

export const gitopsSyncFailsMissingCrd: Scenario = {
  slug: "gitops-sync-fails-missing-crd",
  title: "GitOps sync fails on the staging cluster because of a missing CRD",
  category: "Interview Cheat-Sheet: Multi‑Cluster & Governance",
  content: `
• **Symptoms** – ArgoCD reports “Missing CustomResourceDefinition”; the corresponding Application remains **OutOfSync**; \`kubectl get crd\` on staging does not list the needed CRD.
• **Items encountered** – The **CRD** lives in a separate repo that was not applied to the staging cluster; the cluster’s **RBAC** prevents ArgoCD from creating CRDs; the **helm chart** uses \`crd-install\` hook which is ignored in Helm v3.
• **Fix** – 1️⃣ Apply the CRD manually (\`kubectl apply -f crd.yaml -n staging\`). <br> 2️⃣ Add the CRD repository as a **dependence** in ArgoCD’s ApplicationSet (\`syncPolicy: automated\`). <br> 3️⃣ Ensure the ArgoCD service account has \`cluster-admin\` or at least \`crd\` creation rights (\`kubectl edit clusterrolebinding argocd-admin\`). <br> 4️⃣ Re‑sync the Application.
• **Best‑practice checklist**  <br> – Store **CRDs** in a **cluster‑level repo** that is applied before any namespace‑scoped apps. <br> – Use **Helm v3** \`crd\` directory (no hooks). <br> – Run a **pre‑sync health check** (ArgoCD \`resource.customizations.health.<group>/<kind>\`) to catch missing CRDs early.
`,
};