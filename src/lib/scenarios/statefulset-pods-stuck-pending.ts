import { Scenario } from "../types";

export const statefulsetPodsStuckPending: Scenario = {
  slug: "statefulset-pods-stuck-pending",
  title: "StatefulSet pods stuck in Pending – PVC bound but node has no disk",
  category: "Interview Cheat-Sheet: Storage & CSI",
  content: `
* **Symptoms** – \`kubectl describe pod\` shows \`Events: FailedScheduling\` with “Insufficient cpu”, but the node has free CPU; \`kubectl get pvc\` shows **Bound**, yet the pod never gets a volume attached.
* **Items encountered** – The node’s **volume‑attachment** limit (e.g., \`max-volumes-per-node\` in AWS) reached, the **StorageClass** uses \`allowVolumeExpansion: false\` and the requested size exceeds the node’s local‑disk limit, or the CSI driver is not deployed on that node (taint/toleration mismatch).
* **Fix** –
  1️⃣ Check the node’s volume limits (\`kubectl describe node <node>\` → \`Allocated resources\`).  
  2️⃣ If limit is hit, increase the limit in the cloud provider (e.g., \`aws ec2 modify-instance-attribute --block-device-mappings\`).  
  3️⃣ Add a **taint**‑**toleration** pair for the CSI driver if missing (\`kubectl taint nodes <node> csi=true:NoSchedule\`).  
  4️⃣ If using local PVs, verify the **local path** exists on the node.  
  5️⃣ Re‑schedule the pod (\`kubectl delete pod <pod>\`).
* **Best‑practice checklist**  
  – Use **PodDisruptionBudgets** for StatefulSets to avoid accidental evictions.  
  – Keep **PVC size** under the node’s max‑volume limit; monitor via \`kubelet_volume_stats_capacity_bytes\`.  
  – Define a **StorageClass** with appropriate **reclaimPolicy** (\`Retain\` for critical data).
`,
};