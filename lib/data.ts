// ─── Experience Data ─────────────────────────────────────────────────────────

export type RoleType = "Research" | "Engineering" | "Both";

export interface Impact {
  value: string;
  label: string;
}

export interface ExperienceItem {
  slug: string;
  company: string;
  role: string;
  period: string;
  location: string;
  type: RoleType;
  current?: boolean;
  shortDesc: string;
  tools: string[];
  // detail page
  impact: Impact[];
  fullBullets: string[];
  diagramType: string;
  context: string;
}

export const experiences: ExperienceItem[] = [
  {
    slug: "university-siegen",
    company: "University of Siegen",
    role: "AI Researcher & Engineer",
    period: "04/2026 – Present",
    location: "Siegen, Germany",
    type: "Both",
    current: true,
    shortDesc:
      "Advancing multimodal Human Activity Recognition using IMU sensors and vision foundation models.",
    tools: ["PyTorch", "CLIP", "DINOv2", "DINOv3", "SLURM", "Python"],
    impact: [
      { value: "10%", label: "improvement in annotation accuracy" },
      { value: "80%", label: "reduction in manual labeling effort" },
      { value: "40+", label: "subjects in the sensor dataset" },
      { value: "100K+", label: "sensor windows auto-annotated" },
    ],
    context:
      "Human Activity Recognition (HAR) using wearable IMUs is limited by expensive manual annotation. This project uses vision-language foundation models to automatically annotate sensor streams.",
    fullBullets: [
      "Collaborating within an interdisciplinary research team to advance multimodal Human Activity Recognition (HAR) by exploring inertial measurement units (IMUs) and vision-based foundational models (CLIP, DINOv2, DINOv3).",
      "Engineered an automated annotation pipeline that leverages feature extraction from vision and IMU foundational models to label sensor streams, achieving a 10% improvement in annotation accuracy over baseline methods.",
      "Conducting downstream activity recognition and classification studies to evaluate the impact of the refined annotations on final model generalization and accuracy.",
      "Building PyTorch-based preprocessing and feature-extraction pipelines for multi-modal time-series and sensor data across 40+ subjects, standardizing inputs for downstream model training.",
    ],
    diagramType: "har",
  },
  {
    slug: "bosch-researcher",
    company: "Robert Bosch GmbH",
    role: "AI Researcher & Engineer",
    period: "09/2025 – 03/2026",
    location: "Hildesheim, Germany",
    type: "Both",
    shortDesc:
      "Master thesis: novel multi-embedding architecture for controllable image generation. ICPR 2026 oral accepted.",
    tools: [
      "Stable Diffusion",
      "FLUX",
      "Diffusers",
      "LoRA",
      "PyTorch",
      "SLURM",
      "BLIP",
    ],
    impact: [
      { value: "~10%", label: "factor disentanglement improvement" },
      { value: "150+", label: "participants in user validation study" },
      { value: "40%", label: "reduction in experiment iteration cycles" },
      { value: "ICPR 2026", label: "oral presentation accepted" },
    ],
    context:
      "The thesis investigated how to condition text-to-image generation on multiple independent visual factors — camera lens, sensor type, viewpoint, and domain — simultaneously and controllably, without entanglement between factors.",
    fullBullets: [
      "Collaborated with an interdisciplinary research team from Bosch Research and ETH Zurich to conduct master thesis on text-to-image, multimodal foundational methods and continual learning.",
      "Proposed and implemented a novel multi-embedding architecture aimed at disentangling visual concepts; achieved a ~10% improvement in factor disentanglement compared to established baseline models.",
      "Designed and established a standardised benchmark to quantitatively evaluate the adaptability of generative systems to unseen visual concepts.",
      "Executed large-scale model training and ablation studies using HPC environments (SLURM/multi-GPU) to validate the scalability and robustness of the proposed method.",
      "Assembled an automated BLIP-based captioning and metadata-filtering pipeline structuring 15+ object-detection datasets for generative fine-tuning, shrinking manual captioning time by 90%.",
      "Created a DINOv3-based automated evaluation framework to track generation quality and degradation across training iterations.",
      "Validated generation outputs through a 150+ participant user study.",
    ],
    diagramType: "multi",
  },
  {
    slug: "bosch-intern",
    company: "Robert Bosch GmbH",
    role: "AI Engineer (Intern)",
    period: "04/2025 – 09/2025",
    location: "Hildesheim, Germany",
    type: "Both",
    shortDesc:
      "Investigated latent space disentanglement in foundation models; fine-tuned diffusion models with LoRA/QLoRA on driving datasets.",
    tools: ["LoRA", "QLoRA", "Docker", "MLflow", "PyTorch", "Diffusers"],
    impact: [
      { value: "~5%", label: "disentanglement accuracy improvement" },
      { value: "91%", label: "reduction in local setup time via Docker" },
      { value: "4→1.5w", label: "release-to-validation time cut" },
      { value: "100%", label: "reproducible experiment tracking" },
    ],
    context:
      "An investigative internship into what limits current multimodal synthesis: how entangled are visual factors in the latent space of foundation models, and can parameter-efficient fine-tuning methods like LoRA/QLoRA address it?",
    fullBullets: [
      "Conducted a technical investigation into latent space disentanglement within foundational models to identify limitations in current multimodal synthesis.",
      "Developed an embedding-based multimodal prototype that optimized model efficiency and increased disentanglement accuracy by ~5%.",
      "Fine-tuned diffusion models with LoRA and QLoRA on domain-specific driving datasets to generate high-fidelity synthetic camera scenarios.",
      "Established reusable PyTorch/Diffusers/Transformers workflows to compare model variants, hyperparameters, and output quality.",
      "Containerized distributed training with Docker and tracked experiments in MLflow, trimming local setup time by 91% and enabling fully reproducible model tracking.",
      "Reduced release-to-validation time from 4 weeks to 1.5 weeks through automated dataset and experiment tracking.",
    ],
    diagramType: "lora",
  },
  {
    slug: "fraunhofer",
    company: "Fraunhofer Institute for Mechatronic Systems Design",
    role: "GenAI Engineer",
    period: "06/2024 – 03/2025",
    location: "Paderborn, Germany",
    type: "Engineering",
    shortDesc:
      "Built a GPT-4o OCR microservice and production RAG engine with hybrid search. Delivered full-stack ReactJS frontend.",
    tools: [
      "GPT-4o",
      "LangChain",
      "ChromaDB",
      "Pinecone",
      "FastAPI",
      "ReactJS",
    ],
    impact: [
      { value: "97%", label: "OCR parsing accuracy" },
      { value: "40%", label: "compliance review speed improvement" },
      { value: "15%", label: "misclassification rate reduction" },
      { value: "70%", label: "manual review overhead eliminated" },
    ],
    context:
      "A GenAI incubator project at Fraunhofer: take document intelligence from research prototype to a production microservice that lawyers and compliance teams can actually use — OCR, retrieval, generation, and a usable frontend.",
    fullBullets: [
      "Productionized a GPT-4o-powered document intelligence microservice via FastAPI, reaching 97% OCR parsing accuracy on handwritten historical and policy documents.",
      "Architected a production RAG engine (LangChain, ChromaDB, Pinecone) with hybrid search and metadata filtering, improving retrieval-driven compliance review speed by 40%.",
      "Implemented few-shot prompting and system-level optimizations that reduced misclassification rates by ~15% and significantly decreased manual review overhead by ~70%.",
      "Delivered a ReactJS front end for document upload, retrieval, analysis, and AI-assisted review.",
      "Conducted research on OCR tasks and developed an Information Extraction system, leveraging the Flamingo OCR and GPT-4o API.",
    ],
    diagramType: "rag",
  },
  {
    slug: "sp-capital-iq",
    company: "S&P Capital IQ",
    role: "Engineer I — Site Reliability Engineer",
    period: "08/2022 – 09/2023",
    location: "Hyderabad, India",
    type: "Engineering",
    shortDesc:
      "Built and scaled AWS infrastructure with Terraform across 10+ services. Engineered Datadog observability cutting MTTD by 70%.",
    tools: ["AWS", "Terraform", "Datadog", "Python", "SQL"],
    impact: [
      { value: "99.9%+", label: "uptime across 10+ services" },
      { value: "70%", label: "reduction in Mean Time to Detection" },
      { value: "10+", label: "AWS services managed with Terraform IaC" },
      { value: "7-member", label: "global infrastructure team" },
    ],
    context:
      "First engineering role after graduation: site reliability at a global financial data company. Responsibility for infrastructure that serves financial professionals worldwide — uptime is not optional.",
    fullBullets: [
      "Built and scaled AWS infrastructure with Terraform across 10+ services, sustaining 99.9%+ uptime.",
      "Engineered Datadog-based observability, cutting Mean Time to Detection by 70%.",
      "Automated cost, metric, and incident-reporting pipelines within a 7-member global infrastructure team.",
    ],
    diagramType: "sre",
  },
  {
    slug: "adrin",
    company: "ADRIN (Advanced Data Processing Research Institute)",
    role: "Machine Learning Research Intern",
    period: "01/2022 – 06/2022",
    location: "Hyderabad, India",
    type: "Research",
    shortDesc:
      "Developed a TensorFlow voice-command system for UAV/UGV control — 95% accuracy, 17 commands, deployed on Raspberry Pi.",
    tools: ["TensorFlow", "AttRNN", "Raspberry Pi", "ZeroTier VPN", "Python"],
    impact: [
      { value: "95%", label: "real-time accuracy on 17 commands" },
      { value: "<10ms", label: "inference latency on Raspberry Pi" },
      { value: "2", label: "vehicle types controlled (UAV + UGV)" },
      { value: "B.E. Thesis", label: "basis for 1st-prize final year project" },
    ],
    context:
      "Final-year B.E. research internship: build a voice-controlled system that lets operators command unmanned aerial and ground vehicles in real time, using a model small enough to run on edge hardware.",
    fullBullets: [
      "Researched voice command control and developed a Voice Control and Command System for Unmanned Aerial and Ground Vehicles (UAV/UGV).",
      "Built an AttRNN model using TensorFlow, achieving 95% accuracy on the Google Speech Commands dataset.",
      "Implemented real-time remote control by deploying the model on a Raspberry Pi and establishing secure communication via ZeroTier VPN.",
      "The system served as the basis for the Best Final Year Project award (1st prize among ~120 competing teams).",
    ],
    diagramType: "voice",
  },
];

