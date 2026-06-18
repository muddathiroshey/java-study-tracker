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
      className={`fixed bottom-6 right-6 z-[100] max-w-sm w-full shadow-2xl rounded-2xl border transition-all duration-300 ${
        isUploading ? 'bg-surface-container border-outline-variant'
        : isSuccess  ? 'bg-tertiary-container border-tertiary/30'
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
            : isSuccess  ? 'text-on-tertiary-container'
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
              className="mt-1 inline-flex items-center gap-1 text-caption font-bold text-tertiary hover:underline"
            >
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
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
