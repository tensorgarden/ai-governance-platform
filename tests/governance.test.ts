import { describe, it, expect } from "vitest";
import {
  demoPolicies,
  demoUsageEvents,
  demoComplianceReports,
  demoSafetyChecks,
  demoTeamAccess,
  demoUseCaseInventory,
  demoMetrics,
} from "@/lib/demo-data";

describe("AI Governance Platform — demo data integrity", () => {
  it("has exactly 9 active policies", () => {
    expect(demoPolicies).toHaveLength(9);
    const activeCount = demoPolicies.filter(p => p.status === "active").length;
    expect(activeCount).toBe(9);
  });

  it("every policy has a valid category", () => {
    const validCategories = ["data_privacy", "model_usage", "output_review", "access_control", "audit", "bias_fairness", "agentic_autonomy", "model_supply_chain"];
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

  it("has exactly 28 usage events", () => {
    expect(demoUsageEvents).toHaveLength(28);
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
    const validCheckTypes = ["prompt_injection", "pii_leak", "toxic_output", "hallucination", "data_exfiltration", "bias_detection", "agent_action", "model_provenance"];
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

  it("models supply chain integrity for third-party and open-source AI models", () => {
    const supplyChainPolicy = demoPolicies.find(policy => policy.name === "Model Supply Chain Integrity");
    expect(supplyChainPolicy).toBeDefined();
    expect(supplyChainPolicy?.category).toBe("model_supply_chain");
    expect(supplyChainPolicy?.owner).toBe("AI Safety Board");
    expect(supplyChainPolicy?.affectedTools).toEqual(expect.arrayContaining(["deepseek", "gemini"]));

    const supplyChainEvents = demoUsageEvents.filter(event => event.policyName === "Model Supply Chain Integrity");
    expect(supplyChainEvents.length).toBe(3);
    expect(supplyChainEvents.some(event => event.action === "allow")).toBe(true);
    expect(supplyChainEvents.some(event => event.action === "flag")).toBe(true);
    expect(supplyChainEvents.some(event => event.action === "block")).toBe(true);

    const blockedEvent = supplyChainEvents.find(event => event.action === "block");
    expect(blockedEvent?.reason).toMatch(/unregistered|supply chain registry/i);
  });

  it("escalates supply chain violations as model provenance safety checks", () => {
    const provenanceChecks = demoSafetyChecks.filter(check => check.checkType === "model_provenance");
    expect(provenanceChecks.length).toBe(2);

    const passedCheck = provenanceChecks.find(check => check.status === "passed");
    expect(passedCheck).toBeDefined();
    expect(passedCheck?.severity).toBe("low");
    expect(passedCheck?.detail).toMatch(/vendor registry|CVSS/i);

    const blockedCheck = provenanceChecks.find(check => check.status === "blocked");
    expect(blockedCheck).toBeDefined();
    expect(blockedCheck?.severity).toBe("critical");
    expect(blockedCheck?.detail).toMatch(/unregistered|supply chain registry/i);

    const blockedSupplyChainEvent = demoUsageEvents.find(
      event => event.policyName === "Model Supply Chain Integrity" && event.action === "block"
    );
    expect(blockedSupplyChainEvent).toBeDefined();
    expect(
      provenanceChecks.some(check =>
        check.status === "blocked" &&
        check.userId === blockedSupplyChainEvent!.userId &&
        check.toolName === blockedSupplyChainEvent!.toolName
      )
    ).toBe(true);
  });

  it("links compliance reports to current evidence artifacts mapped to declared frameworks", () => {
    for (const report of demoComplianceReports) {
      expect(report.evidenceArtifacts.length, `${report.id} should include compliance evidence`).toBeGreaterThanOrEqual(2);

      for (const artifact of report.evidenceArtifacts) {
        expect(report.frameworks).toContain(artifact.framework);
        expect(artifact.control.length).toBeGreaterThan(20);
        expect(artifact.owner.length).toBeGreaterThan(0);
        expect(new Date(artifact.collectedAt).toString()).not.toBe("Invalid Date");
        expect(["current", "needs_review"]).toContain(artifact.status);
      }
    }
  });


  it("tracks AI governance at the use-case level with vendor-specific risk context", () => {
    expect(demoUseCaseInventory.length).toBeGreaterThanOrEqual(4);
    const policyIds = new Set(demoPolicies.map(policy => policy.id));

    for (const useCase of demoUseCaseInventory) {
      expect(useCase.vendor.length).toBeGreaterThan(0);
      expect(useCase.modelName.length).toBeGreaterThan(0);
      expect(useCase.frameworks.length).toBeGreaterThan(0);
      expect(new Date(useCase.lastRiskAssessmentAt).toString()).not.toBe("Invalid Date");
      expect(new Date(useCase.nextReviewDue).getTime()).toBeGreaterThan(new Date(useCase.lastRiskAssessmentAt).getTime());
      expect(useCase.reviewerRoles.length).toBeGreaterThanOrEqual(2);
      expect(useCase.linkedPolicyIds.every(policyId => policyIds.has(policyId))).toBe(true);
    }

    const riskTiersByModel = new Map<string, Set<string>>();
    for (const useCase of demoUseCaseInventory) {
      const tiers = riskTiersByModel.get(useCase.modelName) ?? new Set<string>();
      tiers.add(useCase.riskTier);
      riskTiersByModel.set(useCase.modelName, tiers);
    }
    expect([...riskTiersByModel.values()].some(tiers => tiers.size > 1)).toBe(true);
  });

  it("requires human oversight and cross-functional review for high-risk AI use cases", () => {
    const highRiskUseCases = demoUseCaseInventory.filter(useCase => useCase.riskTier === "high");
    expect(highRiskUseCases.length).toBeGreaterThanOrEqual(2);

    for (const useCase of highRiskUseCases) {
      expect(useCase.humanOversightRequired).toBe(true);
      expect(useCase.workflowStatus).not.toBe("intake");
      expect(useCase.reviewerRoles).toEqual(expect.arrayContaining(["business_owner", "legal", "compliance"]));
      expect(useCase.linkedPolicyIds.length).toBeGreaterThanOrEqual(2);
      expect(useCase.frameworks.some(framework => /EU AI Act|NIST AI RMF|ISO 42001/.test(framework))).toBe(true);
    }
  });

  it("attaches oversight review records to every AI use case", () => {
    const artifactIds = new Set(demoComplianceReports.flatMap(report => report.evidenceArtifacts.map(artifact => artifact.id)));

    for (const useCase of demoUseCaseInventory) {
      const review = useCase.oversightReview;
      expect(new Date(review.lastReviewedAt).toString()).not.toBe("Invalid Date");
      expect(review.reviewCadenceDays).toBeGreaterThan(0);
      expect(review.escalationOwner.length).toBeGreaterThan(5);
      expect(review.openFindings).toBeGreaterThanOrEqual(0);
      expect(review.evidenceArtifactIds.length).toBeGreaterThanOrEqual(1);
      expect(review.evidenceArtifactIds.every(artifactId => artifactIds.has(artifactId))).toBe(true);
    }
  });

  it("tracks post-market monitoring signals with evidence and corrective due dates", () => {
    const artifactIds = new Set(demoComplianceReports.flatMap(report => report.evidenceArtifacts.map(artifact => artifact.id)));
    const highRiskUseCases = demoUseCaseInventory.filter(useCase => useCase.riskTier === "high");

    for (const useCase of demoUseCaseInventory) {
      const signals = useCase.oversightReview.monitoringSignals;
      expect(signals.length).toBeGreaterThanOrEqual(useCase.riskTier === "high" ? 2 : 1);

      for (const signal of signals) {
        expect(["green", "watch", "breach"]).toContain(signal.status);
        expect(signal.threshold.length).toBeGreaterThan(10);
        expect(signal.observedValue.length).toBeGreaterThan(5);
        expect(new Date(signal.lastCheckedAt).toString()).not.toBe("Invalid Date");
        expect(signal.evidenceArtifactIds.every(artifactId => artifactIds.has(artifactId))).toBe(true);

        if (signal.status !== "green") {
          expect(signal.correctiveActionDue).toBeDefined();
          expect(new Date(signal.correctiveActionDue!).getTime()).toBeGreaterThan(new Date(signal.lastCheckedAt).getTime());
        }
      }
    }

    for (const useCase of highRiskUseCases) {
      expect(useCase.oversightReview.postMarketMonitoring).toBe(true);
      expect(useCase.oversightReview.monitoringSignals.some(signal => signal.status === "watch" || signal.status === "breach")).toBe(true);
    }
  });

  it("keeps high-risk AI use cases on post-market human oversight cadence", () => {
    const highRiskUseCases = demoUseCaseInventory.filter(useCase => useCase.riskTier === "high");
    expect(highRiskUseCases.length).toBeGreaterThanOrEqual(2);

    for (const useCase of highRiskUseCases) {
      const review = useCase.oversightReview;
      const lastReviewedAt = new Date(review.lastReviewedAt).getTime();
      const nextReviewDue = new Date(useCase.nextReviewDue).getTime();
      const daysUntilNextReview = (nextReviewDue - lastReviewedAt) / (24 * 60 * 60 * 1000);

      expect(review.postMarketMonitoring).toBe(true);
      expect(review.reviewCadenceDays).toBeLessThanOrEqual(30);
      expect(review.evidenceArtifactIds.length).toBeGreaterThanOrEqual(2);
      expect(daysUntilNextReview).toBeGreaterThan(0);
      expect(daysUntilNextReview).toBeLessThanOrEqual(review.reviewCadenceDays + 1);
      expect(useCase.humanOversightRequired).toBe(true);
    }
  });


});
