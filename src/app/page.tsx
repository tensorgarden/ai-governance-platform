import { demoPolicies, demoUsageEvents, demoComplianceReports, demoSafetyChecks, demoTeamAccess, demoUseCaseInventory, demoMetrics } from "@/lib/demo-data";
import type { AIPolicy, UsageEvent, ComplianceReport, SafetyCheck, TeamAccess, AIUseCaseInventoryItem } from "@/lib/types";

// --- Reusable components ---

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "red" | "amber" | "blue" | "purple" }) {
  const tones: Record<string, string> = {
    slate: "border-slate-200 bg-white text-slate-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    red: "border-red-200 bg-red-50 text-red-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    purple: "border-indigo-200 bg-indigo-50 text-indigo-700",
  };
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone] || tones.slate}`}>{children}</span>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur ${className}`}>{children}</section>;
}

function ProgressBar({ value, color = "indigo" }: { value: number; color?: string }) {
  const colors: Record<string, string> = { indigo: "bg-indigo-600", emerald: "bg-emerald-600", amber: "bg-amber-500", red: "bg-red-500" };
  return <div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${colors[color] || colors.indigo}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = { active: "bg-emerald-400", warning: "bg-amber-400", blocked: "bg-red-400", compliant: "bg-emerald-400", at_risk: "bg-amber-400", non_compliant: "bg-red-400" };
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${map[status] || "bg-slate-400"}`} />;
}

function StatCard({ label, value, tone = "slate" }: { label: string; value: string; tone?: string }) {
  const borders: Record<string, string> = { slate: "border-l-slate-300", green: "border-l-emerald-300", amber: "border-l-amber-300", red: "border-l-red-300", blue: "border-l-blue-300" };
  return (
    <div className={`rounded-2xl bg-white/90 p-5 shadow-sm border-l-4 ${borders[tone] || borders.slate}`}>
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

// --- Policy table ---

function PolicyRow({ policy }: { policy: AIPolicy }) {
  const categoryBadge: Record<string, "blue" | "purple" | "amber" | "slate" | "green" | "red"> = {
    data_privacy: "blue", model_usage: "purple", output_review: "amber",
    access_control: "slate", audit: "green", bias_fairness: "red",
  };
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2"><StatusDot status={policy.status} /><span className="font-semibold text-slate-900">{policy.name}</span></div>
        <div className="text-xs text-slate-500 ml-6">{policy.owner}</div>
      </td>
      <td className="py-3 px-4"><Badge tone={categoryBadge[policy.category] || "slate"}>{policy.category.replace(/_/g, " ")}</Badge></td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800">{policy.enforcementRate}%</span>
          <ProgressBar value={policy.enforcementRate} color={policy.enforcementRate >= 95 ? "emerald" : policy.enforcementRate >= 85 ? "amber" : "red"} />
        </div>
      </td>
      <td className="py-3 px-4"><span className="text-sm font-semibold text-slate-800">{policy.violationsLast30d}</span><span className="text-xs text-slate-400"> /30d</span></td>
      <td className="py-3 px-4 text-xs text-slate-500">{new Date(policy.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
    </tr>
  );
}

function PolicyTable() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Active Policies</h2>
        <Badge tone="green">{demoPolicies.filter(p => p.status === "active").length} active</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b-2 border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500"><th className="py-2 px-4">Policy</th><th className="py-2 px-4">Category</th><th className="py-2 px-4">Enforcement</th><th className="py-2 px-4">Violations</th><th className="py-2 px-4">Updated</th></tr></thead>
          <tbody>{demoPolicies.map(p => <PolicyRow key={p.id} policy={p} />)}</tbody>
        </table>
      </div>
    </Card>
  );
}

// --- Usage event feed ---

function UsageEventRow({ event }: { event: UsageEvent }) {
  const actionBadge: Record<string, "green" | "amber" | "red"> = { allow: "green", flag: "amber", block: "red" };
  return (
    <div className="flex gap-3 items-start py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-lg mt-0.5">{event.action === "block" ? "🚫" : event.action === "flag" ? "⚠️" : "✅"}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <span className="font-semibold text-sm text-slate-900 truncate">{event.userName}</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
            <Badge tone={actionBadge[event.action]}>{event.action}</Badge>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-0.5">{event.inputSummary}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-400">{event.toolName} · {event.policyName}</span>
        </div>
        <p className="text-xs text-slate-400 italic mt-0.5">{event.reason}</p>
      </div>
    </div>
  );
}

function UsageEventFeed() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Live Usage Feed</h2>
        <div className="flex gap-2">
          <Badge tone="green">{demoUsageEvents.filter(e => e.action === "allow").length} allowed</Badge>
          <Badge tone="amber">{demoUsageEvents.filter(e => e.action === "flag").length} flagged</Badge>
          <Badge tone="red">{demoUsageEvents.filter(e => e.action === "block").length} blocked</Badge>
        </div>
      </div>
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {demoUsageEvents.map(e => <UsageEventRow key={e.id} event={e} />)}
      </div>
    </Card>
  );
}

// --- Compliance report preview ---

function ComplianceReportCard({ report }: { report: ComplianceReport }) {
  const statusTone: Record<string, "green" | "amber" | "red"> = { compliant: "green", at_risk: "amber", non_compliant: "red" };
  return (
    <div className="rounded-xl border border-slate-100 bg-white/80 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-sm text-slate-900">{report.title}</span>
        <Badge tone={statusTone[report.overallStatus]}>{report.overallStatus.replace(/_/g, " ")}</Badge>
      </div>
      <p className="text-xs text-slate-600 mb-3">{report.summary}</p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div><div className="text-lg font-bold text-slate-800">{report.findingsCount}</div><div className="text-xs text-slate-400">findings</div></div>
        <div><div className="text-lg font-bold text-emerald-600">{report.resolvedCount}</div><div className="text-xs text-slate-400">resolved</div></div>
        <div><div className={`text-lg font-bold ${report.criticalCount > 0 ? "text-red-600" : "text-slate-800"}`}>{report.criticalCount}</div><div className="text-xs text-slate-400">critical</div></div>
      </div>
      <div className="flex flex-wrap gap-1 mt-3">
        {report.frameworks.map(f => <Badge key={f} tone="blue">{f}</Badge>)}
      </div>
      <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Evidence trail</span>
          <span>{report.evidenceArtifacts.length} artifacts</span>
        </div>
        <div className="space-y-2">
          {report.evidenceArtifacts.slice(0, 2).map(artifact => (
            <div key={artifact.id} className="rounded-md bg-white p-2 text-xs text-slate-600 shadow-sm">
              <div className="font-semibold text-slate-800">{artifact.framework} · {artifact.control}</div>
              <div className="mt-0.5 text-slate-400">{artifact.artifactType.replace(/_/g, " ")} · {artifact.owner} · {artifact.status.replace(/_/g, " ")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComplianceSection() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Compliance Reports</h2>
        <Badge tone="blue">{demoComplianceReports.length} reports</Badge>
      </div>
      <div className="space-y-4">
        {demoComplianceReports.map(r => <ComplianceReportCard key={r.id} report={r} />)}
      </div>
    </Card>
  );
}

// --- Safety check log ---

function SafetyCheckRow({ check }: { check: SafetyCheck }) {
  const typeLabels: Record<string, string> = {
    prompt_injection: "Prompt Injection", pii_leak: "PII Leak", toxic_output: "Toxic Output",
    hallucination: "Hallucination", data_exfiltration: "Data Exfiltration", bias_detection: "Bias Detection",
  };
  const statusIcon: Record<string, string> = { passed: "✅", flagged: "⚠️", blocked: "🚫" };
  const severityTone: Record<string, "red" | "amber" | "blue" | "slate"> = { critical: "red", high: "amber", medium: "blue", low: "slate" };
  return (
    <div className="flex gap-3 items-start py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm mt-0.5">{statusIcon[check.status]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <span className="font-semibold text-xs text-slate-900">{typeLabels[check.checkType] || check.checkType}</span>
          <Badge tone={severityTone[check.severity]}>{check.severity}</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{check.detail}</p>
        <div className="text-xs text-slate-400 mt-0.5">{check.toolName} · {new Date(check.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
      </div>
    </div>
  );
}

function SafetySection() {
  const blocked = demoSafetyChecks.filter(c => c.status === "blocked").length;
  const flagged = demoSafetyChecks.filter(c => c.status === "flagged").length;
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Safety Checks</h2>
        <div className="flex gap-2">
          <Badge tone="red">{blocked} blocked</Badge>
          <Badge tone="amber">{flagged} flagged</Badge>
        </div>
      </div>
      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {[...demoSafetyChecks].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(c => <SafetyCheckRow key={c.id} check={c} />)}
      </div>
    </Card>
  );
}

// --- Team access matrix ---

function TeamAccessRow({ access }: { access: TeamAccess }) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <td className="py-3 px-4">
        <div className="font-semibold text-sm text-slate-900">{access.userName}</div>
        <div className="text-xs text-slate-500">{access.role} · {access.department}</div>
      </td>
      {access.tools.map(t => {
        const levelTone: Record<string, "green" | "amber" | "slate" | "purple"> = { full: "green", restricted: "amber", none: "slate", review: "purple" };
        return (
          <td key={t.toolName} className="py-3 px-3 text-center">
            <Badge tone={levelTone[t.accessLevel]}>{t.accessLevel}</Badge>
          </td>
        );
      })}
    </tr>
  );
}

function TeamAccessMatrix() {
  const tools = ["chatgpt", "claude", "copilot", "gemini"];
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Team Access Matrix</h2>
        <Badge tone="blue">{demoTeamAccess.length} teams</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b-2 border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500"><th className="py-2 px-4">User / Role</th>{tools.map(t => <th key={t} className="py-2 px-3 text-center">{t}</th>)}</tr></thead>
          <tbody>{demoTeamAccess.map(a => <TeamAccessRow key={a.userId} access={a} />)}</tbody>
        </table>
      </div>
    </Card>
  );
}

// --- Compliance score gauge ---

function ComplianceGauge({ score }: { score: number }) {
  const color = score >= 90 ? "text-emerald-600" : score >= 70 ? "text-amber-600" : "text-red-600";
  return (
    <Card className="text-center">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Compliance Score</h2>
      <div className={`text-5xl font-extrabold ${color}`}>{score}%</div>
      <ProgressBar value={score} color={score >= 90 ? "emerald" : "amber"} />
      <p className="text-xs text-slate-500 mt-3">Across all active frameworks</p>
    </Card>
  );
}


// --- High-risk use-case oversight ---

function UseCaseOversightCard({ useCase }: { useCase: AIUseCaseInventoryItem }) {
  const riskTone: Record<string, "green" | "blue" | "amber" | "red"> = { low: "green", limited: "blue", high: "amber", prohibited: "red" };
  const signalTone: Record<string, "green" | "amber" | "red" | "slate"> = { green: "green", watch: "amber", breach: "red" };
  return (
    <div className="rounded-xl border border-slate-100 bg-white/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-sm text-slate-900">{useCase.name}</div>
          <div className="text-xs text-slate-500">{useCase.businessOwner} · {useCase.vendor}</div>
        </div>
        <Badge tone={riskTone[useCase.riskTier] || "slate"}>{useCase.riskTier} risk</Badge>
      </div>
      <p className="mt-2 text-xs text-slate-600">{useCase.purpose}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="font-semibold text-slate-800">Last human review</div>
          <div className="text-slate-500">{new Date(useCase.oversightReview.lastReviewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="font-semibold text-slate-800">Evidence artifacts</div>
          <div className="text-slate-500">{useCase.oversightReview.evidenceArtifactIds.length} linked</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone={useCase.oversightReview.postMarketMonitoring ? "green" : "slate"}>post-market monitoring</Badge>
        <Badge tone={useCase.oversightReview.openFindings === 0 ? "green" : "amber"}>{useCase.oversightReview.openFindings} open findings</Badge>
      </div>
      <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50/70 p-3 text-xs">
        <div className="font-semibold uppercase tracking-wide text-amber-700">Incident reporting readiness</div>
        <div className="mt-1 text-slate-700">
          {Math.round(useCase.oversightReview.seriousIncidentEscalation.reportingWindowHours / 24)} day reporting window · {useCase.oversightReview.seriousIncidentEscalation.marketAuthority}
        </div>
        <div className="mt-1 text-slate-500">
          Last drill {new Date(useCase.oversightReview.seriousIncidentEscalation.lastDrillAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {useCase.oversightReview.seriousIncidentEscalation.playbookOwner}
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-slate-50 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monitoring signals</div>
        <div className="mt-2 space-y-2">
          {useCase.oversightReview.monitoringSignals.slice(0, 2).map(signal => (
            <div key={signal.id} className="flex items-start justify-between gap-2 text-xs">
              <div>
                <div className="font-semibold text-slate-800">{signal.name}</div>
                <div className="text-slate-500">{signal.observedValue}</div>
              </div>
              <Badge tone={signalTone[signal.status] || "slate"}>{signal.status}</Badge>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-400">Escalation: {useCase.oversightReview.escalationOwner}</div>
    </div>
  );
}

function UseCaseOversightSection() {
  const highRiskUseCases = demoUseCaseInventory.filter(useCase => useCase.riskTier === "high");
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">High-Risk Use Case Oversight</h2>
        <Badge tone="amber">{highRiskUseCases.length} high-risk</Badge>
      </div>
      <div className="space-y-3">
        {highRiskUseCases.map(useCase => <UseCaseOversightCard key={useCase.id} useCase={useCase} />)}
      </div>
    </Card>
  );
}

// --- Main page ---

export default function Home() {
  const m = demoMetrics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 px-6 py-8 font-sans text-slate-900 antialiased">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">AI Governance Platform</h1>
        <p className="mt-1 text-sm text-slate-500">Policy enforcement · usage monitoring · compliance reporting · safety controls · enterprise AI adoption</p>
      </header>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Policies Active" value={String(m.activePolicies)} tone="blue" />
        <StatCard label="Events Today" value={String(m.usageEventsToday)} tone="slate" />
        <StatCard label="Blocked" value={String(m.blockedEventsToday)} tone="red" />
        <StatCard label="Flagged" value={String(m.flaggedEventsToday)} tone="amber" />
        <StatCard label="Violations /mo" value={String(m.violationsThisMonth)} tone="red" />
        <StatCard label="Safety Alerts" value={String(m.safetyAlertsToday)} tone="amber" />
      </div>

      {/* Two-column layout: main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PolicyTable />
          <UsageEventFeed />
          <TeamAccessMatrix />
        </div>
        <div className="space-y-6">
          <ComplianceGauge score={m.complianceScorePercent} />
          <UseCaseOversightSection />
          <ComplianceSection />
          <SafetySection />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-400">
        AI Governance Platform · Portfolio demonstration · All data is fictional · No production keys or network calls
      </footer>
    </div>
  );
}
