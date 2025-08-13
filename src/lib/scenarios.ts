export type Scenario = {
  slug: string;
  title: string;
  category?: string;
  content: string;
};

export const scenarios: Scenario[] = [
  // Content from response.md (Interview Cheat-Sheet)
  {
    slug: "control-plane-out-of-sync",
    title: "Control‑plane components out‑of‑sync after a half‑finished upgrade",
    category: "Interview Cheat-Sheet: Cluster Provisioning & Upgrades",
    content: `
• **Symptoms** – \`kube-apiserver\` is reporting “etcdserver: request timed out”, \`kubectl get nodes\` hangs, \`kubectl version\` shows mismatched client/server versions.
• **Items encountered** – mixed version binaries on master nodes, stale \`kubelet\` config, an etcd member still running the old version, rolling‑update flag omitted.
• **Fix** – 1️⃣ Verify the upgrade plan (kubeadm, kops, or managed service) <br> 2️⃣ Check the version of each control‑plane pod (\`kubectl -n kube-system get pods -o wide\`) <br> 3️⃣ If a node is still on the previous version, drain it (\`kubectl drain <node> --ignore-daemonsets\`) and re‑run the upgrade command (\`kubeadm upgrade apply vX.Y.Z\`) <br> 4️⃣ Upgrade etcd first (\`etcdctl version\` → upgrade via \`kubeadm upgrade etcd\`) <br> 5️⃣ Uncordon the node and validate (\`kubectl get componentstatuses\`).
• **Best‑practice checklist**  <br> – Keep **etcd** one minor version behind the control plane. <br> – Use **kubeadm upgrade plan** to view the exact sequence. <br> – Enable **etcd backup** (snapshot) before any upgrade. <br> – Automate **drain → upgrade → uncordon** in CI.
`,
  },
  {
    slug: "node-pool-autoscaling-never-registers",
    title: "Node‑pool autoscaling creates nodes that never register",
    category: "Interview Cheat-Sheet: Cluster Provisioning & Upgrades",
    content: `
• **Symptoms** – Cloud‑provider shows a new VM, but \`kubectl get nodes\` doesn’t list it; cluster‑autoscaler logs: “node not ready after 15m”.
• **Items encountered** – Wrong IAM/role permissions for the cloud controller manager, mismatched \`node-labels\`/\`taints\` that prevent the kubelet from joining, missing **cloud‑provider** config (\`--cloud-provider=external\`).
• **Fix** – 1️⃣ Inspect cloud‑API logs (AWS CloudWatch, GCP operations) for VM creation errors. <br> 2️⃣ Confirm the node has the **node‑role.kubernetes.io/worker** label; if not, add it manually or fix the **node‑group** template. <br> 3️⃣ Check the kubelet systemd unit on the new VM for \`--cloud-provider=external\`. <br> 4️⃣ Add required IAM policies (e.g., \`AmazonEKSWorkerNodePolicy\`). <br> 5️⃣ Restart kubelet and watch \`kubectl get nodes -w\`.
• **Best‑practice checklist**  <br> – Use **managed node‑pools** that embed the cloud‑provider config. <br> – Tag the instance template with the exact **node‑group** name. <br> – Enable **cluster‑autoscaler‑expander** logs at \`v=4\`. <br> – Periodically run \`kubectl describe node <new>\` to verify registration.
`,
  },
  {
    slug: "blue-green-deployment-fails",
    title: "Blue‑green deployment fails: new version never receives traffic",
    category: "Interview Cheat-Sheet: Application Deployment & Rollouts",
    content: `
• **Symptoms** – Service selector still points to old Pods; \`kubectl get svc -o yaml\` shows unchanged \`selector\`; new Pods in \`Running\` state but \`kubectl describe svc\` shows zero endpoints for the new labels.
• **Items encountered** – Mis‑typed label in Deployment, missing **service‑account** that creates the Service, outdated **selector** because of a manual edit, or a **NetworkPolicy** that blocks traffic to the new Pods.
• **Fix** – 1️⃣ \`kubectl get deployment <new> -o yaml\` → verify \`spec.template.metadata.labels\`. <br> 2️⃣ If label mismatch, edit the deployment (\`kubectl edit deployment <new>\`) to align with Service selector. <br> 3️⃣ If the Service selector is wrong, patch it (\`kubectl patch svc <svc> -p '{"spec":{"selector":{"app":"myapp","version":"v2"}}}'\`). <br> 4️⃣ Validate endpoints (\`kubectl get endpoints <svc>\`). <br> 5️⃣ Optionally use **Istio VirtualService** or **Ingress** with weighted routing for a true blue‑green cut‑over.
• **Best‑practice checklist**  <br> – Keep **label schema** (\`app\`, \`tier\`, \`version\`) consistent across Deployments, Services, and Ingress. <br> – Store Service selector in a **ConfigMap** and reference it in CI templates to avoid drift. <br> – Add a **smoke‑test pod** that curls the Service before traffic switch.
`,
  },
  {
    slug: "crashloopbackoff-configmap-change",
    title: "CrashLoopBackOff after ConfigMap change – pods don’t pick up the new config",
    category: "Interview Cheat-Sheet: Application Deployment & Rollouts",
    content: `
• **Symptoms** – \`kubectl logs <pod>\` shows parsing error, but the ConfigMap was updated successfully (\`kubectl describe cm <cm>\`).
• **Items encountered** – ConfigMap mounted as a **volume** (read‑only) – changes are reflected only after the pod restarts; application does not watch file‑system for changes; a **binary‑encoded** ConfigMap (e.g., base64) was edited manually causing corruption.
• **Fix** – 1️⃣ If the app can reload on SIGHUP, send signal (\`kubectl exec <pod> -- kill -HUP 1\`). <br> 2️⃣ Otherwise, force a rolling restart (\`kubectl rollout restart deployment/<dep>\`). <br> 3️⃣ If you need immediate in‑place update, use **ProjectedVolume** with \`watch: true\` (K8s 1.21+). <br> 4️⃣ Validate the new config (\`kubectl exec <pod> -- cat /etc/config/...\`).
• **Best‑practice checklist**  <br> – Prefer **environment variables** for small config; they are refreshed on pod restart automatically. <br> – Set **\`restartPolicy: OnFailure\`** only when you want the pod to self‑heal; otherwise use Deployments to control restarts. <br> – Version the ConfigMap (\`app-config-v001\`) and reference that version in the Deployment to make changes explicit.
`,
  },
  {
    slug: "pods-cant-reach-external-apis",
    title: "Pods can’t reach external APIs – DNS resolution fails intermittently",
    category: "Interview Cheat-Sheet: Networking & Service Mesh",
    content: `
• **Symptoms** – \`nslookup api.example.com\` inside a pod returns **SERVFAIL**; \`kubectl exec\` shows \`/etc/resolv.conf\` points to \`10.96.0.10\` (kube‑dns) but the CoreDNS logs contain “error loading zone”.
• **Items encountered** – CoreDNS ConfigMap (\`Corefile\`) missing the **forward** plugin for the corporate DNS, \`max_concurrent\` limit hit, node‑level \`iptables\` NAT rules conflicting with the cloud provider’s egress, or the **EKS VPC DNS** resolver quotas exhausted.
• **Fix** – 1️⃣ \`kubectl -n kube-system edit configmap coredns\` → add \`forward . 8.8.8.8\` or corporate DNS servers. <br> 2️⃣ Increase \`max_concurrent\` (\`10\` → \`200\`). <br> 3️⃣ If egress is blocked, add a **NAT Gateway** or **Egress IP** policy. <br> 4️⃣ Restart CoreDNS pods (\`kubectl rollout restart deployment coredns -n kube-system\`). <br> 5️⃣ Run \`dig @10.96.0.10 api.example.com\` to confirm.
• **Best‑practice checklist**  <br> – Keep a **separate CoreDNS ConfigMap** per environment (dev/stage/prod). <br> – Use **stub domains** for internal zones to avoid recursion latency. <br> – Enable **metrics** (\`prometheus\` plugin) to watch DNS query latency.
`,
  },
  {
    slug: "istio-mtls-breaks-legacy-app",
    title: "Service Mesh (Istio) mTLS breaks for a legacy app",
    category: "Interview Cheat-Sheet: Networking & Service Mesh",
    content: `
• **Symptoms** – Calls between services return HTTP 502, \`istio-proxy\` logs show \`TLS handshake error: unknown CA\`.
• **Items encountered** – The legacy app uses **HTTP 1.0** with a hard‑coded **self‑signed cert**; the sidecar injection forced **automatic mTLS**; Pod’s \`securityContext.runAsUser\` prevents the sidecar from writing the certs; or the app expects the **original client IP** which is lost behind the Envoy proxy.
• **Fix** – 1️⃣ Create a **DestinationRule** disabling mTLS for that service (\`trafficPolicy: { tls: { mode: DISABLE } }\`). <br> 2️⃣ Alternatively, enable **\`autoMTLS: false\`** in the **Namespace** annotation (\`istio-injection=disabled\`) and manually inject sidecar with \`--set values.global.autoMtls.enabled=false\`. <br> 3️⃣ If the app requires client IP, add the **\`original-source\`** header via an Envoy filter. <br> 4️⃣ Test with \`curl -v http://service.namespace.svc.cluster.local\`.
• **Best‑practice checklist**  <br> – Keep a **registry of “mTLS‑exempt” services** and document the reason. <br> – Use **\`peerAuthentication\`** resources scoped to namespace/service instead of disabling globally. <br> – Run a **canary** with mTLS off before rolling out full traffic.
`,
  },
  {
    slug: "statefulset-pods-stuck-pending",
    title: "StatefulSet pods stuck in Pending – PVC bound but node has no disk",
    category: "Interview Cheat-Sheet: Storage & CSI",
    content: `
• **Symptoms** – \`kubectl describe pod\` shows \`Events: FailedScheduling\` with “Insufficient cpu”, but the node has free CPU; \`kubectl get pvc\` shows **Bound**, yet the pod never gets a volume attached.
• **Items encountered** – The node’s **volume‑attachment** limit (e.g., \`max-volumes-per-node\` in AWS) reached, the **StorageClass** uses \`allowVolumeExpansion: false\` and the requested size exceeds the node’s local‑disk limit, or the CSI driver is not deployed on that node (taint/toleration mismatch).
• **Fix** – 1️⃣ Check the node’s volume limits (\`kubectl describe node <node>\` → \`Allocated resources\`). <br> 2️⃣ If limit is hit, increase the limit in the cloud provider (e.g., \`aws ec2 modify-instance-attribute --block-device-mappings\`). <br> 3️⃣ Add a **taint**‑**toleration** pair for the CSI driver if missing (\`kubectl taint nodes <node> csi=true:NoSchedule\`). <br> 4️⃣ If using local PVs, verify the **local path** exists on the node. <br> 5️⃣ Re‑schedule the pod (\`kubectl delete pod <pod>\`).
• **Best‑practice checklist**  <br> – Use **PodDisruptionBudgets** for StatefulSets to avoid accidental evictions. <br> – Keep **PVC size** under the node’s max‑volume limit; monitor via \`kubelet_volume_stats_capacity_bytes\`. <br> – Define a **StorageClass** with appropriate **reclaimPolicy** (\`Retain\` for critical data).
`,
  },
  {
    slug: "snapshot-restore-data-loss",
    title: "Snapshot restore leads to “Data loss” – application sees empty DB after PVC restore",
    category: "Interview Cheat-Sheet: Storage & CSI",
    content: `
• **Symptoms** – After recreating a PVC from a VolumeSnapshot, the DB container logs “database file not found” and starts with a fresh schema.
• **Items encountered** – The snapshot was taken **while the DB was still running**, resulting in a crash‑consistent (not application‑consistent) snapshot; the storage class does **not support file‑system freeze**; the PVC was recreated with a **different \`volumeMode\`** (\`Block\` vs \`Filesystem\`).
• **Fix** – 1️⃣ Quiesce the DB (e.g., \`pg_dump\` or \`mysqldump --single-transaction\`) before snapshot. <br> 2️⃣ If the CSI driver supports **filesystem freeze**, enable it (\`csi.storage.k8s.io/freeze\` annotation). <br> 3️⃣ Create a new PVC from the snapshot with **exact same \`storageClassName\` and \`volumeMode\`**. <br> 4️⃣ Mount the restored PVC to a **temporary pod** and verify data (\`ls -l /data\`). <br> 5️⃣ Update the StatefulSet to use the new PVC (or use \`kubectl patch\` to change the claim name).
• **Best‑practice checklist**  <br> – Schedule backups via **Kubernetes CronJob** that runs \`kubectl snapshot\` after a pre‑snapshot hook that stops writes. <br> – Tag snapshots with **application version** and **timestamp**. <br> – Test restoration in a **staging namespace** before production.
`,
  },
  {
    slug: "privileged-container-escaped",
    title: "Privileged container escaped and accessed the host’s /etc/kubernetes",
    category: "Interview Cheat-Sheet: Security & RBAC",
    content: `
• **Symptoms** – Audit log shows a pod with \`CAP_SYS_ADMIN\`; node’s kubelet logs contain “system:node:… attempted to read \`/etc/kubernetes\`”.
• **Items encountered** – A Deployment used \`securityContext.privileged: true\` for convenience; the pod's **ServiceAccount** was bound to a **ClusterRole** granting \`*\` on \`*\`; the PSP (PodSecurityPolicy) was disabled; the node had the **\`docker\` runtime** with no user‑namespace isolation.
• **Fix** – 1️⃣ Delete the offending pod (\`kubectl delete pod <pod>\`). <br> 2️⃣ Revoke the overly‑permissive **ClusterRoleBinding** (\`kubectl delete clusterrolebinding <binding>\`). <br> 3️⃣ Apply a **PodSecurityPolicy** (or the newer **PodSecurity Standards**) that enforces \`restricted\`. <br> 4️⃣ Enforce **Admission Controllers** (\`NamespaceLifecycle\`, \`NodeRestriction\`, \`RBAC\`) at the API server. <br> 5️⃣ If using Docker, migrate to **containerd** with **user‑ns** enabled.
• **Best‑practice checklist**  <br> – Use **least‑privilege ServiceAccounts** per workload. <br> – Enable **OPA Gatekeeper** or **Kyverno** policies that forbid \`privileged: true\` unless explicitly annotated. <br> – Turn on **audit logging** (\`--audit-policy-file\`) and ship to a SIEM.
`,
  },
  {
    slug: "networkpolicy-breaks-intra-namespace-communication",
    title: "NetworkPolicy breaks intra‑namespace communication for a newly added microservice",
    category: "Interview Cheat-Sheet: Security & RBAC",
    content: `
• **Symptoms** – Pods can reach the internet but cannot ping other pods in the same namespace; \`kubectl exec\` shows “connection refused”.
• **Items encountered** – A default‑deny \`NetworkPolicy\` was applied at the namespace level, but the new microservice’s pods lack an ingress rule; the policy uses **namespaceSelector** but no **podSelector** for the new label set; the CNI plugin (Calico) has **policy enforcement mode** set to \`strict\` without proper egress rules.
• **Fix** – 1️⃣ Identify the active policies (\`kubectl get netpol -n <ns>\`). <br> 2️⃣ Add a rule to allow traffic from the new label set:
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-new-service
  namespace: <ns>
spec:
  podSelector:
    matchLabels:
      app: new-service
  ingress:
  - from:
    - podSelector: {}
\`\`\` <br> 3️⃣ Apply the policy (\`kubectl apply -f allow-new-service.yaml\`). <br> 4️⃣ Verify with \`kubectl exec\` and \`curl\`.
• **Best‑practice checklist**  <br> – Adopt **“default‑deny”** + **explicit allow** model for each namespace. <br> – Keep a **policy‑as‑code** repo; run \`kubeval\`/\`conftest\` in PR pipelines. <br> – Use **Calico’s \`policy-recommendations\`** command to auto‑suggest missing rules.
`,
  },
  {
    slug: "high-pod-restart-rate-oomkilled",
    title: "High pod‑restart rate but no clear metric – only “OOMKilled” in events",
    category: "Interview Cheat-Sheet: Observability & Logging",
    content: `
• **Symptoms** – \`kubectl get pods\` shows many pods in \`CrashLoopBackOff\`; \`kubectl describe pod\` has \`State: Terminated Reason: OOMKilled\`; CPU/Memory dashboards are flat.
• **Items encountered** – The **vertical pod autoscaler (VPA)** is disabled, so pods run with static low memory limits; the **cgroup driver** mismatch (systemd vs cgroupfs) causing inaccurate memory accounting; the **application logs** are not shipped, so OOM details are missing.
• **Fix** – 1️⃣ Increase the memory request/limit in the Deployment (\`resources.requests.memory: 256Mi\`, \`limits.memory: 512Mi\`). <br> 2️⃣ Enable VPA in “auto” mode to let the cluster suggest limits. <br> 3️⃣ Confirm the kubelet uses the same **cgroup driver** as the container runtime (\`kubectl get node -o jsonpath='{.status.nodeInfo.cgroupDriver}'\`). <br> 4️⃣ Deploy a **side‑car logger** (Fluent Bit) to capture \`/var/log/containers\`. <br> 5️⃣ Set up **Prometheus alert** on \`container_memory_working_set_bytes > container_spec_memory_limit_bytes\`.
• **Best‑practice checklist**  <br> – Define **resource quotas** at the namespace level. <br> – Run **\`kubectl top pods\`** regularly to spot outliers. <br> – Store **core‑dump** on a sidecar volume for post‑mortem of OOM events.
`,
  },
  {
    slug: "latency-spikes-http-service",
    title: "Latency spikes in an HTTP service: tracing shows no request reach the pod",
    category: "Interview Cheat-Sheet: Observability & Logging",
    content: `
• **Symptoms** – Distributed tracing (Jaeger) shows a gap; Prometheus \`istio_requests_total\` stays low; \`kubectl get svc\` shows correct endpoints.
• **Items encountered** – The **Ingress controller** (NGINX) hit the **max‑connections** limit; a **rate‑limit** annotation (\`nginx.ingress.kubernetes.io/limit-rps\`) throttles traffic; the **Service** is of type \`ClusterIP\` but external traffic is being sent to a **NodePort** that no longer exists after a node reboot.
• **Fix** – 1️⃣ Inspect NGINX ingress config (\`kubectl -n ingress-nginx exec <pod> -- cat /etc/nginx/nginx.conf\`). <br> 2️⃣ Raise \`worker_connections\` (\`nginx.ingress.kubernetes.io/proxy‑connect‑timeout: "30"\`). <br> 3️⃣ Remove or adjust rate‑limit annotations. <br> 4️⃣ If using **Service type LoadBalancer**, verify the cloud‑LB health‑check points to the right port. <br> 5️⃣ Re‑apply the Ingress manifest.
• **Best‑practice checklist**  <br> – Use **CircuitBreaker** policies in Istio/Linkerd to protect backend services. <br> – Enable **request‑id** propagation for end‑to‑end tracing. <br> – Set **HPA** on the Ingress controller itself (replicas >= 3).
`,
  },
  {
    slug: "hpa-never-scales-out",
    title: "Horizontal Pod Autoscaler (HPA) never scales out despite high CPU usage",
    category: "Interview Cheat-Sheet: Autoscaling & Capacity Planning",
    content: `
• **Symptoms** – CPU on pods is at 85 %; \`kubectl get hpa\` shows \`CURRENT\` = \`2\` (desired) but \`TARGET\` = \`2\`; the HPA events say “failed to get cpu utilization: metric not available”.
• **Items encountered** – Metrics Server is not deployed or is outdated (v0.3.x); the API server’s \`--requestheader-client-ca-file\` flag is missing, blocking metrics aggregation; the Deployment’s \`targetCPUUtilizationPercentage\` is set to an unrealistic low value.
• **Fix** – 1️⃣ Deploy or upgrade **metrics‑server** (\`kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml\`). <br> 2️⃣ Verify API aggregation: \`kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1"\` returns data. <br> 3️⃣ Adjust HPA target (\`kubectl edit hpa <name>\`) to a realistic value (e.g., 70 %). <br> 4️⃣ Optionally enable **custom metrics** via Prometheus Adapter for more granular scaling.
• **Best‑practice checklist**  <br> – Run **\`kubectl top nodes\`** and **\`kubectl top pods\`** after installing metrics‑server. <br> – Keep HPA and **VPA** separate; they should not conflict on the same resource. <br> – Add an **idle‑replica** guard (\`minReplicas: 2\`) to avoid cold‑start latency.
`,
  },
  {
    slug: "cluster-runs-out-of-ips",
    title: "Cluster runs out of IPs in the pod CIDR after a burst of short‑lived jobs",
    category: "Interview Cheat-Sheet: Autoscaling & Capacity Planning",
    content: `
• **Symptoms** – New pods stay in \`Pending\` with \`Insufficient IPs\`; \`kubectl get nodes -o jsonpath='{.items[*].status.allocatable.pods}'\` shows zero; the CNI plugin logs “IP exhaustion”.
• **Items encountered** – The pod CIDR was allocated with a /24 block per node (256 IPs) but a burst of **Job** pods (each with a unique IP) never terminate promptly; ConfigMap \`cni‑config\` uses **host‑local** IPAM with a small pool; the cluster is on a **single‑AZ** VPC with limited secondary IP ranges.
• **Fix** – 1️⃣ Increase the **pod CIDR size** in the control‑plane (\`kubeadm init --pod-network-cidr=10.244.0.0/16\`). <br> 2️⃣ If using AWS VPC CNI, request larger **secondary IP ranges** for each ENI. <br> 3️⃣ Add a **TTL** to the Job (\`activeDeadlineSeconds\`) to ensure quick termination. <br> 4️⃣ Enable **IP address reclamation** in the CNI (\`cleanup=true\`). <br> 5️⃣ Monitor IP usage with Prometheus \`cni_ipam_allocated_ips_total\`.
• **Best‑practice checklist**  <br> – Size the pod network **5–10×** the expected maximum concurrent pods per node. <br> – Use **cluster‑autoscaler** with \`scale-down-delay\` to delete empty nodes and release IPs. <br> – Periodically run \`kubectl get pods --field-selector=status.phase=Failed\` and clean up.
`,
  },
  {
    slug: "etcd-lost-latest-snapshot",
    title: "etcd lost its latest snapshot after a node reboot – data corruption",
    category: "Interview Cheat-Sheet: Disaster Recovery & Backup",
    content: `
• **Symptoms** – \`etcdctl endpoint health\` fails; \`etcdctl member list\` shows a member stuck in **unstarted** state; \`kubectl get componentstatuses\` reports etcd **Unhealthy**.
• **Items encountered** – The automated snapshot cronjob stored backups on a **local PV** that disappeared with the node; the **etcd data directory** (\`/var/lib/etcd\`) had mismatched permissions after a kernel upgrade; the **etcd version** was upgraded without preserving the data directory (\`/var/lib/etcd/member\`).
• **Fix** – 1️⃣ Stop the etcd static pod (\`systemctl stop kubelet\` on the master). <br> 2️⃣ Mount an external backup volume (e.g., NFS) that contains the latest snapshot (\`/backups/etcd-snap-2024-07-01.db\`). <br> 3️⃣ Restore with \`etcdctl snapshot restore <snapfile> --data-dir /var/lib/etcd --name <node> --initial-cluster <node>=https://<ip>:2380\`. <br> 4️⃣ Restart kubelet; validate with \`etcdctl endpoint status\`.
• **Best‑practice checklist**  <br> – Store **etcd snapshots** off‑node (S3, GCS). <br> – Run snapshots **every 30 min** plus a **weekly full backup**. <br> – Test restore quarterly in a sandbox cluster.
`,
  },
  {
    slug: "application-backup-data-leakage",
    title: "Application‑level backup (MySQL) restored to the wrong namespace causing data leakage",
    category: "Interview Cheat-Sheet: Disaster Recovery & Backup",
    content: `
• **Symptoms** – After running a restore job, the MySQL pod contains data from a **different tenant**; audit logs show the PVC was bound to a **shared** storage class.
• **Items encountered** – The backup job used a **cluster‑wide PVC** with \`accessModes: ReadWriteMany\` that two namespaces shared; the **restore script** omitted the namespace selector; the storage class \`standard\` points to a **single‑tenant** EBS volume but the reclaim policy \`Retain\` kept the old PV alive.
• **Fix** – 1️⃣ Delete the mistakenly restored PVC (\`kubectl delete pvc mysql-pvc -n prod\`). <br> 2️⃣ Create a **namespace‑scoped** PVC with a **unique storage class** (\`type: gp2-prod\`). <br> 3️⃣ Update the restore Job to include \`metadata.namespace: prod\` and a **label selector** for the backup object. <br> 4️⃣ Run the restore again and verify data integrity (\`SELECT tenant_id FROM users\`).
• **Best‑practice checklist**  <br> – Use **Backup Objects** (Velero, Stash) that are **namespaced**. <br> – Set **\`persistentVolumeReclaimPolicy: Delete\`** for multi‑tenant workloads. <br> – Tag backups with tenant ID and enforce a **policy** that a restore can only target the same tenant.
`,
  },
  {
    slug: "idle-nodes-running-hpa-minreplicas",
    title: "Idle nodes keep running because of mis‑configured HPA minReplicas",
    category: "Interview Cheat-Sheet: Cost & Resource Optimization",
    content: `
• **Symptoms** – Cloud cost dashboard shows a steady increase in **EC2‑instance‑hours** even during off‑peak; \`kubectl get hpa\` shows \`minReplicas: 5\` for several micro‑services.
• **Items encountered** – HPA objects were created with a **static \`minReplicas\`** that never dropped below 5; the **Cluster Autoscaler** was disabled, so nodes never scaled down; there is a **DaemonSet** with \`runOnAllNodes: true\` that forces a node to stay alive.
• **Fix** – 1️⃣ Reduce \`minReplicas\` to 0 or 1 where safe (\`kubectl patch hpa <svc> -p '{"spec":{"minReplicas":0}}'\`). <br> 2️⃣ Enable **Cluster Autoscaler** (\`--scale-down-enabled=true\`). <br> 3️⃣ Add a **node‑selector** to the DaemonSet to run only on a subset of nodes. <br> 4️⃣ Monitor cost with **kubecost** charts to verify the drop.
• **Best‑practice checklist**  <br> – Review all **HPAs** monthly for over‑provisioned \`minReplicas\`. <br> – Tag cloud resources with \`k8s.io/cluster-autoscaler/enabled\`. <br> – Use **Spot Instances** for non‑critical node pools.
`,
  },
  {
    slug: "container-image-bloat",
    title: "Container image bloat inflates storage usage and slows node provisioning",
    category: "Interview Cheat-Sheet: Cost & Resource Optimization",
    content: `
• **Symptoms** – \`docker images\` on a node shows many >1 GB images; \`kubelet\` reports **ImagePullBackOff** for some pods due to “disk pressure”.
• **Items encountered** – CI pipelines push **fat base images** (e.g., \`ubuntu:latest\`) instead of \`scratch\` or \`distroless\`; images are not **squashed**; \`imagePullPolicy: Always\` forces repeated pulls even when cached; no **image garbage collection** is configured.
• **Fix** – 1️⃣ Implement a **container‑image‑size** lint in CI (\`hadolint\` + \`docker-slim\`). <br> 2️⃣ Switch to **multi‑stage builds** to produce minimal layers. <br> 3️⃣ Set \`imagePullPolicy: IfNotPresent\` for stable tags. <br> 4️⃣ Configure kubelet garbage collector (\`--image-gc-high-threshold=70\`, \`--image-gc-low-threshold=50\`). <br> 5️⃣ Run a manual prune (\`crictl rmi --prune\`).
• **Best‑practice checklist**  <br> – Enforce **image scanning** (Trivy, Clair) and size limits (≤ 200 MB). <br> - Use **\`docker manifest\`** to keep a single tag for multiple architectures. <br> – Periodically audit **unused images** with \`crictl images -q | xargs -I{} crictl inspecti {}\`.
`,
  },
  {
    slug: "gitops-sync-fails-missing-crd",
    title: "GitOps sync fails on the staging cluster because of a missing CRD",
    category: "Interview Cheat-Sheet: Multi‑Cluster & Governance",
    content: `
• **Symptoms** – ArgoCD reports “Missing CustomResourceDefinition”; the corresponding Application remains **OutOfSync**; \`kubectl get crd\` on staging does not list the needed CRD.
• **Items encountered** – The **CRD** lives in a separate repo that was not applied to the staging cluster; the cluster’s **RBAC** prevents ArgoCD from creating CRDs; the **helm chart** uses \`crd-install\` hook which is ignored in Helm v3.
• **Fix** – 1️⃣ Apply the CRD manually (\`kubectl apply -f crd.yaml -n staging\`). <br> 2️⃣ Add the CRD repository as a **dependence** in ArgoCD’s ApplicationSet (\`syncPolicy: automated\`). <br> 3️⃣ Ensure the ArgoCD service account has \`cluster-admin\` or at least \`crd\` creation rights (\`kubectl edit clusterrolebinding argocd-admin\`). <br> 4️⃣ Re‑sync the Application.
• **Best‑practice checklist**  <br> – Store **CRDs** in a **cluster‑level repo** that is applied before any namespace‑scoped apps. <br> – Use **Helm v3** \`crd\` directory (no hooks). <br> – Run a **pre‑sync health check** (ArgoCD \`resource.customizations.health.<group>/<kind>\`) to catch missing CRDs early.
`,
  },
  {
    slug: "federated-deployment-old-version",
    title: "Federated deployment rolled out to prod but one cluster still has the old version",
    category: "Interview Cheat-Sheet: Multi‑Cluster & Governance",
    content: `
• **Symptoms** – \`kubectl get deploy -A\` shows version \`v1.2.3\` in most clusters, but cluster‑C still reports \`v1.2.2\`; service health metrics are degraded only in that region.
• **Items encountered** – The **kubefed** controller missed the update because the **APIService** endpoint was unreachable (network partition); the **ClusterRole** for the federation controller lacked \`patch\` permission; the cluster‑C had a **taint** that prevented the rollout pod from being scheduled.
• **Fix** – 1️⃣ Verify the federation status (\`kubectl get federationcontrolplane -A\`). <br> 2️⃣ Manually trigger a sync (\`kubectl patch federateddeployment <name> -p '{"spec":{"template":{"metadata":{"annotations":{"kubefed.io/last-sync":"$(date +%s)"}}}}}'\`). <br> 3️⃣ Ensure cluster‑C API endpoint is reachable (\`curl https://<clusterC‑apiserver>/healthz\`). <br> 4️⃣ Add missing \`patch\` permission to the federation controller’s ClusterRole. <br> 5️⃣ Remove the taint or add a toleration to the rollout pod.
• **Best‑practice checklist**  <br> – Use **progressive rollout** with \`Canary\` or \`Argo Rollout\` across clusters, not immediate full sync. <br> – Monitor **federation health** with Prometheus \`kubefed_sync_success_total\`. <br> – Keep a **cluster‑specific override** file to handle one‑off taints without breaking the global manifest.
`,
  },
  // Content from response (1).md (Comprehensive Kubernetes Scenarios)
  {
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
  },
  {
    slug: "persistent-storage-contention",
    title: "Persistent Storage Contention",
    category: "Comprehensive Kubernetes Scenarios",
    content: `
**Scenario**: Database pods (e.g., PostgreSQL) experiencing \`read-only filesystem\` errors during heavy writes.
**Items Encountered**:
- PVCs stuck in \`Pending\` status.
- Storage provisioner (e.g., AWS EBS) hitting IOPS limits.
- Pods crashing with \`Out of disk space\` errors.
**Fix Applied**:
1. Resize PVC dynamically (if storage class supports):
   \`\`\`bash
   kubectl patch pvc <pvc-name> -p '{"spec":{"resources":{"requests":{"storage":"100Gi"}}}}'
   \`\`\`
2. Provision storage classes with higher IOPS (e.g., \`io2 Block Express\` for AWS).
3. Separate storage tiers for logs/data (use \`ReadWriteMany\` for shared volumes).
**Best Practices**:
- Use **VolumeSnapshots** for data backup.
- Configure **storage quotas** per namespace.
- Monitor PVC metrics via **kube-state-metrics**.
`,
  },
  {
    slug: "network-policy-misconfiguration",
    title: "Network Policy Misconfiguration",
    category: "Comprehensive Kubernetes Scenarios",
    content: `
**Scenario**: Microservices unable to communicate after applying a network policy, causing \`Connection refused\`.
**Items Encountered**:
- Pods failing to connect to external APIs.
- Network policies blocking inter-pod traffic.
- CNI plugin logs (e.g., Calico) showing dropped packets.
**Fix Applied**:
1. Audit network policies:
   \`\`\`bash
   kubectl get networkpolicy -A -o yaml
   \`\`\`
2. Test connectivity with \`kubectl exec -it <pod> -- curl <service-url>\`.
3. Add egress rules for external services:
   \`\`\`yaml
   egress:
   - to: []
     ports:
     - protocol: TCP
       port: 443
   \`\`\`
**Best Practices**:
- Start with permissive policies, then restrict gradually.
- Use **Cilium** for advanced network policies.
- Implement **service meshes** (Istio) for L7 traffic management.
`,
  },
  {
    slug: "etcd-corruption-during-upgrade",
    title: "etcd Corruption During Upgrade",
    category: "Comprehensive Kubernetes Scenarios",
    content: `
**Scenario**: Cluster upgrade to v1.27 failed, causing etcd to enter "corrupt member" state.
**Items Encountered**:
- \`etcdctl endpoint health\` failing.
- Pods in \`CrashLoopBackOff\` with etcd errors.
- \`/var/lib/etcd\` disk full.
**Fix Applied**:
1. Restore etcd from backup:
   \`\`\`bash
   ETCDCTL_API=3 etcdctl --endpoints=<endpoint> snapshot restore snapshot.db
   \`\`\`
2. Replace corrupt etcd member:
   \`\`\`bash
   kubectl delete node <etcd-node>
   kubectl label node <new-node> node-role.kubernetes.io/etcd= --overwrite
   \`\`\`
3. Recertify etcd cluster:
   \`\`\`bash
   kubectl delete -f etcd.yaml && kubectl apply -f etcd.yaml
   \`\`\`
**Best Practices**:
- Use **etcd-backup** jobs with \`etcd-operator\`.
- Test upgrades in **staging clusters**.
- Monitor etcd disk usage with \`kubectl top pods -n kube-system\`.
`,
  },
  {
    slug: "resource-exhaustion-cpu-throttling",
    title: "Resource Exhaustion (CPU/Throttling)",
    category: "Comprehensive Kubernetes Scenarios",
    content: `
**Scenario**: Critical pods terminated due to CPU limits being exceeded in production.
**Items Encountered**:
- Pods evicted with \`Evicted\` status.
- CPU throttling logs in \`kubelet\`.
- HPA not scaling pods fast enough.
**Fix Applied**:
1. Identify resource bottlenecks:
   \`\`\`bash
   kubectl top pods --sort-by=cpu
   \`\`\`
2. Adjust resource requests/limits:
   \`\`\`yaml
   resources:
     requests:
       cpu: "500m"
     limits:
       cpu: "1000m"
   \`\`\`
3. Implement **burst scaling** with \`targetUtilizationPercentage\` in HPA.
**Best Practices**:
- Use **vertical pod autoscaler (VPA)** for resource recommendations.
- Set **default resource limits** via namespace limits.
- Monitor with **kubectl top nodes** and **kube-state-metrics**.
`,
  },
  {
    slug: "certificate-rotation-failures",
    title: "Certificate Rotation Failures",
    category: "Comprehensive Kubernetes Scenarios",
    content: `
**Scenario**: API server certificates expired, causing \`connection refused\` errors for \`kubectl\`.
**Items Encountered**:
- \`kubectl get nodes\` returning \`The connection to the server <server> was refused\`.
- kube-controller-manager logs showing \`certificate has expired or is not yet valid\`.
**Fix Applied**:
1. Rotate API server certificates:
   \`\`\`bash
   kubectl get csr -o name | xargs -I {} kubectl certificate approve {}
   \`\`\`
2. Regenerate CA certificates:
   \`\`\`bash
   kubeadm alpha certs renew all --config=kubeadm-config.yaml
   \`\`\`
3. Restart control-plane components:
   \`\`\`bash
   kubectl delete pod -n kube-system <kube-apiserver-pod>
   \`\`\`
**Best Practices**:
- Automate certificate rotation with **cert-manager**.
- Monitor certificate expiry with **Prometheus alerts**.
- Use **kubeadm** for lifecycle management.
`,
  },
  {
    slug: "ingress-controller-timeout-issues",
    title: "Ingress Controller Timeout Issues",
    category: "Comprehensive Kubernetes Scenarios",
    content: `
**Scenario**: User-facing apps time out during high traffic due to Ingress controller (NGINX) misconfiguration.
**Items Encountered**:
- \`504 Gateway Timeout\` errors.
- Ingress controller pod CPU at 100%.
- Open connections maxed out.
**Fix Applied**:
1. Tune NGINX timeouts:
   \`\`\`yaml
   data:
     proxy-connect-timeout: "30"
     proxy-send-timeout: "600"
     proxy-read-timeout: "600"
   \`\`\`
2. Increase Ingress controller replicas:
   \`\`\`yaml
   spec:
     replicas: 5
   \`\`\`
3. Configure keep-alive timeouts in service annotations.
**Best Practices**:
- Use **PodDisruptionBudgets** for Ingress controllers.
- Implement **circuit breakers** in service meshes.
- Test with **locust**/vegeta before deployment.
`,
  },
  {
    slug: "namespace-quota-exceeded",
    title: "Namespace Quota Exceeded",
    category: "Comprehensive Kubernetes Scenarios",
    content: `
**Scenario**: Development teams can’t deploy new pods due to resource quotas being exhausted.
**Items Encountered**:
- \`Insufficient cpu\` errors in pod events.
- Quota status showing \`used:cpu > hard:cpu\`.
- Persistent volume claims stuck in \`Pending\`.
**Fix Applied**:
1. Check quota usage:
   \`\`\`bash
   kubectl get resourcequota <quota-name> -o yaml
   \`\`\`
2. Adjust quotas or request deletion of non-critical resources:
   \`\`\`bash
   kubectl delete deployment <non-critical-app>
   \`\`\`
3. Add resource limits to namespace:
   \`\`\`yaml
   limits:
     - default:
         cpu: "500m"
         memory: "1Gi"
   \`\`\`
**Best Practices**:
- Use **ResourceQuota** and **LimitRange** per namespace.
- Implement **cost monitoring** with **kube-cost**.
- Enforce **admission controllers** (e.g., Kyverno) for resource policies.
`,
  },
  {
    slug: "multi-cluster-service-mesh-incompatibility",
    title: "Multi-Cluster Service Mesh Incompatibility",
    category: "Comprehensive Kubernetes Scenarios",
    content: `
**Scenario**: Failed federation between clusters due to mismatched Istio versions.
**Items Encountered**:
- \`xDS errors\` in Istio Pilot logs.
- Cross-cluster traffic failing with \`Connection refused\`.
- Pilot sync retries failing.
**Fix Applied**:
1. Align Istio versions across clusters:
   \`\`\`bash
   helm upgrade istio-base ./istio-1.18.0 -n istio-system
   \`\`\`
2. Reconfigure istiod with global discovery:
   \`\`\`yaml
   global:
     meshID: mesh1
     multiCluster:
       clusterName: cluster-a
   \`\`\`
3. Restart istio-pods and verify endpoints.
**Best Practices**:
- Use **GitOps** (ArgoCD) for consistent deployments.
- Test multi-cluster setups in dedicated environments.
- Monitor with **Kiali** and **Jaeger**.
`,
  },
  {
    slug: "cost-optimization-idle-resources",
    title: "Cost Optimization (Idle Resources)",
    category: "Comprehensive Kubernetes Scenarios",
    content: `
**Scenario**: Over-provisioned nodes costing $10k+/month during low-traffic periods.
**Items Encountered**:
- Nodes with <10% CPU utilization for weeks.
- Cluster autoscaler not scaling down due to pod disruption budgets.
- Unused PVCs consuming storage.
**Fix Applied**:
1. Identify idle resources:
   \`\`\`bash
   kubectl get nodes --no-headers | awk '$5 < 10 {print $1}'
   \`\`\`
2. Scale down HPA minReplicas:
   \`\`\`yaml
   minReplicas: 1
   \`\`\`
3. Clean unused PVCs:
   \`\`\`bash
   kubectl get pvc --all-namespaces --field-selector=status.phase=Released
   \`\`\`
**Best Practices**:
- Use **Karpenter** for right-sizing nodes.
- Implement **cluster autoscaler** with scale-down profiles.
- Deploy **cost management tools** (e.g., CloudHealth).
`,
  },
  // Content from response (3).md (Enhanced Kubernetes Scenarios)
  {
    slug: "migrating-monolith-to-kubernetes-aws",
    title: "Migrating a Monolith to Kubernetes on AWS",
    category: "Enhanced Kubernetes Scenarios",
    content: `
**Scenario**:
- *Requirement*: Migrate a legacy Java monolith (running on EC2) to EKS with zero downtime.
- *Encountered Issues*:
  - Data loss during pod restarts (no persistent storage).
  - Service discovery failures between pods.
  - Inefficient resource utilization (over-provisioned EC2 instances).
- *Fix Applied*:
  1. **State Storage**: Migrated database to Amazon RDS (Aurora) with Multi-AZ.
  2. **Kubernetes Architecture**:
     - Deployed monolith as a StatefulSet for stable IDs.
     - Used AWS EBS CSI driver for persistent volumes.
     - Implemented \`livenessProbe\` and \`readinessProbe\` to prevent crashes.
  3. **CI/CD Pipeline**:
     - Terraform for EKS cluster provisioning:
       \`\`\`hcl
       resource "aws_eks_cluster" "prod" {
         name     = "monolith-cluster"
         role_arn = aws_iam_role.eks.arn
         vpc_config {
           subnet_ids = aws_subnet.private[*].id
         }
       }
       \`\`\`
     - ArgoCD for GitOps deployments with AWS ECR for image storage.
  4. **Service Mesh**: Istio for traffic splitting (10% canary releases).
- **Best Practices**:
  - Use Kubernetes \`Deployment\` strategies (e.g., RollingUpdate) with maxSurge.
  - Implement AWS Security Groups for pod-level network policies.
  - Monitor with Prometheus/Grafana + AWS CloudWatch Container Insights.
`,
  },
  {
    slug: "secure-multi-cluster-architecture-aws",
    title: "Secure Multi-Cluster Architecture with AWS",
    category: "Enhanced Kubernetes Scenarios",
    content: `
**Scenario**:
- *Requirement*: Build a secure, geographically distributed EKS cluster for PCI-compliant workloads.
- *Encountered Issues*:
  - Cross-cluster secret leakage.
  - Network latency between regions (us-east-1 and eu-west-1).
  - Failed compliance audit (no encryption at rest).
- *Fix Applied*:
  1. **AWS Architecture**:
     - EKS clusters in separate regions with AWS Transit Gateway for connectivity.
     - AWS KMS for EBS encryption and EKS control-plane encryption.
  2. **Secrets Management**:
     - Integrated AWS Secrets Manager with Kubernetes Secrets Store CSI Driver.
     - IAM Roles for Service Accounts (IRSA) for least privilege access.
  3. **Network Isolation**:
     - Calico network policies enforcing ingress/egress rules.
     - VPC endpoints for EKS, S3, and Secrets Manager to avoid internet exposure.
- **Best Practices**:
  - Enable AWS Config rules for Kubernetes compliance (e.g., \`encrypted-volumes\`).
  - Use AWS Backup for EKS cluster snapshots.
  - Implement AWS WAF + Shield for cluster ingress protection.
`,
  },
  {
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
  },
  {
    slug: "cost-optimization-eks",
    title: "Cost Optimization of EKS",
    category: "Enhanced Kubernetes Scenarios",
    content: `
**Scenario**:
- *Requirement*: Reduce EKS costs by 40% without impacting production workloads.
- *Encountered Issues*:
  - Over-provisioned nodes (90% idle capacity).
  - Unoptimized Spot Instance interruptions.
  - Unused ECR images bloating storage costs.
- *Fix Applied*:
  1. **Node Optimization**:
     - Migrated to AWS Fargate for serverless pods (no node management).
     - Spot Instances with \`rebalance-reclamation: delete\` for auto-healing.
  2. **Terraform Cost Controls**:
     \`\`\`hcl
     resource "aws_eks_node_group" "spot" {
       cluster_name    = aws_eks_cluster.prod.name
       instance_types  = ["m5.large"]
       capacity_type   = "SPOT"
       scaling_config {
         desired_size = 3
         max_size     = 10
       }
     }
     \`\`\`
  3. **ECR Lifecycle Policies**:
     - Automated cleanup of untagged images older than 7 days.
- **Best Practices**:
  - Use AWS Cost Explorer + Kubecost for real-time cost tracking.
  - Implement ResourceQuotas and LimitRanges per namespace.
  - Schedule non-critical workloads during Spot Instance availability windows.
`,
  },
  {
    slug: "disaster-recovery-multi-az-eks",
    title: "Disaster Recovery for Multi-AZ EKS",
    category: "Enhanced Kubernetes Scenarios",
    content: `
**Scenario**:
- *Requirement*: Achieve RTO < 15 mins for a global SaaS application.
- *Encountered Issues*:
  - AZ failure causing pod disruptions.
  - Data inconsistency during failover.
  - Manual failover taking > 2 hours.
- *Fix Applied*:
  1. **AWS Architectural Design**:
     - Multi-AZ EKS cluster with 3 subnets across 2 AZs.
     - Amazon EFS for shared storage (Multi-AZ deployment).
     - Route 53 failover routing with health checks.
  2. **Automation**:
     - AWS Backup + Velero for cross-region cluster replication:
       \`\`\`bash
       velero backup create dr-backup --include-namespaces=production
       \`\`\`
     - Terraform for infrastructure-as-code (IaC) to rebuild AZ in < 10 mins.
  3. **Data Consistency**:
     - Aurora Global Database for multi-region read replicas.
- **Best Practices**:
  - Run monthly disaster drills with AWS Control Tower.
  - Use AWS FIS (Fault Injection Simulator) to validate recovery.
  - Implement SLOs/SLIs for HA (e.g., > 99.95% uptime).
`,
  },
  // Content from response (2).md (Interview-Ready Architecture & Migration Blueprint)
  {
    slug: "interview-ready-architecture-migration-blueprint",
    title: "Interview‑Ready Architecture & Migration Blueprint",
    category: "Interview-Ready Architecture & Migration Blueprint",
    content: `
**Profile you’ll be presenting**

| Certification | What it tells the interview panel |
|---------------|-----------------------------------|
| **AWS Solution Architect – Professional** | Deep knowledge of AWS networking, security, high‑availability, cost‑optimization and large‑scale design. |
| **Terraform Associate** | Ability to codify the whole infra (including the new K8s platform) as reusable, version‑controlled IaC. |
| **CKAD** | Hands‑on expertise with Kubernetes objects, workloads, observability, CI/CD pipelines and troubleshooting. |

Below is a **complete end‑to‑end design** that ties those three skill‑sets together and shows how you would **migrate a legacy EC2‑hosted application stack to a production‑grade Amazon EKS cluster**.

---

## 1️⃣ Business & Technical Requirements (Typical “given requirement”)

| # | Requirement | Why it matters |
|---|-------------|----------------|
| 1 | **Zero‑downtime migration** – the service must stay live 24/7. | Customer SLA. |
| 2 | **Scalable, self‑healing workloads** – auto‑scale on traffic spikes. | Cost‑efficiency & resiliency. |
| 3 | **Secure networking & data‑in‑flight encryption** (VPC‑isolated, mTLS). | PCI / GDPR compliance. |
| 4 | **Immutable infrastructure** – all infra codified, reproducible. | Auditable, disaster‑recoverable. |
| 5 | **Observability stack** (metrics, logs, tracing). | Fast root‑cause analysis. |
| 6 | **Blue‑green or canary deploys** with rollback. | Low‑risk releases. |
| 7 | **Cost‑aware design** – use Spot/Reserved Instances where possible. | OPEX control. |
| 8 | **Terraform‑first approach** – all resources provisioned via code. | Repeatable environments (dev / stage / prod). |

---

## 2️⃣ Target Architecture Overview (AWS + EKS)

\`\`\`
+-----------------------------------------------------------+
|                        AWS Account                        |
|  +-------------------+   +-----------------------------+  |
|  |  VPC (10.0.0.0/16)│   │  IAM (Roles, Policies)     │  |
|  |   +-----------+   │   +-----------------------------+  |
|  |   │  Public   │   │   |  Service‑Linked Roles (EKS)│  |
|  |   │ Subnet(s) │   │   +-----------------------------+  |
|  |   │ Private   │   │   |  KMS (EBS‑encryption)     │  |
|  |   │ Subnet(s) │   │   +-----------------------------+  |
|  |   +-----------+   │   |  Secrets Manager / SSM     │  |
|  |   │  NAT GW   │   │   +-----------------------------+  |
|  |   +-----------+   │                                 |
|  |   │  IGW      │   │   +-----------------------------+ |
|  |   +-----------+   │   │  Amazon EKS Control Plane  │ |
|  +-------------------+   +-----------------------------+ |
|                          |  • Managed etcd (regional)   │ |
|                          |  • Private endpoint (no public)│ |
|                          +-----------------------------+ |
|  +---------------------------------------------------+ |
|  |  Node‑Groups (managed node groups)                | |
|  |   – On‑Demand (critical system pods)             | |
|  |   – Spot (stateless workloads)                  | |
|  |   – Bottlerocket / AL2 AMI                        | |
|  +---------------------------------------------------+ |
|  |  Service Mesh (Istio/Linkerd) – mTLS between pods| |
|  +---------------------------------------------------+ |
|  |  Ingress – AWS Load Balancer Controller (ALB)   | |
|  +---------------------------------------------------+ |
|  |  Data Layer – RDS Aurora (Postgres/MySQL)        | |
|  +---------------------------------------------------+ |
|  |  Observability – CloudWatch, Prometheus‑Operator| |
|  +---------------------------------------------------+ |
|  |  CI/CD – GitHub Actions / CodePipeline → Argo CD| |
|  +---------------------------------------------------+ |
+-------------------------------------------------------+
\`\`\`

### Key Design Decisions (Why they fit the certifications)

| Decision | AWS Solution‑Architect rationale | Terraform Associate rationale | CKAD rationale |
|----------|---------------------------------|------------------------------|----------------|
| **EKS with private endpoint** | Keeps control plane inside VPC → no public exposure, uses VPC‑endpoint. | \`aws_eks_cluster\` with \`endpoint_private_access = true\`. | Pods talk to API via internal DNS; \`kubectl\` works from bastion. |
| **Managed Node Groups (Mixed On‑Demand + Spot)** | Leverages cost‑optimized Spot for bursty workloads, on‑demand for system pods → cost‑aware. | \`aws_eks_node_group\` with \`instance_market_options\`. | Use \`taints\` / \`tolerations\` to schedule critical pods on on‑demand nodes. |
| **IAM for Service Accounts (IRSA)** | Fine‑grained IAM per workload; removes static credentials. | \`aws_iam_role\` + \`aws_iam_policy_attachment\` + \`eks_identity_provider_config\`. | Pods get AWS SDK credentials via projected service account token. |
| **ALB Ingress Controller** | Managed L7 load balancer, integrates with ACM (TLS). | \`aws_lb_target_group\` and \`kubernetes_ingress_v1\` resources. | \`Ingress\` resources expose services, support canary via annotations. |
| **Istio Service Mesh** | Enforces zero‑trust, mTLS, and observability (traffic‑mirroring). | Deploy via Helm chart (\`helm_release\` module). | \`VirtualService\`, \`DestinationRule\` for traffic split (blue‑green). |
| **GitOps (Argo CD)** | Declarative state, audit‑ready – aligns with AWS‑well‑architected docs. | \`helm_release\` for Argo CD, \`kustomize\` overlays in repo. | \`Application\` CRD tracks sync status, self‑heals drift. |
| **Observability stack** | CloudWatch Alarms + Prometheus‑Operator → unified metrics, logs, traces. | \`helm_release\` for \`kube‑prometheus‑stack\`; \`aws_cloudwatch_log_group\`. | \`ServiceMonitor\`, \`PodMonitor\`, \`Alertmanager\` CRDs for alerting. |

---

## 3️⃣ Migration Phases (Zero‑Downtime Playbook)

| Phase | Goal | Steps (AWS + Terraform + K8s) | Validation |
|------|------|------------------------------|------------|
| **0 – Baseline** | Capture current EC2 deployment details. | - Export instance types, SGs, AMIs. <br>- Export running Docker images & tags. <br>- Document RDS endpoints, S3 buckets, IAM roles. | Create a **lift‑and‑shift** diagram for reference. |
| **1 – Create “Shadow” EKS Environment** | Build a fully functional EKS cluster in a **non‑production** VPC using Terraform. | \`\`\`hcl<br>module "eks" {<br>  source = "terraform-aws-modules/eks/aws"<br>  cluster_name = "myapp‑shadow"<br>  vpc_id = var.vpc_id<br>  subnet_ids = var.private_subnet_ids<br>  enable_irsa = true<br>  node_groups = {<br>    spot = {instance_type = "t3.medium", desired_capacity = 3, spot_price = "0.02"}<br>    ondemand = {instance_type = "m5.large", desired_capacity = 2}<br>  }<br>}<br>\`\`\` | - \`kubectl get nodes\` → all nodes Ready.<br>- Verify IAM roles via \`aws eks describe-cluster\`. |
| **2 – CI/CD Pipeline for Container Images** | Push the same image builds used on EC2 to ECR and deploy to EKS. | - Add a **GitHub Action** that builds ⇢ \`docker build -t $ECR_REPO:$GIT_SHA .\` ⇢ \`aws ecr get-login-password\` ⇢ \`docker push\`. <br>- Use **Argo CD** to sync target namespace. | Check image digest in ECR matches the one running on EC2 (\`docker inspect\`). |
| **3 – Data Layer Migration (Read‑only Replication)** | Keep DB on RDS but add a read‑replica for the new pods. | - Enable Aurora **Read Replica** in another AZ. <br>- Create a **Kubernetes secret** (\`aws_secretsmanager_secret\`) that holds the replica endpoint. | Run a job that writes to primary, reads from replica → data consistency. |
| **4 – Blue‑Green Service Deployment** | Deploy new version side‑by‑side with the old EC2 service. | 1️⃣  Deploy a **K8s Service** \`myapp-blue\` → points to EC2 IP via **ExternalName** or **NLB**. <br>2️⃣  Deploy a **K8s Service** \`myapp-green\` → points to pods in EKS. <br>3️⃣  Create an **ALB Listener rule** (via annotations) that routes **50 %** traffic to each target group. | Use \`curl\` with \`X-Forwarded-For\` to verify traffic split. |
| **5 – Gradual Cut‑over** | Shift traffic from EC2 → EKS while monitoring. | - Increase \`green\` weight to 80 % → 100 % (or use Istio \`VirtualService\` traffic routing). <br>- Watch CloudWatch dashboards for error‑rate, latency, CPU. | Once error‑rate < 1 % for 30 min, retire EC2 instances. |
| **6 – Decommission EC2** | Clean up old resources. | - \`terraform destroy\` the EC2 modules. <br>- Delete old security groups, IAM roles, Elastic IPs. | Verify cost in AWS Cost Explorer drops to zero for those resources. |
| **7 – Post‑migration Optimizations** | Right‑size node groups, enforce policies. | - Enable **Cluster Autoscaler** (\`autoscaler_profile = "balanced"\`). <br>- Apply **OPA Gatekeeper** policies (\`k8srequiredlabels\`). <br>- Turn on **EBS Encryption** and **KMS‑generated keys** for all volumes. | Cost reduction – ~30 % vs baseline, compliance audit passes. |

---

## 4️⃣ Terraform Blueprint (Key Modules)

### 4.1 Core Networking & IAM

\`\`\`hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  name    = "myapp-vpc"
  cidr    = "10.0.0.0/16"
  azs     = ["us-east-1a","us-east-1b","us-east-1c"]
  private_subnets = ["10.0.1.0/24","10.0.2.0/24100.3.0/24"]
  public_subnets  = ["10.0.101.0/24","10.0.102.0/24","10.0.103.0/24"]
  enable_nat_gateway = true
}

resource "aws_iam_role" "eks_cluster_role" {
  name = "eksClusterRole"
  assume_role_policy = data.aws_iam_policy_document.eks_cluster_assume.json
}
# …attach AmazonEKSClusterPolicy, AmazonEKSServicePolicy…
\`\`\`

### 4.2 EKS Cluster & Node Groups

\`\`\`hcl
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "myapp-prod"
  cluster_version = "1.28"
  subnets         = module.vpc.private_subnets
  vpc_id          = module.vpc.vpc_id

  enable_irsa          = true           # IAM for Service Accounts
  enable_cluster_logging = ["api","audit","authenticator"]

  node_groups = {
    core = {
      desired_capacity = 3
      instance_type    = "m5.large"
      iam_role_arn     = aws_iam_role.eks_node_core.arn
    }
    spot = {
      desired_capacity = 6
      instance_type    = "t3.medium"
      spot_price       = "0.0116"
      iam_role_arn     = aws_iam_role.eks_node_spot.arn
    }
  }
}
\`\`\`

### 4.3 Add‑ons (Helm Releases)

\`\`\`hcl
module "helm_addons" {
  source = "./modules/helm"

  eks_cluster_name = module.eks.cluster_name
  eks_oidc_provider = module.eks.oidc_provider
  values = {
    prometheus = {
      enabled = true
      alertmanager = { enabled = true }
    }
    argocd = {
      enabled = true
      server = { service = { type = "LoadBalancer" } }
    }
    istio = {
      enabled = true
      version = "1.22.0"
    }
  }
}
\`\`\`

*(The \`./modules/helm\` module simply runs \`helm_release\` resources with the supplied \`values\`.)*

### 4.4 Secrets & Config

\`\`\`hcl
resource "aws_secretsmanager_secret" "db_credentials" {
  name = "myapp-db-creds"
}
resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = var.db_user
    password = var.db_pass
  })
}
# Kubernetes secret via Terraform provider
resource "kubernetes_secret" "db_credentials" {
  metadata {
    name      = "db-cred"
    namespace = "prod"
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.eks_service_account.arn
    }
  }
  data = {
    username = base64encode(var.db_user)
    password = base64encode(var.db_pass)
  }
}
\`\`\`

---

## 5️⃣ Security & Compliance (AWS + K8s)

| Concern | AWS Feature | K8s / CKAD Feature | Implementation |
|---------|-------------|--------------------|----------------|
| **Network segmentation** | Private subnets, **Security Groups** | NetworkPolicy (Calico) | Define \`allow-from\` policies per namespace; default‑deny all. |
| **Pod‑to‑AWS service auth** | **IRSA** (IAM Roles for Service Accounts) | ServiceAccount + \`aws-iam-authenticator\` | Each micro‑service gets its own IAM role (least privilege). |
| **Encryption‑at‑rest** | **EBS‑encryption** with KMS‑CMK | \`encrypted: true\` in \`StorageClass\` | \`storageclass.yaml\` with \`parameters: { encrypted: "true", kmsKeyId: "${aws_kms_key.eks.id}" }\`. |
| **Encryption‑in‑transit** | **ALB TLS** + **ACM** certs | Istio mTLS (auto‑rotate) | Enable \`global.mtls.enabled = true\` in IstioOperator. |
| **Audit logging** | **CloudTrail** + **EKS control‑plane logging** | \`audit\` log via \`--audit-policy-file\` | \`enable_cluster_logging = ["audit"]\` in the EKS module. |
| **Runtime security** | **Amazon GuardDuty** | **OPA Gatekeeper** policies | Example policy enforcing \`runAsNonRoot: true\`. |
| **Secret management** | **Secrets Manager** / **SSM Parameter Store** | \`ExternalSecret\` (external‑secrets operator) | Sync secrets into K8s at runtime, rotate automatically. |

---

## 6️⃣ Observability & Incident‑Response Flow

1. **Metrics** – \`kube‑prometheus‑stack\` → CloudWatch metric streams (via Managed Prometheus).
   *Alert*: \`CPUUtilization > 80% for 5m\` → PagerDuty.

2. **Logs** – \`aws-for-fluent-bit\` DaemonSet sends container stdout/stderr to CloudWatch Logs groups per namespace.

3. **Tracing** – \`OpenTelemetry Operator\` + **AWS X‑Ray** integration; Istio automatically propagates trace headers.

4. **Dashboard** – Grafana (hosted on EKS) with dashboards:
   * Cluster health (node, pod phases)
   * Application latency (SLO = 99 % < 200 ms)
   * Cost per node‑group (Spot vs On‑Demand)

5. **Runbooks** – Store runbook Markdown in the same Git repo; link to CloudWatch Alarms via **Alarm Actions** → SNS → Slack.

---

## 7️⃣ Cost‑Optimization Checklist (AWS + Terraform)

| Item | How you implement it | Savings impact |
|------|----------------------|----------------|
| **Spot Instances for stateless pods** | \`instance_market_options\` in node‑group. | 60 % lower EC2 cost for those pods. |
| **Right‑size EBS volumes** | \`aws_ebs_volume\` \`size = var.size\` from \`terraform.tfvars\`; enable \`throughput = var.throughput\` only when needed. | Eliminates over‑provisioned gp3 volumes. |
| **Reserved Instances for control‑plane nodes** | Purchase 1‑yr RI for \`m5.large\` used in \`core\` node‑group. | Up to 30 % discount. |
| **Fargate for bursty workloads** (optional) | \`aws_eks_fargate_profile\` for jobs/cron. | Pay‑as‑you‑go, no idle nodes. |
| **CloudWatch Log Retention** | \`aws_cloudwatch_log_group\` \`retention_in_days = 30\`. | Avoid indefinite log storage bills. |
| **Auto‑scaling policies** | \`kubernetes_horizontal_pod_autoscaler\` via Terraform \`k8s_hpa\` resource. | Scale to zero when idle (if workloads are stateless). |

---

## 8️⃣ Sample Interview Narrative (5‑minute “Tell‑me‑about‑the‑project”)

> “In my last role I drove a **zero‑downtime migration from a fleet of EC2 instances to a production‑grade Amazon EKS platform**.
> Because I’m an **AWS Solution Architect Professional**, I first built a private‑VPC with isolated subnets, NAT gateways, and a **private‑endpoint EKS control plane**. Using **Terraform**, I codified the entire stack – VPC, IAM roles (including IRSA for per‑service AWS permissions), managed node groups (a mix of on‑demand for system pods and Spot for stateless workloads), and all add‑ons (Istio, Prometheus‑Operator, Argo CD) as reusable modules.
> With my **CKAD** background, I authored the Kubernetes manifests that leveraged **Deployment**, **HorizontalPodAutoscaler**, **NetworkPolicy**, and **Istio VirtualService** to achieve blue‑green traffic shifting. The CI/CD pipeline built Docker images, pushed them to **ECR**, and Argo CD kept the clusters in sync.
> The migration was performed in three phases: (1) spin‑up a “shadow” EKS cluster; (2) replica the data layer with an Aurora read‑replica; (3) run a blue‑green split via an ALB listener rule, gradually shifting 100 % of traffic to the new pods. Throughout, CloudWatch, Prometheus, and X‑Ray gave us real‑time observability.
> After cut‑over we decommissioned the EC2 fleet via Terraform destroy, saved ≈ 30 % in compute cost by moving 70 % of the workload to Spot instances, and hardened the environment with IAM‑for‑Service‑Accounts, KMS‑encrypted EBS, and OPA Gatekeeper policies. The whole project was completed in **six weeks**, met the SLA (zero error‑rate during migration) and passed the internal security audit on the first run.”

---

## 9️⃣ Quick‑Reference Checklist (What to say on the spot)

- **Design** – Private VPC, EKS with private endpoint, multi‑AZ node groups.
- **IaC** – Entire stack in Terraform (VPC, IAM, EKS, Helm releases).
- **Security** – IRSA, KMS/EBS encryption, NetworkPolicies, mTLS (Istio).
- **Observability** – CloudWatch + Prometheus + OpenTelemetry.
- **Deployment** – GitOps (Argo CD), blue‑green via ALB/Istio, canary with automated rollback.
- **Cost** – Spot + Reserved Instances, right‑sized EBS, log retention.
- **Compliance** – CloudTrail, GuardDuty, OPA policies.
- **Outcome** – Zero downtime, 30 % cost reduction, audit‑ready, reproducible environment.

---

### TL;DR

*Leverage the AWS Solution‑Architect skill set to design a secure, cost‑optimized VPC‑isolated EKS platform; use Terraform to encode every piece of infra; apply CKAD‑level Kubernetes expertise (Deployments, HPA, Service Mesh, GitOps) to run blue‑green migrations with zero impact; finish with observability, security hardening, and cost‑saving best practices. This story showcases **architectural vision, automation fluency, and hands‑on Kubernetes mastery**—exactly what the interview panel wants to see.*
`,
  },
];