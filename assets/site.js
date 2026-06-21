const defaultGraphNodes = [
  { id: "agent", name: "Your Applications", tag: "customer", x: 70, y: 92, desc: "Your applications and agent workloads generate inference requests to model providers." },
  { id: "collector", name: "Runtime Collector", tag: "collection", x: 268, y: 92, desc: "Optional collection path for request-level evidence when existing logs are incomplete." },
  { id: "econ", name: "Forensics Engine", tag: "analysis", x: 268, y: 228, desc: "Reconstructs expected vs actual workflow cost, surfaces waste patterns, and ranks fixes." },
  { id: "cache", name: "Reuse Detection", tag: "savings", x: 468, y: 92, desc: "Identifies duplicate and reusable requests to reduce unnecessary provider calls." },
  { id: "coverage", name: "Coverage & Confidence", tag: "trust", x: 468, y: 228, desc: "Shows attribution coverage, confidence notes, and data-quality gaps." },
  { id: "tools", name: "Your Infrastructure", tag: "enterprise", x: 668, y: 92, desc: "Integrates with your existing infrastructure, CI/CD, and operational tools." },
  { id: "audit", name: "Evidence & Reports", tag: "trust", x: 668, y: 228, desc: "Preserves the full story behind spend decisions and recommendations." },
];

const defaultGraphEdges = [
  ["agent", "collector"],
  ["collector", "cache"],
  ["cache", "tools"],
  ["collector", "econ"],
  ["collector", "coverage"],
  ["coverage", "tools"],
  ["econ", "audit"],
  ["coverage", "audit"],
];

const brgGraphNodes = [
  { id: "app", name: "App / Agent", tag: "customer", x: 70, y: 90, desc: "Your application or agent workload that generates LLM and agent workflow events." },
  { id: "sdk", name: "Logs / Traces", tag: "input", x: 230, y: 90, desc: "Existing logs, traces, gateway exports, provider events, and runtime metadata." },
  { id: "gw", name: "Runtime Collector", tag: "collection", x: 390, y: 90, desc: "Optional high-fidelity event collection path when existing data is incomplete." },
  { id: "cache", name: "Duplicate Analysis", tag: "savings", x: 550, y: 90, desc: "Identifies duplicate inference opportunities with supporting evidence and confidence." },
  { id: "router", name: "Workflow Reconstruction", tag: "analysis", x: 390, y: 210, desc: "Reconstructs requests, retries, fallbacks, branches, attribution, and token economics." },
  { id: "adapter", name: "Provider Economics", tag: "provider", x: 550, y: 210, desc: "Connects model, token, pricing, provider, and route context where available." },
  { id: "llm", name: "Model Provider", tag: "external", x: 710, y: 210, desc: "The selected model provider. Blackridge tracks which provider is hit and what it costs." },
  { id: "telemetry", name: "Telemetry", tag: "async", x: 230, y: 300, desc: "Lightweight events captured without adding latency to user-facing requests." },
  { id: "cost", name: "Waste Findings", tag: "analysis", x: 390, y: 300, desc: "Surfaces waste patterns, observed vs modeled opportunity, and recommended fixes." },
  { id: "dash", name: "Evidence Report", tag: "output", x: 550, y: 300, desc: "Shows spend by team, application, workflow, model, and provider with supporting evidence." },
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
  default: { nodes: defaultGraphNodes, edges: defaultGraphEdges, focus: "collector" },
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
