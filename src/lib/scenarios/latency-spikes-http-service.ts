import { Scenario } from "../types";

export const latencySpikesHttpService: Scenario = {
  slug: "latency-spikes-http-service",
  title: "Latency spikes in an HTTP service: tracing shows no request reach the pod",
  category: "Interview Cheat-Sheet: Observability & Logging",
  content: `
• **Symptoms** – Distributed tracing (Jaeger) shows a gap; Prometheus \`istio_requests_total\` stays low; \`kubectl get svc\` shows correct endpoints.
• **Items encountered** – The **Ingress controller** (NGINX) hit the **max‑connections** limit; a **rate‑limit** annotation (\`nginx.ingress.kubernetes.io/limit-rps\`) throttles traffic; the **Service** is of type \`ClusterIP\` but external traffic is being sent to a **NodePort** that no longer exists after a node reboot.
• **Fix** – 1️⃣ Inspect NGINX ingress config (\`kubectl -n ingress-nginx exec <pod> -- cat /etc/nginx/nginx.conf\`). <br> 2️⃣ Raise \`worker_connections\` (\`nginx.ingress.kubernetes.io/proxy‑connect‑timeout: "30"\`). <br> 3️⃣ Remove or adjust rate‑limit annotations. <br> 4️⃣ If using **Service type LoadBalancer**, verify the cloud‑LB health‑check points to the right port. <br> 5️⃣ Re‑apply the Ingress manifest.
• **Best‑practice checklist**  <br> – Use **CircuitBreaker** policies in Istio/Linkerd to protect backend services. <br> – Enable **request‑id** propagation for end‑to‑end tracing. <br> – Set **HPA** on the Ingress controller itself (replicas >= 3).
`,
};