'use client';

import React from 'react';
import { ExternalLink, RefreshCw, AlertTriangle, AlertCircle, FileX } from 'lucide-react';
import { GITHUB_REPO_URL } from '@/lib/wiki/constants';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface WikiFailureStateProps {
  type: 'rate_limited' | 'http_error' | 'network_error' | 'empty';
  message: string;
  githubUrl?: string;
  onRetry?: () => void;
}

export const WikiFailureState: React.FC<WikiFailureStateProps> = ({
  type,
  message,
  githubUrl = GITHUB_REPO_URL,
  onRetry,
}) => {
  const isRateLimit = type === 'rate_limited';
  const isEmpty = type === 'empty';

  const title = isEmpty
    ? 'Knowledge Vault is Empty'
    : isRateLimit
      ? 'GitHub API Rate Limit Exceeded'
      : 'Knowledge Vault Unreachable';

  const defaultExplanation = isEmpty
    ? 'The knowledge vault repository currently holds no Markdown pages under the wiki/ directory.'
    : isRateLimit
      ? 'The GitHub REST API hourly rate limit for unauthenticated requests has been reached. The graph will return automatically once the limit resets.'
      : 'Could not retrieve the knowledge vault from GitHub due to a network failure or temporary outage.';

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <Alert
      aria-live="polite"
      className="max-w-md w-full mx-auto p-8 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl text-center space-y-6"
    >
      <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center bg-slate-800/80 border border-slate-700/50">
        {isEmpty ? (
          <FileX className="w-7 h-7 text-slate-400" />
        ) : isRateLimit ? (
          <AlertCircle className="w-7 h-7 text-amber-400" />
        ) : (
          <AlertTriangle className="w-7 h-7 text-rose-400" />
        )}
      </div>

      <div className="space-y-2">
        <AlertTitle className="text-xl font-bold text-white tracking-tight">{title}</AlertTitle>
        <AlertDescription className="text-sm text-slate-300 leading-relaxed">
          {message || defaultExplanation}
        </AlertDescription>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {!isEmpty && (
          <Button
            onClick={handleRetry}
            variant="outline"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 h-auto rounded-xl font-semibold text-xs tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </Button>
        )}
        <Button
          asChild
          variant="secondary"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 h-auto rounded-xl font-semibold text-xs tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700/80 hover:text-white hover:bg-slate-700 transition-all"
        >
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>View on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Button>
      </div>
    </Alert>
  );
};
