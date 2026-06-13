const defaultGraphNodes = [
  { id: "agent", name: "Agent Runtime", tag: "customer", x: 70, y: 92, desc: "Customer-owned agents generate model calls and tool intent." },
  { id: "gateway", name: "Blackridge Gateway", tag: "runtime", x: 268, y: 92, desc: "Runtime boundary for observing AI traffic and emitting canonical economic evidence." },
  { id: "econ", name: "Token Economics", tag: "forensics", x: 268, y: 228, desc: "Reconstructs expected vs actual workflow cost, waste, confidence, and request evidence." },
  { id: "cache", name: "Exact Cache Evidence", tag: "signals", x: 468, y: 92, desc: "Records cache verdicts and modeled cache opportunity without hiding provenance." },
  { id: "policy", name: "Control Roadmap", tag: "roadmap", x: 468, y: 228, desc: "Budget verdicts and explicit deny scopes exist where configured; broader enforcement follows forensic trust." },
  { id: "tools", name: "Tools & Systems", tag: "enterprise", x: 668, y: 92, desc: "Jira, GitHub, Slack, Kubernetes, CI/CD, cloud APIs, and internal systems." },
  { id: "audit", name: "Evidence & Provenance", tag: "trust", x: 668, y: 228, desc: "Preserves the causal chain behind spend, route decisions, lineage, and recommendations." },
];

const defaultGraphEdges = [
  ["agent", "gateway"],
  ["gateway", "cache"],
  ["cache", "tools"],
  ["gateway", "econ"],
  ["gateway", "policy"],
  ["policy", "tools"],
  ["econ", "audit"],
  ["policy", "audit"],
];

const brgGraphNodes = [
  { id: "app", name: "App / Agent", tag: "customer", x: 70, y: 90, desc: "Customer application or agent workload that issues OpenAI-compatible inference requests." },
  { id: "sdk", name: "OpenAI SDK", tag: "drop-in", x: 230, y: 90, desc: "Existing OpenAI-compatible client pointed at BRG's base URL. Fast adoption with minimal rewrite." },
  { id: "gw", name: "BRG Gateway", tag: "hot path", x: 390, y: 90, desc: "The single ingress for inference requests. It stamps context, normalizes requests, and orchestrates cache, route, provider, response, and telemetry stages." },
  { id: "cache", name: "Cache Lookup", tag: "savings", x: 550, y: 90, desc: "Checks L0/L1 caches before a provider call. A hit short-circuits directly to response normalization and records avoided spend." },
  { id: "router", name: "Model Router", tag: "route", x: 390, y: 210, desc: "Selects provider and model by route policy, cost, latency, task class, budget state, and provider health." },
  { id: "adapter", name: "Provider Adapter", tag: "provider", x: 550, y: 210, desc: "Normalizes calls across OpenAI, Anthropic, Gemini, Azure, Bedrock, and private model runtimes." },
  { id: "llm", name: "LLM Provider", tag: "external", x: 710, y: 210, desc: "The selected model runtime. BRG abstracts and accounts for which provider is actually hit." },
  { id: "telemetry", name: "Telemetry", tag: "off path", x: 230, y: 300, desc: "Fire-and-forget events emitted from the hot path without blocking user-facing latency." },
  { id: "cost", name: "Forensics Engine", tag: "accounting", x: 390, y: 300, desc: "Calculates token spend, expected vs actual workflow cost, attribution, waste, and modeled opportunity." },
  { id: "dash", name: "Forensic Report", tag: "proof", x: 550, y: 300, desc: "Shows spend by tenant, app, user, team, workflow, route, model, provider, cache verdict, confidence, and request evidence." },
];

const brgGraphEdges = [
  ["app", "sdk"],
  ["sdk", "gw"],
  ["gw", "cache"],
  ["cache", "router"],
  ["router", "adapter"],
  ["adapter", "llm"],
  ["gw", "telemetry"],
  ["telemetry", "cost"],
  ["cost", "dash"],
  ["cache", "dash"],
];

const graphVariants = {
  default: { nodes: defaultGraphNodes, edges: defaultGraphEdges, focus: "gateway" },
  brg: { nodes: brgGraphNodes, edges: brgGraphEdges, focus: "gw" },
};

function renderGraph(root) {
  if (!root) return;
  const svg = root.querySelector("svg");
  const section = root.closest(".section") || document;
  const inspector = section.querySelector("[data-inspector]");
  const variant = graphVariants[root.dataset.graph] || graphVariants.default;
  const graphNodes = variant.nodes;
  const graphEdges = variant.edges;
  const width = 760;
  const height = 330;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = `
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="#536171"></path>
      </marker>
    </defs>
  `;

  const byId = Object.fromEntries(graphNodes.map((node) => [node.id, node]));

  graphEdges.forEach(([from, to]) => {
    const a = byId[from];
    const b = byId[to];
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const startX = a.x + 70;
    const endX = b.x - 70;
    const midX = (startX + endX) / 2;
    path.setAttribute("class", "graph-edge");
    path.setAttribute("data-from", from);
    path.setAttribute("data-to", to);
    path.setAttribute("marker-end", "url(#arrow)");
    path.setAttribute("d", `M ${startX} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${endX} ${b.y}`);
    svg.appendChild(path);
  });

  graphNodes.forEach((node) => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "graph-node");
    group.setAttribute("data-id", node.id);
    group.setAttribute("transform", `translate(${node.x - 70}, ${node.y - 34})`);
    group.innerHTML = `
      <rect width="140" height="68"></rect>
      <text x="70" y="30" text-anchor="middle">${node.name}</text>
      <text class="node-tag" x="70" y="48" text-anchor="middle">${node.tag.toUpperCase()}</text>
    `;
    svg.appendChild(group);
  });

  function focus(id) {
    const node = byId[id] || graphNodes[1];
    svg.querySelectorAll(".graph-node").forEach((el) => {
      el.classList.toggle("active", el.dataset.id === node.id);
    });
    svg.querySelectorAll(".graph-edge").forEach((el) => {
      el.classList.toggle("active", el.dataset.from === node.id || el.dataset.to === node.id);
    });
    if (inspector) {
      inspector.querySelector("h3").textContent = node.name;
      inspector.querySelector("p").textContent = node.desc;
      inspector.querySelector(".mono").textContent = `${node.id} / ${node.tag}`;
    }
  }

  svg.querySelectorAll(".graph-node").forEach((el) => {
    el.addEventListener("mouseenter", () => focus(el.dataset.id));
    el.addEventListener("click", () => focus(el.dataset.id));
  });

  focus(variant.focus);
}

document.querySelectorAll("[data-graph]").forEach(renderGraph);
