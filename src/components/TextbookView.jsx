'use client';

import { useState } from 'react';
import Link from 'next/link';

const CHAPTERS = [
  {
    num: 1,
    title: "Introduction to Computers, Programs, and Java",
    pdfPage: 27,
    exercises: [
      { id: "task_1_5", name: "Exercise 1.5: Compute Expressions", day: 1 },
      { id: "task_1_9", name: "Exercise 1.9: Area & Perimeter of Rectangle", day: 2 },
      { id: "task_1_11", name: "Exercise 1.11: Population Projection", day: 7 }
    ]
  },
  {
    num: 2,
    title: "Elementary Programming",
    pdfPage: 74,
    exercises: [
      { id: "task_2_2", name: "Exercise 2.2: Compute Cylinder Volume", day: 3 },
      { id: "task_2_5", name: "Exercise 2.5: Financial Tip Calculator", day: 4 },
      { id: "task_2_6", name: "Exercise 2.6: Sum Integer Digits", day: 5 }
    ]
  },
  {
    num: 3,
    title: "Selections",
    pdfPage: 109,
    exercises: [
      { id: "task_3_4", name: "Exercise 3.4: Random Month Generator", day: 8 },
      { id: "task_3_5", name: "Exercise 3.5: Find Future Dates", day: 9 },
      { id: "task_3_9", name: "Exercise 3.9: Business Check ISBN-10", day: 14 }
    ]
  },
  {
    num: 4,
    title: "Mathematical Functions, Characters, and Strings",
    pdfPage: 151,
    exercises: [
      { id: "task_4_2", name: "Exercise 4.2: Great Circle Distance", day: 10 },
      { id: "task_4_5", name: "Exercise 4.5: Area of Regular Polygon", day: 11 },
      { id: "task_4_3", name: "Exercise 4.3: Estimate Geographic Area", day: 12 }
    ]
  },
  {
    num: 5,
    title: "Loops",
    pdfPage: 191,
    exercises: [
      { id: "task_5_4", name: "Exercise 5.4: Conversion Miles to Kilometers", day: 15 },
      { id: "task_5_7", name: "Exercise 5.7: Compute Future Tuition", day: 16 },
      { id: "task_5_9", name: "Exercise 5.9: Find the Two Highest Scores", day: 21 }
    ]
  },
  {
    num: 6,
    title: "Methods",
    pdfPage: 235,
    exercises: [
      { id: "task_6_2", name: "Exercise 6.2: Sum Digits Helper Method", day: 17 },
      { id: "task_6_3", name: "Exercise 6.3: Palindrome Integer Methods", day: 18 },
      { id: "task_6_5", name: "Exercise 6.5: Sort Three Numbers Helper", day: 19 }
    ]
  },
  {
    num: 7,
    title: "Single-Dimensional Arrays",
    pdfPage: 275,
    exercises: [
      { id: "task_7_2", name: "Exercise 7.2: Reverse Array Input", day: 22 },
      { id: "task_7_7", name: "Exercise 7.7: Count Single Digits", day: 23 }
    ]
  },
  {
    num: 8,
    title: "Multidimensional Arrays",
    pdfPage: 325,
    exercises: [
      { id: "task_8_2", name: "Exercise 8.2: Sum Major Diagonal", day: 24 }
    ]
  },
  {
    num: 9,
    title: "Objects and Classes",
    pdfPage: 361,
    exercises: [
      { id: "task_9_1", name: "Exercise 9.1: Rectangle Class", day: 29 },
      { id: "task_9_2", name: "Exercise 9.2: Stock Class Design", day: 30 },
      { id: "task_9_3", name: "Exercise 9.3: Date API Class Usage", day: 31 },
      { id: "task_9_6", name: "Exercise 9.6: Stopwatch Class", day: 32 },
      { id: "task_9_8", name: "Exercise 9.8: Fan Class Design", day: 33 },
      { id: "task_9_10", name: "Exercise 9.10: QuadraticEquation Class", day: 35 }
    ]
  },
  {
    num: 10,
    title: "Thinking in Objects",
    pdfPage: 405,
    exercises: [
      { id: "task_10_2", name: "Exercise 10.2: BMI Class Encapsulation", day: 36 },
      { id: "task_10_3", name: "Exercise 10.3: MyInteger Class Design", day: 37 },
      { id: "task_10_4", name: "Exercise 10.4: MyPoint Coordinates Distance", day: 38 },
      { id: "task_10_11", name: "Exercise 10.11: Circle2D Geometric Methods", day: 39 },
      { id: "task_10_17", name: "Exercise 10.17: Large Square Numbers", day: 40 }
    ]
  },
  {
    num: 11,
    title: "Inheritance and Polymorphism",
    pdfPage: 447,
    exercises: [
      { id: "task_11_1", name: "Exercise 11.1: Triangle & GeometricObject Class", day: 43 },
      { id: "task_11_2", name: "Exercise 11.2: Polymorphic Person Hierarchy", day: 44 },
      { id: "task_11_3", name: "Exercise 11.3: Checking and Savings Subclasses", day: 45 },
      { id: "task_11_8", name: "Exercise 11.8: Custom Transactions List", day: 46 }
    ]
  },
  {
    num: 12,
    title: "Exception Handling and Text IO",
    pdfPage: 487,
    exercises: [
      { id: "task_12_2", name: "Exercise 12.2: InputMismatchException Safe Input", day: 52 },
      { id: "task_12_3", name: "Exercise 12.3: Array Index Out of Bounds Exception", day: 53 },
      { id: "task_12_15", name: "Exercise 12.15: Write/Read Data File", day: 54 }
    ]
  },
  {
    num: 13,
    title: "Abstract Classes and Interfaces",
    pdfPage: 535,
    exercises: [
      { id: "task_13_1", name: "Exercise 13.1: Abstract Triangle Class", day: 50 },
      { id: "task_13_5", name: "Exercise 13.5: Comparable GeometricObject", day: 51 }
    ]
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
            Access course reading materials. Use the chapter list on the left to jump directly to any of the first 13 chapters, and access their coding exercises.
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
                        isSelected
                          ? 'bg-primary/5 text-primary font-black'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <span className="font-mono text-caption text-outline-variant select-none mt-0.5 min-w-[20px] shrink-0">
                        Ch {ch.num}
                      </span>
                      <span className="leading-snug">{ch.title}</span>
                    </button>

                    {/* Exercises Nested List */}
                    <div className="flex flex-col gap-1.5 pl-8 pr-2 mt-1.5 border-l border-outline-variant/30 ml-5">
                      {ch.exercises.map((ex) => (
                        <Link
                          key={ex.id}
                          href={`/lessons/${ex.day}?tab=code`}
                          className="text-[11px] font-bold text-on-surface-variant/80 hover:text-primary transition-colors flex items-center gap-1.5 group"
                        >
                          <span className="material-symbols-outlined text-[12px] text-outline group-hover:text-primary transition-transform group-hover:translate-x-0.5">
                            terminal
                          </span>
                          <span className="truncate">{ex.name.split(':')[0]}</span>
                        </Link>
                      ))}
                    </div>
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
