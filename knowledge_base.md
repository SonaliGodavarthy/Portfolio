# Sonali Godavarthy: Knowledge Base

This file is everything the website chatbot knows. Edit it to change what the chatbot can answer.

## Profile
- Name: Sonali Godavarthy
- Title: AI Research Engineer
- Tagline: I love working with images and video: building computer vision systems that help machines see, understand and create them.
- Location: Siegen, Germany (open to relocate)
- Email: godavarthysonali@gmail.com
- Phone: +49 1515 8879503
- GitHub: https://github.com/SonaliGodavarthy
- Google Scholar: https://scholar.google.com/citations?user=Qn4h9lwAAAAJ&hl=en
- LinkedIn: https://www.linkedin.com/in/sonali-godavarthy-982a31184/
- Languages: English, German (conversational, B1), Hindi

## About
I work on generative AI, computer vision and foundation models. Most of my time goes into new methods, benchmarks and evaluation frameworks for controllable image generation and multimodal activity recognition.

My master’s thesis with Bosch Research and ETH Zurich asked how a text-to-image model can learn several visual concepts incrementally and keep them apart. It became two papers, one of them an oral at ICPR 2026. Today I’m at the University of Siegen, using vision foundation models to label IMU sensor data.

I build generative AI, computer vision and applied ML systems: diffusion models, retrieval-augmented LLM systems and vision-language pipelines, trained and evaluated on SLURM-based HPC clusters.

Before ML I was a site reliability engineer, running AWS infrastructure for a global financial data company. That shaped how I work now: I care about moving models out of experiments and into systems people can rely on.

## Publications
### MULTI: Disentangling Camera Lens, Sensor, View, and Domain for Novel Image Generation
- Venue: ICPR 2026, International Conference on Pattern Recognition, pages 279-293
- Status: Oral presentation
- Authors: S. Godavarthy, M. Neuwirth-Trapp, T. F. Faasch, M. Bieshaar, M. Moeller, and others
- Summary: A multi-embedding approach that separates four imaging factors, so a text-to-image model can change the lens without changing the domain, or the sensor without moving the camera. It improves factor disentanglement by about 10% over established baselines, and comes with a benchmark for how well generators adapt to unseen visual concepts.

### X-MULTI: VLM-based Imaging Factor Disentanglement for Factor-Aware Image Synthesis
- Venue: ECCV 2026 Workshop, 2nd Workshop on Multimodal Large Language Models for Unified Comprehension and Generation (MUCG)
- Status: Accepted paper
- Authors: S. Godavarthy, M. Neuwirth-Trapp, T. F. Faasch, M. Bieshaar, M. Moeller, and others
- Summary: Brings a vision-language model into the loop to disentangle imaging factors, extending MULTI toward factor-aware image synthesis.

## Experience
### AI Researcher / AI Engineer, University of Siegen
- Dates: Apr 2026 to Present
- Location: Siegen, Germany
- Context: Activity recognition from wearable IMUs is held back by how expensive it is to label sensor data by hand. This project uses vision and vision-language foundation models to annotate the sensor streams automatically, then checks whether the better labels lead to better downstream models.
- Tools: PyTorch, CLIP, DINOv2, DINOv3, SLURM, Python
- Case study page: /experience/university-siegen
- What she did:
  - Collaborating in an interdisciplinary team to advance multimodal Human Activity Recognition with inertial measurement units and vision foundation models (CLIP, DINOv2, DINOv3).
  - Engineered an automated annotation pipeline that uses features from vision and IMU foundation models to label sensor streams, improving annotation accuracy by 10% over baseline methods.
  - Running downstream activity recognition and classification studies to measure how the refined annotations affect generalization and accuracy.
  - Building PyTorch-based preprocessing and feature-extraction pipelines for multimodal time-series and sensor data across 40+ subjects, standardizing inputs for downstream training.
  - Designing an automated labeling pipeline with vision-language models (CLIP, DINOv2, DINOv3) to annotate 100,000+ sensor windows, cutting manual labeling effort by 80% at 90% classification accuracy.
- Impact: 10% better annotation accuracy than baselines; 80% less manual labeling effort; 40+ subjects in the sensor dataset; 100K+ sensor windows auto-annotated

