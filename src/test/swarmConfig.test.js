import { describe, it, expect } from 'vitest';
import {
  TOPOLOGIES,
  AGENT_TYPES,
  COORDINATION_STRATEGIES,
  MESSAGE_PROTOCOLS,
  getTopologyDescription,
  getAgentTypeInfo,
  getTopologyList,
} from '../renderer/lib/swarmConfig';

describe('TOPOLOGIES', () => {
  it('has exactly 6 topologies', () => {
    expect(Object.keys(TOPOLOGIES).length).toBe(6);
  });

  it('has all required topologies: hierarchical, mesh, ring, star, hybrid, adaptive', () => {
    expect(TOPOLOGIES).toHaveProperty('hierarchical');
    expect(TOPOLOGIES).toHaveProperty('mesh');
    expect(TOPOLOGIES).toHaveProperty('ring');
    expect(TOPOLOGIES).toHaveProperty('star');
    expect(TOPOLOGIES).toHaveProperty('hybrid');
    expect(TOPOLOGIES).toHaveProperty('adaptive');
  });

  describe('each topology structure', () => {
    const topologyIds = ['hierarchical', 'mesh', 'ring', 'star', 'hybrid', 'adaptive'];

    topologyIds.forEach((topologyId) => {
      it(`${topologyId} has name, icon, eli5, complex fields`, () => {
        const topology = TOPOLOGIES[topologyId];
        expect(topology).toHaveProperty('name');
        expect(topology).toHaveProperty('icon');
        expect(topology).toHaveProperty('eli5');
        expect(topology).toHaveProperty('complex');
        expect(typeof topology.name).toBe('string');
        expect(typeof topology.icon).toBe('string');
        expect(typeof topology.eli5).toBe('string');
        expect(typeof topology.complex).toBe('string');
      });
    });
  });

  it('hierarchical topology has correct name', () => {
    expect(TOPOLOGIES.hierarchical.name).toBe('Hierarchical');
  });

  it('mesh topology has correct name', () => {
    expect(TOPOLOGIES.mesh.name).toBe('Mesh');
  });

  it('ring topology has correct name', () => {
    expect(TOPOLOGIES.ring.name).toBe('Ring');
  });

  it('star topology has correct name', () => {
    expect(TOPOLOGIES.star.name).toBe('Star');
  });

  it('hybrid topology has correct name', () => {
    expect(TOPOLOGIES.hybrid.name).toBe('Hybrid');
  });

  it('adaptive topology has correct name', () => {
    expect(TOPOLOGIES.adaptive.name).toBe('Adaptive');
  });

  it('all topologies have icons', () => {
    Object.values(TOPOLOGIES).forEach((topology) => {
      expect(topology.icon).toBeTruthy();
      expect(topology.icon.length).toBeGreaterThan(0);
    });
  });
});

