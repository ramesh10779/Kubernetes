import { Scenario } from "../types";

export const containerImageBloat: Scenario = {
  slug: "container-image-bloat",
  title: "Container image bloat inflates storage usage and slows node provisioning",
  category: "Interview Cheat-Sheet: Cost & Resource Optimization",
  content: `
* **Symptoms** – \`docker images\` on a node shows many >1 GB images; \`kubelet\` reports **ImagePullBackOff** for some pods due to “disk pressure”.
* **Items encountered** – CI pipelines push **fat base images** (e.g., \`ubuntu:latest\`) instead of \`scratch\` or \`distroless\`; images are not **squashed**; \`imagePullPolicy: Always\` forces repeated pulls even when cached; no **image garbage collection** is configured.
* **Fix** –
  1️⃣ Implement a **container‑image‑size** lint in CI (\`hadolint\` + \`docker-slim\`).  
  2️⃣ Switch to **multi‑stage builds** to produce minimal layers.  
  3️⃣ Set \`imagePullPolicy: IfNotPresent\` for stable tags.  
  4️⃣ Configure kubelet garbage collector (\`--image-gc-high-threshold=70\`, \`--image-gc-low-threshold=50\`).  
  5️⃣ Run a manual prune (\`crictl rmi --prune\`).
* **Best‑practice checklist**  
  – Enforce **image scanning** (Trivy, Clair) and size limits (≤ 200 MB).  
  – Use **\`docker manifest\`** to keep a single tag for multiple architectures.  
  – Periodically audit **unused images** with \`crictl images -q | xargs -I{} crictl inspecti {}\`.
`,
};