export interface GraphEmbedOptions {
  /** Base URL of the deployed graph page. Defaults to NEXT_PUBLIC_WIKI_GRAPH_URL. */
  baseUrl?: string;
  /** Optional node ID to select and focus on initial load (maps to ?note=...). */
  note?: string | null;
  /** Whether to display the remote AI chat widget. Defaults to false for a clean embedded graph. */
  showChat?: boolean;
  /** Additional custom query parameters to forward to the iframe URL. */
  queryParams?: Record<string, string | number | boolean | undefined>;
  /** Visually crops out the top 56px navigation bar of the remote page to show only the canvas. */
  cropHeader?: boolean;
  /** Height of the embed container (e.g. '600px', '80vh', '100%'). Defaults to '640px'. */
  height?: string;
  /** Optional CSS class names for the outer wrapper container. */
  className?: string;
  /** Show host overlay controls (Fullscreen toggle, Reload, Open in new tab). Defaults to true. */
  showHostControls?: boolean;
  /** Accessible title for the iframe element. */
  title?: string;
  /** Loading attribute for the iframe ('eager' | 'lazy'). Defaults to 'eager'. */
  loading?: 'lazy' | 'eager';
  /** Callback fired when the iframe finishes loading. */
  onLoad?: () => void;
}

export interface GraphPostMessageEvent {
  type: string;
  payload?: Record<string, unknown>;
}