// ─── Project Data ─────────────────────────────────────────────────────────────

export interface ProjectItem {
  slug: string;
  title: string;
  shortDesc: string;
  tools: string[];
  accent: string;
  // detail page
  impact: Impact[];
  fullDesc: string;
  fullBullets: string[];
  diagramType: string;
}

export const projects: ProjectItem[] = [
  {
    slug: "german-legal-ai",
    title: "German Legal AI Assistant & Enterprise RAG Engine",
    shortDesc:
      "Multilingual RAG pipeline over 9,000+ legal document chunks. Sub-200ms latency with semantic-hallucination monitoring.",
    tools: ["LangChain", "ChromaDB", "Pinecone", "MiniLM-L12", "Langfuse", "FastAPI"],
    accent: "#10b981",
    impact: [
      { value: "9,000+", label: "metadata-tagged document chunks" },
      { value: "<200ms", label: "latency on metadata-aware search" },
      { value: "40", label: "automated hallucination tests" },
      { value: "2", label: "languages: German + English" },
    ],
    fullDesc:
      "A production-grade RAG system built to handle German legal documents — a domain where hallucination is unacceptable and retrieval precision is critical. The pipeline combines dense retrieval with metadata filtering and citation-grounded generation.",
    fullBullets: [
      "Assembled a multilingual (German/English) RAG pipeline over 9,000+ metadata-tagged legal document chunks using MiniLM-L12 embeddings and citation-grounded response generation.",
      "Implemented semantic-hallucination monitoring with Langfuse and 40 automated tests, achieving sub-200ms latency on metadata-aware search.",
      "Designed a hybrid retrieval approach combining dense vector search (ChromaDB, Pinecone) with BM25-style metadata filtering for precision in legal domain queries.",
    ],
    diagramType: "rag",
  },
  {
    slug: "askdoc",
    title: "AskDoc — Research Paper RAG Assistant",
    shortDesc:
      "Document QA system converting research papers into searchable FAISS embeddings for natural-language querying.",
    tools: ["FAISS", "Sentence Transformers", "LangChain", "Python"],
    accent: "#60a5fa",
    impact: [
      { value: "FAISS", label: "vector search over dense embeddings" },
      { value: "NL", label: "natural-language query interface" },
      { value: "Source", label: "grounded citation-backed answers" },
      { value: "PDF", label: "direct ingestion from research PDFs" },
    ],
    fullDesc:
      "A tool to make research papers queryable in natural language. Users upload PDFs which are chunked, embedded, and indexed in FAISS. Queries return semantically relevant passages with source attribution.",
    fullBullets: [
      "Developed a document QA system converting research papers into searchable embeddings for natural-language querying.",
      "Built source-grounded answer generation over FAISS vector search — answers cite the exact passage they come from.",
      "Supports multi-document ingestion — query across a reading list, not just a single paper.",
    ],
    diagramType: "askdoc",
  },
  {
    slug: "jigsaw-puzzle",
    title: "Jigsaw Puzzle Solver using Computer Vision",
    shortDesc:
      "End-to-end CV pipeline with SAM segmentation, projective transforms, and graph-based matching. Solves ~80% of complex puzzles.",
    tools: ["OpenCV", "SAM", "Python", "NumPy"],
    accent: "#c084fc",
    impact: [
      { value: "~80%", label: "solve accuracy on complex puzzles" },
      { value: "Zero-shot", label: "SAM segmentation — no piece templates" },
      { value: "QR", label: "projective transform for coordinate rectification" },
      { value: "Graph", label: "matching with recursive backtracking" },
    ],
    fullDesc:
      "An end-to-end computer vision pipeline that takes a scattered jigsaw puzzle and reconstructs it without any prior knowledge of the piece shapes. Uses Segment Anything Model for zero-shot segmentation, projective transforms for orientation correction, and a graph-based solver.",
    fullBullets: [
      "Developed an end-to-end computer vision pipeline utilizing QR-based projective transforms for coordinate rectification and Segment Anything Model (SAM) for zero-shot segmentation of individual puzzle pieces.",
      "Implemented automated rotation correction and utilized specialized OpenCV algorithms for piece identification, including shape-based corner detection and color-profile matching.",
      "Engineered a graph-based matching algorithm combined with recursive backtracking to perform robust piece alignment and solve ~80% of complex, large-scale puzzles.",
    ],
    diagramType: "cv",
  },
  {
    slug: "microscopic-denoising",
    title: "Denoise Microscopic Data with Deep Learning",
    shortDesc:
      "UNet-based denoising model achieving ~54% PSNR improvement over classical filters on biological datasets.",
    tools: ["PyTorch", "UNet", "NumPy", "Matplotlib"],
    accent: "#f59e0b",
    impact: [
      { value: "~54%", label: "PSNR improvement over classical filters" },
      { value: "2", label: "benchmark datasets: LiveCell + Mouse Actin" },
      { value: "UNet", label: "Blind Spot Denoising architecture" },
      { value: "3", label: "filters benchmarked: Gaussian, Median, Box3D" },
    ],
    fullDesc:
      "A deep learning approach to denoising fluorescence microscopy images, where noise degrades the ability to detect cellular structures. Implemented a UNet architecture inspired by Blind Spot Denoising and benchmarked against classical signal processing filters.",
    fullBullets: [
      "Investigated deep learning-based denoising techniques for microscopic imaging by implementing a UNet architecture inspired by Blind Spot Denoising.",
      "Conducted a comparative analysis between deep learning approaches and classical filters (Gaussian, Median, Box3D), quantifying a ~54% PSNR improvement in image fidelity.",
      "Validated and benchmarked model performance on specialized biological datasets, including LiveCell and Mouse Actin.",
    ],
    diagramType: "unet",
  },
  {
    slug: "christmas-classification",
    title: "Christmas Image Classification",
    shortDesc:
      "Transfer learning benchmark comparing AlexNet, ResNet, GoogLeNet. Fine-tuned to 91% accuracy with 8–12% gain from hyperparameter tuning.",
    tools: ["PyTorch", "GoogLeNet", "AlexNet", "ResNet", "Python"],
    accent: "#f87171",
    impact: [
      { value: "91%", label: "classification accuracy (GoogLeNet)" },
      { value: "8–12%", label: "accuracy gain from hyperparameter tuning" },
      { value: "3", label: "architectures benchmarked" },
      { value: "Domain", label: "specific fine-tuning from ImageNet" },
    ],
    fullDesc:
      "An empirical transfer learning study: which CNN architecture best adapts to a highly domain-specific dataset (Christmas imagery) via fine-tuning from ImageNet weights? Compared AlexNet, ResNet, and GoogLeNet under controlled conditions.",
    fullBullets: [
      "Performed an empirical study on transfer learning by fine-tuning GoogLeNet in PyTorch for high-accuracy domain-specific image classification.",
      "Executed an architectural benchmarking study comparing AlexNet, ResNet, and GoogLeNet, optimizing model selection to achieve a 91% classification accuracy.",
      "Quantified the impact of hyperparameter tuning and curated datasets, resulting in an 8–12% accuracy gain over baseline architectural configurations.",
    ],
    diagramType: "transfer",
  },
];
