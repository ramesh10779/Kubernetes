import { Scenario } from "../types";

export const idleNodesRunningHpaMinreplicas: Scenario = {
  slug: "idle-nodes-running-hpa-minreplicas",
  title: "Idle nodes keep running because of mis‑configured HPA minReplicas",
  category: "Interview Cheat-Sheet: Cost & Resource Optimization",
  content: `
• **Symptoms** – Cloud cost dashboard shows a steady increase in **EC2‑instance‑hours** even during off‑peak; \`kubectl get hpa\` shows \`minReplicas: 5\` for several micro‑services.
• **Items encountered** – HPA objects were created with a **static \`minReplicas\`** that never dropped below 5; the **Cluster Autoscaler** was disabled, so nodes never scaled down; there is a **DaemonSet** with \`runOnAllNodes: true\` that forces a node to stay alive.
• **Fix** – 1️⃣ Reduce \`minReplicas\` to 0 or 1 where safe (\`kubectl patch hpa <svc> -p '{"spec":{"minReplicas":0}}'\`). <br> 2️⃣ Enable **Cluster Autoscaler** (\`--scale-down-enabled=true\`). <br> 3️⃣ Add a **node‑selector** to the DaemonSet to run only on a subset of nodes. <br> 4️⃣ Monitor cost with **kubecost** charts to verify the drop.
• **Best‑practice checklist**  <br> – Review all **HPAs** monthly for over‑provisioned \`minReplicas\`. <br> – Tag cloud resources with \`k8s.io/cluster-autoscaler/enabled\`. <br> – Use **Spot Instances** for non‑critical node pools.
`,
};