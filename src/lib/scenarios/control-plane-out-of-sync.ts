import { Scenario } from "../types";

export const controlPlaneOutOfSync: Scenario = {
  slug: "control-plane-out-of-sync",
  title: "Control‑plane components out‑of‑sync after a half‑finished upgrade",
  category: "Interview Cheat-Sheet: Cluster Provisioning & Upgrades",
  content: `
* **Symptoms** – \`kube-apiserver\` is reporting “etcdserver: request timed out”, \`kubectl get nodes\` hangs, \`kubectl version\` shows mismatched client/server versions.
* **Items encountered** – mixed version binaries on master nodes, stale \`kubelet\` config, an etcd member still running the old version, rolling‑update flag omitted.
* **Fix** –
  1️⃣ Verify the upgrade plan (kubeadm, kops, or managed service)  
  2️⃣ Check the version of each control‑plane pod (\`kubectl -n kube-system get pods -o wide\`)  
  3️⃣ If a node is still on the previous version, drain it (\`kubectl drain <node> --ignore-daemonsets\`) and re‑run the upgrade command (\`kubeadm upgrade apply vX.Y.Z\`)  
  4️⃣ Upgrade etcd first (\`etcdctl version\` → upgrade via \`kubeadm upgrade etcd\`)  
  5️⃣ Uncordon the node and validate (\`kubectl get componentstatuses\`).
* **Best‑practice checklist**  
  – Keep **etcd** one minor version behind the control plane.  
  – Use **kubeadm upgrade plan** to view the exact sequence.  
  – Enable **etcd backup** (snapshot) before any upgrade.  
  – Automate **drain → upgrade → uncordon** in CI.
`,
};