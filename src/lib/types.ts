export type PolicyStatus = "active" | "warning" | "blocked";
export type EnforcementAction = "allow" | "flag" | "block";
export type Severity = "critical" | "high" | "medium" | "low";
export type ComplianceStatus = "compliant" | "at_risk" | "non_compliant";
export type AccessLevel = "full" | "restricted" | "none" | "review";

export interface AIPolicy {
  id: string;
  name: string;
  description: string;
  category: "data_privacy" | "model_usage" | "output_review" | "access_control" | "audit" | "bias_fairness" | "agentic_autonomy";
  status: PolicyStatus;
  enforcementRate: number;
  violationsLast30d: number;
  lastUpdated: string;
  owner: string;
  affectedTools: string[];
}

export interface UsageEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  toolName: string;
  action: EnforcementAction;
  policyId: string;
  policyName: string;
  inputSummary: string;
  reason: string;
  department: string;
}

export interface ComplianceReport {
  id: string;
  title: string;
  generatedAt: string;
  period: string;
  overallStatus: ComplianceStatus;
  findingsCount: number;
  resolvedCount: number;
  criticalCount: number;
  frameworks: string[];
  summary: string;
}

export interface SafetyCheck {
  id: string;
  timestamp: string;
  toolName: string;
  checkType: "prompt_injection" | "pii_leak" | "toxic_output" | "hallucination" | "data_exfiltration" | "bias_detection" | "agent_action";
  severity: Severity;
  status: "passed" | "flagged" | "blocked";
  detail: string;
  userId: string;
}

export interface TeamAccess {
  userId: string;
  userName: string;
  role: string;
  department: string;
  tools: {
    toolName: string;
    accessLevel: AccessLevel;
    reason: string;
    lastReviewed: string;
  }[];
}

export interface GovernanceMetrics {
  totalPolicies: number;
  activePolicies: number;
  usageEventsToday: number;
  blockedEventsToday: number;
  flaggedEventsToday: number;
  violationsThisMonth: number;
  complianceScorePercent: number;
  safetyChecksRun: number;
  safetyAlertsToday: number;
  teamsWithAccess: number;
  toolsMonitored: number;
}
