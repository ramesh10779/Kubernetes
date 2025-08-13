import { Scenario } from "../types";

export const autoScalingSpikyWorkloads: Scenario = {
  slug: "auto-scaling-spiky-workloads",
  title: "Auto-Scaling for Spiky Workloads",
  category: "Enhanced Kubernetes Scenarios",
  content: `
**Scenario**:
- *Requirement*: Handle Black Friday traffic (0→10k RPS in 5 mins) for an e-commerce platform.
- *Encountered Issues*:
  - HPA not scaling fast enough (CPU-based lag).
  - Node provisioning delays (Cluster Autoscaler bottlenecks).
  - Database connection pool exhaustion.
- *Fix Applied*:
  1. **Advanced Auto-Scaling**:
     - Kubernetes HPA + custom metrics (e.g., RPS from Prometheus):
       \`\`\`yaml
       apiVersion: autoscaling/v2
       kind: HorizontalPodAutoscaler
       spec:
         metrics:
           - type: Pods
             pods:
               metric:
                 name: requests_per_second
               target:
                 type: AverageValue
                 averageValue: "100"
       \`\`\`
     - AWS Cluster Autoscaler with \`scale-down-unneeded-time: 10m\`.
  2. **Database Resilience**:
     - Amazon RDS Proxy for connection pooling.
     - Read replicas for scaling.
  3. **Caching Layer**:
     - Redis (ElastiCache) for session storage.
- **Best Practices**:
  - Use vertical pod autoscaler (VPA) for initial resource tuning.
  - Implement pod disruption budgets (PDB) for critical services.
  - Test chaos engineering with AWS Fault Injection Simulator.
`,
};