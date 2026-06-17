const defaultGraphNodes = [
  { id: "agent", name: "Your Applications", tag: "customer", x: 70, y: 92, desc: "Your applications and agent workloads generate inference requests to model providers." },
  { id: "gateway", name: "Blackridge Gateway", tag: "gateway", x: 268, y: 92, desc: "Sits between your applications and model providers to observe, attribute, and analyze AI spend." },
  { id: "econ", name: "Spend Analysis", tag: "analysis", x: 268, y: 228, desc: "Reconstructs expected vs actual workflow cost, surfaces waste patterns, and identifies savings." },
  { id: "cache", name: "Reuse Detection", tag: "savings", x: 468, y: 92, desc: "Identifies duplicate and reusable requests to reduce unnecessary provider calls." },
  { id: "policy", name: "Spend Controls", tag: "controls", x: 468, y: 228, desc: "Spending limits and access controls applied where you configure them." },
  { id: "tools", name: "Your Infrastructure", tag: "enterprise", x: 668, y: 92, desc: "Integrates with your existing infrastructure, CI/CD, and operational tools." },
  { id: "audit", name: "Evidence & Reports", tag: "trust", x: 668, y: 228, desc: "Preserves the full story behind spend decisions and recommendations." },
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
  { id: "app", name: "App / Agent", tag: "customer", x: 70, y: 90, desc: "Your application or agent workload that issues OpenAI-compatible inference requests." },
  { id: "sdk", name: "OpenAI SDK", tag: "compatible", x: 230, y: 90, desc: "Existing OpenAI-compatible client pointed at the gateway. Fast adoption with a base-URL change." },
  { id: "gw", name: "Blackridge Gateway", tag: "gateway", x: 390, y: 90, desc: "The single entry point for inference requests. Observes traffic, attributes spend, and routes to providers." },
  { id: "cache", name: "Reuse Check", tag: "savings", x: 550, y: 90, desc: "Identifies duplicate requests before they reach a provider. Hits return instantly and record avoided spend." },
  { id: "router", name: "Smart Routing", tag: "route", x: 390, y: 210, desc: "Selects provider and model based on your configured policies for cost, latency, and availability." },
  { id: "adapter", name: "Provider Connection", tag: "provider", x: 550, y: 210, desc: "Connects to OpenAI, Anthropic, Gemini, and self-hosted models behind a single interface." },
  { id: "llm", name: "Model Provider", tag: "external", x: 710, y: 210, desc: "The selected model provider. Blackridge tracks which provider is hit and what it costs." },
  { id: "telemetry", name: "Telemetry", tag: "async", x: 230, y: 300, desc: "Lightweight events captured without adding latency to user-facing requests." },
  { id: "cost", name: "Spend Analysis", tag: "analysis", x: 390, y: 300, desc: "Analyzes AI spend, surfaces waste patterns, and identifies savings opportunities." },
  { id: "dash", name: "Spend Report", tag: "output", x: 550, y: 300, desc: "Shows spend by team, application, workflow, model, and provider — with supporting evidence." },
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
