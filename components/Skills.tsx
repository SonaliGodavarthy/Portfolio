"use client";

import { motion } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;

const categories = [
  {
    label: "Generative AI & Diffusion",
    skills: ["Stable Diffusion", "FLUX", "Diffusers", "LoRA", "QLoRA", "BLIP"],
    accent: "#10b981",
  },
  {
    label: "LLMs & RAG",
    skills: [
      "LangChain",
      "LangGraph",
      "AutoGen",
      "GPT-4o",
      "Azure OpenAI",
      "ChromaDB",
      "Pinecone",
      "FAISS",
      "Langfuse",
      "RAG",
    ],
    accent: "#60a5fa",
  },
  {
    label: "Computer Vision & VLMs",
    skills: ["CLIP", "DINOv2", "DINOv3", "SAM", "OpenCV"],
    accent: "#c084fc",
  },
  {
    label: "ML & Deep Learning",
    skills: [
      "PyTorch",
      "TensorFlow",
      "Keras",
      "Scikit-learn",
      "Transformers",
      "UNet",
      "Hugging Face",
    ],
    accent: "#f59e0b",
  },
  {
    label: "MLOps & Infrastructure",
    skills: ["MLflow", "SLURM", "HPC", "Docker", "Kubernetes", "GitHub Actions"],
    accent: "#f87171",
  },
  {
    label: "Cloud & DevOps",
    skills: ["AWS", "Terraform", "Datadog"],
    accent: "#38bdf8",
  },
  {
    label: "Programming & Data",
    skills: ["Python", "SQL", "Bash", "NumPy", "Pandas", "Matplotlib", "Seaborn"],
    accent: "#a3e635",
  },
  {
    label: "Development Tools",
    skills: ["FastAPI", "ReactJS", "Git", "Conda", "LaTeX", "Claude Code"],
    accent: "#fb923c",
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 border-t border-white/6">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, transform: "translateY(20px)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#444] mb-2">05</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#f0f0f0]">
            Skills
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, transform: "translateY(20px)" }}
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: ci * 0.05, ease: EASE }}
              className="p-4 rounded-2xl border border-white/7 bg-[#161616] hover:border-white/12 transition-colors duration-300"
            >
              {/* Category label */}
              <div
                className="font-mono text-[10px] uppercase tracking-[0.15em] mb-3 pb-2.5 border-b"
                style={{ color: cat.accent, borderColor: "rgba(255,255,255,0.06)" }}
              >
                {cat.label}
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((skill, si) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, transform: "scale(0.9)" }}
                    whileInView={{ opacity: 1, transform: "scale(1)" }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: ci * 0.04 + si * 0.03,
                      ease: EASE,
                    }}
                    className="text-xs text-[#888] bg-white/4 border border-white/7 px-2 py-0.5 rounded-md"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
