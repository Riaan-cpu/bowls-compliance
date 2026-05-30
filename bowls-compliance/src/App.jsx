import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const modules = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "licences", label: "Licences", icon: "📜" },
  { id: "cipc", label: "CIPC", icon: "🏛️" },
  { id: "governance", label: "Governance", icon: "⚖️" },
  { id: "risk", label: "Risk Register", icon: "⚠️" },
  { id: "documents", label: "Documents", icon: "📁" },
];

const statusColor = (status) => {
  if (status === "Compliant") return "#16a34a";
  if (status === "Due Soon") return "#d97706";
  if (status === "Overdue") return "#dc2626";
  return "#6b7280";
};

const impactColor = (v) => {
  if (v === "Critical") return "#7c3aed";
  if (v === "High") return "#dc2626";
  if (v === "Medium") return "#d97706";
  return "#16a34a";
};

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      <div style={{ fontSize: 32, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function PageHeader({ title, subtitle, onAdd }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>{title}</h1>
        <p style={{ color: "#64748b" }}>{subtitle}</p>
      </div>
      {onAdd && <button onClick={onAdd} style={{ padding: "10px 20px", background: "#1e3a5f", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>+ Add Item</button>}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data states
  const [complianceItems, setComplianceItems] = useState([]);
  const [licences, setLicences] = useState([]);
  const [cipc, setCipc] = useState([]);
  const [governance, setGovernance] = useState([]);
  const [risks, setRisks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [complianceForm, setComplianceForm] = useState({ name: "", due_date: "", status: "Compliant", owner: "" });
  const [licenceForm, setLicenceForm] = useState({ name: "", licence_number: "", issued_date: "", expiry_date: "", status: "Compliant", authority: "" });
  const [govForm, setGovForm] = useState({ name: "", frequency: "", last_done: "", next_due: "", status: "Compliant" });
  const [riskForm, setRiskForm] = useState({ risk: "", category: "", likelihood: "Low", impact: "Low", mitigation: "" });

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    const [c, l, ci, g, r, d] = await Promise.all([
      supabase.from("compliance_items").select("*").order("due_date"),
      supabase.from("licences").select("*").order("expiry_date"),
      supabase.from("cipc").select("*"),
      supabase.from("governance").select("*").order("next_due"),
      supabase.from("risk_register").select("*"),
      supabase.from("documents").select("*").order("file_date"),
    ]);
    if (!c.error) setComplianceItems(c.data);
    if (!l.error) setLicences(l.data);
    if (!ci.error) setCipc(ci.data);
    if (!g.error) setGovernance(g.data);
    if (!r.error) setRisks(r.data);
    if (!d.error) setDocuments(d.data);
    setLoading(false);
  }

  async function deleteRow(table, id, refresh) {
    await supabase.from(table).delete().eq("id", id);
    refresh();
  }

  async function addCompliance() {
    setSaving(true);
    await supabase.from("compliance_items").insert([complianceForm]);
    setComplianceForm({ name: "", due_date: "", status: "Compliant", owner: "" });
    setShowForm(false); setSaving(false); fetchAll();
  }

  async function addLicence() {
    setSaving(true);
    await supabase.from("licences").insert([licenceForm]);
    setLicenceForm({ name: "", licence_number: "", issued_date: "", expiry_date: "", status: "Compliant", authority: "" });
    setShowForm(false); setSaving(false); fetchAll();
  }

  async function addGovernance() {
    setSaving(true);
    await supabase.from("governance").insert([govForm]);
    setGovForm({ name: "", frequency: "", last_done: "", next_due: "", status: "Compliant" });
    setShowForm(false); setSaving(false); fetchAll();
  }

  async function addRisk() {
    setSaving(true);
    await supabase.from("risk_register").insert([riskForm]);
    setRiskForm({ risk: "", category: "", likelihood: "Low", impact: "Low", mitigation: "" });
    setShowForm(false); setSaving(false); fetchAll();
  }

  const counts = {
    total: complianceItems.length,
    compliant: complianceItems.filter(i => i.status === "Compliant").length,
    dueSoon: complianceItems.filter(i => i.status === "Due Soon").length,
    overdue: complianceItems.filter(i => i.status === "Overdue").length,
  };

  const inputStyle = { padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14 };
  const selectStyle = { ...inputStyle };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Segoe UI, sans-serif", background: "#f1f5f9" }}>
      <div style={{ width: sidebarOpen ? 220 : 60, background: "#1e3a5f", color: "white", transition: "width 0.2s", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #2d5080", display: "flex", alignItems: "center", gap: 10 }}>
          {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>Bowls Club<br />Compliance</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ marginLeft: "auto", background: "none", border: "none", color: "white", fontSize: 18, cursor: "pointer" }}>☰</button>
        </div>
        {modules.map((m) => (
          <div key={m.id} onClick={() => { setActive(m.id); setShowForm(false); }}
            style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              background: active === m.id ? "#2d5080" : "transparent",
              borderLeft: active === m.id ? "3px solid #60a5fa" : "3px solid transparent" }}>
            <span style={{ fontSize: 18 }}>{m.icon}</span>
            {sidebarOpen && <span style={{ fontSize: 14 }}>{m.label}</span>}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 32 }}>

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div>
            <PageHeader title="Compliance Dashboard" subtitle="Live overview of all club compliance obligations"
              onAdd={() => setShowForm(!showForm)} />
            {showForm && (
              <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ marginBottom: 16, color: "#1e3a5f" }}>New Compliance Item</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <input placeholder="Obligation name" value={complianceForm.name} onChange={e => setComplianceForm({...complianceForm, name: e.target.value})} style={inputStyle} />
                  <input type="date" value={complianceForm.due_date} onChange={e => setComplianceForm({...complianceForm, due_date: e.target.value})} style={inputStyle} />
                  <select value={complianceForm.status} onChange={e => setComplianceForm({...complianceForm, status: e.target.value})} style={selectStyle}>
                    <option>Compliant</option><option>Due Soon</option><option>Overdue</option>
                  </select>
                  <input placeholder="Owner" value={complianceForm.owner} onChange={e => setComplianceForm({...complianceForm, owner: e.target.value})} style={inputStyle} />
                </div>
                <button onClick={addCompliance} disabled={saving} style={{ padding: "8px 24px", background: "#16a34a", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                  {saving ? "Saving..." : "Save Item"}
                </button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              <StatCard label="Total Items" value={counts.total} color="#1e3a5f" />
              <StatCard label="Compliant" value={counts.compliant} color="#16a34a" />
              <StatCard label="Due Soon" value={counts.dueSoon} color="#d97706" />
              <StatCard label="Overdue" value={counts.overdue} color="#dc2626" />
            </div>
            <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#1e3a5f" }}>All Compliance Items</div>
              {loading ? <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading...</div> : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr style={{ background: "#f8fafc" }}>
                    {["Obligation", "Due Date", "Status", "Owner", ""].map(h => <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {complianceItems.map(item => (
                      <tr key={item.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px 20px", fontWeight: 500 }}>{item.name}</td>
                        <td style={{ padding: "14px 20px", color: "#64748b" }}>{item.due_date}</td>
                        <td style={{ padding: "14px 20px" }}><span style={{ background: statusColor(item.status) + "20", color: statusColor(item.status), padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.status}</span></td>
                        <td style={{ padding: "14px 20px", color: "#64748b" }}>{item.owner}</td>
                        <td style={{ padding: "14px 20px" }}><button onClick={() => deleteRow("compliance_items", item.id, fetchAll)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 16 }}>🗑️</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* LICENCES */}
        {active === "licences" && (
          <div>
            <PageHeader title="Licence Tracker" subtitle="Monitor all club licence renewals and statuses" onAdd={() => setShowForm(!showForm)} />
            {showForm && (
              <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ marginBottom: 16, color: "#1e3a5f" }}>New Licence</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <input placeholder="Licence name" value={licenceForm.name} onChange={e => setLicenceForm({...licenceForm, name: e.target.value})} style={inputStyle} />
                  <input placeholder="Licence number" value={licenceForm.licence_number} onChange={e => setLicenceForm({...licenceForm, licence_number: e.target.value})} style={inputStyle} />
                  <input placeholder="Authority" value={licenceForm.authority} onChange={e => setLicenceForm({...licenceForm, authority: e.target.value})} style={inputStyle} />
                  <input type="date" placeholder="Issued date" value={licenceForm.issued_date} onChange={e => setLicenceForm({...licenceForm, issued_date: e.target.value})} style={inputStyle} />
                  <input type="date" placeholder="Expiry date" value={licenceForm.expiry_date} onChange={e => setLicenceForm({...licenceForm, expiry_date: e.target.value})} style={inputStyle} />
                  <select value={licenceForm.status} onChange={e => setLicenceForm({...licenceForm, status: e.target.value})} style={selectStyle}>
                    <option>Compliant</option><option>Due Soon</option><option>Overdue</option>
                  </select>
                </div>
                <button onClick={addLicence} disabled={saving} style={{ padding: "8px 24px", background: "#16a34a", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                  {saving ? "Saving..." : "Save Licence"}
                </button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {licences.map(lic => (
                <div key={lic.id} style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{lic.name}</span>
                    <span style={{ background: statusColor(lic.status) + "20", color: statusColor(lic.status), padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{lic.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 2 }}>
                    <div><b>Licence No:</b> {lic.licence_number}</div>
                    <div><b>Issued:</b> {lic.issued_date}</div>
                    <div><b>Expires:</b> {lic.expiry_date}</div>
                    <div><b>Authority:</b> {lic.authority}</div>
                  </div>
                  <button onClick={() => deleteRow("licences", lic.id, fetchAll)} style={{ marginTop: 16, width: "100%", padding: "8px 0", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CIPC */}
        {active === "cipc" && (
          <div>
            <PageHeader title="CIPC Management" subtitle="Track annual return filings and company registration status" />
            {cipc.map(c => (
              <div key={c.id} style={{ background: "white", borderRadius: 12, padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", maxWidth: 600 }}>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 2.2 }}>
                  {[["Entity Name", c.entity_name], ["Registration No.", c.registration_number], ["Entity Type", c.entity_type], ["Last Annual Return", c.last_return], ["Next Due Date", c.next_due], ["Status", c.status]].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 8, marginBottom: 8 }}>
                      <span><b>{label}</b></span>
                      {label === "Status" ? <span style={{ background: statusColor(value) + "20", color: statusColor(value), padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{value}</span> : <span style={{ color: value === c.next_due && c.status === "Overdue" ? "#dc2626" : "inherit", fontWeight: value === c.next_due && c.status === "Overdue" ? 600 : 400 }}>{value}</span>}
                    </div>
                  ))}
                </div>
                <button style={{ marginTop: 24, padding: "10px 24px", background: "#1e3a5f", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>File Annual Return →</button>
              </div>
            ))}
          </div>
        )}

        {/* GOVERNANCE */}
        {active === "governance" && (
          <div>
            <PageHeader title="Governance Obligations" subtitle="Track board and committee governance requirements" onAdd={() => setShowForm(!showForm)} />
            {showForm && (
              <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ marginBottom: 16, color: "#1e3a5f" }}>New Governance Item</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <input placeholder="Obligation" value={govForm.name} onChange={e => setGovForm({...govForm, name: e.target.value})} style={inputStyle} />
                  <input placeholder="Frequency" value={govForm.frequency} onChange={e => setGovForm({...govForm, frequency: e.target.value})} style={inputStyle} />
                  <input type="date" value={govForm.last_done} onChange={e => setGovForm({...govForm, last_done: e.target.value})} style={inputStyle} />
                  <input type="date" value={govForm.next_due} onChange={e => setGovForm({...govForm, next_due: e.target.value})} style={inputStyle} />
                  <select value={govForm.status} onChange={e => setGovForm({...govForm, status: e.target.value})} style={selectStyle}>
                    <option>Compliant</option><option>Due Soon</option><option>Overdue</option>
                  </select>
                </div>
                <button onClick={addGovernance} disabled={saving} style={{ padding: "8px 24px", background: "#16a34a", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                  {saving ? "Saving..." : "Save Item"}
                </button>
              </div>
            )}
            <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#f8fafc" }}>
                  {["Obligation", "Frequency", "Last Done", "Next Due", "Status", ""].map(h => <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {governance.map(item => (
                    <tr key={item.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "14px 20px", fontWeight: 500 }}>{item.name}</td>
                      <td style={{ padding: "14px 20px", color: "#64748b" }}>{item.frequency}</td>
                      <td style={{ padding: "14px 20px", color: "#64748b" }}>{item.last_done}</td>
                      <td style={{ padding: "14px 20px", color: "#64748b" }}>{item.next_due}</td>
                      <td style={{ padding: "14px 20px" }}><span style={{ background: statusColor(item.status) + "20", color: statusColor(item.status), padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.status}</span></td>
                      <td style={{ padding: "14px 20px" }}><button onClick={() => deleteRow("governance", item.id, fetchAll)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 16 }}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RISK REGISTER */}
        {active === "risk" && (
          <div>
            <PageHeader title="Risk Register" subtitle="Identify and track compliance risks before they escalate" onAdd={() => setShowForm(!showForm)} />
            {showForm && (
              <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ marginBottom: 16, color: "#1e3a5f" }}>New Risk</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 2fr", gap: 12, marginBottom: 16 }}>
                  <input placeholder="Risk" value={riskForm.risk} onChange={e => setRiskForm({...riskForm, risk: e.target.value})} style={inputStyle} />
                  <input placeholder="Category" value={riskForm.category} onChange={e => setRiskForm({...riskForm, category: e.target.value})} style={inputStyle} />
                  <select value={riskForm.likelihood} onChange={e => setRiskForm({...riskForm, likelihood: e.target.value})} style={selectStyle}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                  <select value={riskForm.impact} onChange={e => setRiskForm({...riskForm, impact: e.target.value})} style={selectStyle}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                  </select>
                  <input placeholder="Mitigation" value={riskForm.mitigation} onChange={e => setRiskForm({...riskForm, mitigation: e.target.value})} style={inputStyle} />
                </div>
                <button onClick={addRisk} disabled={saving} style={{ padding: "8px 24px", background: "#16a34a", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                  {saving ? "Saving..." : "Save Risk"}
                </button>
              </div>
            )}
            <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#f8fafc" }}>
                  {["Risk", "Category", "Likelihood", "Impact", "Mitigation", ""].map(h => <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {risks.map(r => (
                    <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "14px 20px", fontWeight: 500 }}>{r.risk}</td>
                      <td style={{ padding: "14px 20px", color: "#64748b" }}>{r.category}</td>
                      <td style={{ padding: "14px 20px" }}><span style={{ color: impactColor(r.likelihood), fontWeight: 600 }}>{r.likelihood}</span></td>
                      <td style={{ padding: "14px 20px" }}><span style={{ color: impactColor(r.impact), fontWeight: 600 }}>{r.impact}</span></td>
                      <td style={{ padding: "14px 20px", color: "#64748b", fontSize: 13 }}>{r.mitigation}</td>
                      <td style={{ padding: "14px 20px" }}><button onClick={() => deleteRow("risk_register", r.id, fetchAll)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 16 }}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {active === "documents" && (
          <div>
            <PageHeader title="Document Repository" subtitle="Centralized storage for all compliance documents" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {documents.map(doc => (
                <div key={doc.id} style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 32 }}>📄</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{doc.type} · {doc.file_date} · {doc.size}</div>
                  <button onClick={() => deleteRow("documents", doc.id, fetchAll)} style={{ marginTop: 8, padding: "6px 0", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}