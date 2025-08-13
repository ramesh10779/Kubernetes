import { Scenario } from "../types";

export const privilegedContainerEscaped: Scenario = {
  slug: "privileged-container-escaped",
  title: "Privileged container escaped and accessed the host’s /etc/kubernetes",
  category: "Interview Cheat-Sheet: Security & RBAC",
  content: `
• **Symptoms** – Audit log shows a pod with \`CAP_SYS_ADMIN\`; node’s kubelet logs contain “system:node:… attempted to read \`/etc/kubernetes\`”.
• **Items encountered** – A Deployment used \`securityContext.privileged: true\` for convenience; the pod's **ServiceAccount** was bound to a **ClusterRole** granting \`*\` on \`*\`; the PSP (PodSecurityPolicy) was disabled; the node had the **\`docker\` runtime** with no user‑namespace isolation.
• **Fix** – 1️⃣ Delete the offending pod (\`kubectl delete pod <pod>\`). <br> 2️⃣ Revoke the overly‑permissive **ClusterRoleBinding** (\`kubectl delete clusterrolebinding <binding>\`). <br> 3️⃣ Apply a **PodSecurityPolicy** (or the newer **PodSecurity Standards**) that enforces \`restricted\`. <br> 4️⃣ Enforce **Admission Controllers** (\`NamespaceLifecycle\`, \`NodeRestriction\`, \`RBAC\`) at the API server. <br> 5️⃣ If using Docker, migrate to **containerd** with **user‑ns** enabled.
• **Best‑practice checklist**  <br> – Use **least‑privilege ServiceAccounts** per workload. <br> – Enable **OPA Gatekeeper** or **Kyverno** policies that forbid \`privileged: true\` unless explicitly annotated. <br> – Turn on **audit logging** (\`--audit-policy-file\`) and ship to a SIEM.
`,
};