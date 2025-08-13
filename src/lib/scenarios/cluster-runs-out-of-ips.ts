import { Scenario } from "../types";

export const clusterRunsOutOfIps: Scenario = {
  slug: "cluster-runs-out-of-ips",
  title: "Cluster runs out of IPs in the pod CIDR after a burst of short‑lived jobs",
  category: "Interview Cheat-Sheet: Autoscaling & Capacity Planning",
  content: `
• **Symptoms** – New pods stay in \`Pending\` with \`Insufficient IPs\`; \`kubectl get nodes -o jsonpath='{.items[*].status.allocatable.pods}'\` shows zero; the CNI plugin logs “IP exhaustion”.
• **Items encountered** – The pod CIDR was allocated with a /24 block per node (256 IPs) but a burst of **Job** pods (each with a unique IP) never terminate promptly; ConfigMap \`cni‑config\` uses **host‑local** IPAM with a small pool; the cluster is on a **single‑AZ** VPC with limited secondary IP ranges.
• **Fix** – 1️⃣ Increase the **pod CIDR size** in the control‑plane (\`kubeadm init --pod-network-cidr=10.244.0.0/16\`). <br> 2️⃣ If using AWS VPC CNI, request larger **secondary IP ranges** for each ENI. <br> 3️⃣ Add a **TTL** to the Job (\`activeDeadlineSeconds\`) to ensure quick termination. <br> 4️⃣ Enable **IP address reclamation** in the CNI (\`cleanup=true\`). <br> 5️⃣ Monitor IP usage with Prometheus \`cni_ipam_allocated_ips_total\`.
• **Best‑practice checklist**  <br> – Size the pod network **5–10×** the expected maximum concurrent pods per node. <br> – Use **cluster‑autoscaler** with \`scale-down-delay\` to delete empty nodes and release IPs. <br> – Periodically run \`kubectl get pods --field-selector=status.phase=Failed\` and clean up.
`,
};