export type Project = {
  title: string;
  description: string;
  tags: string[];
  githubLink: string;
  // Optional: a project without a UI (a server, a library) may have nothing to screenshot.
  // The card renders a designed fallback panel instead.
  image?: string;
};

export const projects: Project[] = [
  {
    title: "Deepfake Detector",
    description:
      "A full-stack application designed to combat misinformation, featuring a Deepfake Image Detector powered by fine-tuned vision models and an intelligent Facts Verifier Chatbot with real-time web search capabilities.",
    tags: ["Next.js", "FastAPI", "Hugging Face"],
    githubLink: "https://github.com/ShunDa002/deepfake-detector-website",
    image: "/images/projects/deepfake-detector.png",
  },
  {
    title: "Malaysian SPM History (Sejarah) RAG",
    description:
      "A full-stack educational web app for learning Malaysian SPM History (Sejarah) using an AI-powered RAG chatbot with textbook citations, Next.js frontend, and FastAPI backend.",
    tags: ["Next.js", "FastAPI", "LangChain"],
    githubLink: "https://github.com/ShunDa002/sejarah-rag-website",
    image: "/images/projects/sejarah-rag.png",
  },
  {
    title: "Yahoo Finance MCP",
    description:
      "Yahoo Finance MCP is a lightweight MCP server that wraps yfinance into a clean set of tools for programmatic market data access.",
    tags: ["Python", "MCP"],
    githubLink: "https://github.com/ShunDa002/yahoo-finance-mcp",
  },
];
