export type Project = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  problem: string;
  approach: string[];
  stack: string[];
  /** skill names (from skills.ts) lit up on hover */
  skills: string[];
  proof: { label: string; href: string }[];
  /** GitHub "owner/name" for live metadata. Omit when the repository is private. */
  repo?: string;
  /** Featured systems get a wide card with headline numbers at the top of the Projects section. */
  featured?: boolean;
  /** One line on what the work is (course, paper, team size) and where the owner fits. */
  role?: string;
  /** Headline numbers, shown big on the card and the case study. Only figures stated in the source material. */
  metrics?: { value: string; label: string }[];
  /** Short pipeline shown as a row of steps on the case study. */
  flow?: string[];
  /** What was measured and what it showed, including negative results. */
  results?: string[];
  /** Honest limits of the work. */
  limits?: string[];
  /** Shown instead of a link when the source is not public. */
  note?: string;
};

export const projects: Project[] = [
  {
    slug: "freight-exception-copilot",
    featured: true,
    title: "Freight Exception Copilot — AI-assisted customs & demurrage platform",
    kicker: "Agentic platform · Logistics · Evaluation-first",
    summary:
      "An AI-assisted platform that investigates held containers and disputed freight charges, computes duty and demurrage in tested code, and executes only human-approved fixes through audited, idempotent writes.",
    role: "Personal project · private repository",
    problem:
      "When a container is held at a port, a coordinator pieces together PDFs, carrier messages, terminal pages, customs status and ERP records by hand while demurrage accrues every day. The human is the integration layer. An AI tool that guesses at duties, invents tariff codes or double-submits a payment is worse than none, so the hard part is not the model: it is deciding what the model may and may not do.",
    approach: [
      "One rule runs through the design: AI reads and proposes, code computes and checks, humans approve. Duty, MPF, HMF and demurrage are computed by tested Python with Decimal from effective-dated rate tables; a missing rate stops the calculation instead of letting a model fill it in.",
      "Five layers: sense (carrier and terminal events), understand (document extraction that keeps a pointer to where each value came from), decide (reconcile documents against rules, retrieve tariff knowledge, propose a fix with evidence), act (only after approval, through MCP tools), verify (re-read the external state and write a tamper-evident audit record).",
      "Durable case workflows on Temporal with LangGraph for reasoning inside a step. Writes need an approval bound to the payload hash plus an idempotency key, so a retry can never pay a fee twice. Postgres with pgvector is the system of record; every action lands in a hash-chained audit log; a React UI shows the queue, evidence and approvals.",
      "Every AI part had to beat a simple baseline before it stayed in: tariff classification and document extraction were each measured against a non-LLM alternative, and the weaker option was dropped.",
    ],
    stack: ["Python", "Temporal", "LangGraph", "MCP", "PostgreSQL / pgvector", "FastAPI", "React", "Docker", "GitHub Actions CI"],
    skills: ["AI Agents", "LangGraph", "MCP", "RAG", "PostgreSQL", "FastAPI", "Docker", "Evaluation", "Pydantic"],
    flow: ["Sense", "Understand", "Decide", "Human approval", "Act (idempotent)", "Verify + audit"],
    metrics: [
      { value: "18/83", label: "BM25 top-3 accuracy at 10 digits vs 8/83 for an LLM tree navigator" },
      { value: "0.987", label: "local vision model vs 0.882 for Tesseract on 2,570 fields" },
      { value: "0", label: "unauthorised writes across 365 prompt-injection tests" },
      { value: "2,600+", label: "automated tests, CI on every commit" },
    ],
    results: [
      "Tariff classification: compared 4 methods on 83 public CBP rulings. BM25 reached 18/83 top-3 accuracy at the full 10-digit code against 8/83 for an LLM tree navigator, so BM25 shipped, paired with a rule-based legal-note check.",
      "Document extraction: a local vision model (qwen3-vl:4b) scored 0.987 normalised accuracy against 0.882 for Tesseract on 2,570 fields from 494 pages. Its self-reported confidence was unusable, so it was replaced with OCR-disagreement routing, which caught 32 of 33 planted errors at similar review cost.",
      "Safety, checked in CI: 0 duplicate writes with the worker killed at 3 different points of a case, and 0 unauthorised writes across 365 prompt-injection tests.",
      "Engineering: 2,600+ automated tests with CI on every commit; money maths covered by tests against effective-dated rates.",
    ],
    limits: [
      "Built on synthetic and public data only; no live carrier, terminal or customs connections. Integrations are tested against stand-ins built from published specifications, and a real pilot would start read-only.",
      "It prepares customs actions for a licensed broker; it does not file anything itself.",
    ],
    proof: [],
    note: "Source is a private repository. Architecture notes, the evaluation tables and a walkthrough are available on request.",
  },
  {
    slug: "vulnrefine",
    featured: true,
    title: "VulnRefine — Local LLM vulnerability detection & verified repair",
    kicker: "Security · QLoRA fine-tuning · Multi-agent",
    summary:
      "A four-agent pipeline that finds a vulnerability, explains it, writes a patch and proves the patch works before accepting it, running entirely on local hardware so no source code leaves the machine.",
    role: "Minor project, team of two with Meet Vyas · mentored · private repository",
    problem:
      "Static analyzers are precise on known patterns but miss most real bugs, bury teams in false positives and cannot fix anything. Hosted LLMs can explain and patch code, but sending proprietary code to a cloud service is often not allowed, and an LLM fix may be wrong or break the build. The goal: a private tool that detects, explains, fixes and verifies, and a measurement of how much domain fine-tuning actually helps.",
    approach: [
      "Four agents in a feedback loop: Detector (static rules for 16 languages plus an LLM judge), Analyst (CWE, root cause, severity), Remediator (full patched code) and Verifier. A patch is accepted only after a syntax check, a re-scan that shows the finding gone and no new one, an LLM judge, and optionally a proof-of-concept exploit run in a sandbox. A rejection sends concrete feedback back to the Remediator for up to three rounds.",
      "Fine-tuned Qwen2.5-Coder-7B with QLoRA (4-bit NF4, rank 16) on 26,226 records built from 18,518 samples of PrimeVul, CleanVul, DiverseVul and synthetic code. Exact-hash and MinHash deduplication against every test set left 0 overlap. Training took 3.4 hours on one RTX 6000 Ada; the merged model is exported to GGUF Q4_K_M and served through Ollama, so it also runs on a 6 GB laptop GPU.",
      "Evaluated like research, not a demo: bootstrap confidence intervals, McNemar tests, threshold-free AUC because confidence scores did not transfer across datasets, and a stricter repair measure (\"verified and changed\") because unchanged code can pass verification.",
      "Productised as a CLI, a REST API, SARIF output for GitHub code scanning, a CI gate and a 10-page Streamlit dashboard.",
    ],
    stack: ["Python", "PyTorch", "Qwen2.5-Coder-7B", "QLoRA / PEFT / TRL", "Ollama (GGUF)", "FastAPI", "Streamlit", "Bandit · Semgrep · cppcheck"],
    skills: ["AI Agents", "Multi-Agent Systems", "RAG", "Evaluation", "Python", "FastAPI", "LLMs"],
    flow: ["Detector", "Analyst", "Remediator", "Verifier", "Report"],
    metrics: [
      { value: "0.745 → 0.889", label: "detection F1 on a 16-language benchmark" },
      { value: "26% → 2.5%", label: "false-positive rate" },
      { value: "6% → 28%", label: "correct, code-changing fixes on 109 real Python vulnerabilities (p < 0.001)" },
      { value: "0.53 → 0.68", label: "AUC on real held-out code, near a fine-tuned UniXcoder (0.699)" },
    ],
    results: [
      "Detection on the 16-language benchmark: F1 0.745 → 0.889 and false-positive rate 0.263 → 0.025 against the base model (McNemar p < 0.001).",
      "Real held-out code: threshold-free AUC 0.533 → 0.677, matching a fine-tuned UniXcoder classifier at the same false-positive rate.",
      "Repair: verified-fix rate 0.656 → 0.792; on 109 real Python vulnerabilities checked by execution, correct code-changing fixes rose from 0.06 to 0.28.",
      "Negative results kept in the report: reasoning distillation with ORPO, newer base models and a hyper-parameter sweep did not beat the plain QLoRA run. The training-step budget mattered more than the choice of base model.",
    ],
    limits: [
      "Telling a vulnerable function from its own fix stays near chance for every model, as in the PrimeVul study; a single function lacks callers and data flow.",
      "Single seed; the repair tests are written by the same model that writes the patch; the benchmark is small (16 samples per language).",
    ],
    proof: [],
    note: "Source is a private repository. The full project report is available on request.",
  },
  {
    slug: "readmission-prediction",
    featured: true,
    title: "Diabetic Readmission Prediction — Patient-level evaluation of boosted ensembles",
    kicker: "Research paper · ICCMSE 2026 & 28th GAMS · PDEU",
    summary:
      "A leakage-free study of 30-day readmission prediction on 101,766 hospital encounters: patient-grouped splits in every step, a custom out-of-fold stack over XGBoost, LightGBM and CatBoost, and exact SHAP attributions for the stacked model.",
    role: "Co-author (3 authors) · ICCMSE 2026 & 28th GAMS Annual Conference, PDEU, Nov 2026",
    problem:
      "Published results on the public Diabetes 130-US Hospitals data are hard to trust or compare. The data record encounters, not patients: 46.2% of encounters come from patients admitted more than once, so a random split puts the same patient in training and test and inflates scores. In a stacked model the leak returns inside the pipeline, because the out-of-fold predictions that train the meta-learner must also be grouped by patient, which scikit-learn's stacking estimator does not support.",
    approach: [
      "Split by patient with stratified group 5-fold partitioning and hold out one fold: 79,625 training encounters from 55,952 patients and 19,718 test encounters from 14,038 unseen patients. Tuning, out-of-fold stacking, calibration and threshold choice all stay inside the training patients; the test set is used once.",
      "Wrote a separate stacking estimator that accepts patient groups: out-of-fold probabilities from XGBoost, LightGBM and CatBoost feed a four-parameter logistic-regression meta-learner on the log-odds scale. That scale keeps the meta-learner tiny and makes exact explanations possible.",
      "Added patient-history features computed only from each patient's earlier encounters (earlier stays, earlier 30-day readmissions, previous outcome and length of stay), after checking that the encounter order is consistent with the labels.",
      "Ran controlled ablations over features, class weighting and calibration, with repeated runs and patient-level bootstrap confidence intervals, and explained the stack with exact SHAP values: the base models' SHAP values combined with the meta-learner's weights.",
    ],
    stack: ["Python", "scikit-learn", "XGBoost", "LightGBM", "CatBoost", "Optuna", "SHAP", "Kaggle"],
    skills: ["Machine Learning", "Evaluation", "Python"],
    flow: ["Patient-grouped split", "Tuned base learners", "Grouped OOF stack", "Calibration check", "Exact SHAP"],
    metrics: [
      { value: "0.695", label: "ROC-AUC on 14,038 held-out patients (95% CI 0.680–0.708)" },
      { value: "0.682 → 0.691", label: "gain from patient-history features, vs +0.002 from stacking" },
      { value: "101,766", label: "encounters from 71,518 patients, split by patient" },
      { value: "0.092", label: "Brier score: boosted models already well calibrated" },
    ],
    results: [
      "The stack reaches 0.695 ROC-AUC and 0.259 PR-AUC against a 0.111 prevalence, averaged over three runs.",
      "Patient-history features add more (LightGBM 0.682 to 0.691) than stacking does (+0.002 over the best single model): the base models' predictions are too correlated, 0.92 to 0.95, for the stack to gain much.",
      "Class weighting worsened calibration (Brier 0.092 unweighted against 0.16 to 0.22 weighted) without improving discrimination.",
      "Exact SHAP attributions point to discharge disposition, prior inpatient visits, payer code and the outcome of the previous encounter as the strongest predictors.",
    ],
    limits: [
      "Retrospective study on public, de-identified 1999–2008 data from one source, with no external validation. Not for clinical use.",
      "Modest discrimination is the honest result; the contribution is the evaluation protocol, not a record score.",
    ],
    proof: [],
    note: "Conference paper with V. Pandya (first author) and D. P. Singh. The full text is available on request.",
  },
  {
    slug: "openenv",
    title: "OpenEnv — Data-Cleaning RL Agent",
    kicker: "Reinforcement learning · LLM agents",
    summary:
      "A custom RL environment where a Llama 3 agent autonomously cleans tabular data.",
    problem:
      "Data cleaning is repetitive and rule-heavy, yet hard to automate because 'clean' depends on the table. It needs an agent that can act, get feedback, and know when it is done.",
    approach: [
      "Custom RL environment with shaped rewards: +2 for missing-value reduction, +3 for deduplication, +5 for completion, plus anti-loop penalties.",
      "Pydantic schemas for actions and observations; structured-JSON LLM pipeline with fallbacks when the model returns malformed output.",
      "FastAPI REST and WebSocket server; multi-stage Docker build deployed on HuggingFace Spaces.",
    ],
    stack: ["Python", "Llama 3", "Reinforcement Learning", "Pydantic", "FastAPI", "WebSockets", "Docker"],
    skills: ["Reinforcement Learning", "LLMs", "Pydantic", "FastAPI", "WebSockets", "Llama 3", "Docker"],
    proof: [{ label: "Source on GitHub", href: "https://github.com/chetangadhiya5062/open-env-nuclei" }],
    repo: "chetangadhiya5062/open-env-nuclei",
  },
  {
    slug: "aethermail",
    title: "AetherMail — Autonomous AI Email Agent",
    kicker: "Agents · RAG · Streaming data",
    summary:
      "A stateful LangGraph agent that reads, reasons over and acts on email, backed by a Kafka → Spark pipeline.",
    problem:
      "Inboxes are unstructured, high-volume and private. An email agent needs memory, tools and a data pipeline that scales, without leaking content.",
    approach: [
      "Stateful LangGraph workflow on Gemini 2.5 Flash with 6 tools.",
      "RAG with Ollama embeddings (768-dim) stored in Qdrant.",
      "Kafka → Spark → HDFS / PostgreSQL / Qdrant ingestion pipeline with encrypted storage.",
    ],
    stack: ["LangGraph", "Gemini", "Qdrant", "Ollama", "Kafka", "Spark", "PostgreSQL"],
    skills: ["AI Agents", "LangGraph", "Gemini", "RAG", "Vector DBs (Qdrant)", "Kafka", "Spark", "PostgreSQL"],
    proof: [{ label: "Source on GitHub", href: "https://github.com/chetangadhiya5062/autonomous_mail" }],
    repo: "chetangadhiya5062/autonomous_mail",
  },
  {
    slug: "neuroflow-ai",
    title: "NeuroFlow AI — AI Operating Platform",
    kicker: "Platform engineering · HNNOIX",
    summary:
      "A domain-agnostic AI Operating Platform for autonomous agents, RAG, workflows and knowledge systems.",
    problem:
      "Teams re-build the same LLM plumbing for every AI product. A platform needs swappable providers, clear boundaries and observability from day one.",
    approach: [
      "Modular monolith in six layers following Clean Architecture and SOLID: core ports → infrastructure adapters → plugins → platform runtime → application services → API.",
      "Runtime layer includes LLM Gateway, RAG Runtime, AI Memory Layer, Knowledge Base, Knowledge Graph, Agent Runtime, Workflow Engine and Prompt Runtime.",
      "Interface-first: port contracts are defined before adapters; dependencies are constructor-injected.",
    ],
    stack: ["Python", "FastAPI", "Clean Architecture", "Docker", "CI"],
    skills: ["LLMs", "RAG", "AI Agents", "FastAPI", "Docker"],
    proof: [{ label: "Source on GitHub", href: "https://github.com/chetangadhiya5062/NeuroFlow-AI" }],
    repo: "chetangadhiya5062/NeuroFlow-AI",
  },
  {
    slug: "truth-ai",
    title: "Truth AI — Fact-Verification System",
    kicker: "Multi-agent · GenAI Exchange Hackathon",
    summary:
      "CrewAI multi-agent fact-checking with web research, structured verdicts and citations (team 'AI Gyani').",
    problem:
      "Misinformation spreads faster than manual fact-checking. Verdicts need sources and a confidence the reader can judge.",
    approach: [
      "Agents split the job: claim extraction, web research (SerperDev), verdict synthesis.",
      "Pydantic-validated structured output with confidence scoring and citations.",
      "Conditional processing cut inference overhead by 15%.",
    ],
    stack: ["CrewAI", "Gemini", "SerperDev", "Pydantic", "FastAPI"],
    skills: ["Multi-Agent Systems", "CrewAI", "Gemini", "Pydantic", "FastAPI", "Prompt Engineering"],
    proof: [
      { label: "Source on GitHub", href: "https://github.com/chetangadhiya5062/misinformation_ai" },
      { label: "Hackathon build", href: "https://github.com/chetangadhiya5062/GenAI_Truth-AI" },
    ],
    repo: "chetangadhiya5062/misinformation_ai",
  },
];
