export type PolicyStatus = "active" | "warning" | "blocked";
export type EnforcementAction = "allow" | "flag" | "block";
export type Severity = "critical" | "high" | "medium" | "low";
export type ComplianceStatus = "compliant" | "at_risk" | "non_compliant";
export type AccessLevel = "full" | "restricted" | "none" | "review";
export type AIUseCaseRiskTier = "low" | "limited" | "high" | "prohibited";
export type GovernanceWorkflowStatus = "intake" | "risk_assessment" | "approved" | "monitoring" | "remediation";
export type GovernanceReviewerRole = "business_owner" | "technical_lead" | "legal" | "compliance" | "security" | "ethics";
export type MonitoringSignalStatus = "green" | "watch" | "breach";

export interface PostMarketMonitoringSignal {
  id: string;
  name: string;
  status: MonitoringSignalStatus;
  lastCheckedAt: string;
  threshold: string;
  observedValue: string;
  correctiveActionDue?: string;
  evidenceArtifactIds: string[];
}

export interface SeriousIncidentEscalationPlan {
  playbookOwner: string;
  marketAuthority: string;
  reportingWindowHours: number;
  acceleratedWindowHours?: number;
  lastDrillAt: string;
  evidenceArtifactIds: string[];
}

export type FundamentalRightsAssessmentStatus = "draft" | "current" | "needs_update";
export type FundamentalRightsAssessmentBasis = "public_body" | "public_service" | "creditworthiness" | "life_health_insurance" | "voluntary";

export interface FundamentalRightsImpactAssessment {
  status: FundamentalRightsAssessmentStatus;
  applicabilityBasis: FundamentalRightsAssessmentBasis;
  affectedGroups: string[];
  foreseeableHarms: string[];
  humanOversightMeasures: string;
  complaintMechanism: string;
  lastAssessedAt: string;
  updateTrigger: string;
  marketAuthorityNotifiedAt?: string;
  evidenceArtifactIds: string[];
}

export interface AIUseCaseOversightReview {
  lastReviewedAt: string;
  reviewCadenceDays: number;
  escalationOwner: string;
  openFindings: number;
  evidenceArtifactIds: string[];
  postMarketMonitoring: boolean;
  monitoringSignals: PostMarketMonitoringSignal[];
  fundamentalRightsAssessment?: FundamentalRightsImpactAssessment;
  seriousIncidentEscalation: SeriousIncidentEscalationPlan;
}

export interface AIUseCaseInventoryItem {
  id: string;
  name: string;
  businessOwner: string;
  technicalOwner: string;
  vendor: string;
  modelName: string;
  purpose: string;
  riskTier: AIUseCaseRiskTier;
  frameworks: string[];
  lastRiskAssessmentAt: string;
  nextReviewDue: string;
  humanOversightRequired: boolean;
  workflowStatus: GovernanceWorkflowStatus;
  reviewerRoles: GovernanceReviewerRole[];
  oversightReview: AIUseCaseOversightReview;
  linkedPolicyIds: string[];
}

export interface AIPolicy {
  id: string;
  name: string;
  description: string;
  category: "data_privacy" | "model_usage" | "output_review" | "access_control" | "audit" | "bias_fairness" | "agentic_autonomy" | "model_supply_chain";
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

export interface ComplianceEvidenceArtifact {
  id: string;
  framework: string;
  control: string;
  artifactType: "policy" | "audit_log" | "risk_assessment" | "review_record" | "training_record";
  owner: string;
  collectedAt: string;
  retention: string;
  status: "current" | "needs_review";
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
  evidenceArtifacts: ComplianceEvidenceArtifact[];
}

export interface SafetyCheck {
  id: string;
  timestamp: string;
  toolName: string;
  checkType: "prompt_injection" | "pii_leak" | "toxic_output" | "hallucination" | "data_exfiltration" | "bias_detection" | "agent_action" | "model_provenance";
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
