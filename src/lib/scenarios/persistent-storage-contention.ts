import { Scenario } from "../types";

export const persistentStorageContention: Scenario = {
  slug: "persistent-storage-contention",
  title: "Persistent Storage Contention",
  category: "Comprehensive Kubernetes Scenarios",
  content: `
**Scenario**: Database pods (e.g., PostgreSQL) experiencing \`read-only filesystem\` errors during heavy writes.
**Items Encountered**:
- PVCs stuck in \`Pending\` status.
- Storage provisioner (e.g., AWS EBS) hitting IOPS limits.
- Pods crashing with \`Out of disk space\` errors.
**Fix Applied**:
1. Resize PVC dynamically (if storage class supports):
   \`\`\`bash
   kubectl patch pvc <pvc-name> -p '{"spec":{"resources":{"requests":{"storage":"100Gi"}}}}'
   \`\`\`
2. Provision storage classes with higher IOPS (e.g., \`io2 Block Express\` for AWS).
3. Separate storage tiers for logs/data (use \`ReadWriteMany\` for shared volumes).
**Best Practices**:
- Use **VolumeSnapshots** for data backup.
- Configure **storage quotas** per namespace.
- Monitor PVC metrics via **kube-state-metrics**.
`,
};