### AI Researcher / AI Engineer, Robert Bosch GmbH
- Dates: Sep 2025 to Mar 2026
- Location: Hildesheim, Germany
- Context: The thesis asked how to condition text-to-image generation on several independent imaging factors at once (camera lens, sensor, viewpoint and domain) so that each can be changed without dragging the others along, and how to keep learning new concepts incrementally.
- Tools: Stable Diffusion, FLUX, Diffusers, LoRA, BLIP, DINOv3, PyTorch, SLURM
- Case study page: /experience/bosch-researcher
- What she did:
  - Conducted my master’s thesis on text-to-image generation, multimodal foundation models and continual learning, with a team from Bosch Research and ETH Zurich.
  - Proposed and implemented a multi-embedding architecture for disentangling visual concepts, improving factor disentanglement by about 10% over established baselines.
  - Designed a standardised benchmark that measures how well generative systems adapt to unseen visual concepts.
  - Ran large-scale training and ablation studies on SLURM / multi-GPU HPC to validate scalability and robustness.
  - Developed a controllable image-generation method adapting Stable Diffusion and FLUX to condition on camera lens, sensor, viewpoint and domain: the core of an ICPR 2026 paper with Bosch Research and ETH Zurich.
  - Assembled an automated BLIP captioning and metadata-filtering pipeline that structured 15+ object-detection datasets for generative fine-tuning, cutting manual captioning time by 90%.
  - Created a DINOv3-based evaluation framework to track generation quality and degradation across training iterations.
  - Scaled training and evaluation on a SLURM cluster, shortening experiment iteration cycles by 40%.
  - Validated generation outputs through a user study with 150+ participants.
- Impact: ~10% better factor disentanglement than baselines; 150+ participants in the user study; 40% shorter experiment iteration cycles; Oral presentation at ICPR 2026

### AI Researcher (Intern) / AI Engineer (Intern), Robert Bosch GmbH
- Dates: Apr 2025 to Sep 2025
- Location: Hildesheim, Germany
- Context: An investigative internship into what limits multimodal synthesis today: how entangled are visual factors inside foundation models, and how far can parameter-efficient fine-tuning take a diffusion model on a specific domain?
- Tools: LoRA, QLoRA, Diffusers, PyTorch, Docker, MLflow
- Case study page: /experience/bosch-intern
- What she did:
  - Investigated latent-space disentanglement in foundation models to find the limits of current multimodal synthesis.
  - Developed an embedding-based multimodal prototype that improved model efficiency and raised disentanglement accuracy by about 5%.
  - Evaluated the method across downstream generative tasks, weighing computational efficiency against image fidelity.
  - Fine-tuned diffusion models with LoRA and QLoRA on domain-specific driving datasets to generate high-fidelity synthetic camera scenarios.
  - Established reusable PyTorch / Diffusers / Transformers workflows to compare model variants, hyperparameters and output quality.
  - Containerized distributed training with Docker and tracked experiments in MLflow, cutting local setup time by 91% and making every run reproducible.
  - Reduced release-to-validation time from 4 weeks to 1.5 weeks through automated dataset and experiment tracking.
- Impact: ~5% better disentanglement accuracy; 91% less local setup time with Docker; 4 to 1.5 weeks from release to validation; LoRA and QLoRA fine-tuning on driving data

### AI Research Engineer, GenAI Incubator / GenAI Engineer, Fraunhofer Institute for Mechatronic Systems Design
- Dates: Jun 2024 to Mar 2025
- Location: Paderborn, Germany
- Context: A GenAI incubator project: take document intelligence from a research prototype to a service people can use, covering OCR on handwritten documents, retrieval, generation and a usable front end.
- Tools: GPT-4o, LangChain, ChromaDB, Pinecone, FastAPI, ReactJS
- Case study page: /experience/fraunhofer
- What she did:
  - Researched OCR tasks and built an information extraction system on Flamingo OCR and the GPT-4o API.
  - Implemented few-shot prompting and system-level optimizations that reduced misclassification by about 15% and manual review overhead by about 70%.
  - Built a ReactJS front end for visualizing, annotating and benchmarking OCR results.
  - Productionized a GPT-4o document-intelligence microservice with FastAPI, reaching 97% OCR parsing accuracy on handwritten historical and policy documents.
  - Architected a production RAG engine (LangChain, ChromaDB, Pinecone) with hybrid search and metadata filtering, speeding up retrieval-driven compliance review by 40%.
  - Delivered a ReactJS front end for document upload, retrieval, analysis and AI-assisted review.
