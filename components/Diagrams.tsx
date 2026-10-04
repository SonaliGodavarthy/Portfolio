"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react";

// Flow diagrams for the case-study pages. They show the pipeline at the level
// the CVs describe it, without inventing architecture details.

const EASE = [0.23, 1, 0.32, 1] as const;

type N = { label: string; sub?: string; key?: boolean };
/** A row is a left-to-right sequence, or (with `par`) siblings side by side. */
type Row = N[] | { par: N[] };

function Node({ n, i }: { n: N; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
      className={`rounded-xl px-4 py-3 text-center min-w-[120px]
                  ${n.key ? "bg-lavender text-paper" : "bg-surface text-ink ring-1 ring-line"}`}
    >
      <p className="text-[0.875rem] font-semibold leading-tight">{n.label}</p>
      {n.sub && (
        <p className={`mt-0.5 text-[0.75rem] tracking-[0.01em] leading-tight ${n.key ? "text-lavender-soft" : "text-ink-3"}`}>{n.sub}</p>
      )}
    </motion.div>
  );
}

/** Rows flow downward; nodes within a row flow left to right. */
function Flow({ title, rows }: { title: string; rows: Row[] }) {
  let i = 0;
  return (
    <figure className="rounded-3xl bg-paper-2 p-6 md:p-10 overflow-x-auto">
      <div className="flex min-w-[320px] flex-col items-center gap-3">
        {rows.map((row, r) => {
          const par = !Array.isArray(row);
          const nodes = Array.isArray(row) ? row : row.par;
          return (
          <Fragment key={r}>
            {r > 0 && <ArrowDown size={16} className="text-ink-3" aria-hidden />}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {nodes.map((n, c) => (
                <Fragment key={n.label}>
                  {c > 0 && !par && <ArrowRight size={14} className="text-ink-3 shrink-0" aria-hidden />}
                  <Node n={n} i={i++} />
                </Fragment>
              ))}
            </div>
          </Fragment>
          );
        })}
      </div>
      <figcaption className="mt-6 text-center text-[0.8125rem] tracking-[0.01em] text-ink-3">{title}</figcaption>
    </figure>
  );
}

const DIAGRAMS: Record<string, { title: string; rows: Row[] }> = {
  har: {
    title: "Automatic annotation for activity recognition",
    rows: [
      { par: [{ label: "IMU streams", sub: "40+ subjects" }, { label: "Video frames" }] },
      { par: [{ label: "CLIP / DINOv2 / DINOv3", sub: "Vision foundation features" }, { label: "IMU features" }] },
      [{ label: "Auto-annotation", sub: "100K+ sensor windows", key: true }],
      [{ label: "Activity classifier", sub: "Downstream study" }],
    ],
  },
  multi: {
    title: "Factor-aware text-to-image generation",
    rows: [
      { par: [{ label: "Lens" }, { label: "Sensor" }, { label: "View" }, { label: "Domain" }] },
      [{ label: "Separate factor embeddings", key: true }],
      [{ label: "Stable Diffusion / FLUX", sub: "Text-to-image backbone" }],
      [{ label: "Generated image", sub: "One factor changed at a time" }],
      { par: [{ label: "DINOv3 evaluation" }, { label: "User study", sub: "150+ participants" }] },
    ],
  },
  lora: {
    title: "Parameter-efficient fine-tuning and tracking",
    rows: [
      { par: [{ label: "Driving datasets" }, { label: "Diffusion model", sub: "Pretrained" }] },
      [{ label: "LoRA / QLoRA", sub: "Fine-tuning", key: true }],
      [{ label: "Synthetic camera scenarios" }],
      { par: [{ label: "Docker", sub: "Reproducible training" }, { label: "MLflow", sub: "Experiment tracking" }] },
    ],
  },
  rag: {
    title: "Retrieval-augmented generation",
    rows: [
      [{ label: "Documents" }, { label: "OCR / parsing", sub: "GPT-4o" }, { label: "Chunks + metadata" }],
      [{ label: "Embeddings" }, { label: "Vector store", sub: "ChromaDB / Pinecone" }],
      [{ label: "Query" }, { label: "Hybrid search", sub: "Metadata filtering", key: true }],
      [{ label: "LLM answer", sub: "Grounded in sources" }],
    ],
  },
  sre: {
    title: "Infrastructure and observability",
    rows: [
      [{ label: "10+ AWS services" }],
      [{ label: "Terraform", sub: "Infrastructure as code", key: true }],
      [{ label: "Datadog", sub: "Observability" }, { label: "Alerts and incidents", sub: "MTTD down 70%" }],
      [{ label: "Automated reporting", sub: "Cost, metrics, incidents" }],
    ],
  },
  voice: {
    title: "Voice control for unmanned vehicles",
    rows: [
      [{ label: "Spoken command", sub: "17 classes" }],
      [{ label: "AttRNN", sub: "TensorFlow", key: true }],
      [{ label: "Raspberry Pi", sub: "Under 10 ms" }, { label: "ZeroTier VPN" }],
      { par: [{ label: "UAV" }, { label: "UGV" }] },
    ],
  },
  cv: {
    title: "Jigsaw reconstruction pipeline",
    rows: [
      [{ label: "Photo of pieces" }],
      { par: [{ label: "QR projective rectification" }, { label: "SAM segmentation", sub: "Zero-shot" }] },
      [{ label: "Rotation correction" }, { label: "Corners + colour profiles" }],
      [{ label: "Graph matching", sub: "Recursive backtracking", key: true }],
    ],
  },
  unet: {
    title: "Self-supervised denoising",
    rows: [
      [{ label: "Noisy microscopy", sub: "LiveCell / Mouse Actin" }],
      [{ label: "UNet", sub: "Blind-spot inspired", key: true }],
      { par: [{ label: "Denoised image" }, { label: "vs. Gaussian, Median, Box3D" }] },
    ],
  },
  askdoc: {
    title: "Question answering over papers",
    rows: [
      [{ label: "Research papers" }, { label: "Embeddings" }, { label: "FAISS index" }],
      [{ label: "Question" }, { label: "Vector search", key: true }],
      [{ label: "Answer", sub: "Grounded in the paper" }],
    ],
  },
  transfer: {
    title: "Transfer-learning benchmark",
    rows: [
      { par: [{ label: "AlexNet" }, { label: "ResNet" }, { label: "GoogLeNet", key: true }] },
      [{ label: "Fine-tuning + tuning", sub: "Curated dataset" }],
      [{ label: "91% accuracy", sub: "GoogLeNet" }],
    ],
  },
};

export function DiagramByType({ type }: { type: string }) {
  const d = DIAGRAMS[type];
  return d ? <Flow title={d.title} rows={d.rows} /> : null;
}
