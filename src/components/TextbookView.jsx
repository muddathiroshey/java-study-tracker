'use client';

import { useState, useRef, useEffect } from 'react';

// Page numbers inside the PDF (as given by user)
const CHAPTERS = [
  { num: 1,  title: "Introduction to Computers, Programs, and Java", pdfPage: 24,  exercisesPdfPage: 53  },
  { num: 2,  title: "Elementary Programming",                          pdfPage: 56,  exercisesPdfPage: 93  },
  { num: 3,  title: "Selections",                                      pdfPage: 100, exercisesPdfPage: 133 },
  { num: 4,  title: "Mathematical Functions, Characters, and Strings", pdfPage: 144, exercisesPdfPage: 174 },
  { num: 5,  title: "Loops",                                           pdfPage: 182, exercisesPdfPage: 217 },
  { num: 6,  title: "Methods",                                         pdfPage: 228, exercisesPdfPage: 259 },
  { num: 7,  title: "Single-Dimensional Arrays",                       pdfPage: 272, exercisesPdfPage: 303 },
  { num: 8,  title: "Multidimensional Arrays",                         pdfPage: 312, exercisesPdfPage: 330 },
  { num: 9,  title: "Objects and Classes",                             pdfPage: 346, exercisesPdfPage: 385 },
  { num: 10, title: "Thinking in Objects",                             pdfPage: 390, exercisesPdfPage: 424 },
  { num: 11, title: "Inheritance and Polymorphism",                    pdfPage: 434, exercisesPdfPage: 470 },
  { num: 12, title: "Exception Handling and Text IO",                  pdfPage: 476, exercisesPdfPage: 515 },
  { num: 13, title: "Abstract Classes and Interfaces",                 pdfPage: 522, exercisesPdfPage: 558 },
];

const LAST_PAGE = 563; // End of Chapter 13

export default function TextbookView() {
  const [currentPage, setCurrentPage] = useState(24); // Default to Chapter 1
  const [activeChapter, setActiveChapter] = useState(1);
  const [activeSection, setActiveSection] = useState('chapter'); // 'chapter' | 'exercises'

  // We keep the iframe always mounted (hidden when tab is not active) so it never reloads
  const iframeRef = useRef(null);

  const navigateTo = (chNum, pageNum, section) => {
    setActiveChapter(chNum);
    setActiveSection(section);
    const clampedPage = Math.min(pageNum, LAST_PAGE);
    setCurrentPage(clampedPage);
    // Update iframe src directly to avoid full remount
    if (iframeRef.current) {
      iframeRef.current.src = `/textbook.pdf#page=${clampedPage}`;
    }
  };

  // Set initial src
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = `/textbook.pdf#page=${currentPage}`;
    }
  }, []);

  return (
    <div className="flex-1 overflow-y-auto pt-20 pb-12 select-none min-h-screen">
      <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        {/* Header Section */}
        <div className="mb-xl">
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-sm font-black flex items-center gap-md">
            <span className="material-symbols-outlined text-primary text-4xl">menu_book</span>
            Textbook Reader
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl">
            Access course reading materials — Chapters 1–13. Use the chapter list on the left to jump directly to any chapter or its exercises.
          </p>
        </div>

        {/* Reader Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-xl items-start">
          
          {/* Chapter Outline Side panel */}
          <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm max-h-[75vh] overflow-y-auto flex flex-col gap-md scrollbar-thin">
            <h3 className="font-title-sm text-on-surface font-extrabold flex items-center gap-2 border-b border-outline-variant/50 pb-2">
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
              Table of Contents
            </h3>
            <div className="flex flex-col gap-xs">
              {CHAPTERS.map((ch) => {
                const isChActive = activeChapter === ch.num && activeSection === 'chapter';
                const isExActive = activeChapter === ch.num && activeSection === 'exercises';
                return (
                  <div key={ch.num} className="flex flex-col border-b border-outline-variant/20 py-2">
                    <button
                      onClick={() => navigateTo(ch.num, ch.pdfPage, 'chapter')}
                      className={`text-left font-label-md py-2 px-3 rounded-xl cursor-pointer transition-all flex items-start gap-2 ${
                        isChActive
                          ? 'bg-primary/5 text-primary font-black'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <span className="font-mono text-caption text-outline-variant select-none mt-0.5 min-w-[20px] shrink-0">
                        Ch {ch.num}
                      </span>
                      <span className="leading-snug">{ch.title}</span>
                    </button>

                    {/* Link to chapter's exercises inside the textbook */}
                    <button
                      onClick={() => navigateTo(ch.num, ch.exercisesPdfPage, 'exercises')}
                      className={`text-left text-xs font-bold py-1 px-3 rounded-lg ml-6 mt-1 cursor-pointer transition-all flex items-center gap-1.5 ${
                        isExActive
                          ? 'text-primary bg-primary/5'
                          : 'text-on-surface-variant hover:text-primary hover:bg-surface-container/50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">assignment</span>
                      Programming Exercises
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Textbook Visual Viewport Card */}
          <div className="lg:col-span-3 flex flex-col gap-lg h-full">
            <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[75vh] bg-[#f8f9fc] border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
              {/* 
                The iframe is always mounted so it never reloads when switching tabs.
                We set the initial src via useEffect and navigate via direct .src assignment.
              */}
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0 bg-[#f8f9fc]"
                title="Textbook PDF Viewer"
              />
            </div>
            
            {/* Download Textbook Button */}
            <div className="flex justify-center sm:justify-start">
              <a
                href="/textbook.pdf"
                download="Introduction to Java Programming and Data Structures Textbook.pdf"
                className="px-xl py-3.5 bg-primary text-on-primary hover:bg-primary-hover font-bold text-label-md rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-primary-hover active:scale-[0.98]"
              >
                <span className="material-symbols-outlined font-black">download</span>
                Download Complete Textbook PDF
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