- Impact: 97% OCR parsing accuracy; 40% faster compliance review; ~15% fewer misclassifications; ~70% less manual review overhead

### Engineer I, Site Reliability / Site Reliability Engineer, S&P Capital IQ
- Dates: Aug 2022 to Sep 2023
- Location: Hyderabad, India
- Context: First engineering role after graduating: site reliability at a global financial data company, for infrastructure that financial professionals depend on around the clock.
- Tools: AWS, Terraform, Datadog, Python, SQL
- Case study page: /experience/sp-capital-iq
- What she did:
  - Built and scaled AWS infrastructure with Terraform across 10+ services, sustaining 99.9%+ uptime.
  - Engineered Datadog-based observability, cutting Mean Time to Detection by 70%.
  - Automated cost, metric and incident-reporting pipelines within a 7-member global infrastructure team.
- Impact: 99.9%+ uptime across 10+ services; 70% faster Mean Time to Detection; 10+ AWS services managed as code; 7 engineers in the global infra team

### Project Intern, Brane Services
- Dates: May 2022 to Jul 2022
- Location: Hyderabad, India
- Tools: QA, Test design
- What she did:
  - Designed 20+ validation test cases and QA checklists, raising application test coverage by 80% across three release cycles.
  - Tracked and validated 30+ application defects with a 5-member team, cutting release verification effort by 30%.

### Research Intern / Machine Learning Engineer Intern, Advanced Data Processing Research Institute (ADRIN)
- Dates: Jan 2022 to Jun 2022
- Location: Hyderabad, India
- Context: Research internship behind my bachelor’s thesis: let operators command unmanned aerial and ground vehicles by voice, in real time, with a model small enough for edge hardware.
- Tools: TensorFlow, AttRNN, Raspberry Pi, ZeroTier VPN, Python
- Case study page: /experience/adrin
- What she did:
  - Researched voice command control and developed a Voice Control and Command System for Unmanned Aerial and Ground Vehicles (UAV/UGV).
  - Built an AttRNN model in TensorFlow, reaching 95% accuracy on the Google Speech Commands dataset.
  - Implemented real-time remote control by deploying the model on a Raspberry Pi with secure communication over a ZeroTier VPN.
  - Developed a TensorFlow voice-command recognition system for UAV/UGV control, reaching 95% real-time accuracy across 17 commands, deployed on a Raspberry Pi at under 10 ms inference latency.
- Impact: 95% real-time accuracy on 17 commands; <10 ms inference latency on a Raspberry Pi; 2 vehicle types: aerial and ground; 1st prize, Best Final Year Project

## Projects
### German Legal AI Assistant & Enterprise RAG Engine
- Summary: A retrieval-augmented assistant for German legal documents, a domain where a made-up citation is worse than no answer. Retrieval is metadata-aware, every answer is grounded in cited chunks, and hallucination is monitored rather than hoped against.
- Tools: MiniLM-L12, Langfuse, RAG, Python
- Project page: /projects/german-legal-ai
- What she did:
  - Assembled a multilingual (German/English) RAG pipeline over 9,000+ metadata-tagged legal document chunks using MiniLM-L12 embeddings and citation-grounded response generation.
  - Implemented semantic-hallucination monitoring with Langfuse and 40 automated tests, achieving sub-200 ms latency on metadata-aware search.
- Impact: 9,000+ metadata-tagged document chunks; <200 ms metadata-aware search latency; 40 automated tests; 2 languages: German and English

### AskDoc: Research Paper RAG Assistant
- Summary: A document QA tool that turns research papers into searchable embeddings, so you can ask questions in natural language and get answers grounded in the paper’s own text.
- Tools: FAISS, Embeddings, RAG, Python
- Project page: /projects/askdoc
- What she did:
  - Developed a document QA system that converts research papers into searchable embeddings for natural-language querying.
  - Generates source-grounded answers on top of FAISS vector search.
- Impact: FAISS vector search over paper embeddings; NL natural-language questions; Grounded answers tied to source passages; PDF research papers as input

