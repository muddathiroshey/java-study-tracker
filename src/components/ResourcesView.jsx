'use client';

export default function ResourcesView() {
  return (
    <div className="flex-1 overflow-y-auto pt-20 pb-12 select-none min-h-screen">
      <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        
        {/* Header Section */}
        <div className="mb-xl">
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-sm font-black flex items-center gap-md">
            <span className="material-symbols-outlined text-primary text-4xl">folder_open</span>
            Course Resources
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl">
            Access references, reference books, download links, and companion websites for this course.
          </p>
        </div>

        {/* Resources Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
          
          {/* Card 1: Textbook Download */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:border-primary/50 transition-all duration-300 hover:shadow-md">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined text-2xl">menu_book</span>
              </div>
              <h3 className="font-title-md text-title-md font-black text-on-surface mb-sm">
                Introduction to Java Programming
              </h3>
              <p className="text-caption text-on-surface-variant leading-relaxed mb-lg">
                Download the complete companion textbook PDF containing chapters 1 to 13. Excellent reference for understanding core OOP design patterns, arrays, control loops, methods, exceptions, and class files.
              </p>
            </div>
            
            <div>
              <a
                href="https://github.com/muddathiroshey/java-study-tracker/releases/download/assets/Introduction.to.Java.Programming.and.Data.Structures.Textbook.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-lg py-3.5 bg-primary text-on-primary hover:bg-primary-hover font-bold text-label-md rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer border border-primary-hover active:scale-[0.98]"
              >
                <span className="material-symbols-outlined font-black">download</span>
                Download Textbook PDF
              </a>
            </div>
          </div>

          {/* Card 2: Companion Resources Website */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:border-primary/50 transition-all duration-300 hover:shadow-md">
            <div>
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined text-2xl">language</span>
              </div>
              <h3 className="font-title-md text-title-md font-black text-on-surface mb-sm">
                Liang Java Companion Resources
              </h3>
              <p className="text-caption text-on-surface-variant leading-relaxed mb-lg">
                The official Pearson website for Liang's 12th edition textbook. Features online self-test questions, additional code examples, chapter slides, programming exercises, algorithms tutorials, and supplementary guides.
              </p>
            </div>
            
            <div>
              <a
                href="https://media.pearsoncmg.com/ph/php8/sites/ecs/ecs_liang_java_12/cw/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-lg py-3.5 bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-bold text-label-md rounded-xl transition-all border border-outline flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span className="material-symbols-outlined font-black">open_in_new</span>
                Open Companion Website
              </a>
            </div>
          </div>

          {/* Card 3: HackerRank Practice */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:border-primary/50 transition-all duration-300 hover:shadow-md">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined text-2xl">code</span>
              </div>
              <h3 className="font-title-md text-title-md font-black text-on-surface mb-sm">
                HackerRank Java Practice
              </h3>
              <p className="text-caption text-on-surface-variant leading-relaxed mb-lg">
                Looking for more challenges? Practice fundamental programming problems, algorithms, core data structures, and advanced logic assertions on HackerRank's official Java preparation track.
              </p>
            </div>
            
            <div>
              <a
                href="https://www.hackerrank.com/domains/java"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-lg py-3.5 bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-bold text-label-md rounded-xl transition-all border border-outline flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span className="material-symbols-outlined font-black">open_in_new</span>
                Open HackerRank Java Track
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