describe('AGENT_TYPES', () => {
  it('is an array with exactly 8 agent types', () => {
    expect(Array.isArray(AGENT_TYPES)).toBe(true);
    expect(AGENT_TYPES.length).toBe(8);
  });

  it('has all required agent types', () => {
    const agentIds = AGENT_TYPES.map((a) => a.id);
    expect(agentIds).toContain('coordinator');
    expect(agentIds).toContain('researcher');
    expect(agentIds).toContain('coder');
    expect(agentIds).toContain('analyst');
    expect(agentIds).toContain('architect');
    expect(agentIds).toContain('tester');
    expect(agentIds).toContain('reviewer');
    expect(agentIds).toContain('optimizer');
  });

  describe('each agent type structure', () => {
    it('each agent type has id, name, icon, eli5, complex, capabilities fields', () => {
      AGENT_TYPES.forEach((agent) => {
        expect(agent).toHaveProperty('id');
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('icon');
        expect(agent).toHaveProperty('eli5');
        expect(agent).toHaveProperty('complex');
        expect(agent).toHaveProperty('capabilities');
        expect(typeof agent.id).toBe('string');
        expect(typeof agent.name).toBe('string');
        expect(typeof agent.icon).toBe('string');
        expect(typeof agent.eli5).toBe('string');
        expect(typeof agent.complex).toBe('string');
        expect(Array.isArray(agent.capabilities)).toBe(true);
      });
    });

    it('each agent type has non-empty capabilities array', () => {
      AGENT_TYPES.forEach((agent) => {
        expect(agent.capabilities.length).toBeGreaterThan(0);
        agent.capabilities.forEach((capability) => {
          expect(typeof capability).toBe('string');
        });
      });
    });
  });

  it('coordinator has correct properties', () => {
    const coordinator = AGENT_TYPES.find((a) => a.id === 'coordinator');
    expect(coordinator.name).toBe('Coordinator');
    expect(coordinator.icon).toBeTruthy();
    expect(coordinator.capabilities).toContain('task-decomposition');
  });

  it('researcher has correct properties', () => {
    const researcher = AGENT_TYPES.find((a) => a.id === 'researcher');
    expect(researcher.name).toBe('Researcher');
    expect(researcher.icon).toBeTruthy();
    expect(researcher.capabilities).toContain('web-search');
  });

  it('coder has correct properties', () => {
    const coder = AGENT_TYPES.find((a) => a.id === 'coder');
    expect(coder.name).toBe('Coder');
    expect(coder.icon).toBeTruthy();
    expect(coder.capabilities).toContain('code-generation');
  });

  it('analyst has correct properties', () => {
    const analyst = AGENT_TYPES.find((a) => a.id === 'analyst');
    expect(analyst.name).toBe('Analyst');
    expect(analyst.icon).toBeTruthy();
    expect(analyst.capabilities).toContain('static-analysis');
  });

  it('architect has correct properties', () => {
    const architect = AGENT_TYPES.find((a) => a.id === 'architect');
    expect(architect.name).toBe('Architect');
    expect(architect.icon).toBeTruthy();
    expect(architect.capabilities).toContain('system-design');
  });

  it('tester has correct properties', () => {
    const tester = AGENT_TYPES.find((a) => a.id === 'tester');
    expect(tester.name).toBe('Tester');
    expect(tester.icon).toBeTruthy();
    expect(tester.capabilities).toContain('test-generation');
  });

  it('reviewer has correct properties', () => {
    const reviewer = AGENT_TYPES.find((a) => a.id === 'reviewer');
    expect(reviewer.name).toBe('Reviewer');
    expect(reviewer.icon).toBeTruthy();
    expect(reviewer.capabilities).toContain('code-review');
  });

  it('optimizer has correct properties', () => {
    const optimizer = AGENT_TYPES.find((a) => a.id === 'optimizer');
    expect(optimizer.name).toBe('Optimizer');
    expect(optimizer.icon).toBeTruthy();
    expect(optimizer.capabilities).toContain('profiling');
  });
});

describe('COORDINATION_STRATEGIES', () => {
  it('has exactly 3 coordination strategies', () => {
    expect(Object.keys(COORDINATION_STRATEGIES).length).toBe(3);
  });

  it('has all required strategies: centralized, distributed, consensus', () => {
    expect(COORDINATION_STRATEGIES).toHaveProperty('centralized');
    expect(COORDINATION_STRATEGIES).toHaveProperty('distributed');
    expect(COORDINATION_STRATEGIES).toHaveProperty('consensus');
  });

  describe('each strategy structure', () => {
    const strategyIds = ['centralized', 'distributed', 'consensus'];

    strategyIds.forEach((strategyId) => {
      it(`${strategyId} has name, eli5, complex fields`, () => {
        const strategy = COORDINATION_STRATEGIES[strategyId];
        expect(strategy).toHaveProperty('name');
        expect(strategy).toHaveProperty('eli5');
        expect(strategy).toHaveProperty('complex');
        expect(typeof strategy.name).toBe('string');
        expect(typeof strategy.eli5).toBe('string');
        expect(typeof strategy.complex).toBe('string');
      });
    });
  });

  it('centralized strategy has correct name', () => {
    expect(COORDINATION_STRATEGIES.centralized.name).toBe('Centralized');
  });

  it('distributed strategy has correct name', () => {
    expect(COORDINATION_STRATEGIES.distributed.name).toBe('Distributed');
  });

  it('consensus strategy has correct name', () => {
    expect(COORDINATION_STRATEGIES.consensus.name).toBe('Consensus');
  });
});

