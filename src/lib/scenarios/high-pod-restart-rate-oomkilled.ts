import { Scenario } from "../types";

export const highPodRestartRateOomkilled: Scenario = {
  slug: "high-pod-restart-rate-oomkilled",
  title: "High pod‑restart rate but no clear metric – only “OOMKilled” in events",
  category: "Interview Cheat-Sheet: Observability & Logging",
  content: `
* **Symptoms** – \`kubectl get pods\` shows many pods in \`CrashLoopBackOff\`; \`kubectl describe pod\` has \`State: Terminated Reason: OOMKilled\`; CPU/Memory dashboards are flat.
* **Items encountered** – The **vertical pod autoscaler (VPA)** is disabled, so pods run with static low memory limits; the **cgroup driver** mismatch (systemd vs cgroupfs) causing inaccurate memory accounting; the **application logs** are not shipped, so OOM details are missing.
* **Fix** –
  1️⃣ Increase the memory request/limit in the Deployment (\`resources.requests.memory: 256Mi\`, \`limits.memory: 512Mi\`).  
  2️⃣ Enable VPA in “auto” mode to let the cluster suggest limits.  
  3️⃣ Confirm the kubelet uses the same **cgroup driver** as the container runtime (\`kubectl get node -o jsonpath='{.status.nodeInfo.cgroupDriver}'\`).  
  4️⃣ Deploy a **side‑car logger** (Fluent Bit) to capture \`/var/log/containers\`.  
  5️⃣ Set up **Prometheus alert** on \`container_memory_working_set_bytes > container_spec_memory_limit_bytes\`.
* **Best‑practice checklist**  
  – Define **resource quotas** at the namespace level.  
  – Run **\`kubectl top pods\`** regularly to spot outliers.  
  – Store **core‑dump** on a sidecar volume for post‑mortem of OOM events.
`,
};