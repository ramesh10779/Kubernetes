import { Scenario } from "../types";

export const interviewReadyArchitectureMigrationBlueprint: Scenario = {
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
|  |   +-----------+   │   +-----------------------------+  |
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
| **Encryption‑at‑rest** | **EBS‑encryption** with KMS‑CMK | \`encrypted: true\` in \`StorageClass\` | \`storageclass.yaml\` with \`parameters: { encrypted: "true", kmsKeyId: "YOUR_KMS_KEY_ARN" }\`. |
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
};