### Jigsaw Puzzle Solver Using Computer Vision
- Summary: An end-to-end computer vision pipeline that takes a photo of scattered jigsaw pieces and reconstructs the puzzle, with no templates of the piece shapes.
- Tools: OpenCV, SAM, Python, NumPy
- Project page: /projects/jigsaw-puzzle
- What she did:
  - Built an end-to-end pipeline using QR-based projective transforms for coordinate rectification and the Segment Anything Model (SAM) for zero-shot segmentation of individual pieces.
  - Implemented automated rotation correction and OpenCV-based piece identification, including shape-based corner detection and colour-profile matching.
  - Engineered a graph-based matching algorithm with recursive backtracking for robust piece alignment, solving ~80% of complex, large-scale puzzles.
- Impact: ~80% of complex, large puzzles solved; Zero-shot piece segmentation with SAM; QR projective rectification; Graph matching with backtracking

### Denoise Microscopic Data with Deep Learning
- Summary: Deep-learning denoising for microscopy, where noise hides the cellular structure you are trying to see. A UNet inspired by Blind Spot Denoising, benchmarked against classical filters.
- Tools: PyTorch, UNet, NumPy, Matplotlib
- Project page: /projects/microscopic-denoising
- What she did:
  - Investigated deep-learning denoising for microscopic imaging with a UNet architecture inspired by Blind Spot Denoising.
  - Compared deep-learning approaches with classical filters (Gaussian, Median, Box3D), measuring a ~54% PSNR improvement in image fidelity.
  - Validated and benchmarked performance on biological datasets including LiveCell and Mouse Actin.
- Impact: ~54% PSNR gain over classical filters; 2 datasets: LiveCell and Mouse Actin; UNet inspired by Blind Spot Denoising; 3 baselines: Gaussian, Median, Box3D

### Christmas Image Classification
- Summary: An empirical transfer-learning study: which CNN adapts best to a narrow, domain-specific image set when fine-tuned in PyTorch?
- Tools: PyTorch, GoogLeNet, ResNet, AlexNet
- Project page: /projects/christmas-classification
- What she did:
  - Fine-tuned GoogLeNet in PyTorch for domain-specific image classification.
  - Benchmarked AlexNet, ResNet and GoogLeNet to choose the model, reaching 91% classification accuracy.
  - Quantified the effect of hyperparameter tuning and dataset curation: an 8-12% accuracy gain over baseline configurations.
- Impact: 91% classification accuracy (GoogLeNet); 8-12% gain from tuning and curation; 3 architectures benchmarked; Transfer learning from pretrained weights

## Skills
- Focus Areas: Generative AI, Diffusion models, Computer vision, Multimodal learning, Foundation models, Controllable image generation, Human activity recognition
- Generative AI: Stable Diffusion, FLUX, Diffusers, LoRA, QLoRA, BLIP
- Vision & VLMs: CLIP, DINOv2, DINOv3, SAM, OpenCV
- LLMs & RAG: LangChain, LangGraph, AutoGen, LLaMA, GPT-4o, Azure OpenAI, ChromaDB, Pinecone, FAISS, Langfuse, Context engineering
- Deep Learning: PyTorch, TensorFlow, Keras, Hugging Face Transformers, Scikit-learn, UNet
- MLOps & Cloud: SLURM, MLflow, Docker, Kubernetes, AWS, Terraform, GitHub Actions, Datadog
- Software & Tools: FastAPI, ReactJS, Git, Hugging Face Hub, Claude Code, Conda, LaTeX
- Programming & Data: Python, SQL, Bash, NumPy, Pandas, Matplotlib, Seaborn
- Mathematics: Linear algebra, Probability & statistics, Calculus, Optimization

## Education
### M.Sc. Computer Science (Visual Computing), University of Siegen
- Dates: 2023 - 2026
- Location: Siegen, Germany
- Final grade: 1.6 on the German scale, where 1.0 is best (Thesis graded 1.1)
- Thesis: Incremental Learning for Disentangling of Multiple Visual Concepts for Text-to-Image

### B.E. Information Technology, Vasavi College of Engineering
- Dates: 2018 - 2022
- Location: Hyderabad, India
- Final grade: 1.5 on the German scale, where 1.0 is best
- Thesis: Voice Control and Command System for Unmanned Aerial and Ground Vehicles

## Awards and Milestones
### Deutschlandstipendium (2024)
- Awarded by: Studienförderfonds Siegen e.V.
- Merit scholarship for academic excellence and commitment, awarded to roughly the top 1% of students in Germany.

### Best Project of 2021-22 (2022)
- Awarded by: Vasavi College of Engineering
- First prize for the best final-year project, out of about 120 competing teams.
