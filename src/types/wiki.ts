export type WikiClassification =
  | 'concept'
  | 'source'
  | 'synthesis'
  | 'question'
  | 'index'
  | 'log'
  | string;

export interface WikiFrontmatter {
  title?: string;
  type?: string;
  status?: string;
  confidence?: string;
  knowledge_status?: string;
  tags?: string[];
  aliases?: string[];
  sources?: string[];
  created?: string;
  updated?: string;
  [key: string]: unknown;
}

export interface WikiNode {
  id: string;
  path: string;
  label: string;
  classification: WikiClassification;
  frontmatter: WikiFrontmatter;
  excerpt: string;
  githubUrl: string;
  linksTo?: string[];
}

export interface WikiEdge {
  source: string;
  target: string;
}

export interface WikiGraphData {
  nodes: WikiNode[];
  edges: WikiEdge[];
}

export interface WikiPositionedNode extends WikiNode {
  x: number;
  y: number;
  r: number;
  degree: number;
  linksTo: string[];
}

export interface WikiPositionedGraphData {
  nodes: WikiPositionedNode[];
  edges: WikiEdge[];
  classifications: WikiClassification[];
  hasNoConnections?: boolean;
}

export type WikiPipelineFailureReason = 'network_error' | 'http_error' | 'rate_limited';

export interface WikiPipelineFailure {
  status: 'error';
  reason: WikiPipelineFailureReason;
  message: string;
  statusCode?: number;
}

export interface WikiPipelineSuccess {
  status: 'success';
  data: WikiPositionedGraphData;
}

export interface WikiPipelineEmpty {
  status: 'empty';
  message: string;
  githubUrl: string;
}

export type WikiPipelineResult = WikiPipelineSuccess | WikiPipelineFailure | WikiPipelineEmpty;
