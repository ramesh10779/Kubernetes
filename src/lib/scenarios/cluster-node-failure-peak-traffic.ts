import { Scenario } from "../types";

export const clusterNodeFailurePeakTraffic: Scenario = {
  slug: "cluster-node-failure-peak-traffic",
  title: "Cluster Node Failure During Peak Traffic",
  category: "Comprehensive Kubernetes Scenarios",
  content: `
**Scenario**: Node crashed during high traffic (e.g., Black Friday sale), causing pods to become \`Unknown\`/\`Pending\`.
**Items Encountered**:
- Pods stuck in \`Unknown\` state due to node unreachability.
- Horizontal Pod Autoscaler (HPA) not scaling fast enough.
- Etcd latency spikes.
**Fix Applied**:
1. Evacuate pods from the failed node:
   \`\`\`bash
   kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data
   \`\`\`
2. Force-delete stuck pods if eviction failed:
   \`\`\`bash
   kubectl delete pod <pod-name> --force --grace-period=0
   \`\`\`
3. Verify cluster health with \`kubectl get nodes -o wide\` and cluster autoscaler logs.
4. Increase HPA target CPU/memory thresholds.
**Best Practices**:
- Use **Cluster Autoscaler** with \`scale-down-unneeded-time\` to handle node failures.
- Implement **pod anti-affinity** to avoid single-node failures.
- Monitor node health with **Prometheus Node Exporter** + **Grafana** alerts.
`,
};