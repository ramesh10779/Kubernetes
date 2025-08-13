import { Scenario } from "../types";

export const nodePoolAutoscalingNeverRegisters: Scenario = {
  slug: "node-pool-autoscaling-never-registers",
  title: "Node‑pool autoscaling creates nodes that never register",
  category: "Interview Cheat-Sheet: Cluster Provisioning & Upgrades",
  content: `
• **Symptoms** – Cloud‑provider shows a new VM, but \`kubectl get nodes\` doesn’t list it; cluster‑autoscaler logs: “node not ready after 15m”.
• **Items encountered** – Wrong IAM/role permissions for the cloud controller manager, mismatched \`node-labels\`/\`taints\` that prevent the kubelet from joining, missing **cloud‑provider** config (\`--cloud-provider=external\`).
• **Fix** – 1️⃣ Inspect cloud‑API logs (AWS CloudWatch, GCP operations) for VM creation errors. <br> 2️⃣ Confirm the node has the **node‑role.kubernetes.io/worker** label; if not, add it manually or fix the **node‑group** template. <br> 3️⃣ Check the kubelet systemd unit on the new VM for \`--cloud-provider=external\`. <br> 4️⃣ Add required IAM policies (e.g., \`AmazonEKSWorkerNodePolicy\`). <br> 5️⃣ Restart kubelet and watch \`kubectl get nodes -w\`.
• **Best‑practice checklist**  <br> – Use **managed node‑pools** that embed the cloud‑provider config. <br> – Tag the instance template with the exact **node‑group** name. <br> – Enable **cluster‑autoscaler‑expander** logs at \`v=4\`. <br> – Periodically run \`kubectl describe node <new>\` to verify registration.
`,
};