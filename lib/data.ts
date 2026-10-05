// All portfolio content lives here. Every number traces to one of the two CVs
// (research framing and engineering framing, both dated 2026-10-04).

export type Framing = "research" | "engineering";

/** A string that reads differently in research and engineering framing. */
export interface Framed<T = string> {
  research: T;
  engineering: T;
}

export type RoleType = "Research" | "Engineering" | "Both";

export interface Impact {
  value: string;
  label: string;
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export const profile = {
  name: "Sonali Godavarthy",
  email: "godavarthysonali@gmail.com",
  phone: "+49 1515 8879503",
  location: "Siegen, Germany",
  relocate: "Open to relocate",
  links: {
    linkedin: "https://www.linkedin.com/in/sonali-godavarthy-982a31184/",
    github: "https://github.com/SonaliGodavarthy",
    scholar: "https://scholar.google.com/citations?user=Qn4h9lwAAAAJ&hl=en",
  },
  title: "AI Research Engineer",
  heroLine:
    "I love working with images and video: building computer vision systems that help machines see, understand and create them.",
  about: {
    research: [
      "I work on generative AI, computer vision and foundation models. Most of my time goes into new methods, benchmarks and evaluation frameworks for controllable image generation and multimodal activity recognition.",
      "My master’s thesis with Bosch Research and ETH Zurich asked how a text-to-image model can learn several visual concepts incrementally and keep them apart. It became two papers, one of them an oral at ICPR 2026. Today I’m at the University of Siegen, using vision foundation models to label IMU sensor data.",
    ],
    engineering: [
      "I build generative AI, computer vision and applied ML systems: diffusion models, retrieval-augmented LLM systems and vision-language pipelines, trained and evaluated on SLURM-based HPC clusters.",
      "Before ML I was a site reliability engineer, running AWS infrastructure for a global financial data company. That shaped how I work now: I care about moving models out of experiments and into systems people can rely on.",
    ],
  } satisfies Framed<string[]>,
  languages: [
    { name: "English", level: "" },
    { name: "German", level: "Conversational (B1)" },
    { name: "Hindi", level: "" },
  ],
};

// ─── Publications ────────────────────────────────────────────────────────────

export interface Paper {
  id: string;
  short: string;
  title: string;
  venue: string;
  venueLong: string;
  status: string;
  authors: string[];
  summary: string;
  pages?: string;
  bibtex: string;
}

const AUTHORS = [
  "S. Godavarthy",
  "M. Neuwirth-Trapp",
  "T. F. Faasch",
  "M. Bieshaar",
  "M. Moeller",
];

export const papers: Paper[] = [
  {
    id: "multi",
    short: "MULTI",
    title:
      "MULTI: Disentangling Camera Lens, Sensor, View, and Domain for Novel Image Generation",
    venue: "ICPR 2026",
    venueLong: "International Conference on Pattern Recognition",
    status: "Oral presentation",
    authors: AUTHORS,
    pages: "279-293",
    summary:
      "A multi-embedding approach that separates four imaging factors, so a text-to-image model can change the lens without changing the domain, or the sensor without moving the camera. It improves factor disentanglement by about 10% over established baselines, and comes with a benchmark for how well generators adapt to unseen visual concepts.",
    bibtex: `@inproceedings{godavarthy2026multi,
  title     = {MULTI: Disentangling Camera Lens, Sensor, View, and Domain for Novel Image Generation},
  author    = {Godavarthy, Sonali and Neuwirth-Trapp, M. and Faasch, T. F. and Bieshaar, M. and Moeller, M. and others},
  booktitle = {International Conference on Pattern Recognition (ICPR)},
  pages     = {279--293},
  year      = {2026}
}`,
  },
  {
    id: "x-multi",
    short: "X-MULTI",
    title:
      "X-MULTI: VLM-based Imaging Factor Disentanglement for Factor-Aware Image Synthesis",
    venue: "ECCV 2026 Workshop",
    venueLong:
      "2nd Workshop on Multimodal Large Language Models for Unified Comprehension and Generation (MUCG)",
    status: "Accepted paper",
    authors: AUTHORS,
    summary:
      "Brings a vision-language model into the loop to disentangle imaging factors, extending MULTI toward factor-aware image synthesis.",
    bibtex: `@inproceedings{godavarthy2026xmulti,
  title     = {X-MULTI: VLM-based Imaging Factor Disentanglement for Factor-Aware Image Synthesis},
  author    = {Godavarthy, Sonali and Neuwirth-Trapp, M. and Faasch, T. F. and Bieshaar, M. and Moeller, M. and others},
  booktitle = {2nd Workshop on Multimodal Large Language Models for Unified Comprehension and Generation (MUCG), ECCV},
  year      = {2026}
}`,
  },
];

// ─── Experience ──────────────────────────────────────────────────────────────

export interface ExperienceItem {
  slug: string;
  company: string;
  companyShort: string;
  role: Framed;
  start: string;
  end: string;
  location: string;
  type: RoleType;
  current?: boolean;
  /** Small roles show in the timeline without a case study. */
  minor?: boolean;
  summary: Framed;
  bullets: Framed<string[]>;
  tools: string[];
  // detail page
  impact: Impact[];
  context: string;
  diagramType: string;
}

export const experiences: ExperienceItem[] = [
  {
    slug: "university-siegen",
    company: "University of Siegen",
    companyShort: "Uni Siegen",
    role: { research: "AI Researcher", engineering: "AI Engineer" },
    start: "Apr 2026",
    end: "Present",
    location: "Siegen, Germany",
    type: "Both",
    current: true,
    summary: {
      research:
        "Multimodal Human Activity Recognition: using IMUs together with vision foundation models (CLIP, DINOv2, DINOv3) to label sensor streams automatically.",
      engineering:
        "PyTorch pipelines for multimodal sensor data across 40+ subjects, plus a vision-language auto-labeler for 100,000+ sensor windows.",
    },
    bullets: {
      research: [
        "Collaborating in an interdisciplinary team to advance multimodal Human Activity Recognition with inertial measurement units and vision foundation models (CLIP, DINOv2, DINOv3).",
        "Engineered an automated annotation pipeline that uses features from vision and IMU foundation models to label sensor streams, improving annotation accuracy by 10% over baseline methods.",
        "Running downstream activity recognition and classification studies to measure how the refined annotations affect generalization and accuracy.",
      ],
      engineering: [
        "Building PyTorch-based preprocessing and feature-extraction pipelines for multimodal time-series and sensor data across 40+ subjects, standardizing inputs for downstream training.",
        "Designing an automated labeling pipeline with vision-language models (CLIP, DINOv2, DINOv3) to annotate 100,000+ sensor windows, cutting manual labeling effort by 80% at 90% classification accuracy.",
      ],
    },
    tools: ["PyTorch", "CLIP", "DINOv2", "DINOv3", "SLURM", "Python"],
    impact: [
      { value: "10%", label: "better annotation accuracy than baselines" },
      { value: "80%", label: "less manual labeling effort" },
      { value: "40+", label: "subjects in the sensor dataset" },
      { value: "100K+", label: "sensor windows auto-annotated" },
    ],
    context:
      "Activity recognition from wearable IMUs is held back by how expensive it is to label sensor data by hand. This project uses vision and vision-language foundation models to annotate the sensor streams automatically, then checks whether the better labels lead to better downstream models.",
    diagramType: "har",
  },
  {
    slug: "bosch-researcher",
    company: "Robert Bosch GmbH",
    companyShort: "Bosch",
    role: { research: "AI Researcher", engineering: "AI Engineer" },
    start: "Sep 2025",
    end: "Mar 2026",
    location: "Hildesheim, Germany",
    type: "Both",
    summary: {
      research:
        "Master’s thesis with Bosch Research and ETH Zurich: a multi-embedding architecture that disentangles visual concepts in text-to-image models. It became the ICPR 2026 oral paper.",
      engineering:
        "Built a controllable image-generation method on Stable Diffusion and FLUX, with BLIP captioning, DINOv3-based evaluation and SLURM-scale training.",
    },
    bullets: {
      research: [
        "Conducted my master’s thesis on text-to-image generation, multimodal foundation models and continual learning, with a team from Bosch Research and ETH Zurich.",
        "Proposed and implemented a multi-embedding architecture for disentangling visual concepts, improving factor disentanglement by about 10% over established baselines.",
        "Designed a standardised benchmark that measures how well generative systems adapt to unseen visual concepts.",
        "Ran large-scale training and ablation studies on SLURM / multi-GPU HPC to validate scalability and robustness.",
      ],
      engineering: [
        "Developed a controllable image-generation method adapting Stable Diffusion and FLUX to condition on camera lens, sensor, viewpoint and domain: the core of an ICPR 2026 paper with Bosch Research and ETH Zurich.",
        "Assembled an automated BLIP captioning and metadata-filtering pipeline that structured 15+ object-detection datasets for generative fine-tuning, cutting manual captioning time by 90%.",
        "Created a DINOv3-based evaluation framework to track generation quality and degradation across training iterations.",
        "Scaled training and evaluation on a SLURM cluster, shortening experiment iteration cycles by 40%.",
        "Validated generation outputs through a user study with 150+ participants.",
      ],
    },
    tools: ["Stable Diffusion", "FLUX", "Diffusers", "LoRA", "BLIP", "DINOv3", "PyTorch", "SLURM"],
    impact: [
      { value: "~10%", label: "better factor disentanglement than baselines" },
      { value: "150+", label: "participants in the user study" },
      { value: "40%", label: "shorter experiment iteration cycles" },
      { value: "Oral", label: "presentation at ICPR 2026" },
    ],
    context:
      "The thesis asked how to condition text-to-image generation on several independent imaging factors at once (camera lens, sensor, viewpoint and domain) so that each can be changed without dragging the others along, and how to keep learning new concepts incrementally.",
    diagramType: "multi",
  },
  {
    slug: "bosch-intern",
    company: "Robert Bosch GmbH",
    companyShort: "Bosch",
    role: { research: "AI Researcher (Intern)", engineering: "AI Engineer (Intern)" },
    start: "Apr 2025",
    end: "Sep 2025",
    location: "Hildesheim, Germany",
    type: "Both",
    summary: {
      research:
        "Investigated how entangled visual factors are in the latent space of foundation models, and built an embedding-based prototype that improved disentanglement.",
      engineering:
        "Fine-tuned diffusion models with LoRA and QLoRA on driving data, with Docker-based training and MLflow tracking.",
    },
    bullets: {
      research: [
        "Investigated latent-space disentanglement in foundation models to find the limits of current multimodal synthesis.",
        "Developed an embedding-based multimodal prototype that improved model efficiency and raised disentanglement accuracy by about 5%.",
        "Evaluated the method across downstream generative tasks, weighing computational efficiency against image fidelity.",
      ],
      engineering: [
        "Fine-tuned diffusion models with LoRA and QLoRA on domain-specific driving datasets to generate high-fidelity synthetic camera scenarios.",
        "Established reusable PyTorch / Diffusers / Transformers workflows to compare model variants, hyperparameters and output quality.",
        "Containerized distributed training with Docker and tracked experiments in MLflow, cutting local setup time by 91% and making every run reproducible.",
        "Reduced release-to-validation time from 4 weeks to 1.5 weeks through automated dataset and experiment tracking.",
      ],
    },
    tools: ["LoRA", "QLoRA", "Diffusers", "PyTorch", "Docker", "MLflow"],
    impact: [
      { value: "~5%", label: "better disentanglement accuracy" },
      { value: "91%", label: "less local setup time with Docker" },
      { value: "4 to 1.5", label: "weeks from release to validation" },
      { value: "LoRA", label: "and QLoRA fine-tuning on driving data" },
    ],
    context:
      "An investigative internship into what limits multimodal synthesis today: how entangled are visual factors inside foundation models, and how far can parameter-efficient fine-tuning take a diffusion model on a specific domain?",
    diagramType: "lora",
  },
  {
    slug: "fraunhofer",
    company: "Fraunhofer Institute for Mechatronic Systems Design",
    companyShort: "Fraunhofer IEM",
    role: {
      research: "AI Research Engineer, GenAI Incubator",
      engineering: "GenAI Engineer",
    },
    start: "Jun 2024",
    end: "Mar 2025",
    location: "Paderborn, Germany",
    type: "Engineering",
    summary: {
      research:
        "Researched OCR and information extraction with Flamingo OCR and GPT-4o, using few-shot prompting to cut misclassification.",
      engineering:
        "Shipped a GPT-4o document-intelligence microservice and a production RAG engine with hybrid search, plus the React front end.",
    },
    bullets: {
      research: [
        "Researched OCR tasks and built an information extraction system on Flamingo OCR and the GPT-4o API.",
        "Implemented few-shot prompting and system-level optimizations that reduced misclassification by about 15% and manual review overhead by about 70%.",
        "Built a ReactJS front end for visualizing, annotating and benchmarking OCR results.",
      ],
      engineering: [
        "Productionized a GPT-4o document-intelligence microservice with FastAPI, reaching 97% OCR parsing accuracy on handwritten historical and policy documents.",
        "Architected a production RAG engine (LangChain, ChromaDB, Pinecone) with hybrid search and metadata filtering, speeding up retrieval-driven compliance review by 40%.",
        "Delivered a ReactJS front end for document upload, retrieval, analysis and AI-assisted review.",
      ],
    },
    tools: ["GPT-4o", "LangChain", "ChromaDB", "Pinecone", "FastAPI", "ReactJS"],
    impact: [
      { value: "97%", label: "OCR parsing accuracy" },
      { value: "40%", label: "faster compliance review" },
      { value: "~15%", label: "fewer misclassifications" },
      { value: "~70%", label: "less manual review overhead" },
    ],
    context:
      "A GenAI incubator project: take document intelligence from a research prototype to a service people can use, covering OCR on handwritten documents, retrieval, generation and a usable front end.",
    diagramType: "rag",
  },
  {
    slug: "sp-capital-iq",
    company: "S&P Capital IQ",
    companyShort: "S&P Capital IQ",
    role: {
      research: "Engineer I, Site Reliability",
      engineering: "Site Reliability Engineer",
    },
    start: "Aug 2022",
    end: "Sep 2023",
    location: "Hyderabad, India",
    type: "Engineering",
    summary: {
      research:
        "Site reliability for a global financial data platform: AWS infrastructure as code and Datadog observability.",
      engineering:
        "Built and scaled AWS infrastructure with Terraform across 10+ services at 99.9%+ uptime, and cut Mean Time to Detection by 70%.",
    },
    bullets: {
      research: [
        "Built and scaled AWS infrastructure with Terraform across 10+ services, sustaining 99.9%+ uptime.",
        "Engineered Datadog-based observability, cutting Mean Time to Detection by 70%.",
        "Automated cost, metric and incident-reporting pipelines within a 7-member global infrastructure team.",
      ],
      engineering: [
        "Built and scaled AWS infrastructure with Terraform across 10+ services, sustaining 99.9%+ uptime.",
        "Engineered Datadog-based observability, cutting Mean Time to Detection by 70%.",
        "Automated cost, metric and incident-reporting pipelines within a 7-member global infrastructure team.",
      ],
    },
    tools: ["AWS", "Terraform", "Datadog", "Python", "SQL"],
    impact: [
      { value: "99.9%+", label: "uptime across 10+ services" },
      { value: "70%", label: "faster Mean Time to Detection" },
      { value: "10+", label: "AWS services managed as code" },
      { value: "7", label: "engineers in the global infra team" },
    ],
    context:
      "First engineering role after graduating: site reliability at a global financial data company, for infrastructure that financial professionals depend on around the clock.",
    diagramType: "sre",
  },
  {
    slug: "brane-services",
    company: "Brane Services",
    companyShort: "Brane Services",
    role: { research: "Project Intern", engineering: "Project Intern" },
    start: "May 2022",
    end: "Jul 2022",
    location: "Hyderabad, India",
    type: "Engineering",
    minor: true,
    summary: {
      research:
        "QA internship: 20+ validation test cases and checklists that raised test coverage by 80% over three release cycles.",
      engineering:
        "QA internship: 20+ validation test cases and checklists that raised test coverage by 80% over three release cycles.",
    },
    bullets: {
      research: [
        "Designed 20+ validation test cases and QA checklists, raising application test coverage by 80% across three release cycles.",
        "Tracked and validated 30+ application defects with a 5-member team, cutting release verification effort by 30%.",
      ],
      engineering: [
        "Designed 20+ validation test cases and QA checklists, raising application test coverage by 80% across three release cycles.",
        "Tracked and validated 30+ application defects with a 5-member team, cutting release verification effort by 30%.",
      ],
    },
    tools: ["QA", "Test design"],
    impact: [],
    context: "",
    diagramType: "",
  },
  {
    slug: "adrin",
    company: "Advanced Data Processing Research Institute (ADRIN)",
    companyShort: "ADRIN",
    role: { research: "Research Intern", engineering: "Machine Learning Engineer Intern" },
    start: "Jan 2022",
    end: "Jun 2022",
    location: "Hyderabad, India",
    type: "Research",
    summary: {
      research:
        "Bachelor’s thesis research: a voice control and command system for unmanned aerial and ground vehicles.",
      engineering:
        "A TensorFlow voice-command recognizer for UAV/UGV control: 95% real-time accuracy on 17 commands, under 10 ms on a Raspberry Pi.",
    },
    bullets: {
      research: [
        "Researched voice command control and developed a Voice Control and Command System for Unmanned Aerial and Ground Vehicles (UAV/UGV).",
        "Built an AttRNN model in TensorFlow, reaching 95% accuracy on the Google Speech Commands dataset.",
        "Implemented real-time remote control by deploying the model on a Raspberry Pi with secure communication over a ZeroTier VPN.",
      ],
      engineering: [
        "Developed a TensorFlow voice-command recognition system for UAV/UGV control, reaching 95% real-time accuracy across 17 commands, deployed on a Raspberry Pi at under 10 ms inference latency.",
      ],
    },
    tools: ["TensorFlow", "AttRNN", "Raspberry Pi", "ZeroTier VPN", "Python"],
    impact: [
      { value: "95%", label: "real-time accuracy on 17 commands" },
      { value: "<10 ms", label: "inference latency on a Raspberry Pi" },
      { value: "2", label: "vehicle types: aerial and ground" },
      { value: "1st", label: "prize, Best Final Year Project" },
    ],
    context:
      "Research internship behind my bachelor’s thesis: let operators command unmanned aerial and ground vehicles by voice, in real time, with a model small enough for edge hardware.",
    diagramType: "voice",
  },
];

// ─── Projects ────────────────────────────────────────────────────────────────

export interface ProjectItem {
  slug: string;
  title: string;
  shortTitle: string;
  shortDesc: string;
  tools: string[];
  impact: Impact[];
  fullDesc: string;
  fullBullets: string[];
  diagramType: string;
}

export const projects: ProjectItem[] = [
  {
    slug: "german-legal-ai",
    title: "German Legal AI Assistant & Enterprise RAG Engine",
    shortTitle: "German Legal AI",
    shortDesc:
      "Multilingual RAG over 9,000+ legal document chunks, with citation-grounded answers and hallucination monitoring.",
    tools: ["MiniLM-L12", "Langfuse", "RAG", "Python"],
    impact: [
      { value: "9,000+", label: "metadata-tagged document chunks" },
      { value: "<200 ms", label: "metadata-aware search latency" },
      { value: "40", label: "automated tests" },
      { value: "2", label: "languages: German and English" },
    ],
    fullDesc:
      "A retrieval-augmented assistant for German legal documents, a domain where a made-up citation is worse than no answer. Retrieval is metadata-aware, every answer is grounded in cited chunks, and hallucination is monitored rather than hoped against.",
    fullBullets: [
      "Assembled a multilingual (German/English) RAG pipeline over 9,000+ metadata-tagged legal document chunks using MiniLM-L12 embeddings and citation-grounded response generation.",
      "Implemented semantic-hallucination monitoring with Langfuse and 40 automated tests, achieving sub-200 ms latency on metadata-aware search.",
    ],
    diagramType: "rag",
  },
  {
    slug: "askdoc",
    title: "AskDoc: Research Paper RAG Assistant",
    shortTitle: "AskDoc",
    shortDesc:
      "Ask a research paper a question in plain language and get an answer grounded in its own passages.",
    tools: ["FAISS", "Embeddings", "RAG", "Python"],
    impact: [
      { value: "FAISS", label: "vector search over paper embeddings" },
      { value: "NL", label: "natural-language questions" },
      { value: "Grounded", label: "answers tied to source passages" },
      { value: "PDF", label: "research papers as input" },
    ],
    fullDesc:
      "A document QA tool that turns research papers into searchable embeddings, so you can ask questions in natural language and get answers grounded in the paper’s own text.",
    fullBullets: [
      "Developed a document QA system that converts research papers into searchable embeddings for natural-language querying.",
      "Generates source-grounded answers on top of FAISS vector search.",
    ],
    diagramType: "askdoc",
  },
  {
    slug: "jigsaw-puzzle",
    title: "Jigsaw Puzzle Solver Using Computer Vision",
    shortTitle: "Jigsaw Solver",
    shortDesc:
      "SAM segmentation, projective transforms and graph matching that reassemble ~80% of complex puzzles.",
    tools: ["OpenCV", "SAM", "Python", "NumPy"],
    impact: [
      { value: "~80%", label: "of complex, large puzzles solved" },
      { value: "Zero-shot", label: "piece segmentation with SAM" },
      { value: "QR", label: "projective rectification" },
      { value: "Graph", label: "matching with backtracking" },
    ],
    fullDesc:
      "An end-to-end computer vision pipeline that takes a photo of scattered jigsaw pieces and reconstructs the puzzle, with no templates of the piece shapes.",
    fullBullets: [
      "Built an end-to-end pipeline using QR-based projective transforms for coordinate rectification and the Segment Anything Model (SAM) for zero-shot segmentation of individual pieces.",
      "Implemented automated rotation correction and OpenCV-based piece identification, including shape-based corner detection and colour-profile matching.",
      "Engineered a graph-based matching algorithm with recursive backtracking for robust piece alignment, solving ~80% of complex, large-scale puzzles.",
    ],
    diagramType: "cv",
  },
  {
    slug: "microscopic-denoising",
    title: "Denoise Microscopic Data with Deep Learning",
    shortTitle: "Microscopy Denoising",
    shortDesc:
      "A blind-spot UNet that beats classical filters by ~54% PSNR on LiveCell and Mouse Actin.",
    tools: ["PyTorch", "UNet", "NumPy", "Matplotlib"],
    impact: [
      { value: "~54%", label: "PSNR gain over classical filters" },
      { value: "2", label: "datasets: LiveCell and Mouse Actin" },
      { value: "UNet", label: "inspired by Blind Spot Denoising" },
      { value: "3", label: "baselines: Gaussian, Median, Box3D" },
    ],
    fullDesc:
      "Deep-learning denoising for microscopy, where noise hides the cellular structure you are trying to see. A UNet inspired by Blind Spot Denoising, benchmarked against classical filters.",
    fullBullets: [
      "Investigated deep-learning denoising for microscopic imaging with a UNet architecture inspired by Blind Spot Denoising.",
      "Compared deep-learning approaches with classical filters (Gaussian, Median, Box3D), measuring a ~54% PSNR improvement in image fidelity.",
      "Validated and benchmarked performance on biological datasets including LiveCell and Mouse Actin.",
    ],
    diagramType: "unet",
  },
  {
    slug: "christmas-classification",
    title: "Christmas Image Classification",
    shortTitle: "Christmas Classifier",
    shortDesc:
      "Transfer learning study across AlexNet, ResNet and GoogLeNet. GoogLeNet won at 91%.",
    tools: ["PyTorch", "GoogLeNet", "ResNet", "AlexNet"],
    impact: [
      { value: "91%", label: "classification accuracy (GoogLeNet)" },
      { value: "8-12%", label: "gain from tuning and curation" },
      { value: "3", label: "architectures benchmarked" },
      { value: "Transfer", label: "learning from pretrained weights" },
    ],
    fullDesc:
      "An empirical transfer-learning study: which CNN adapts best to a narrow, domain-specific image set when fine-tuned in PyTorch?",
    fullBullets: [
      "Fine-tuned GoogLeNet in PyTorch for domain-specific image classification.",
      "Benchmarked AlexNet, ResNet and GoogLeNet to choose the model, reaching 91% classification accuracy.",
      "Quantified the effect of hyperparameter tuning and dataset curation: an 8-12% accuracy gain over baseline configurations.",
    ],
    diagramType: "transfer",
  },
];

// ─── Skills ──────────────────────────────────────────────────────────────────

export interface SkillGroup {
  label: string;
  items: string[];
}

export const skills: Framed<SkillGroup[]> = {
  research: [
    {
      label: "Research Areas",
      items: [
        "Generative AI",
        "Diffusion models",
        "Computer vision",
        "Multimodal learning",
        "Foundation models",
        "Human activity recognition",
        "Controllable image generation",
      ],
    },
    { label: "Generative AI", items: ["Stable Diffusion", "FLUX", "Diffusers", "LoRA", "QLoRA", "BLIP"] },
    { label: "Vision & VLMs", items: ["CLIP", "DINOv2", "DINOv3", "SAM", "OpenCV"] },
    { label: "Deep Learning", items: ["PyTorch", "TensorFlow", "Hugging Face Transformers", "Scikit-learn"] },
    {
      label: "Mathematics",
      items: ["Linear algebra", "Probability & statistics", "Calculus", "Optimization"],
    },
    {
      label: "Experiments & Infrastructure",
      items: ["SLURM", "MLflow", "Docker", "Kubernetes", "Git", "Conda", "LaTeX"],
    },
    {
      label: "Programming & Data",
      items: ["Python", "SQL", "NumPy", "Pandas", "Matplotlib", "Seaborn"],
    },
  ],
  engineering: [
    {
      label: "LLMs & RAG",
      items: [
        "LangChain",
        "LangGraph",
        "AutoGen",
        "LLaMA",
        "GPT-4o",
        "Azure OpenAI",
        "ChromaDB",
        "Pinecone",
        "FAISS",
        "Langfuse",
        "Context engineering",
      ],
    },
    { label: "Generative AI", items: ["Stable Diffusion", "FLUX", "Diffusers", "LoRA", "QLoRA", "BLIP"] },
    { label: "Vision & VLMs", items: ["CLIP", "DINOv2", "DINOv3", "SAM", "OpenCV"] },
    {
      label: "Deep Learning",
      items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "Transformers", "UNet"],
    },
    {
      label: "Cloud, DevOps & MLOps",
      items: ["AWS", "Terraform", "Docker", "Kubernetes", "GitHub Actions", "Datadog", "MLflow", "SLURM"],
    },
    {
      label: "Software",
      items: ["FastAPI", "ReactJS", "Git", "Hugging Face Hub", "Claude Code", "Conda"],
    },
    {
      label: "Programming & Data",
      items: ["Python", "SQL", "Bash", "NumPy", "Pandas", "Matplotlib", "Seaborn"],
    },
  ],
};

