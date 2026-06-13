'use client';

import { useState } from 'react';

const CHAPTERS = [
  {
    num: 1,
    title: "Introduction to Computers, Programs, and Java",
    pdfPage: 27,
    exercisesPdfPage: 49
  },
  {
    num: 2,
    title: "Elementary Programming",
    pdfPage: 74,
    exercisesPdfPage: 96
  },
  {
    num: 3,
    title: "Selections",
    pdfPage: 109,
    exercisesPdfPage: 130
  },
  {
    num: 4,
    title: "Mathematical Functions, Characters, and Strings",
    pdfPage: 151,
    exercisesPdfPage: 169
  },
  {
    num: 5,
    title: "Loops",
    pdfPage: 191,
    exercisesPdfPage: 212
  },
  {
    num: 6,
    title: "Methods",
    pdfPage: 235,
    exercisesPdfPage: 253
  },
  {
    num: 7,
    title: "Single-Dimensional Arrays",
    pdfPage: 275,
    exercisesPdfPage: 294
  },
  {
    num: 8,
    title: "Multidimensional Arrays",
    pdfPage: 325,
    exercisesPdfPage: 338
  },
  {
    num: 9,
    title: "Objects and Classes",
    pdfPage: 361,
    exercisesPdfPage: 385
  },
  {
    num: 10,
    title: "Thinking in Objects",
    pdfPage: 405,
    exercisesPdfPage: 423
  },
  {
    num: 11,
    title: "Inheritance and Polymorphism",
    pdfPage: 447,
    exercisesPdfPage: 463
  },
  {
    num: 12,
    title: "Exception Handling and Text IO",
    pdfPage: 487,
    exercisesPdfPage: 504
  },
  {
    num: 13,
    title: "Abstract Classes and Interfaces",
    pdfPage: 535,
    exercisesPdfPage: 550
  }
];

export default function TextbookView() {
  const [currentPage, setCurrentPage] = useState(27); // Default to Chapter 1 (page 27 in PDF)
  const [activeChapter, setActiveChapter] = useState(1);

  const handleSelectChapter = (chNum, pageNum) => {
    setActiveChapter(chNum);
    setCurrentPage(pageNum);
  };

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
            Access course reading materials. Use the chapter list on the left to jump directly to any of the first 13 chapters, and view their corresponding exercises in the book.
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
                const isSelected = activeChapter === ch.num;
                return (
                  <div key={ch.num} className="flex flex-col border-b border-outline-variant/20 py-2">
                    <button
                      onClick={() => handleSelectChapter(ch.num, ch.pdfPage)}
                      className={`text-left font-label-md py-2 px-3 rounded-xl cursor-pointer transition-all flex items-start gap-2 ${
                        isSelected && currentPage === ch.pdfPage
                          ? 'bg-primary/5 text-primary font-black'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <span className="font-mono text-caption text-outline-variant select-none mt-0.5 min-w-[20px] shrink-0">
                        Ch {ch.num}
                      </span>
                      <span className="leading-snug">{ch.title}</span>
                    </button>

                    {/* Link to chapter's programming exercises page inside the textbook */}
                    <button
                      onClick={() => handleSelectChapter(ch.num, ch.exercisesPdfPage)}
                      className={`text-left text-xs font-bold py-1 px-3 rounded-lg ml-6 mt-1 cursor-pointer transition-all flex items-center gap-1.5 ${
                        isSelected && currentPage === ch.exercisesPdfPage
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
            <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[75vh] bg-[#f8f9fc] border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
              <iframe
                src={`/textbook.pdf#page=${currentPage}`}
                className="w-full h-full border-0 bg-[#f8f9fc]"
                title="Textbook PDF Viewer"
              />
            </div>
            
            {/* Download Textbook Button */}
            <div className="flex justify-center sm:justify-start">
              <a
                href="/textbook.pdf"
                download="Introduction_to_Java_Programming_and_Data_Structures.pdf"
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
