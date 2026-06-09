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
  it("has exactly 6 active policies", () => {
    expect(demoPolicies).toHaveLength(6);
    const activeCount = demoPolicies.filter(p => p.status === "active").length;
    expect(activeCount).toBe(6);
  });

  it("every policy has a valid category", () => {
    const validCategories = ["data_privacy", "model_usage", "output_review", "access_control", "audit", "bias_fairness"];
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

  it("has exactly 20 usage events", () => {
    expect(demoUsageEvents).toHaveLength(20);
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
    const validCheckTypes = ["prompt_injection", "pii_leak", "toxic_output", "hallucination", "data_exfiltration", "bias_detection"];
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
});