// ─── Education & recognition ─────────────────────────────────────────────────

export const education = [
  {
    degree: "M.Sc. Computer Science (Visual Computing)",
    institution: "University of Siegen",
    period: "2023 - 2026",
    location: "Siegen, Germany",
    grade: "1.6",
    gradeNote: "Thesis graded 1.1",
    thesis:
      "Incremental Learning for Disentangling of Multiple Visual Concepts for Text-to-Image",
  },
  {
    degree: "B.E. Information Technology",
    institution: "Vasavi College of Engineering",
    period: "2018 - 2022",
    location: "Hyderabad, India",
    grade: "1.5",
    gradeNote: "German scale",
    thesis: "Voice Control and Command System for Unmanned Aerial and Ground Vehicles",
  },
];

export const awards = [
  {
    title: "Deutschlandstipendium",
    issuer: "Studienförderfonds Siegen e.V.",
    date: "2024",
    figure: "Top 1%",
    figureNote: "of students in Germany",
    note: "Merit scholarship for academic excellence and commitment, awarded to roughly the top 1% of students in Germany.",
  },
  {
    title: "Best Project of 2021-22",
    issuer: "Vasavi College of Engineering",
    date: "2022",
    figure: "1st",
    figureNote: "of about 120 teams",
    note: "First prize for the best final-year project, out of about 120 competing teams.",
  },
];
