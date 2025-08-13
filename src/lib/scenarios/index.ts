import { Scenario } from "../types";

import { controlPlaneOutOfSync } from "./control-plane-out-of-sync";
import { nodePoolAutoscalingNeverRegisters } from "./node-pool-autoscaling-never-registers";
import { blueGreenDeploymentFails } from "./blue-green-deployment-fails";
import { crashloopbackoffConfigmapChange } from "./crashloopbackoff-configmap-change";
import { podsCantReachExternalApis } from "./pods-cant-reach-external-apis";
import { istioMtlsBreaksLegacyApp } from "./istio-mtls-breaks-legacy-app";
import { statefulsetPodsStuckPending } from "./statefulset-pods-stuck-pending";
import { snapshotRestoreDataLoss } from "./snapshot-restore-data-loss";
import { privilegedContainerEscaped } from "./privileged-container-escaped";
import { networkpolicyBreaksIntraNamespaceCommunication } from "./networkpolicy-breaks-intra-namespace-communication";
import { highPodRestartRateOomkilled } from "./high-pod-restart-rate-oomkilled";
import { latencySpikesHttpService } from "./latency-spikes-http-service";
import { hpaNeverScalesOut } from "./hpa-never-scales-out";
import { clusterRunsOutOfIps } from "./cluster-runs-out-of-ips";
import { etcdLostLatestSnapshot } from "./etcd-lost-latest-snapshot";
import { applicationBackupDataLeakage } from "./application-backup-data-leakage";
import { idleNodesRunningHpaMinreplicas } from "./idle-nodes-running-hpa-minreplicas";
import { containerImageBloat } from "./container-image-bloat";
import { gitopsSyncFailsMissingCrd } from "./gitops-sync-fails-missing-crd";
import { federatedDeploymentOldVersion } from "./federated-deployment-old-version";
import { clusterNodeFailurePeakTraffic } from "./cluster-node-failure-peak-traffic";
import { persistentStorageContention } from "./persistent-storage-contention";
import { networkPolicyMisconfiguration } from "./network-policy-misconfiguration";
import { etcdCorruptionDuringUpgrade } from "./etcd-corruption-during-upgrade";
import { resourceExhaustionCpuThrottling } from "./resource-exhaustion-cpu-throttling";
import { certificateRotationFailures } from "./certificate-rotation-failures";
import { ingressControllerTimeoutIssues } from "./ingress-controller-timeout-issues";
import { namespaceQuotaExceeded } from "./namespace-quota-exceeded";
import { multiClusterServiceMeshIncompatibility } from "./multi-cluster-service-mesh-incompatibility";
import { costOptimizationIdleResources } from "./cost-optimization-idle-resources";
import { migratingMonolithToKubernetesAws } from "./migrating-monolith-to-kubernetes-aws";
import { secureMultiClusterArchitectureAws } from "./secure-multi-cluster-architecture-aws";
import { autoScalingSpikyWorkloads } from "./auto-scaling-spiky-workloads";
import { costOptimizationEks } from "./cost-optimization-eks";
import { disasterRecoveryMultiAzEks } from "./disaster-recovery-multi-az-eks";
import { interviewReadyArchitectureMigrationBlueprint } from "./interview-ready-architecture-migration-blueprint";
import { kubernetesArchitecture } from "./kubernetes-architecture"; // New import

export const scenarios: Scenario[] = [
  controlPlaneOutOfSync,
  nodePoolAutoscalingNeverRegisters,
  blueGreenDeploymentFails,
  crashloopbackoffConfigmapChange,
  podsCantReachExternalApis,
  istioMtlsBreaksLegacyApp,
  statefulsetPodsStuckPending,
  snapshotRestoreDataLoss,
  privilegedContainerEscaped,
  networkpolicyBreaksIntraNamespaceCommunication,
  highPodRestartRateOomkilled,
  latencySpikesHttpService,
  hpaNeverScalesOut,
  clusterRunsOutOfIps,
  etcdLostLatestSnapshot,
  applicationBackupDataLeakage,
  idleNodesRunningHpaMinreplicas,
  containerImageBloat,
  gitopsSyncFailsMissingCrd,
  federatedDeploymentOldVersion,
  clusterNodeFailurePeakTraffic,
  persistentStorageContention,
  networkPolicyMisconfiguration,
  etcdCorruptionDuringUpgrade,
  resourceExhaustionCpuThrottling,
  certificateRotationFailures,
  ingressControllerTimeoutIssues,
  namespaceQuotaExceeded,
  multiClusterServiceMeshIncompatibility,
  costOptimizationIdleResources,
  migratingMonolithToKubernetesAws,
  secureMultiClusterArchitectureAws,
  autoScalingSpikyWorkloads,
  costOptimizationEks,
  disasterRecoveryMultiAzEks,
  interviewReadyArchitectureMigrationBlueprint,
  kubernetesArchitecture, // New scenario added
];