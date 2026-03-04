// Swarm configuration data for Agent Teams section

export const TOPOLOGIES = {
  hierarchical: {
    name: 'Hierarchical',
    icon: '🏗️',
    eli5: 'One lead agent directs the others, like a team with a manager.',
    complex: 'Tree-structured topology with a root coordinator delegating to specialist sub-agents. Best for well-defined, decomposable tasks.',
  },
  mesh: {
    name: 'Mesh',
    icon: '🕸️',
    eli5: 'Every agent can talk to every other agent directly.',
    complex: 'Fully-connected peer-to-peer topology. All agents communicate directly. High flexibility but O(n^2) message complexity.',
  },
  ring: {
    name: 'Ring',
    icon: '🔄',
    eli5: 'Agents pass work around in a circle, each adding their part.',
    complex: 'Circular token-passing topology. Sequential processing pipeline with O(n) message complexity. Good for staged workflows.',
  },
  star: {
    name: 'Star',
    icon: '⭐',
    eli5: 'One central agent coordinates all the others.',
    complex: 'Hub-and-spoke topology with a central coordinator. Low latency coordination but single point of failure.',
  },
  hybrid: {
    name: 'Hybrid',
    icon: '🔀',
    eli5: 'A mix of different patterns - adapts to the task at hand.',
    complex: 'Multi-pattern topology combining hierarchical teams with peer-to-peer sub-clusters. Optimized for heterogeneous workloads.',
  },
  adaptive: {
    name: 'Adaptive',
    icon: '🧬',
    eli5: 'The system automatically picks the best pattern for each task.',
    complex: 'Self-organizing topology that dynamically reconfigures based on task characteristics, agent performance, and resource constraints.',
  },
};

export const AGENT_TYPES = [
  {
    id: 'coordinator',
    name: 'Coordinator',
    icon: '👑',
    eli5: 'The boss agent that assigns and manages tasks.',
    complex: 'Task orchestration agent responsible for decomposition, assignment, and progress tracking.',
    capabilities: ['task-decomposition', 'delegation', 'progress-tracking'],
  },
  {
    id: 'researcher',
    name: 'Researcher',
    icon: '🔍',
    eli5: 'An agent that searches and gathers information.',
    complex: 'Information retrieval agent specialized in codebase exploration, web search, and knowledge synthesis.',
    capabilities: ['web-search', 'code-search', 'knowledge-synthesis'],
  },
  {
    id: 'coder',
    name: 'Coder',
    icon: '💻',
    eli5: 'An agent that writes and modifies code.',
    complex: 'Implementation agent focused on code generation, refactoring, and feature development.',
    capabilities: ['code-generation', 'refactoring', 'implementation'],
  },
  {
    id: 'analyst',
    name: 'Analyst',
    icon: '📊',
    eli5: 'An agent that analyzes code quality and finds issues.',
    complex: 'Code analysis agent for static analysis, complexity metrics, and pattern detection.',
    capabilities: ['static-analysis', 'metrics', 'pattern-detection'],
  },
  {
    id: 'architect',
    name: 'Architect',
    icon: '🏛️',
    eli5: 'An agent that designs system structure and makes big decisions.',
    complex: 'Architecture agent for system design, component relationships, and technical decision-making.',
    capabilities: ['system-design', 'api-design', 'architecture-review'],
  },
  {
    id: 'tester',
    name: 'Tester',
    icon: '🧪',
    eli5: 'An agent that writes and runs tests.',
    complex: 'Testing agent for test generation, execution, coverage analysis, and regression detection.',
    capabilities: ['test-generation', 'test-execution', 'coverage-analysis'],
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    icon: '👀',
    eli5: 'An agent that reviews code for quality and correctness.',
    complex: 'Code review agent for quality assessment, best practice enforcement, and security auditing.',
    capabilities: ['code-review', 'security-audit', 'best-practices'],
  },
  {
    id: 'optimizer',
    name: 'Optimizer',
    icon: '⚡',
    eli5: 'An agent that makes code faster and more efficient.',
    complex: 'Performance optimization agent for profiling, bottleneck identification, and algorithmic improvement.',
    capabilities: ['profiling', 'optimization', 'benchmarking'],
  },
];

export const COORDINATION_STRATEGIES = {
  centralized: {
    name: 'Centralized',
    eli5: 'One coordinator makes all the decisions.',
    complex: 'Single coordinator assigns tasks and collects results. Low overhead, deterministic ordering.',
  },
  distributed: {
    name: 'Distributed',
    eli5: 'Agents figure out task assignment among themselves.',
    complex: 'Peer-to-peer task claiming with work-stealing. Higher resilience but potential contention.',
  },
  consensus: {
    name: 'Consensus',
    eli5: 'Agents vote on decisions together.',
    complex: 'Quorum-based decision making using Raft-like consensus. Strongest consistency guarantees.',
  },
};

export const MESSAGE_PROTOCOLS = {
  direct: {
    name: 'Direct',
    eli5: 'Agents send messages one-on-one.',
    complex: 'Point-to-point messaging. O(1) per message. Best for targeted communication.',
  },
  broadcast: {
    name: 'Broadcast',
    eli5: 'Every message goes to all agents at once.',
    complex: 'All-to-all messaging. O(n) per message. Best for state synchronization.',
  },
  gossip: {
    name: 'Gossip',
    eli5: 'Messages spread gradually through the network.',
    complex: 'Probabilistic dissemination protocol. O(log n) convergence. Best for large swarms.',
  },
};

export function getTopologyDescription(topologyId, mode) {
  const topology = TOPOLOGIES[topologyId];
  if (!topology) return '';
  return mode === 'eli5' ? topology.eli5 : topology.complex;
}

export function getAgentTypeInfo(typeId) {
  return AGENT_TYPES.find(a => a.id === typeId) || null;
}

export function getTopologyList() {
  return Object.entries(TOPOLOGIES).map(([id, t]) => ({ id, ...t }));
}