describe('MESSAGE_PROTOCOLS', () => {
  it('has exactly 3 message protocols', () => {
    expect(Object.keys(MESSAGE_PROTOCOLS).length).toBe(3);
  });

  it('has all required protocols: direct, broadcast, gossip', () => {
    expect(MESSAGE_PROTOCOLS).toHaveProperty('direct');
    expect(MESSAGE_PROTOCOLS).toHaveProperty('broadcast');
    expect(MESSAGE_PROTOCOLS).toHaveProperty('gossip');
  });

  describe('each protocol structure', () => {
    const protocolIds = ['direct', 'broadcast', 'gossip'];

    protocolIds.forEach((protocolId) => {
      it(`${protocolId} has name, eli5, complex fields`, () => {
        const protocol = MESSAGE_PROTOCOLS[protocolId];
        expect(protocol).toHaveProperty('name');
        expect(protocol).toHaveProperty('eli5');
        expect(protocol).toHaveProperty('complex');
        expect(typeof protocol.name).toBe('string');
        expect(typeof protocol.eli5).toBe('string');
        expect(typeof protocol.complex).toBe('string');
      });
    });
  });

  it('direct protocol has correct name', () => {
    expect(MESSAGE_PROTOCOLS.direct.name).toBe('Direct');
  });

  it('broadcast protocol has correct name', () => {
    expect(MESSAGE_PROTOCOLS.broadcast.name).toBe('Broadcast');
  });

  it('gossip protocol has correct name', () => {
    expect(MESSAGE_PROTOCOLS.gossip.name).toBe('Gossip');
  });
});

describe('getTopologyDescription', () => {
  it('returns eli5 description for hierarchical topology', () => {
    const desc = getTopologyDescription('hierarchical', 'eli5');
    expect(desc).toBe('One lead agent directs the others, like a team with a manager.');
  });

  it('returns complex description for hierarchical topology', () => {
    const desc = getTopologyDescription('hierarchical', 'complex');
    expect(desc).toContain('Tree-structured');
  });

  it('returns eli5 description for mesh topology', () => {
    const desc = getTopologyDescription('mesh', 'eli5');
    expect(desc).toContain('Every agent can talk to every other agent');
  });

  it('returns complex description for mesh topology', () => {
    const desc = getTopologyDescription('mesh', 'complex');
    expect(desc).toContain('Fully-connected');
  });

  it('returns eli5 description for ring topology', () => {
    const desc = getTopologyDescription('ring', 'eli5');
    expect(desc).toContain('circle');
  });

  it('returns complex description for ring topology', () => {
    const desc = getTopologyDescription('ring', 'complex');
    expect(desc).toContain('Circular');
  });

  it('returns eli5 description for star topology', () => {
    const desc = getTopologyDescription('star', 'eli5');
    expect(desc).toContain('central agent');
  });

  it('returns complex description for star topology', () => {
    const desc = getTopologyDescription('star', 'complex');
    expect(desc).toContain('Hub-and-spoke');
  });

  it('returns eli5 description for hybrid topology', () => {
    const desc = getTopologyDescription('hybrid', 'eli5');
    expect(desc).toContain('mix');
  });

  it('returns complex description for hybrid topology', () => {
    const desc = getTopologyDescription('hybrid', 'complex');
    expect(desc).toContain('Multi-pattern');
  });

  it('returns eli5 description for adaptive topology', () => {
    const desc = getTopologyDescription('adaptive', 'eli5');
    expect(desc).toContain('automatically picks');
  });

  it('returns complex description for adaptive topology', () => {
    const desc = getTopologyDescription('adaptive', 'complex');
    expect(desc).toContain('Self-organizing');
  });

  it('returns empty string for unknown topology', () => {
    const desc = getTopologyDescription('unknown-topology', 'eli5');
    expect(desc).toBe('');
  });

  it('returns empty string for unknown topology with complex mode', () => {
    const desc = getTopologyDescription('unknown-topology', 'complex');
    expect(desc).toBe('');
  });

  it('returns empty string for null topology', () => {
    const desc = getTopologyDescription(null, 'eli5');
    expect(desc).toBe('');
  });

  it('defaults to complex description when mode is undefined', () => {
    const desc = getTopologyDescription('hierarchical', undefined);
    expect(desc).toContain('Tree-structured');
  });
});

