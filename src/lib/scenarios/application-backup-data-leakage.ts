import { Scenario } from "../types";

export const applicationBackupDataLeakage: Scenario = {
  slug: "application-backup-data-leakage",
  title: "Application‑level backup (MySQL) restored to the wrong namespace causing data leakage",
  category: "Interview Cheat-Sheet: Disaster Recovery & Backup",
  content: `
• **Symptoms** – After running a restore job, the MySQL pod contains data from a **different tenant**; audit logs show the PVC was bound to a **shared** storage class.
• **Items encountered** – The backup job used a **cluster‑wide PVC** with \`accessModes: ReadWriteMany\` that two namespaces shared; the **restore script** omitted the namespace selector; the storage class \`standard\` points to a **single‑tenant** EBS volume but the reclaim policy \`Retain\` kept the old PV alive.
• **Fix** – 1️⃣ Delete the mistakenly restored PVC (\`kubectl delete pvc mysql-pvc -n prod\`). <br> 2️⃣ Create a **namespace‑scoped** PVC with a **unique storage class** (\`type: gp2-prod\`). <br> 3️⃣ Update the restore Job to include \`metadata.namespace: prod\` and a **label selector** for the backup object. <br> 4️⃣ Run the restore again and verify data integrity (\`SELECT tenant_id FROM users\`).
• **Best‑practice checklist**  <br> – Use **Backup Objects** (Velero, Stash) that are **namespaced**. <br> – Set **\`persistentVolumeReclaimPolicy: Delete\`** for multi‑tenant workloads. <br> – Tag backups with tenant ID and enforce a **policy** that a restore can only target the same tenant.
`,
};