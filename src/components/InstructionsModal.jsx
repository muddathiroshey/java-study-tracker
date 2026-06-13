'use client';

export default function InstructionsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">📚 How to Use This Platform</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Video */}
          <div className="mb-6">
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-4">
              <video
                src="/instructions.mp4"
                controls
                controlsList="nodownload"
                className="w-full h-full"
                title="Platform Instructions"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 dark:border-zinc-700 my-6" />

          {/* Info Message */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                info
              </span>
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  💡 You can watch this video anytime!
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You'll find this instructions video in your <strong>Settings</strong> under the <strong>Instructions</strong> section.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 active:scale-[0.98] mt-8"
          >
            Get Started! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
