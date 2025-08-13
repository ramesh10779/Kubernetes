import { Scenario } from "../types";

export const snapshotRestoreDataLoss: Scenario = {
  slug: "snapshot-restore-data-loss",
  title: "Snapshot restore leads to “Data loss” – application sees empty DB after PVC restore",
  category: "Interview Cheat-Sheet: Storage & CSI",
  content: `
• **Symptoms** – After recreating a PVC from a VolumeSnapshot, the DB container logs “database file not found” and starts with a fresh schema.
• **Items encountered** – The snapshot was taken **while the DB was still running**, resulting in a crash‑consistent (not application‑consistent) snapshot; the storage class does **not support file‑system freeze**; the PVC was recreated with a **different \`volumeMode\`** (\`Block\` vs \`Filesystem\`).
• **Fix** – 1️⃣ Quiesce the DB (e.g., \`pg_dump\` or \`mysqldump --single-transaction\`) before snapshot. <br> 2️⃣ If the CSI driver supports **filesystem freeze**, enable it (\`csi.storage.k8s.io/freeze\` annotation). <br> 3️⃣ Create a new PVC from the snapshot with **exact same \`storageClassName\` and \`volumeMode\`**. <br> 4️⃣ Mount the restored PVC to a **temporary pod** and verify data (\`ls -l /data\`). <br> 5️⃣ Update the StatefulSet to use the new PVC (or use \`kubectl patch\` to change the claim name).
• **Best‑practice checklist**  <br> – Schedule backups via **Kubernetes CronJob** that runs \`kubectl snapshot\` after a pre‑snapshot hook that stops writes. <br> – Tag snapshots with **application version** and **timestamp**. <br> – Test restoration in a **staging namespace** before production.
`,
};