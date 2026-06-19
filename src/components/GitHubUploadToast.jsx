'use client';

/**
 * GitHubUploadToast
 * Shown in the bottom-right corner while/after pushing a solution to GitHub.
 *
 * Props:
 *   status  : 'uploading' | 'success' | 'error' | null
 *   url     : string  – GitHub blob URL (success only)
 *   error   : string  – error message (error only)
 *   onDismiss : () => void
 */
export default function GitHubUploadToast({ status, url, error, onDismiss }) {
  if (!status) return null;

  const isUploading = status === 'uploading';
  const isSuccess   = status === 'success';
  const isError     = status === 'error';

  return (
    <div
      className={`fixed bottom-6 right-4 z-[100] w-[320px] max-w-[calc(100vw-2rem)] shadow-2xl rounded-2xl border transition-all duration-300 ${
        isUploading ? 'bg-surface-container border-outline-variant'
        : isSuccess  ? 'bg-white border-outline-variant/40'
        : 'bg-error-container border-error/30'
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={`mt-0.5 shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
          isUploading ? 'bg-primary/10 text-primary'
          : isSuccess  ? 'bg-tertiary/15 text-tertiary'
          : 'bg-error/15 text-error'
        }`}>
          {isUploading && (
            <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
          )}
          {isSuccess && (
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          )}
          {isError && (
            <span className="material-symbols-outlined text-lg">error</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-body-sm ${
            isUploading ? 'text-on-surface'
            : isSuccess  ? 'text-on-surface'
            : 'text-on-error-container'
          }`}>
            {isUploading && 'Uploading to GitHub…'}
            {isSuccess   && 'Solution pushed to GitHub!'}
            {isError     && 'GitHub upload failed'}
          </p>

          {isSuccess && url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-tertiary/10 hover:bg-tertiary/20 text-tertiary font-bold rounded-lg text-caption transition-colors border border-tertiary/20"
            >
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              View on GitHub
            </a>
          )}

          {isError && error && (
            <p className="mt-1 text-caption text-on-error-container/80 font-semibold break-words">
              {error}
            </p>
          )}
        </div>

        {/* Dismiss button (not on loading) */}
        {!isUploading && (
          <button
            onClick={onDismiss}
            className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer bg-transparent border-0 p-0 flex items-center"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
