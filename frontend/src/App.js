import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000";
const STEPS = ["pending", "hearing", "closed"];
const STEP_LABELS = ["Filed", "Hearing", "Closed"];
const FILTERS = ["all", "pending", "hearing", "closed"];

const Logo = () => (
  <svg className="logo" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4v22M9 26h14M6 9h20" />
    <path d="M6 9l-3.5 8a3.5 3.5 0 0 0 7 0L6 9zM26 9l-3.5 8a3.5 3.5 0 0 0 7 0L26 9z" />
  </svg>
);

const Field = ({ label, children }) => (
  <label className="field">
    <span>{label}</span>
    {children}
  </label>
);

function App() {
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [cases, setCases] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [judgeName, setJudgeName] = useState("");
  const [lawyerName, setLawyerName] = useState("");
  const [hearingDate, setHearingDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (user) fetchCases();
  }, [user]);

  const notify = (text, type = "info") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Runs an async action with a busy flag and success/error toasts
  const act = async (fn, ok, fail) => {
    setBusy(true);
    try {
      await fn();
      if (ok) notify(ok, "success");
    } catch (error) {
      notify(error.response?.data?.message || fail, "error");
    } finally {
      setBusy(false);
    }
  };

  const fetchCases = async () => {
    try {
      const res = await axios.get(`${API}/cases`);
      setCases(res.data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  const handleRegister = () =>
    act(
      async () => {
        await axios.post(`${API}/auth/register`, { name, email, password, role });
        setMode("login");
        setName("");
        setEmail("");
        setPassword("");
        setRole("citizen");
      },
      "Account created. Please sign in.",
      "Registration failed"
    );

  const handleLogin = () =>
    act(
      async () => {
        const res = await axios.post(`${API}/auth/login`, { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        setEmail("");
        setPassword("");
      },
      null,
      "Login failed"
    );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCases([]);
  };

  const addCase = () => {
    if (!title.trim() || !description.trim()) {
      return notify("Please enter both a title and a description", "error");
    }
    act(
      async () => {
        await axios.post(`${API}/cases/add`, {
          title,
          description,
          createdBy: user.name,
          createdByRole: user.role,
        });
        setTitle("");
        setDescription("");
        await fetchCases();
      },
      "Case filed",
      "Could not file the case"
    );
  };

  const closeCase = (id) =>
    act(
      async () => {
        await axios.put(`${API}/cases/${id}`, { status: "closed" });
        await fetchCases();
      },
      "Case closed",
      "Could not close the case"
    );

  const assignCaseDetails = (id) => {
    if (!judgeName.trim() || !lawyerName.trim() || !hearingDate.trim()) {
      return notify("Enter judge, lawyer and hearing date", "error");
    }
    act(
      async () => {
        await axios.put(`${API}/cases/${id}`, {
          assignedJudge: judgeName,
          assignedLawyer: lawyerName,
          hearingDate,
          status: "hearing",
        });
        setJudgeName("");
        setLawyerName("");
        setHearingDate("");
        await fetchCases();
      },
      "Hearing scheduled",
      "Could not assign details"
    );
  };

  const uploadEvidence = (id) => {
    if (!selectedFile) return notify("Please choose a file first", "error");
    act(
      async () => {
        const formData = new FormData();
        formData.append("document", selectedFile);
        formData.append("uploadedBy", user.name);
        formData.append("uploadedByRole", user.role);
        await axios.put(`${API}/cases/${id}/upload-evidence`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSelectedFile(null);
        await fetchCases();
      },
      "Document uploaded",
      "Upload failed"
    );
  };

  const deleteEvidence = (caseId, index) =>
    act(
      async () => {
        await axios.delete(`${API}/cases/${caseId}/delete-evidence/${index}`);
        await fetchCases();
      },
      "Document removed",
      "Could not delete the file"
    );

  const toastEl = toast && (
    <div className={`toast ${toast.type}`} role="status">
      {toast.text}
    </div>
  );

  if (!user) {
    const isLogin = mode === "login";
    return (
      <>
        <main className="auth">
          <section className="auth-brand">
            <div className="brand-mark">
              <Logo />
              <span>E-Court</span>
            </div>
            <h1>
              Justice, <em>digitised.</em>
            </h1>
            <p>
              File cases, schedule hearings and keep evidence in one place, for
              citizens, lawyers, judges and administrators.
            </p>
            <ul>
              <li>Role-based access for four kinds of users</li>
              <li>Evidence attached to every case</li>
              <li>Clear status from filing to closure</li>
            </ul>
          </section>

          <section className="auth-panel">
            <form
              className="auth-card"
              onSubmit={(e) => {
                e.preventDefault();
                isLogin ? handleLogin() : handleRegister();
              }}
            >
              <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
              <p className="muted">
                {isLogin ? "Sign in to manage your cases." : "Choose your role to get started."}
              </p>

              <div className="tabs">
                <button type="button" className={isLogin ? "on" : ""} onClick={() => setMode("login")}>
                  Sign in
                </button>
                <button type="button" className={!isLogin ? "on" : ""} onClick={() => setMode("register")}>
                  Register
                </button>
              </div>

              {!isLogin && (
                <Field label="Full name">
                  <input type="text" placeholder="Priya Sharma" value={name} onChange={(e) => setName(e.target.value)} required />
                </Field>
              )}
              <Field label="Email">
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  placeholder={isLogin ? "Your password" : "At least 6 characters"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={isLogin ? undefined : 6}
                  required
                />
              </Field>
              {!isLogin && (
                <Field label="I am a">
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="citizen">Citizen</option>
                    <option value="lawyer">Lawyer</option>
                    <option value="judge">Judge</option>
                    <option value="admin">Admin</option>
                  </select>
                </Field>
              )}

              <button className="btn primary block" disabled={busy}>
                {busy ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
              </button>
            </form>
          </section>
        </main>
        {toastEl}
      </>
    );
  }

  const visibleCases = cases.filter((c) => {
    if (user.role === "admin") return true;
    if (user.role === "judge") return c.assignedJudge === user.name;
    if (user.role === "lawyer") return c.assignedLawyer === user.name;
    if (user.role === "citizen") return c.createdBy === user.name;
    return false;
  });
  const filteredCases = visibleCases.filter((c) => filter === "all" || c.status === filter);
  const count = (s) => visibleCases.filter((c) => c.status === s).length;
  const stats = [
    ["total", "Total cases", visibleCases.length],
    ["pending", "Pending", count("pending")],
    ["hearing", "In hearing", count("hearing")],
    ["closed", "Closed", count("closed")],
  ];

  const canFile = ["citizen", "lawyer", "admin"].includes(user.role);
  const canEvidence = user.role === "admin" || user.role === "lawyer";
  const canClose = user.role === "judge" || user.role === "admin";

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand-mark">
          <Logo />
          <div>
            <h1>E-Court</h1>
            <p className="muted">Welcome back, {user.name}</p>
          </div>
        </div>
        <div className="who">
          <span className="role-chip">{user.role}</span>
          <span className="avatar" aria-hidden="true">{user.name?.[0]?.toUpperCase()}</span>
          <button className="btn ghost" onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <section className="stats">
        {stats.map(([key, label, n]) => (
          <div key={key} className={`stat ${key}`}>
            <span className="stat-num">{n}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </section>

      <div className="grid">
        {canFile && (
          <section className="panel file-form">
            <h2>File a new case</h2>
            <Field label="Case title">
              <input type="text" placeholder="e.g. Property boundary dispute" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Description">
              <textarea rows={5} placeholder="Describe what happened and what you are asking the court to decide." value={description} onChange={(e) => setDescription(e.target.value)} />
            </Field>
            <button className="btn primary block" onClick={addCase} disabled={busy}>
              {busy ? "Submitting…" : "Submit case"}
            </button>
          </section>
        )}

        <section className={`panel ${canFile ? "" : "wide"}`}>
          <div className="list-head">
            <h2>Case records</h2>
            <div className="chips">
              {FILTERS.map((f) => (
                <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredCases.length === 0 ? (
            <div className="empty">
              <Logo />
              <p>{filter === "all" ? "No cases here yet" : `No ${filter} cases`}</p>
              <span>{canFile ? "File your first case using the form." : "Cases assigned to you will appear here."}</span>
            </div>
          ) : (
            filteredCases.map((c) => (
              <article key={c._id} className="case">
                <header className="case-head">
                  <div>
                    <h3>{c.title}</h3>
                    <p className="muted">{c.description}</p>
                  </div>
                  <span className={`badge ${c.status}`}>{c.status}</span>
                </header>

                <ol className="steps">
                  {STEPS.map((s, i) => (
                    <li key={s} className={i <= STEPS.indexOf(c.status) ? "done" : ""}>
                      {STEP_LABELS[i]}
                    </li>
                  ))}
                </ol>

                <dl className="meta">
                  <div><dt>Filed by</dt><dd>{c.createdBy || "Unknown"} · {c.createdByRole || "Unknown"}</dd></div>
                  <div><dt>Lawyer</dt><dd>{c.assignedLawyer || "Not assigned"}</dd></div>
                  <div><dt>Judge</dt><dd>{c.assignedJudge || "Not assigned"}</dd></div>
                  <div><dt>Hearing date</dt><dd>{c.hearingDate || "Not scheduled"}</dd></div>
                </dl>

                <div className="evidence">
                  <h4>Evidence and documents</h4>
                  {!c.evidence || c.evidence.length === 0 ? (
                    <p className="muted small">No documents added yet.</p>
                  ) : (
                    c.evidence.map((doc, index) => (
                      <div key={index} className="doc">
                        <div>
                          <a href={`${API}${doc.filePath}`} target="_blank" rel="noreferrer">{doc.fileName}</a>
                          <p className="muted small">Uploaded by {doc.uploadedBy} ({doc.uploadedByRole})</p>
                        </div>
                        {canEvidence && (
                          <button className="btn danger sm" onClick={() => deleteEvidence(c._id, index)} disabled={busy}>
                            Delete
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {(canEvidence || canClose) && (
                  <footer className="actions">
                    {user.role === "admin" && c.status !== "closed" && (
                      <div className="action-row">
                        <input aria-label="Assign lawyer" placeholder="Lawyer name" value={lawyerName} onChange={(e) => setLawyerName(e.target.value)} />
                        <input aria-label="Assign judge" placeholder="Judge name" value={judgeName} onChange={(e) => setJudgeName(e.target.value)} />
                        <input aria-label="Hearing date" type="date" value={hearingDate} onChange={(e) => setHearingDate(e.target.value)} />
                        <button className="btn ghost sm" onClick={() => assignCaseDetails(c._id)} disabled={busy}>Assign</button>
                      </div>
                    )}
                    {canEvidence && (
                      <div className="action-row">
                        <input type="file" aria-label="Choose a document" onChange={(e) => setSelectedFile(e.target.files[0])} />
                        <button className="btn ghost sm" onClick={() => uploadEvidence(c._id)} disabled={busy}>Upload document</button>
                      </div>
                    )}
                    {canClose && c.status !== "closed" && (
                      <button className="btn primary sm" onClick={() => closeCase(c._id)} disabled={busy}>Close case</button>
                    )}
                  </footer>
                )}
              </article>
            ))
          )}
        </section>
      </div>
      {toastEl}
    </div>
  );
}

export default App;