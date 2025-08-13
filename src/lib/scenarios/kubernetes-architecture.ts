import { Scenario } from "../types";

export const kubernetesArchitecture: Scenario = {
  slug: "kubernetes-architecture",
  title: "Kubernetes Architecture Overview",
  category: "Core Kubernetes Concepts",
  content: `
**Scenario**: Understanding the fundamental components and their interactions within a Kubernetes cluster.

**Kubernetes Architecture Diagram**:
![Kubernetes Architecture Diagram](/images/kubernetes-architecture.svg)

**Key Components**:

### 1. Control Plane (Master Node)
The Control Plane manages the worker nodes and the Pods in the cluster. It's responsible for maintaining the desired state of the cluster.

*   **Kube-APIServer**: The front end for the Kubernetes control plane. It exposes the Kubernetes API. All communication between components goes through the API server.
*   **etcd**: A consistent and highly available key-value store used as Kubernetes' backing store for all cluster data.
*   **Kube-Scheduler**: Watches for newly created Pods with no assigned node, and selects a node for them to run on.
*   **Kube-Controller-Manager**: Runs controller processes. These controllers watch the shared state of the cluster through the API server and make changes attempting to move the current state towards the desired state. Examples include Node Controller, Job Controller, EndpointSlice Controller, ServiceAccount Controller.
*   **Cloud Controller Manager (Optional)**: Integrates with the underlying cloud provider to manage cloud resources (e.g., load balancers, persistent volumes, node lifecycle).

### 2. Worker Nodes (Minions)
Worker nodes run the actual applications (workloads) in the form of Pods.

*   **Kubelet**: An agent that runs on each node in the cluster. It ensures that containers are running in a Pod.
*   **Kube-Proxy**: A network proxy that runs on each node. It maintains network rules on nodes, allowing network communication to your Pods from inside or outside of the cluster.
*   **Container Runtime**: The software that is responsible for running containers (e.g., containerd, CRI-O, Docker).

### 3. Core Objects
These are the building blocks you interact with to deploy and manage applications.

*   **Pods**: The smallest deployable units of computing that you can create and manage in Kubernetes. A Pod represents a single instance of a running process in your cluster.
*   **Deployments**: A higher-level abstraction that manages a set of identical Pods. It ensures that a specified number of Pod replicas are running at any given time and handles rolling updates and rollbacks.
*   **Services**: An abstract way to expose an application running on a set of Pods as a network service. Services enable loose coupling between dependent Pods.
*   **Volumes**: A directory, possibly with some data in it, which is accessible to the containers in a Pod. Kubernetes Volumes have a lifetime as long as the Pod that encloses them.
*   **Namespaces**: A way to divide cluster resources among multiple users or teams. They provide a scope for names.
`,
};