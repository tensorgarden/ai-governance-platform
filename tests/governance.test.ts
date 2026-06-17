import { describe, it, expect } from "vitest";
import {
  demoPolicies,
  demoUsageEvents,
  demoComplianceReports,
  demoSafetyChecks,
  demoTeamAccess,
  demoMetrics,
} from "@/lib/demo-data";

describe("AI Governance Platform — demo data integrity", () => {
  it("has exactly 8 active policies", () => {
    expect(demoPolicies).toHaveLength(8);
    const activeCount = demoPolicies.filter(p => p.status === "active").length;
    expect(activeCount).toBe(8);
  });

  it("every policy has a valid category", () => {
    const validCategories = ["data_privacy", "model_usage", "output_review", "access_control", "audit", "bias_fairness", "agentic_autonomy"];
    for (const policy of demoPolicies) {
      expect(validCategories).toContain(policy.category);
    }
  });

  it("policy enforcement rates are between 0 and 100", () => {
    for (const policy of demoPolicies) {
      expect(policy.enforcementRate).toBeGreaterThanOrEqual(0);
      expect(policy.enforcementRate).toBeLessThanOrEqual(100);
    }
  });

  it("has exactly 25 usage events", () => {
    expect(demoUsageEvents).toHaveLength(25);
  });

  it("usage events reference valid policies", () => {
    const policyIds = new Set(demoPolicies.map(p => p.id));
    for (const event of demoUsageEvents) {
      expect(policyIds.has(event.policyId), `Event ${event.id} references unknown policy ${event.policyId}`).toBe(true);
    }
  });

  it("usage events have valid actions", () => {
    const validActions = ["allow", "flag", "block"];
    for (const event of demoUsageEvents) {
      expect(validActions).toContain(event.action);
    }
  });

  it("safety checks have valid statuses and check types", () => {
    const validStatuses = ["passed", "flagged", "blocked"];
    const validCheckTypes = ["prompt_injection", "pii_leak", "toxic_output", "hallucination", "data_exfiltration", "bias_detection", "agent_action"];
    for (const check of demoSafetyChecks) {
      expect(validStatuses).toContain(check.status);
      expect(validCheckTypes).toContain(check.checkType);
    }
  });

  it("team access entries have valid access levels", () => {
    const validLevels = ["full", "restricted", "none", "review"];
    for (const entry of demoTeamAccess) {
      for (const tool of entry.tools) {
        expect(validLevels).toContain(tool.accessLevel);
      }
    }
  });

  it("compliance reports have valid statuses", () => {
    const validStatuses = ["compliant", "at_risk", "non_compliant"];
    for (const report of demoComplianceReports) {
      expect(validStatuses).toContain(report.overallStatus);
    }
  });

  it("governance metrics are internally consistent", () => {
    expect(demoMetrics.usageEventsToday).toBe(demoUsageEvents.length);
    expect(demoMetrics.blockedEventsToday).toBe(demoUsageEvents.filter(e => e.action === "block").length);
    expect(demoMetrics.flaggedEventsToday).toBe(demoUsageEvents.filter(e => e.action === "flag").length);
    expect(demoMetrics.complianceScorePercent).toBeGreaterThanOrEqual(0);
    expect(demoMetrics.complianceScorePercent).toBeLessThanOrEqual(100);
    expect(demoMetrics.activePolicies).toBe(demoPolicies.filter(p => p.status === "active").length);
  });

  it("models shadow AI controls for unapproved AI tools and data egress", () => {
    const shadowPolicy = demoPolicies.find(policy => policy.name === "Shadow AI Detection");
    expect(shadowPolicy).toBeDefined();
    expect(shadowPolicy?.affectedTools).toEqual(expect.arrayContaining(["deepseek", "perplexity"]));

    const shadowEvents = demoUsageEvents.filter(event => event.policyName === "Shadow AI Detection");
    expect(shadowEvents.length).toBeGreaterThanOrEqual(2);
    expect(shadowEvents.some(event => event.action === "block")).toBe(true);
    expect(shadowEvents.every(event => /unsanctioned|unregistered|extension/i.test(event.reason))).toBe(true);
  });

  it("escalates blocked shadow AI attempts as data exfiltration safety checks", () => {
    const blockedShadowEvents = demoUsageEvents.filter(
      event => event.policyName === "Shadow AI Detection" && event.action === "block"
    );
    const exfiltrationChecks = demoSafetyChecks.filter(
      check => check.checkType === "data_exfiltration" && check.status === "blocked"
    );

    for (const event of blockedShadowEvents) {
      expect(
        exfiltrationChecks.some(check => check.userId === event.userId && check.toolName === event.toolName),
        `Blocked shadow AI event ${event.id} should have a blocked data exfiltration safety check`
      ).toBe(true);
    }
  });

  it("models agentic autonomy governance for autonomous AI agent actions", () => {
    const agentPolicy = demoPolicies.find(policy => policy.name === "Agentic Autonomy Governance");
    expect(agentPolicy).toBeDefined();
    expect(agentPolicy?.category).toBe("agentic_autonomy");
    expect(agentPolicy?.affectedTools).toEqual(expect.arrayContaining(["claude", "copilot"]));

    const agentEvents = demoUsageEvents.filter(event => event.policyName === "Agentic Autonomy Governance");
    expect(agentEvents.length).toBe(3);
    expect(agentEvents.some(event => event.action === "allow")).toBe(true);
    expect(agentEvents.some(event => event.action === "flag")).toBe(true);
    expect(agentEvents.some(event => event.action === "block")).toBe(true);

    const blockedAgentEvent = agentEvents.find(event => event.action === "block");
    expect(blockedAgentEvent?.reason).toMatch(/mutation|change control/i);
  });

  it("escalates high-risk agent actions as safety checks", () => {
    const agentChecks = demoSafetyChecks.filter(check => check.checkType === "agent_action");
    expect(agentChecks.length).toBe(3);

    const blockedAgentEvents = demoUsageEvents.filter(
      event => event.policyName === "Agentic Autonomy Governance" && event.action === "block"
    );
    const blockedAgentChecks = agentChecks.filter(check => check.status === "blocked");
    expect(blockedAgentChecks.length).toBe(1);
    expect(blockedAgentChecks[0].severity).toBe("critical");

    for (const event of blockedAgentEvents) {
      expect(
        blockedAgentChecks.some(check => check.userId === event.userId && check.toolName === event.toolName),
        `Blocked agent action event ${event.id} should have a blocked agent_action safety check`
      ).toBe(true);
    }
  });
});
