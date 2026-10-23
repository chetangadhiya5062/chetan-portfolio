/**
 * Builds src/content/generated/latent.json from src/content/concepts.ts.
 *
 *   npm i --no-save onnxruntime-node @huggingface/tokenizers
 *   node scripts/embed-concepts.mjs <dir with onnx/model.onnx + tokenizer.json>
 *
 * Model: sentence-transformers/all-MiniLM-L6-v2 (384-d, mean pooling, L2 normalised).
 * Every similarity shown on the site is the cosine between these vectors.
 */
import fs from "node:fs";
import path from "node:path";
import ort from "onnxruntime-node";
import { Tokenizer } from "@huggingface/tokenizers";

const dir = process.argv[2];
if (!dir) throw new Error("usage: node scripts/embed-concepts.mjs <model-dir>");

const src = fs.readFileSync("src/content/concepts.ts", "utf8");
const concepts = [...src.matchAll(/\{ id: "([^"]+)", label: "([^"]+)", cluster: "([^"]+)", def: "([^"]+)" \}/g)].map((m) => ({
  id: m[1], label: m[2], cluster: m[3], def: m[4],
}));

const tok = new Tokenizer(JSON.parse(fs.readFileSync(path.join(dir, "tokenizer.json"), "utf8")), { do_lower_case: true });
const sess = await ort.InferenceSession.create(path.join(dir, "onnx/model.onnx"));

async function embed(text) {
  const ids = tok.encode(text).ids.map(BigInt);
  const n = ids.length;
  const out = await sess.run({
    input_ids: new ort.Tensor("int64", BigInt64Array.from(ids), [1, n]),
    attention_mask: new ort.Tensor("int64", BigInt64Array.from(ids.map(() => 1n)), [1, n]),
    token_type_ids: new ort.Tensor("int64", new BigInt64Array(n), [1, n]),
  });
  const h = out.last_hidden_state, d = h.dims[2];
  const v = new Float64Array(d);
  for (let t = 0; t < n; t++) for (let k = 0; k < d; k++) v[k] += h.data[t * d + k] / n;
  const norm = Math.hypot(...v);
  return Array.from(v, (x) => x / norm);
}

// the label is embedded together with its definition so short names like "SOLID" still land correctly
const vecs = [];
for (const c of concepts) vecs.push(await embed(`${c.label}: ${c.def}`));
const cos = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);

// PCA by power iteration (2 components) on mean-centred vectors
const dim = vecs[0].length, N = vecs.length;
const mean = Array.from({ length: dim }, (_, k) => vecs.reduce((s, v) => s + v[k], 0) / N);
let X = vecs.map((v) => v.map((x, k) => x - mean[k]));
const comps = [];
for (let c = 0; c < 2; c++) {
  let w = Array.from({ length: dim }, (_, k) => Math.sin(k * 12.9898 + c));
  for (let it = 0; it < 200; it++) {
    const nw = new Array(dim).fill(0);
    for (const row of X) { const p = row.reduce((s, x, k) => s + x * w[k], 0); for (let k = 0; k < dim; k++) nw[k] += p * row[k]; }
    const nn = Math.hypot(...nw); w = nw.map((x) => x / nn);
  }
  comps.push(w);
  X = X.map((row) => { const p = row.reduce((s, x, k) => s + x * w[k], 0); return row.map((x, k) => x - p * w[k]); });
}
const proj = vecs.map((v) => comps.map((w) => v.reduce((s, x, k) => s + (x - mean[k]) * w[k], 0)));
const ext = (i) => [Math.min(...proj.map((p) => p[i])), Math.max(...proj.map((p) => p[i]))];
const [x0, x1] = ext(0), [y0, y1] = ext(1);

const nodes = concepts.map((c, i) => ({
  id: c.id,
  x: +((proj[i][0] - x0) / (x1 - x0)).toFixed(4),
  y: +((proj[i][1] - y0) / (y1 - y0)).toFixed(4),
  near: concepts
    .map((o, j) => ({ id: o.id, s: j === i ? -1 : cos(vecs[i], vecs[j]) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 10)
    .map((n) => [n.id, +n.s.toFixed(3)]),
}));

fs.writeFileSync("src/content/generated/latent.json", JSON.stringify({ model: "all-MiniLM-L6-v2", dim, nodes }));
console.log(`wrote ${nodes.length} concepts`);
for (const id of ["rag", "kafka", "langgraph", "reward-shaping"]) {
  const n = nodes.find((x) => x.id === id);
  console.log(id, "->", n.near.slice(0, 4).map(([o, s]) => `${o} ${s}`).join(", "));
}
