import { Scenario } from "../types";

export const etcdLostLatestSnapshot: Scenario = {
  slug: "etcd-lost-latest-snapshot",
  title: "etcd lost its latest snapshot after a node reboot – data corruption",
  category: "Interview Cheat-Sheet: Disaster Recovery & Backup",
  content: `
* **Symptoms** – \`etcdctl endpoint health\` fails; \`etcdctl member list\` shows a member stuck in **unstarted** state; \`kubectl get componentstatuses\` reports etcd **Unhealthy**.
* **Items encountered** – The automated snapshot cronjob stored backups on a **local PV** that disappeared with the node; the **etcd data directory** (\`/var/lib/etcd\`) had mismatched permissions after a kernel upgrade; the **etcd version** was upgraded without preserving the data directory (\`/var/lib/etcd/member\`).
* **Fix** –
  1️⃣ Stop the etcd static pod (\`systemctl stop kubelet\` on the master).  
  2️⃣ Mount an external backup volume (e.g., NFS) that contains the latest snapshot (\`/backups/etcd-snap-2024-07-01.db\`).  
  3️⃣ Restore with \`etcdctl snapshot restore <snapfile> --data-dir /var/lib/etcd --name <node> --initial-cluster <node>=https://<ip>:2380\`.  
  4️⃣ Restart kubelet; validate with \`etcdctl endpoint status\`.
* **Best‑practice checklist**  
  – Store **etcd snapshots** off‑node (S3, GCS).  
  – Run snapshots **every 30 min** plus a **weekly full backup**.  
  – Test restore quarterly in a sandbox cluster.
`,
};