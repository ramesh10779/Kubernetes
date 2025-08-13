import { Scenario } from "../types";

import { controlPlaneOutOfSync } from "./control-plane-out-of-sync.js";
import { nodePoolAutoscalingNeverRegisters } from "./node-pool-autoscaling-never-registers.js";
import { blueGreenDeploymentFails } from "./blue-green-deployment-fails.js";
import { crashloopbackoffConfigmapChange } from "./crashloopbackoff-configmap-change.js";
import { podsCantReachExternalApis } from "./pods-cant-reach-external-apis.js";
import { istioMtlsBreaksLegacyApp } from "./istio-mtls-breaks-legacy-app.js";
import { statefulsetPodsStuckPending } from "./statefulset-pods-stuck-pending.js";
import { snapshotRestoreDataLoss } from "./snapshot-restore-data-loss.js";
import { privilegedContainerEscaped } from "./privileged-container-escaped.js";
import { networkpolicyBreaksIntraNamespaceCommunication } from "./networkpolicy-breaks-intra-namespace-communication.js";
import { highPodRestartRateOomkilled } from "./high-pod-restart-rate-oomkilled.js";
import { latencySpikesHttpService } from "./latency-spikes-http-service.js";
import { hpaNeverScalesOut } from "./hpa-never-scales-out.js";
import { clusterRunsOutOfIps } from "./cluster-runs-out-of-ips.js";
import { etcdLostLatestSnapshot } from "./etcd-lost-latest-snapshot.js";
import { applicationBackupDataLeakage } from "./application-backup-data-leakage.js";
import { idleNodesRunningHpaMinreplicas } from "./idle-nodes-running-hpa-minreplicas.js";
import { containerImageBloat } from "./container-image-bloat.js";
import { gitopsSyncFailsMissingCrd } from "./gitops-sync-fails-missing-crd.js";
import { federatedDeploymentOldVersion } from "./federated-deployment-old-version.js";
import { clusterNodeFailurePeakTraffic } from "./cluster-node-failure-peak-traffic.js";
import { persistentStorageContention } from "./persistent-storage-contention.js";
import { networkPolicyMisconfiguration } from "./network-policy-misconfiguration.js";
import { etcdCorruptionDuringUpgrade } from "./etcd-corruption-during-upgrade.js";
import { resourceExhaustionCpuThrottling } from "./resource-exhaustion-cpu-throttling.js";
import { certificateRotationFailures } from "./certificate-rotation-failures.js";
import { ingressControllerTimeoutIssues } from "./ingress-controller-timeout-issues.js";
import { namespaceQuotaExceeded } from "./namespace-quota-exceeded.js";
import { multiClusterServiceMeshIncompatibility } from "./multi-cluster-service-mesh-incompatibility.js";
import { costOptimizationIdleResources } from "./cost-optimization-idle-resources.js";
import { migratingMonolithToKubernetesAws } from "./migrating-monolith-to-kubernetes-aws.js";
import { secureMultiClusterArchitectureAws } from "./secure-multi-cluster-architecture-aws.js";
import { autoScalingSpikyWorkloads } from "./auto-scaling-spiky-workloads.js";
import { costOptimizationEks } from "./cost-optimization-eks.js";
import { disasterRecoveryMultiAzEks } from "./disaster-recovery-multi-az-eks.js";
import { interviewReadyArchitectureMigrationBlueprint } from "./interview-ready-architecture-migration-blueprint.js";

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
];