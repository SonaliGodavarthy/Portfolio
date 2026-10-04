"use client";

import { motion } from "motion/react";

// ─── Shared primitives ────────────────────────────────────────────────────────

const EASE = [0.23, 1, 0.32, 1] as const;

function Node({
  label,
  sub,
  color = "#10b981",
  delay = 0,
  wide = false,
}: {
  label: string;
  sub?: string;
  color?: string;
  delay?: number;
  wide?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, transform: "scale(0.92)" }}
      animate={{ opacity: 1, transform: "scale(1)" }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      className={`flex flex-col items-center justify-center text-center px-3 py-2.5 rounded-lg border ${wide ? "min-w-[120px]" : "min-w-[90px]"}`}
      style={{
        background: `${color}10`,
        borderColor: `${color}35`,
        color,
      }}
    >
      <span className="text-xs font-mono font-medium leading-tight">{label}</span>
      {sub && <span className="text-[10px] opacity-60 mt-0.5 leading-tight">{sub}</span>}
    </motion.div>
  );
}

function Arrow({ dir = "right", delay = 0 }: { dir?: "right" | "down"; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className={`flex items-center justify-center text-[#333] ${dir === "down" ? "h-5 rotate-90" : "w-6"}`}
    >
      →
    </motion.div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1.5 flex-wrap justify-center">{children}</div>;
}

function Col({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-center gap-2">{children}</div>;
}

function DiagramShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/7 bg-[#0f0f0f] p-6 md:p-8 overflow-x-auto">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#444] mb-6">{title}</p>
      <div className="flex flex-col gap-4 items-center min-w-[320px]">{children}</div>
    </div>
  );
}

// ─── Diagrams ─────────────────────────────────────────────────────────────────

export function HARDiagram() {
  return (
    <DiagramShell title="Multi-Modal HAR Pipeline">
      <Row>
        <Node label="IMU Sensors" sub="40+ subjects" color="#60a5fa" delay={0} />
        <Arrow delay={0.1} />
        <Node label="Feature Extractor" sub="Time-series" color="#60a5fa" delay={0.15} />
      </Row>
      <Row>
        <Node label="Camera Feed" sub="Video frames" color="#c084fc" delay={0.2} />
        <Arrow delay={0.3} />
        <Node label="CLIP / DINOv2 / DINOv3" sub="Vision foundation" color="#c084fc" delay={0.35} wide />
      </Row>
      <Arrow dir="down" delay={0.45} />
      <Node label="Fusion Module" sub="Cross-modal" color="#10b981" delay={0.5} wide />
      <Arrow dir="down" delay={0.6} />
      <Row>
        <Node label="Auto-Annotator" sub="100K+ windows" color="#10b981" delay={0.65} />
        <Arrow delay={0.75} />
        <Node label="Activity Classifier" sub="Labels + confidence" color="#10b981" delay={0.8} wide />
      </Row>
    </DiagramShell>
  );
}

export function MultiEmbeddingDiagram() {
  return (
    <DiagramShell title="MULTI — Multi-Embedding Architecture">
      <Row>
        {["Lens Factor", "Sensor Factor", "View Factor", "Domain Factor"].map((f, i) => (
          <Node key={f} label={f} color="#f59e0b" delay={i * 0.08} />
        ))}
      </Row>
      <Row>
        {["Emb₁", "Emb₂", "Emb₃", "Emb₄"].map((e, i) => (
          <Node key={e} label={e} color="#fb923c" delay={0.35 + i * 0.06} />
        ))}
      </Row>
      <Arrow dir="down" delay={0.65} />
      <Node label="Cross-Attention Conditioning" sub="Factor-aware injection" color="#10b981" delay={0.7} wide />
      <Arrow dir="down" delay={0.8} />
      <Row>
        <Node label="Stable Diffusion" color="#a78bfa" delay={0.85} />
        <span className="text-[#444] text-xs font-mono">/ or /</span>
        <Node label="FLUX" color="#a78bfa" delay={0.9} />
      </Row>
      <Arrow dir="down" delay={1.0} />
      <Node label="Generated Image" sub="Controllable factors" color="#10b981" delay={1.05} wide />
    </DiagramShell>
  );
}

export function LoRADiagram() {
  return (
    <DiagramShell title="LoRA / QLoRA Fine-Tuning Pipeline">
      <Row>
        <Node label="Base Model" sub="Stable Diffusion / FLUX" color="#a78bfa" delay={0} wide />
        <Arrow delay={0.1} />
        <Node label="Freeze Weights" color="#666" delay={0.15} />
      </Row>
      <Arrow dir="down" delay={0.25} />
      <Row>
        <Node label="LoRA Adapters" sub="rank r, α" color="#10b981" delay={0.3} />
        <span className="text-[#444] font-mono text-xs">←</span>
        <Node label="Domain Data" sub="Driving datasets" color="#60a5fa" delay={0.35} />
      </Row>
      <Arrow dir="down" delay={0.45} />
      <Node label="Fine-tuned Model" sub="Parameter-efficient" color="#10b981" delay={0.5} wide />
      <Arrow dir="down" delay={0.6} />
      <Row>
        <Node label="Docker Container" sub="Reproducible env" color="#f59e0b" delay={0.65} />
        <Arrow delay={0.75} />
        <Node label="MLflow Tracking" sub="Experiments + artifacts" color="#f59e0b" delay={0.8} />
      </Row>
    </DiagramShell>
  );
}

export function RAGDiagram() {
  return (
    <DiagramShell title="Production RAG Pipeline">
      <Row>
        <Node label="Documents" sub="PDF / Handwritten" color="#60a5fa" delay={0} />
        <Arrow delay={0.1} />
        <Node label="OCR / Parser" sub="GPT-4o / Flamingo" color="#60a5fa" delay={0.15} />
        <Arrow delay={0.25} />
        <Node label="Chunker" sub="Metadata-aware" color="#60a5fa" delay={0.3} />
      </Row>
      <Arrow dir="down" delay={0.4} />
      <Row>
        <Node label="Embedder" sub="MiniLM-L12" color="#10b981" delay={0.45} />
        <Arrow delay={0.55} />
        <Node label="Vector DB" sub="ChromaDB · Pinecone" color="#10b981" delay={0.6} wide />
      </Row>
      <Row>
        <Node label="User Query" color="#c084fc" delay={0.65} />
        <Arrow delay={0.75} />
        <Node label="Hybrid Retriever" sub="Dense + BM25" color="#c084fc" delay={0.8} wide />
      </Row>
      <Arrow dir="down" delay={0.9} />
      <Row>
        <Node label="LLM Generator" sub="GPT-4o" color="#f59e0b" delay={0.95} />
        <Arrow delay={1.05} />
        <Node label="Cited Response" sub="Langfuse monitored" color="#f59e0b" delay={1.1} wide />
      </Row>
    </DiagramShell>
  );
}

export function SREDiagram() {
  return (
    <DiagramShell title="AWS Infrastructure (Terraform IaC)">
      <Row>
        {["EC2", "RDS", "S3", "Lambda", "ECS"].map((svc, i) => (
          <Node key={svc} label={svc} sub="AWS" color="#f59e0b" delay={i * 0.07} />
        ))}
      </Row>
      <Arrow dir="down" delay={0.4} />
      <Node label="Terraform IaC" sub="10+ services, version-controlled" color="#10b981" delay={0.45} wide />
      <Arrow dir="down" delay={0.55} />
      <Row>
        <Node label="Datadog Observability" sub="Metrics · Logs · APM" color="#a78bfa" delay={0.6} wide />
        <Arrow delay={0.7} />
        <Node label="Alerts + Incidents" sub="MTTD −70%" color="#f87171" delay={0.75} wide />
      </Row>
      <Arrow dir="down" delay={0.85} />
      <Node label="99.9%+ Uptime" sub="Global financial data" color="#10b981" delay={0.9} wide />
    </DiagramShell>
  );
}

export function VoiceDiagram() {
  return (
    <DiagramShell title="Voice Command System — UAV / UGV">
      <Node label="Microphone Input" sub="17 command classes" color="#60a5fa" delay={0} wide />
      <Arrow dir="down" delay={0.1} />
      <Row>
        <Node label="MFCC Features" color="#10b981" delay={0.15} />
        <Arrow delay={0.25} />
        <Node label="AttRNN Model" sub="TensorFlow" color="#10b981" delay={0.3} />
      </Row>
      <Arrow dir="down" delay={0.4} />
      <Row>
        <Node label="Raspberry Pi" sub="<10ms inference" color="#f59e0b" delay={0.45} />
        <Arrow delay={0.55} />
        <Node label="ZeroTier VPN" sub="Secure channel" color="#f59e0b" delay={0.6} />
      </Row>
      <Arrow dir="down" delay={0.7} />
      <Row>
        <Node label="UAV Control" color="#c084fc" delay={0.75} />
        <span className="text-[#444] text-xs font-mono mx-2">+</span>
        <Node label="UGV Control" color="#c084fc" delay={0.8} />
      </Row>
    </DiagramShell>
  );
}

export function CVPipelineDiagram() {
  return (
    <DiagramShell title="Jigsaw Puzzle Solver Pipeline">
      <Node label="Scattered Puzzle Image" color="#60a5fa" delay={0} wide />
      <Arrow dir="down" delay={0.1} />
      <Row>
        <Node label="QR Detection" sub="Projective transform" color="#10b981" delay={0.15} />
        <Arrow delay={0.25} />
        <Node label="Coordinate Rectification" color="#10b981" delay={0.3} wide />
      </Row>
      <Arrow dir="down" delay={0.4} />
      <Node label="SAM Segmentation" sub="Zero-shot piece isolation" color="#c084fc" delay={0.45} wide />
      <Arrow dir="down" delay={0.55} />
      <Row>
        <Node label="Corner Detection" sub="Shape-based" color="#f59e0b" delay={0.6} />
        <Arrow delay={0.7} />
        <Node label="Color Profile Matching" color="#f59e0b" delay={0.75} wide />
      </Row>
      <Arrow dir="down" delay={0.85} />
      <Node label="Graph Matching + Backtracking" sub="~80% solve rate" color="#10b981" delay={0.9} wide />
    </DiagramShell>
  );
}

export function UNetDiagram() {
  return (
    <DiagramShell title="UNet Blind Spot Denoising">
      <Node label="Noisy Microscopy Image" sub="LiveCell / Mouse Actin" color="#60a5fa" delay={0} wide />
      <Arrow dir="down" delay={0.1} />
      <Row>
        <Node label="Encoder" sub="Downsampling + skip" color="#f59e0b" delay={0.15} />
        <Arrow delay={0.25} />
        <Node label="Bottleneck" sub="Latent features" color="#f59e0b" delay={0.3} />
        <Arrow delay={0.4} />
        <Node label="Decoder" sub="Skip connections" color="#f59e0b" delay={0.45} />
      </Row>
      <Arrow dir="down" delay={0.55} />
      <Node label="Blind Spot Mask" sub="Self-supervised constraint" color="#c084fc" delay={0.6} wide />
      <Arrow dir="down" delay={0.7} />
      <Node label="Denoised Image" sub="~54% PSNR improvement" color="#10b981" delay={0.75} wide />
    </DiagramShell>
  );
}

export function AskDocDiagram() {
  return (
    <DiagramShell title="AskDoc — Document QA Pipeline">
      <Row>
        <Node label="Research PDFs" color="#60a5fa" delay={0} />
        <Arrow delay={0.1} />
        <Node label="Text Chunker" sub="Semantic splits" color="#60a5fa" delay={0.15} />
      </Row>
      <Arrow dir="down" delay={0.25} />
      <Row>
        <Node label="Sentence Transformer" sub="Dense embeddings" color="#10b981" delay={0.3} wide />
        <Arrow delay={0.4} />
        <Node label="FAISS Index" sub="Vector store" color="#10b981" delay={0.45} />
      </Row>
      <Arrow dir="down" delay={0.55} />
      <Row>
        <Node label="User Query (NL)" color="#c084fc" delay={0.6} />
        <Arrow delay={0.7} />
        <Node label="Similarity Search" color="#c084fc" delay={0.75} />
      </Row>
      <Arrow dir="down" delay={0.85} />
      <Node label="Cited Answer" sub="Source-grounded response" color="#f59e0b" delay={0.9} wide />
    </DiagramShell>
  );
}

export function TransferDiagram() {
  return (
    <DiagramShell title="Transfer Learning Benchmark">
      <Node label="ImageNet Pre-trained Weights" color="#60a5fa" delay={0} wide />
      <Arrow dir="down" delay={0.1} />
      <Row>
        {["AlexNet", "ResNet", "GoogLeNet"].map((m, i) => (
          <Node key={m} label={m} color={i === 2 ? "#10b981" : "#666"} delay={0.15 + i * 0.08} />
        ))}
      </Row>
      <Arrow dir="down" delay={0.4} />
      <Node label="Christmas Domain Dataset" sub="Fine-tuning" color="#f59e0b" delay={0.45} wide />
      <Arrow dir="down" delay={0.55} />
      <Row>
        <Node label="Hyperparameter Tuning" sub="LR, decay, augment" color="#c084fc" delay={0.6} wide />
      </Row>
      <Arrow dir="down" delay={0.7} />
      <Node label="GoogLeNet wins — 91% accuracy" sub="8–12% gain over baseline" color="#10b981" delay={0.75} wide />
    </DiagramShell>
  );
}

// ─── Diagram picker ───────────────────────────────────────────────────────────

export function DiagramByType({ type }: { type: string }) {
  switch (type) {
    case "har":    return <HARDiagram />;
    case "multi":  return <MultiEmbeddingDiagram />;
    case "lora":   return <LoRADiagram />;
    case "rag":    return <RAGDiagram />;
    case "sre":    return <SREDiagram />;
    case "voice":  return <VoiceDiagram />;
    case "cv":     return <CVPipelineDiagram />;
    case "unet":   return <UNetDiagram />;
    case "askdoc": return <AskDocDiagram />;
    case "transfer": return <TransferDiagram />;
    default:       return null;
  }
}
