import { Scenario } from "../types";

export const etcdCorruptionDuringUpgrade: Scenario = {
  slug: "etcd-corruption-during-upgrade",
  title: "etcd Corruption During Upgrade",
  category: "Comprehensive Kubernetes Scenarios",
  content: `
**Scenario**: Cluster upgrade to v1.27 failed, causing etcd to enter "corrupt member" state.
**Items Encountered**:
- \`etcdctl endpoint health\` failing.
- Pods in \`CrashLoopBackOff\` with etcd errors.
- \`/var/lib/etcd\` disk full.
**Fix Applied**:
1. Restore etcd from backup:
   \`\`\`bash
   ETCDCTL_API=3 etcdctl --endpoints=<endpoint> snapshot restore snapshot.db
   \`\`\`
2. Replace corrupt etcd member:
   \`\`\`bash
   kubectl delete node <etcd-node>
   kubectl label node <new-node> node-role.kubernetes.io/etcd= --overwrite
   \`\`\`
3. Recertify etcd cluster:
   \`\`\`bash
   kubectl delete -f etcd.yaml && kubectl apply -f etcd.yaml
   \`\`\`
**Best Practices**:
- Use **etcd-backup** jobs with \`etcd-operator\`.
- Test upgrades in **staging clusters**.
- Monitor etcd disk usage with \`kubectl top pods -n kube-system\`.
`,
};