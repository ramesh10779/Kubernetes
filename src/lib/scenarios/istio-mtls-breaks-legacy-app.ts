import { Scenario } from "../types";

export const istioMtlsBreaksLegacyApp: Scenario = {
  slug: "istio-mtls-breaks-legacy-app",
  title: "Service Mesh (Istio) mTLS breaks for a legacy app",
  category: "Interview Cheat-Sheet: Networking & Service Mesh",
  content: `
• **Symptoms** – Calls between services return HTTP 502, \`istio-proxy\` logs show \`TLS handshake error: unknown CA\`.
• **Items encountered** – The legacy app uses **HTTP 1.0** with a hard‑coded **self‑signed cert**; the sidecar injection forced **automatic mTLS**; Pod’s \`securityContext.runAsUser\` prevents the sidecar from writing the certs; or the app expects the **original client IP** which is lost behind the Envoy proxy.
• **Fix** – 1️⃣ Create a **DestinationRule** disabling mTLS for that service (\`trafficPolicy: { tls: { mode: DISABLE } }\`). <br> 2️⃣ Alternatively, enable **\`autoMTLS: false\`** in the **Namespace** annotation (\`istio-injection=disabled\`) and manually inject sidecar with \`--set values.global.autoMtls.enabled=false\`. <br> 3️⃣ If the app requires client IP, add the **\`original-source\`** header via an Envoy filter. <br> 4️⃣ Test with \`curl -v http://service.namespace.svc.cluster.local\`.
• **Best‑practice checklist**  <br> – Keep a **registry of “mTLS‑exempt” services** and document the reason. <br> – Use **\`peerAuthentication\`** resources scoped to namespace/service instead of disabling globally. <br> – Run a **canary** with mTLS off before rolling out full traffic.
`,
};