describe('getAgentTypeInfo', () => {
  it('returns coordinator agent info', () => {
    const info = getAgentTypeInfo('coordinator');
    expect(info).not.toBeNull();
    expect(info.name).toBe('Coordinator');
    expect(info.id).toBe('coordinator');
  });

  it('returns researcher agent info', () => {
    const info = getAgentTypeInfo('researcher');
    expect(info).not.toBeNull();
    expect(info.name).toBe('Researcher');
    expect(info.id).toBe('researcher');
  });

  it('returns coder agent info', () => {
    const info = getAgentTypeInfo('coder');
    expect(info).not.toBeNull();
    expect(info.name).toBe('Coder');
    expect(info.id).toBe('coder');
  });

  it('returns analyst agent info', () => {
    const info = getAgentTypeInfo('analyst');
    expect(info).not.toBeNull();
    expect(info.name).toBe('Analyst');
    expect(info.id).toBe('analyst');
  });

  it('returns architect agent info', () => {
    const info = getAgentTypeInfo('architect');
    expect(info).not.toBeNull();
    expect(info.name).toBe('Architect');
    expect(info.id).toBe('architect');
  });

  it('returns tester agent info', () => {
    const info = getAgentTypeInfo('tester');
    expect(info).not.toBeNull();
    expect(info.name).toBe('Tester');
    expect(info.id).toBe('tester');
  });

  it('returns reviewer agent info', () => {
    const info = getAgentTypeInfo('reviewer');
    expect(info).not.toBeNull();
    expect(info.name).toBe('Reviewer');
    expect(info.id).toBe('reviewer');
  });

  it('returns optimizer agent info', () => {
    const info = getAgentTypeInfo('optimizer');
    expect(info).not.toBeNull();
    expect(info.name).toBe('Optimizer');
    expect(info.id).toBe('optimizer');
  });

  it('returns null for unknown agent type', () => {
    const info = getAgentTypeInfo('unknown-agent');
    expect(info).toBeNull();
  });

  it('returns null for null agent type', () => {
    const info = getAgentTypeInfo(null);
    expect(info).toBeNull();
  });

  it('returns agent info with all required fields', () => {
    const info = getAgentTypeInfo('coder');
    expect(info).toHaveProperty('id');
    expect(info).toHaveProperty('name');
    expect(info).toHaveProperty('icon');
    expect(info).toHaveProperty('eli5');
    expect(info).toHaveProperty('complex');
    expect(info).toHaveProperty('capabilities');
    expect(Array.isArray(info.capabilities)).toBe(true);
  });
});

describe('getTopologyList', () => {
  it('returns array of all topologies', () => {
    const list = getTopologyList();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(6);
  });

  it('each topology in list has id and required fields', () => {
    const list = getTopologyList();
    list.forEach((topology) => {
      expect(topology).toHaveProperty('id');
      expect(topology).toHaveProperty('name');
      expect(topology).toHaveProperty('icon');
      expect(topology).toHaveProperty('eli5');
      expect(topology).toHaveProperty('complex');
    });
  });

  it('topology list contains all topology ids', () => {
    const list = getTopologyList();
    const ids = list.map((t) => t.id);
    expect(ids).toContain('hierarchical');
    expect(ids).toContain('mesh');
    expect(ids).toContain('ring');
    expect(ids).toContain('star');
    expect(ids).toContain('hybrid');
    expect(ids).toContain('adaptive');
  });

  it('topology list contains correct names', () => {
    const list = getTopologyList();
    const names = list.map((t) => t.name);
    expect(names).toContain('Hierarchical');
    expect(names).toContain('Mesh');
    expect(names).toContain('Ring');
    expect(names).toContain('Star');
    expect(names).toContain('Hybrid');
    expect(names).toContain('Adaptive');
  });

  it('each topology in list has non-empty icon', () => {
    const list = getTopologyList();
    list.forEach((topology) => {
      expect(topology.icon).toBeTruthy();
      expect(topology.icon.length).toBeGreaterThan(0);
    });
  });
});
