// Reorganized Java Course Schedule (June 14, 2026 - August 15, 2026)
// Fridays are OFF (Rest Days). Saturdays are Practice/Submission days.
// Sunday to Thursday are Lecture days (5 lectures per week).

export const COURSE_TITLE = "Java Mastering Course: Zero to OOP Hero";
export const START_DATE = "2026-06-14";
export const END_DATE = "2026-08-15";

export const courseSchedule = [
  {
    "day": 1,
    "date": "2026-06-14",
    "dayOfWeek": "Sunday",
    "type": "video",
    "chapterNum": 1,
    "chapterTitle": "Introduction to Computers, Programs, and Java",
    "title": "Ch 1: Hardware, Operating Systems & Setup",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/01slide.pptx",
    "videos": [
      {
        "videoId": "WnMPk6_8qDo",
        "title": "Java | Chapter 1 | Introduction to Computers, Programs, and Java",
        "duration": "00:59:30",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:59:30",
        "thumbnail": "https://i.ytimg.com/vi/WnMPk6_8qDo/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=WnMPk6_8qDo"
      }
    ],
    "task": {
      "taskId": "task_1_5",
      "title": "Exercise 1.5: Compute Expressions",
      "description": "Write a program that displays the result of the following expression: (9.5 * 4.5 - 2.5 * 3) / (45.5 - 3.5). The class name must be Exercise01_05.",
      "codeTemplate": "public class Exercise01_05 {\n    public static void main(String[] args) {\n        // Calculate and print result here\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "0.8392857142857143",
          "description": "Result should equal 0.8392857142857143"
        }
      ]
    }
  },
  {
    "day": 2,
    "date": "2026-06-15",
    "dayOfWeek": "Monday",
    "type": "video",
    "chapterNum": 1,
    "chapterTitle": "Introduction to Computers, Programs, and Java",
    "title": "Ch 1: First Java Program & Syntax Check",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/01slide.pptx",
    "videos": [
      {
        "videoId": "r_0n_M38Or0",
        "title": "Java | Chapter 1 (Part 2) | Introduction to Computers, Programs, and Java",
        "duration": "00:15:52",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:15:52",
        "thumbnail": "https://i.ytimg.com/vi/r_0n_M38Or0/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=r_0n_M38Or0"
      }
    ],
    "task": {
      "taskId": "task_1_9",
      "title": "Exercise 1.9: Area & Perimeter of Rectangle",
      "description": "Write a program that displays the area and perimeter of a rectangle with width 4.5 and height 7.9. Formulas: Area = width * height, Perimeter = 2 * (width + height). The class name must be Exercise01_09.",
      "codeTemplate": "public class Exercise01_09 {\n    public static void main(String[] args) {\n        // Calculate area and perimeter\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Area: 35.55\nPerimeter: 24.8",
          "description": "Output matches expected calculations"
        }
      ],
      "quiz": [
        {
          "question": "Which of the following is the correct entry point method signature for a Java application?",
          "options": [
            "public void main(String[] args)",
            "public static void main(String[] args)",
            "public static int main(String[] args)",
            "void main(args[])"
          ],
          "correctIdx": 1
        }
      ]
    }
  },
  {
    "day": 3,
    "date": "2026-06-16",
    "dayOfWeek": "Tuesday",
    "type": "video",
    "chapterNum": 2,
    "chapterTitle": "Elementary Programming",
    "title": "Ch 2: Variables, Types & Simple Calculations",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/02slide.ppt",
    "videos": [
      {
        "videoId": "M7XLFoSm1yw",
        "title": "Java | Chapter 2 | Elementary Programming",
        "duration": "01:26:25",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:42:16",
        "thumbnail": "https://i.ytimg.com/vi/M7XLFoSm1yw/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=M7XLFoSm1yw"
      }
    ],
    "task": {
      "taskId": "task_2_2",
      "title": "Exercise 2.2: Compute Cylinder Volume",
      "description": "Write a program that reads the radius and length of a cylinder from console input, and computes area and volume. Area = radius * radius * PI. Volume = area * length. The class name must be Exercise02_02.",
      "codeTemplate": "import java.util.Scanner;\n\npublic class Exercise02_02 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Read radius and length, then calculate area and volume\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "5.5 12",
          "expected": "Area: 95.033\nVolume: 1140.4",
          "description": "Test for radius 5.5 and length 12"
        }
      ]
    }
  },
  {
    "day": 4,
    "date": "2026-06-17",
    "dayOfWeek": "Wednesday",
    "type": "video",
    "chapterNum": 2,
    "chapterTitle": "Elementary Programming",
    "title": "Ch 2: Console Inputs & Scanners",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/02slide.ppt",
    "videos": [
      {
        "videoId": "M7XLFoSm1yw",
        "title": "Java | Chapter 2 | Elementary Programming",
        "duration": "01:26:25",
        "assignedStart": "00:42:16",
        "assignedEnd": "01:26:25",
        "thumbnail": "https://i.ytimg.com/vi/M7XLFoSm1yw/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=M7XLFoSm1yw"
      }
    ],
    "task": {
      "taskId": "task_2_5",
      "title": "Exercise 2.5: Financial Tip Calculator",
      "description": "Write a program that reads a subtotal and a gratuity rate from console input, and computes the gratuity and total. Gratuity = subtotal * (rate / 100). Total = subtotal + gratuity. The class name must be Exercise02_05.",
      "codeTemplate": "import java.util.Scanner;\n\npublic class Exercise02_05 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Read subtotal and rate, calculate and print tip and total\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "10 15",
          "expected": "Tip: 1.5\nTotal: 11.5",
          "description": "Subtotal 10 with 15% rate"
        }
      ]
    }
  },
  {
    "day": 5,
    "date": "2026-06-18",
    "dayOfWeek": "Thursday",
    "type": "video",
    "chapterNum": 2,
    "chapterTitle": "Elementary Programming",
    "title": "Ch 2: Expressions, Arithmetic & Integer Digits Sum",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/02slide.ppt",
    "videos": [
      {
        "videoId": "ORW7sE95NlU",
        "title": "Java | Chapter 2 (Part 2) | Elementary Programming",
        "duration": "00:26:00",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:26:00",
        "thumbnail": "https://i.ytimg.com/vi/ORW7sE95NlU/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=ORW7sE95NlU"
      }
    ],
    "task": {
      "taskId": "task_2_6",
      "title": "Exercise 2.6: Sum Integer Digits",
      "description": "Write a program that reads an integer between 0 and 1000 and adds all the digits in the integer (e.g. 932 -> 9+3+2 = 14). The class name must be Exercise02_06.",
      "codeTemplate": "import java.util.Scanner;\n\npublic class Exercise02_06 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Write logic to sum digits of the input integer\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "932",
          "expected": "Sum: 14",
          "description": "Sum of digits in 932 should equal 14"
        }
      ]
    }
  },
  {
    "day": 6,
    "date": "2026-06-19",
    "dayOfWeek": "Friday",
    "type": "off",
    "chapterNum": null,
    "chapterTitle": "Rest",
    "title": "🏖️ Rest Day"
  },
  {
    "day": 7,
    "date": "2026-06-20",
    "dayOfWeek": "Saturday",
    "type": "video",
    "chapterNum": 1,
    "chapterTitle": "Introduction to Computers, Programs, and Java",
    "title": "Practice: Population Projection",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/01slide.pptx",
    "videos": [],
    "task": {
      "taskId": "task_1_11",
      "title": "Exercise 1.11: Population Projection",
      "description": "Calculate population for next 5 years (Years 1 to 5). Current population = 312032486. A birth every 7s, death every 13s, immigrant every 45s. Year = 365 days. Use floating point addition per year and print as integers. The class name must be Exercise01_11.",
      "codeTemplate": "public class Exercise01_11 {\n    public static void main(String[] args) {\n        // Calculate and print Years 1 to 5 population\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Year 1: 314812582\nYear 2: 317592679\nYear 3: 320372776\nYear 4: 323152873\nYear 5: 325932970",
          "description": "Expected 5-year projections printed in order"
        }
      ],
      "quiz": [
        {
          "question": "Which class is commonly used in Java to read user input from the console?",
          "options": [
            "Reader",
            "Input",
            "Scanner",
            "System.in"
          ],
          "correctIdx": 2
        }
      ]
    }
  },
  {
    "day": 8,
    "date": "2026-06-21",
    "dayOfWeek": "Sunday",
    "type": "video",
    "chapterNum": 3,
    "chapterTitle": "Selections",
    "title": "Ch 3: Conditionals & Selections Part 1",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/03slide.ppt",
    "videos": [
      {
        "videoId": "lGtJeCGeJEA",
        "title": "Java | Chapter 3 | Selections",
        "duration": "01:00:57",
        "assignedStart": "00:00:00",
        "assignedEnd": "01:00:57",
        "thumbnail": "https://i.ytimg.com/vi/lGtJeCGeJEA/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=lGtJeCGeJEA"
      }
    ],
    "task": {
      "taskId": "task_3_4",
      "title": "Exercise 3.4: Random Month Generator",
      "description": "Write a program that randomly generates an integer between 1 and 12 and displays the English month name (e.g. 1 for January, 2 for February...). The class name must be Exercise03_04.",
      "codeTemplate": "public class Exercise03_04 {\n    public static void main(String[] args) {\n        // Generate random number 1 to 12, print month\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "[Month]",
          "description": "Checks if a valid month name is displayed"
        }
      ]
    }
  },
  {
    "day": 9,
    "date": "2026-06-22",
    "dayOfWeek": "Monday",
    "type": "video",
    "chapterNum": 3,
    "chapterTitle": "Selections",
    "title": "Ch 3: Conditionals & Selections Part 2",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/03slide.ppt",
    "videos": [
      {
        "videoId": "687TPQNBap8",
        "title": "Java | Chapter 3 (Part 2) | Selections",
        "duration": "00:51:17",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:51:17",
        "thumbnail": "https://i.ytimg.com/vi/687TPQNBap8/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=687TPQNBap8"
      }
    ],
    "task": {
      "taskId": "task_3_5",
      "title": "Exercise 3.5: Find Future Dates",
      "description": "Prompt user for today's day of week (0 for Sun, 1 for Mon, ..., 6 for Sat) and elapsed days, then print today's day and the future day of the week. The class name must be Exercise03_05.",
      "codeTemplate": "import java.util.Scanner;\n\npublic class Exercise03_05 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Write code here\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "1 3",
          "expected": "Today is Monday and the future day is Thursday",
          "description": "Monday + 3 days = Thursday"
        }
      ],
      "quiz": [
        {
          "question": "Which represents the logical AND operator in Java?",
          "options": [
            "&",
            "AND",
            "&&",
            "||"
          ],
          "correctIdx": 2
        }
      ]
    }
  },
  {
    "day": 10,
    "date": "2026-06-23",
    "dayOfWeek": "Tuesday",
    "type": "video",
    "chapterNum": 4,
    "chapterTitle": "Mathematical Functions, Characters, and Strings",
    "title": "Ch 4: Math Functions & Characters",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/04slide.ppt",
    "videos": [
      {
        "videoId": "DeCBRPWCkoc",
        "title": "Java | Chapter 4 | Mathematical Functions, Characters, and Strings",
        "duration": "01:19:42",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:43:20",
        "thumbnail": "https://i.ytimg.com/vi/DeCBRPWCkoc/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=DeCBRPWCkoc"
      }
    ],
    "task": {
      "taskId": "task_4_2",
      "title": "Exercise 4.2: Great Circle Distance",
      "description": "Read latitude/longitude of point 1 and point 2, then compute the great circle distance using Math trig functions. The class name must be Exercise04_02.",
      "codeTemplate": "import java.util.Scanner;\n\npublic class Exercise04_02 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Write Great Circle distance calculation here\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "39.55 -8.66 41.51 -8.22",
          "expected": "Distance: 218.",
          "description": "Distance between test points"
        }
      ]
    }
  },
  {
    "day": 11,
    "date": "2026-06-24",
    "dayOfWeek": "Wednesday",
    "type": "video",
    "chapterNum": 4,
    "chapterTitle": "Mathematical Functions, Characters, and Strings",
    "title": "Ch 4: Strings & Regular Polygons",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/04slide.ppt",
    "videos": [
      {
        "videoId": "DeCBRPWCkoc",
        "title": "Java | Chapter 4 | Mathematical Functions, Characters, and Strings",
        "duration": "01:19:42",
        "assignedStart": "00:43:20",
        "assignedEnd": "01:19:42",
        "thumbnail": "https://i.ytimg.com/vi/DeCBRPWCkoc/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=DeCBRPWCkoc"
      }
    ],
    "task": {
      "taskId": "task_4_5",
      "title": "Exercise 4.5: Area of Regular Polygon",
      "description": "Read number of sides 'n' and side length 's' from user. Area = (n * s^2) / (4 * tan(PI / n)). The class name must be Exercise04_05.",
      "codeTemplate": "import java.util.Scanner;\n\npublic class Exercise04_05 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Read n and s, print area\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "5 6",
          "expected": "Area: 61.937",
          "description": "5-sided regular polygon with side length 6"
        }
      ]
    }
  },
  {
    "day": 12,
    "date": "2026-06-25",
    "dayOfWeek": "Thursday",
    "type": "video",
    "chapterNum": 4,
    "chapterTitle": "Mathematical Functions, Characters, and Strings",
    "title": "Ch 4: Geometry Estimate Areas",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/04slide.ppt",
    "videos": [
      {
        "videoId": "DeCBRPWCkoc",
        "title": "Java | Chapter 4 | Mathematical Functions, Characters, and Strings",
        "duration": "01:19:42",
        "assignedStart": "00:00:00",
        "assignedEnd": "01:19:42",
        "thumbnail": "https://i.ytimg.com/vi/DeCBRPWCkoc/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=DeCBRPWCkoc"
      }
    ],
    "task": {
      "taskId": "task_4_3",
      "title": "Exercise 4.3: Estimate Geographic Area",
      "description": "Estimate the bounded area between four cities: Atlanta, Orlando, Savannah, and Charlotte using coordinates and triangles. The class name must be Exercise04_03.",
      "codeTemplate": "public class Exercise04_03 {\n    public static void main(String[] args) {\n        // Calculate geographic area\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Area:",
          "description": "Displays estimated area calculation"
        }
      ]
    }
  },
  {
    "day": 13,
    "date": "2026-06-26",
    "dayOfWeek": "Friday",
    "type": "off",
    "chapterNum": null,
    "chapterTitle": "Rest",
    "title": "🏖️ Rest Day"
  },
  {
    "day": 14,
    "date": "2026-06-27",
    "dayOfWeek": "Saturday",
    "type": "video",
    "chapterNum": 3,
    "chapterTitle": "Selections",
    "title": "Practice: ISBN-10 Checksum Validator",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/03slide.ppt",
    "videos": [],
    "task": {
      "taskId": "task_3_9",
      "title": "Exercise 3.9: Business Check ISBN-10",
      "description": "Read the first 9 digits of an ISBN. Compute the checksum: (d1 * 1 + d2 * 2 + ... + d9 * 9) % 11. If the checksum is 10, the last digit is 'X'. Print the full 10-digit ISBN. The class name must be Exercise03_09.",
      "codeTemplate": "import java.util.Scanner;\n\npublic class Exercise03_09 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Read 9 digits, print 10-digit ISBN\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "013031997",
          "expected": "013031997X",
          "description": "ISBN-10 verification for 013031997"
        }
      ],
      "quiz": [
        {
          "question": "Which method is used to compare string content for equality?",
          "options": [
            "==",
            "equals()",
            "compare()"
          ],
          "correctIdx": 1
        }
      ]
    }
  },
  {
    "day": 15,
    "date": "2026-06-28",
    "dayOfWeek": "Sunday",
    "type": "video",
    "chapterNum": 5,
    "chapterTitle": "Loops",
    "title": "Ch 5: Loops & Conversion Tables",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/05slide.ppt",
    "videos": [
      {
        "videoId": "NZzu49ffrgY",
        "title": "Java | Chapter 5 | Loops",
        "duration": "00:55:09",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:55:09",
        "thumbnail": "https://i.ytimg.com/vi/NZzu49ffrgY/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=NZzu49ffrgY"
      }
    ],
    "task": {
      "taskId": "task_5_4",
      "title": "Exercise 5.4: Conversion Miles to Kilometers",
      "description": "Write a loop to display a table of conversions from miles (1 to 10) to kilometers (1 mile = 1.609 km). The class name must be Exercise05_04.",
      "codeTemplate": "public class Exercise05_04 {\n    public static void main(String[] args) {\n        // Display conversion table\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "10      16.09",
          "description": "Checks final line conversion of table"
        }
      ]
    }
  },
  {
    "day": 16,
    "date": "2026-06-29",
    "dayOfWeek": "Monday",
    "type": "video",
    "chapterNum": 5,
    "chapterTitle": "Loops",
    "title": "Ch 5: Tuition Projections",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/05slide.ppt",
    "videos": [
      {
        "videoId": "xQ1x_C9LwmI",
        "title": "Java | Chapter 5 (Part 2) | Loops",
        "duration": "00:50:57",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:50:57",
        "thumbnail": "https://i.ytimg.com/vi/xQ1x_C9LwmI/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=xQ1x_C9LwmI"
      }
    ],
    "task": {
      "taskId": "task_5_7",
      "title": "Exercise 5.7: Compute Future Tuition",
      "description": "Tuition is $10,000 this year, rising 5% annually. Compute tuition in 10 years and the total cost of 4 years' tuition starting 10 years from now. The class name must be Exercise05_07.",
      "codeTemplate": "public class Exercise05_07 {\n    public static void main(String[] args) {\n        // Calculate tuition and total 4-year cost\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Tuition: 16288.9\nCost: 73717.7",
          "description": "Tuition in 10 years and total 4-year cost"
        }
      ]
    }
  },
  {
    "day": 17,
    "date": "2026-06-30",
    "dayOfWeek": "Tuesday",
    "type": "video",
    "chapterNum": 6,
    "chapterTitle": "Methods",
    "title": "Ch 6: Defining and Invoking Helper Methods",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/06slide.ppt",
    "videos": [
      {
        "videoId": "LZ-S5v1Y6bs",
        "title": "Java | Chapter 6 | Methods",
        "duration": "00:46:23",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:46:23",
        "thumbnail": "https://i.ytimg.com/vi/LZ-S5v1Y6bs/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=LZ-S5v1Y6bs"
      }
    ],
    "task": {
      "taskId": "task_6_2",
      "title": "Exercise 6.2: Sum Digits Helper Method",
      "description": "Implement a method 'public static int sumDigits(long n)' to sum all digits in a long integer. Call it from main for the input 234. The class name must be Exercise06_02.",
      "codeTemplate": "public class Exercise06_02 {\n    public static void main(String[] args) {\n        System.out.println(\"Sum: \" + sumDigits(234));\n    }\n    \n    public static int sumDigits(long n) {\n        // Sum digits logic here\n        return 0;\n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Sum: 9",
          "description": "Sum of digits in 234 is 9"
        }
      ]
    }
  },
  {
    "day": 18,
    "date": "2026-07-01",
    "dayOfWeek": "Wednesday",
    "type": "video",
    "chapterNum": 6,
    "chapterTitle": "Methods",
    "title": "Ch 6: Palindrome Checker Method",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/06slide.ppt",
    "videos": [
      {
        "videoId": "qUCj_jK_MFQ",
        "title": "Java | Chapter 6 (Part 2) | Methods",
        "duration": "00:46:14",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:46:14",
        "thumbnail": "https://i.ytimg.com/vi/qUCj_jK_MFQ/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=qUCj_jK_MFQ"
      }
    ],
    "task": {
      "taskId": "task_6_3",
      "title": "Exercise 6.3: Palindrome Integer Methods",
      "description": "Implement two methods: 'public static int reverse(int number)' and 'public static boolean isPalindrome(int number)'. Verify if 121 is a palindrome. The class name must be Exercise06_03.",
      "codeTemplate": "public class Exercise06_03 {\n    public static void main(String[] args) {\n        System.out.println(\"Is Palindrome: \" + isPalindrome(121));\n    }\n    public static int reverse(int number) {\n        // Reverse digits\n        return 0;\n    }\n    public static boolean isPalindrome(int number) {\n        // Check equality with reverse\n        return false;\n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Is Palindrome: true",
          "description": "121 is palindrome"
        }
      ]
    }
  },
  {
    "day": 19,
    "date": "2026-07-02",
    "dayOfWeek": "Thursday",
    "type": "video",
    "chapterNum": 6,
    "chapterTitle": "Methods",
    "title": "Ch 6: Sorting Three Numbers",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/06slide.ppt",
    "videos": [
      {
        "videoId": "LZ-S5v1Y6bs",
        "title": "Sorting Three Numbers Lecture",
        "duration": "00:46:23",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:46:23",
        "thumbnail": "https://i.ytimg.com/vi/LZ-S5v1Y6bs/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=LZ-S5v1Y6bs"
      }
    ],
    "task": {
      "taskId": "task_6_5",
      "title": "Exercise 6.5: Sort Three Numbers Helper",
      "description": "Implement method 'public static void displaySortedNumbers(double num1, double num2, double num3)' to print three numbers in increasing order separated by spaces. The class name must be Exercise06_05.",
      "codeTemplate": "public class Exercise06_05 {\n    public static void main(String[] args) {\n        displaySortedNumbers(3.0, 1.0, 2.0);\n    }\n    public static void displaySortedNumbers(double n1, double n2, double n3) {\n        // Sort and print\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "1.0 2.0 3.0",
          "description": "Output numbers printed as '1.0 2.0 3.0'"
        }
      ]
    }
  },
  {
    "day": 20,
    "date": "2026-07-03",
    "dayOfWeek": "Friday",
    "type": "off",
    "chapterNum": null,
    "chapterTitle": "Rest",
    "title": "🏖️ Rest Day"
  },
  {
    "day": 21,
    "date": "2026-07-04",
    "dayOfWeek": "Saturday",
    "type": "video",
    "chapterNum": 5,
    "chapterTitle": "Loops",
    "title": "Practice: Find Two Highest Scores",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/05slide.ppt",
    "videos": [],
    "task": {
      "taskId": "task_5_9",
      "title": "Exercise 5.9: Find the Two Highest Scores",
      "description": "Write a program that prompts the user to enter the number of students, then each student's name and score, and displays the student with the highest score and the student with the second-highest score. The class name must be Exercise05_09.",
      "codeTemplate": "import java.util.Scanner;\n\npublic class Exercise05_09 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Read students count, names, scores. Output two highest.\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "3 Bob 80 Alice 95 Tom 90",
          "expected": "Highest: Alice\nSecond: Tom",
          "description": "Alice (95) and Tom (90) are top two"
        }
      ],
      "quiz": [
        {
          "question": "Which keyword exits a loop immediately?",
          "options": [
            "continue",
            "break",
            "exit"
          ],
          "correctIdx": 1
        }
      ]
    }
  },
  {
    "day": 22,
    "date": "2026-07-05",
    "dayOfWeek": "Sunday",
    "type": "video",
    "chapterNum": 7,
    "chapterTitle": "Single-Dimensional Arrays",
    "title": "Ch 7: Single-Dimensional Arrays (Part A)",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/07slide.pptx",
    "videos": [
      {
        "videoId": "qvh6RfT_Kek",
        "title": "Java | Chapter 7 | Single-Dimensional Arrays",
        "duration": "00:51:08",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:51:08",
        "thumbnail": "https://i.ytimg.com/vi/qvh6RfT_Kek/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=qvh6RfT_Kek"
      }
    ],
    "task": {
      "taskId": "task_7_2",
      "title": "Exercise 7.2: Reverse Array Input",
      "description": "Read 10 integers from console and display them in the reverse order in which they were read. The class name must be Exercise07_02.",
      "codeTemplate": "import java.util.Scanner;\n\npublic class Exercise07_02 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Read 10 numbers and print in reverse order\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "1 2 3 4 5 6 7 8 9 10",
          "expected": "10 9 8 7 6 5 4 3 2 1",
          "description": "10 numbers in reverse order"
        }
      ]
    }
  },
  {
    "day": 23,
    "date": "2026-07-06",
    "dayOfWeek": "Monday",
    "type": "video",
    "chapterNum": 7,
    "chapterTitle": "Single-Dimensional Arrays",
    "title": "Ch 7: Array Frequencies & Minimum Element",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/07slide.pptx",
    "videos": [
      {
        "videoId": "Hkg3wKVPznA",
        "title": "Java | Chapter 7 (Part 2) | Single-Dimensional Arrays",
        "duration": "01:02:00",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:31:03",
        "thumbnail": "https://i.ytimg.com/vi/Hkg3wKVPznA/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=Hkg3wKVPznA"
      }
    ],
    "task": {
      "taskId": "task_7_7",
      "title": "Exercise 7.7: Count Single Digits",
      "description": "Generate 100 random single-digit integers (0 to 9) and display the frequency count for each digit. The class name must be Exercise07_07.",
      "codeTemplate": "public class Exercise07_07 {\n    public static void main(String[] args) {\n        // Generate 100 random digits, count and print\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Digit 0:",
          "description": "Displays frequency output format"
        }
      ]
    }
  },
  {
    "day": 24,
    "date": "2026-07-07",
    "dayOfWeek": "Tuesday",
    "type": "video",
    "chapterNum": 8,
    "chapterTitle": "Multi-Dimensional Arrays",
    "title": "Ch 8: Sum Matrix Diagonal",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/08slide.ppt",
    "videos": [
      {
        "videoId": "xzSy-sEt4W4",
        "title": "Java | Chapter 8 | Multi-Dimensional Arrays",
        "duration": "00:44:29",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:44:29",
        "thumbnail": "https://i.ytimg.com/vi/xzSy-sEt4W4/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=xzSy-sEt4W4"
      }
    ],
    "task": {
      "taskId": "task_8_2",
      "title": "Exercise 8.2: Sum Major Diagonal",
      "description": "Implement the method 'public static double sumMajorDiagonal(double[][] m)' to calculate the total sum of elements on the major diagonal in a 4x4 matrix. The class name must be Exercise08_02.",
      "codeTemplate": "import java.util.Scanner;\n\npublic class Exercise08_02 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Read 4x4 double matrix, call sumMajorDiagonal\n        \n    }\n    public static double sumMajorDiagonal(double[][] m) {\n        // Write logic\n        return 0;\n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16",
          "expected": "Diagonal Sum: 34.0",
          "description": "Sum of 1 + 6 + 11 + 16 is 34"
        }
      ]
    }
  },
  {
    "day": 25,
    "date": "2026-07-08",
    "dayOfWeek": "Wednesday",
    "type": "project",
    "chapterNum": null,
    "chapterTitle": "Mini Project 1",
    "title": "Mini-Project 1: Class Grade Toolkit",
    "slides": null,
    "videos": [],
    "task": {
      "taskId": "proj_grade_start",
      "title": "Class Grade Toolkit (Setup & Statistics)",
      "description": "Build a command-line program that helps a student analyze a set of exam scores and course credit hours, and produces a GPA report. Initiate your setup: read valid positive course counts, implement validation rules to reject any scores outside 0-100 and non-positive credit hours, and calculate basic statistics (weighted average, highest, lowest, and count above 80).",
      "projectInfo": {
        "covers": "Ch 1–8 (Java basics, variables, I/O, expressions, conditionals, math/strings, loops, methods, arrays, matrices)",
        "goal": "Build a command-line program that helps a student analyze a set of exam scores and course credit hours, and produces a GPA report based on university grading regulations.",
        "requirements": [
          {
            "title": "1. Collecting scores & credit hours",
            "description": "Ask the user how many courses they want to enter. If the number entered is 0 or negative, keep asking until a valid positive number is given. Then ask the user to enter each course's score (percentage) and credit hours. For each course, first ask for the score (percentage), and immediately after, ask for the credit hours of that course. Scores must be between 0 and 100, and credit hours must be greater than 0. Reject invalid values and ask again until valid."
          },
          {
            "title": "2. Basic statistics",
            "description": "After all course data is collected, the app should report: the weighted average score of all the courses (weighted by credit hours: sum(score * credit hours) / sum(credit hours)), the highest score, the lowest score, and the number of courses with a score higher than 80 (this threshold of 80 is fixed — the app doesn't need to ask the user for it)."
          },
          {
            "title": "3. Letter grades per course",
            "description": "For each individual score entered, the app assigns a letter grade using the university scale:\n- 90% and above → A+\n- 85% to < 90% → A\n- 80% to < 85% → B+\n- 75% to < 80% → B\n- 70% to < 75% → C+\n- 65% to < 70% → C\n- 60% to < 65% → D+\n- 50% to < 60% → D\n- Below 50% → F\nThe app should display the full list of letter grades, one per course, in the same order the scores were entered (e.g., [B+, A, C+, D+, A+])."
          },
          {
            "title": "4. A 'bonus number'",
            "description": "The app should take the highest score and produce a 'bonus number' by adding together its individual digits (e.g., a score of 92 produces a bonus number of 11, since 9 + 2 = 11)."
          },
          {
            "title": "5. Name check",
            "description": "Ask the user for their name. The app should check whether the name reads the same forwards and backwards (ignoring case), and tell the user whether their name is a 'palindrome' or not."
          },
          {
            "title": "6. GPA calculator",
            "description": "For each course, determine its grade points using this scale:\n- 90% and above → 4.0\n- 85% to < 90% → 3.75\n- 80% to < 85% → 3.4\n- 75% to < 80% → 3.1\n- 70% to < 75% → 2.8\n- 65% to < 70% → 2.5\n- 60% to < 65% → 2.25\n- 50% to < 60% → 2.0\n- Below 50% → 1.0\nCalculate the Cumulative GPA using the formula: GPA = sum(Grade Points * Credit Hours) / sum(Credit Hours). Determine the Overall General Estimate (التقدير العام): GPA >= 3.4 is Excellent (ممتاز), 2.8 to < 3.4 is Very Good (جيد جداً), 2.4 to < 2.8 is Good (جيد), 2.0 to < 2.4 is Pass (مقبول), 1.4 to < 2.0 is Weak (ضعيف), and GPA < 1.4 is Very Weak (ضعيف جداً)."
          },
          {
            "title": "7. Final report",
            "description": "At the end, the app prints a single clean summary that includes all of the above: the list of courses with scores and credit hours, the weighted average score, highest score, lowest score, count of courses above 80, the list of letter grades (one per course), the bonus number, the palindrome result, the weighted GPA, and the Overall General Estimate."
          }
        ],
        "sampleRun": "How many courses? 5\nEnter score for course 1: 83\nEnter credit hours for course 1: 3\nEnter score for course 2: 150\nInvalid score, please enter a value between 0 and 100:\nEnter score for course 2: 86\nEnter credit hours for course 2: 4\nEnter score for course 3: 72\nEnter credit hours for course 3: 2\nEnter score for course 4: 60\nEnter credit hours for course 4: 3\nEnter score for course 5: 92\nEnter credit hours for course 5: 3\n\nWhat's your name? Ahmed\n\n===== GRADE REPORT =====\nStudent: Ahmed\nIs your name a palindrome? false\nScores & Credits: [83% (3 hrs), 86% (4 hrs), 72% (2 hrs), 60% (3 hrs), 92% (3 hrs)]\nAverage Score (Weighted): 79.53\nHighest Score: 92   Lowest Score: 60\nCourses with score above 80: 3\nLetter Grades: [B+, A, C+, D+, A+]\nBonus number (digit sum of highest score): 11\nWeighted GPA: 3.30\nOverall Grade: Very Good (جيد جداً)\n========================="
      },
      "checklist": [
        "App asks how many courses, and rejects 0 or negative values",
        "App reads that many scores and credit hours from the user sequentially",
        "Any score outside 0–100 or credit hours <= 0 is rejected with a message, and the app re-asks for that value until valid",
        "App correctly reports the weighted average score of the courses entered",
        "App correctly reports the highest score",
        "App correctly reports the lowest score",
        "App correctly reports the number of courses with a score higher than 80 (fixed threshold of 80)"
      ]
    }
  },
  {
    "day": 26,
    "date": "2026-07-09",
    "dayOfWeek": "Thursday",
    "type": "project",
    "chapterNum": null,
    "chapterTitle": "Mini Project 1",
    "title": "Mini-Project 1: Class Grade Toolkit",
    "slides": null,
    "videos": [],
    "task": {
      "taskId": "proj_grade_dev",
      "title": "Class Grade Toolkit (Grades & GPA)",
      "description": "Flesh out student details: calculate standard letter grades (A+/A/B+/B/C+/C/D+/D/F) for each course, calculate a 'bonus number' by summing the digits of the highest score (e.g. 92 -> 11), perform a case-insensitive palindrome check on the student's name, and compute GPA as the credit-weighted average of course grade points.",
      "projectInfo": {
        "covers": "Ch 1–8 (Java basics, variables, I/O, expressions, conditionals, math/strings, loops, methods, arrays, matrices)",
        "goal": "Build a command-line program that helps a student analyze a set of exam scores and course credit hours, and produces a GPA report based on university grading regulations.",
        "requirements": [
          {
            "title": "1. Collecting scores & credit hours",
            "description": "Ask the user how many courses they want to enter. If the number entered is 0 or negative, keep asking until a valid positive number is given. Then ask the user to enter each course's score (percentage) and credit hours. For each course, first ask for the score (percentage), and immediately after, ask for the credit hours of that course. Scores must be between 0 and 100, and credit hours must be greater than 0. Reject invalid values and ask again until valid."
          },
          {
            "title": "2. Basic statistics",
            "description": "After all course data is collected, the app should report: the weighted average score of all the courses (weighted by credit hours: sum(score * credit hours) / sum(credit hours)), the highest score, the lowest score, and the number of courses with a score higher than 80 (this threshold of 80 is fixed — the app doesn't need to ask the user for it)."
          },
          {
            "title": "3. Letter grades per course",
            "description": "For each individual score entered, the app assigns a letter grade using the university scale:\n- 90% and above → A+\n- 85% to < 90% → A\n- 80% to < 85% → B+\n- 75% to < 80% → B\n- 70% to < 75% → C+\n- 65% to < 70% → C\n- 60% to < 65% → D+\n- 50% to < 60% → D\n- Below 50% → F\nThe app should display the full list of letter grades, one per course, in the same order the scores were entered (e.g., [B+, A, C+, D+, A+])."
          },
          {
            "title": "4. A 'bonus number'",
            "description": "The app should take the highest score and produce a 'bonus number' by adding together its individual digits (e.g., a score of 92 produces a bonus number of 11, since 9 + 2 = 11)."
          },
          {
            "title": "5. Name check",
            "description": "Ask the user for their name. The app should check whether the name reads the same forwards and backwards (ignoring case), and tell the user whether their name is a 'palindrome' or not."
          },
          {
            "title": "6. GPA calculator",
            "description": "For each course, determine its grade points using this scale:\n- 90% and above → 4.0\n- 85% to < 90% → 3.75\n- 80% to < 85% → 3.4\n- 75% to < 80% → 3.1\n- 70% to < 75% → 2.8\n- 65% to < 70% → 2.5\n- 60% to < 65% → 2.25\n- 50% to < 60% → 2.0\n- Below 50% → 1.0\nCalculate the Cumulative GPA using the formula: GPA = sum(Grade Points * Credit Hours) / sum(Credit Hours). Determine the Overall General Estimate (التقدير العام): GPA >= 3.4 is Excellent (ممتاز), 2.8 to < 3.4 is Very Good (جيد جداً), 2.4 to < 2.8 is Good (جيد), 2.0 to < 2.4 is Pass (مقبول), 1.4 to < 2.0 is Weak (ضعيف), and GPA < 1.4 is Very Weak (ضعيف جداً)."
          },
          {
            "title": "7. Final report",
            "description": "At the end, the app prints a single clean summary that includes all of the above: the list of courses with scores and credit hours, the weighted average score, highest score, lowest score, count of courses above 80, the list of letter grades (one per course), the bonus number, the palindrome result, the weighted GPA, and the Overall General Estimate."
          }
        ],
        "sampleRun": "How many courses? 5\nEnter score for course 1: 83\nEnter credit hours for course 1: 3\nEnter score for course 2: 150\nInvalid score, please enter a value between 0 and 100:\nEnter score for course 2: 86\nEnter credit hours for course 2: 4\nEnter score for course 3: 72\nEnter credit hours for course 3: 2\nEnter score for course 4: 60\nEnter credit hours for course 4: 3\nEnter score for course 5: 92\nEnter credit hours for course 5: 3\n\nWhat's your name? Ahmed\n\n===== GRADE REPORT =====\nStudent: Ahmed\nIs your name a palindrome? false\nScores & Credits: [83% (3 hrs), 86% (4 hrs), 72% (2 hrs), 60% (3 hrs), 92% (3 hrs)]\nAverage Score (Weighted): 79.53\nHighest Score: 92   Lowest Score: 60\nCourses with score above 80: 3\nLetter Grades: [B+, A, C+, D+, A+]\nBonus number (digit sum of highest score): 11\nWeighted GPA: 3.30\nOverall Grade: Very Good (جيد جداً)\n========================="
      },
      "checklist": [
        "App correctly assigns a letter grade (A+/A/B+/B/C+/C/D+/D/F) to each individual score and displays the list in entry order",
        "App displays a correct 'bonus number' (digit sum of the highest score)",
        "App asks for the user's name and correctly identifies whether it's a palindrome (case-insensitive)",
        "App correctly converts each score to grade points (4.0/3.75/3.4/3.1/2.8/2.5/2.25/2.0/1.0) and calculates GPA as the credit-weighted average"
      ]
    }
  },
  {
    "day": 27,
    "date": "2026-07-10",
    "dayOfWeek": "Friday",
    "type": "off",
    "chapterNum": null,
    "chapterTitle": "Rest",
    "title": "🏖️ Rest Day"
  },
  {
    "day": 28,
    "date": "2026-07-11",
    "dayOfWeek": "Saturday",
    "type": "project",
    "chapterNum": null,
    "chapterTitle": "Mini Project 1",
    "title": "Mini-Project 1: Class Grade Toolkit",
    "slides": null,
    "videos": [],
    "task": {
      "taskId": "proj_grade_submit",
      "title": "Class Grade Toolkit Submission",
      "description": "Complete and publish your Grade Toolkit command-line Java program to GitHub. Write a clear README.md with run instructions and a sample screenshot or execution log. Submit your repository link and development summary below to complete Mini-Project 1.",
      "projectInfo": {
        "covers": "Ch 1–8 (Java basics, variables, I/O, expressions, conditionals, math/strings, loops, methods, arrays, matrices)",
        "goal": "Build a command-line program that helps a student analyze a set of exam scores and course credit hours, and produces a GPA report based on university grading regulations.",
        "requirements": [
          {
            "title": "1. Collecting scores & credit hours",
            "description": "Ask the user how many courses they want to enter. If the number entered is 0 or negative, keep asking until a valid positive number is given. Then ask the user to enter each course's score (percentage) and credit hours. For each course, first ask for the score (percentage), and immediately after, ask for the credit hours of that course. Scores must be between 0 and 100, and credit hours must be greater than 0. Reject invalid values and ask again until valid."
          },
          {
            "title": "2. Basic statistics",
            "description": "After all course data is collected, the app should report: the weighted average score of all the courses (weighted by credit hours: sum(score * credit hours) / sum(credit hours)), the highest score, the lowest score, and the number of courses with a score higher than 80 (this threshold of 80 is fixed — the app doesn't need to ask the user for it)."
          },
          {
            "title": "3. Letter grades per course",
            "description": "For each individual score entered, the app assigns a letter grade using the university scale:\n- 90% and above → A+\n- 85% to < 90% → A\n- 80% to < 85% → B+\n- 75% to < 80% → B\n- 70% to < 75% → C+\n- 65% to < 70% → C\n- 60% to < 65% → D+\n- 50% to < 60% → D\n- Below 50% → F\nThe app should display the full list of letter grades, one per course, in the same order the scores were entered (e.g., [B+, A, C+, D+, A+])."
          },
          {
            "title": "4. A 'bonus number'",
            "description": "The app should take the highest score and produce a 'bonus number' by adding together its individual digits (e.g., a score of 92 produces a bonus number of 11, since 9 + 2 = 11)."
          },
          {
            "title": "5. Name check",
            "description": "Ask the user for their name. The app should check whether the name reads the same forwards and backwards (ignoring case), and tell the user whether their name is a 'palindrome' or not."
          },
          {
            "title": "6. GPA calculator",
            "description": "For each course, determine its grade points using this scale:\n- 90% and above → 4.0\n- 85% to < 90% → 3.75\n- 80% to < 85% → 3.4\n- 75% to < 80% → 3.1\n- 70% to < 75% → 2.8\n- 65% to < 70% → 2.5\n- 60% to < 65% → 2.25\n- 50% to < 60% → 2.0\n- Below 50% → 1.0\nCalculate the Cumulative GPA using the formula: GPA = sum(Grade Points * Credit Hours) / sum(Credit Hours). Determine the Overall General Estimate (التقدير العام): GPA >= 3.4 is Excellent (ممتاز), 2.8 to < 3.4 is Very Good (جيد جداً), 2.4 to < 2.8 is Good (جيد), 2.0 to < 2.4 is Pass (مقبول), 1.4 to < 2.0 is Weak (ضعيف), and GPA < 1.4 is Very Weak (ضعيف جداً)."
          },
          {
            "title": "7. Final report",
            "description": "At the end, the app prints a single clean summary that includes all of the above: the list of courses with scores and credit hours, the weighted average score, highest score, lowest score, count of courses above 80, the list of letter grades (one per course), the bonus number, the palindrome result, the weighted GPA, and the Overall General Estimate."
          }
        ],
        "sampleRun": "How many courses? 5\nEnter score for course 1: 83\nEnter credit hours for course 1: 3\nEnter score for course 2: 150\nInvalid score, please enter a value between 0 and 100:\nEnter score for course 2: 86\nEnter credit hours for course 2: 4\nEnter score for course 3: 72\nEnter credit hours for course 3: 2\nEnter score for course 4: 60\nEnter credit hours for course 4: 3\nEnter score for course 5: 92\nEnter credit hours for course 5: 3\n\nWhat's your name? Ahmed\n\n===== GRADE REPORT =====\nStudent: Ahmed\nIs your name a palindrome? false\nScores & Credits: [83% (3 hrs), 86% (4 hrs), 72% (2 hrs), 60% (3 hrs), 92% (3 hrs)]\nAverage Score (Weighted): 79.53\nHighest Score: 92   Lowest Score: 60\nCourses with score above 80: 3\nLetter Grades: [B+, A, C+, D+, A+]\nBonus number (digit sum of highest score): 11\nWeighted GPA: 3.30\nOverall Grade: Very Good (جيد جداً)\n========================="
      },
      "checklist": [
        "App determines and displays the correct Overall General Estimate based on the GPA",
        "App prints one final report containing all results together, in a readable format",
        "Running the program multiple times with different inputs gives correct, consistent results",
        "Git repository initialized and pushed to GitHub with a solid README.md"
      ]
    }
  },
  {
    "day": 29,
    "date": "2026-07-12",
    "dayOfWeek": "Sunday",
    "type": "video",
    "chapterNum": 9,
    "chapterTitle": "Objects and Classes",
    "title": "Ch 9: Objects and Classes (Part 1)",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/09slide.ppt",
    "videos": [
      {
        "videoId": "RK2ABib7pmI",
        "title": "Java | Chapter 9 | Objects and Classes",
        "duration": "00:35:04",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:35:04",
        "thumbnail": "https://i.ytimg.com/vi/RK2ABib7pmI/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=RK2ABib7pmI"
      }
    ],
    "task": {
      "taskId": "task_9_1",
      "title": "Exercise 9.1: Rectangle Class",
      "description": "Define a Rectangle class with width and height (default 1.0), a no-arg constructor, a constructor with width and height, getArea(), and getPerimeter(). Instantiate two rectangles (4.0x40.0 and 3.5x35.9). The class name must be Exercise09_01.",
      "codeTemplate": "public class Exercise09_01 {\n    public static void main(String[] args) {\n        // Instantiate both Rectangles, print width, height, area, perimeter\n        \n    }\n}\n\nclass Rectangle {\n    // Write fields, constructors and helper methods here\n    \n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Area: 160.0",
          "description": "Checks first Rectangle area calculation (160.0)"
        }
      ]
    }
  },
  {
    "day": 30,
    "date": "2026-07-13",
    "dayOfWeek": "Monday",
    "type": "video",
    "chapterNum": 9,
    "chapterTitle": "Objects and Classes",
    "title": "Ch 9: Stock Change Percentage Class",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/09slide.ppt",
    "videos": [
      {
        "videoId": "eDxRQEmkoGM",
        "title": "Java | Chapter 9 (Part 2) | Objects and Classes",
        "duration": "00:32:29",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:32:29",
        "thumbnail": "https://i.ytimg.com/vi/eDxRQEmkoGM/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=eDxRQEmkoGM"
      }
    ],
    "task": {
      "taskId": "task_9_2",
      "title": "Exercise 9.2: Stock Class Design",
      "description": "Create a Stock class with symbol, name, previousClosingPrice, and currentPrice. Implement getChangePercent(). In main, instantiate a Stock object 'ORCL' (Oracle Corp) with previous price 34.5 and current price 34.35. The class name must be Exercise09_02.",
      "codeTemplate": "public class Exercise09_02 {\n    public static void main(String[] args) {\n        // Create Stock 'ORCL', set prices, print change percent\n        \n    }\n}\n\nclass Stock {\n    // Write fields, constructors and getChangePercent helper here\n    \n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "-0.43",
          "description": "Percentage price change should be around -0.43%"
        }
      ]
    }
  },
  {
    "day": 31,
    "date": "2026-07-14",
    "dayOfWeek": "Tuesday",
    "type": "video",
    "chapterNum": 9,
    "chapterTitle": "Objects and Classes",
    "title": "Ch 9: Date & Random Built-in API Classes",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/09slide.ppt",
    "videos": [
      {
        "videoId": "jFw0ZkDXU6U",
        "title": "Java | Chapter 9 (Part 3) | Objects and Classes",
        "duration": "00:38:40",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:38:40",
        "thumbnail": "https://i.ytimg.com/vi/jFw0ZkDXU6U/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=jFw0ZkDXU6U"
      }
    ],
    "task": {
      "taskId": "task_9_3",
      "title": "Exercise 9.3: Date API Class Usage",
      "description": "Write a program that creates a java.util.Date object and sets its elapsed times to 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000, and 100000000000 milliseconds, displaying each date using toString(). The class name must be Exercise09_03.",
      "codeTemplate": "import java.util.Date;\n\npublic class Exercise09_03 {\n    public static void main(String[] args) {\n        // Instantiate Date and update time, printing representations\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "1970",
          "description": "Displays date conversions starting in 1970"
        }
      ]
    }
  },
  {
    "day": 32,
    "date": "2026-07-15",
    "dayOfWeek": "Wednesday",
    "type": "video",
    "chapterNum": 9,
    "chapterTitle": "Objects and Classes",
    "title": "Ch 9: GregorianCalendar & Stopwatches",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/09slide.ppt",
    "videos": [
      {
        "videoId": "Vd3gfjFgalY",
        "title": "Java | Chapter 9 (Part 4) | Objects and Classes",
        "duration": "00:22:51",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:22:51",
        "thumbnail": "https://i.ytimg.com/vi/Vd3gfjFgalY/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=Vd3gfjFgalY"
      }
    ],
    "task": {
      "taskId": "task_9_6",
      "title": "Exercise 9.6: Stopwatch Class",
      "description": "Create a Stopwatch class with private fields startTime and endTime, methods start(), stop(), and getElapsedTime(). The class name must be Exercise09_06.",
      "codeTemplate": "public class Exercise09_06 {\n    public static void main(String[] args) {\n        Stopwatch sw = new Stopwatch();\n        sw.start();\n        // sort some numbers\n        sw.stop();\n        System.out.println(\"Time: \" + sw.getElapsedTime());\n    }\n}\n\nclass Stopwatch {\n    // Implement fields, start(), stop(), and getElapsedTime() here\n    \n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Time:",
          "description": "Displays elapsed time value"
        }
      ]
    }
  },
  {
    "day": 33,
    "date": "2026-07-16",
    "dayOfWeek": "Thursday",
    "type": "video",
    "chapterNum": 9,
    "chapterTitle": "Objects and Classes",
    "title": "Ch 9: Fan State & Math Equations Classes",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/09slide.ppt",
    "videos": [
      {
        "videoId": "RK2ABib7pmI",
        "title": "OOP Design Principles Recap",
        "duration": "00:35:04",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:35:04",
        "thumbnail": "https://i.ytimg.com/vi/RK2ABib7pmI/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=RK2ABib7pmI"
      }
    ],
    "task": {
      "taskId": "task_9_8",
      "title": "Exercise 9.8: Fan Class Design",
      "description": "Create a Fan class with properties speed, on, radius, and color. Add toString() method displaying status. If on, return speed, color, radius. If off, return color, radius, and 'fan is off'. The class name must be Exercise09_08.",
      "codeTemplate": "public class Exercise09_08 {\n    public static void main(String[] args) {\n        // Create fans and print toString()\n        \n    }\n}\n\nclass Fan {\n    // Implement Fan class with constants and properties\n    \n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "fan is off",
          "description": "Fan state printed on console"
        }
      ]
    }
  },
  {
    "day": 34,
    "date": "2026-07-17",
    "dayOfWeek": "Friday",
    "type": "off",
    "chapterNum": null,
    "chapterTitle": "Rest",
    "title": "🏖️ Rest Day"
  },
  {
    "day": 35,
    "date": "2026-07-18",
    "dayOfWeek": "Saturday",
    "type": "video",
    "chapterNum": 9,
    "chapterTitle": "Objects and Classes",
    "title": "Practice: Quadratic & Linear Equations",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/09slide.ppt",
    "videos": [],
    "task": {
      "taskId": "task_9_10",
      "title": "Exercise 9.10: QuadraticEquation Class",
      "description": "Design a QuadraticEquation class with fields a, b, c, getDiscriminant() [b^2 - 4ac], and roots. In main, prompt user for double a, b, c. If discriminant is negative, print 'No real roots'. The class name must be Exercise09_10.",
      "codeTemplate": "import java.util.Scanner;\n\npublic class Exercise09_10 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Write logic here\n        \n    }\n}\n\nclass QuadraticEquation {\n    // Write class here\n    \n}",
      "testCases": [
        {
          "id": 1,
          "input": "1 3 2",
          "expected": "Root 1: -1.0\nRoot 2: -2.0",
          "description": "Roots of x^2 + 3x + 2"
        }
      ],
      "quiz": [
        {
          "question": "What is the default value of a boolean instance variable in a custom Java class?",
          "options": [
            "true",
            "false",
            "null",
            "undefined"
          ],
          "correctIdx": 1
        }
      ]
    }
  },
  {
    "day": 36,
    "date": "2026-07-19",
    "dayOfWeek": "Sunday",
    "type": "video",
    "chapterNum": 10,
    "chapterTitle": "Thinking in Objects",
    "title": "Ch 10: Thinking in Objects (Part 1)",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/10slide.ppt",
    "videos": [
      {
        "videoId": "6hQ2pw4LqYk",
        "title": "Java | Chapter 10 | Thinking in Objects",
        "duration": "00:38:18",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:38:18",
        "thumbnail": "https://i.ytimg.com/vi/6hQ2pw4LqYk/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=6hQ2pw4LqYk"
      }
    ],
    "task": {
      "taskId": "task_10_2",
      "title": "Exercise 10.2: BMI Class Encapsulation",
      "description": "Define a BMI class with properties name, age, weight (pounds), height (inches), constructors, getBMI(), and getStatus(). The class name must be Exercise10_02.",
      "codeTemplate": "public class Exercise10_02 {\n    public static void main(String[] args) {\n        BMI bmi = new BMI(\"Alan\", 25, 150, 70);\n        System.out.println(\"BMI: \" + bmi.getBMI() + \" Status: \" + bmi.getStatus());\n    }\n}\n\nclass BMI {\n    // Write encapsulated BMI fields and methods here\n    \n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Normal",
          "description": "BMI category status verification"
        }
      ]
    }
  },
  {
    "day": 37,
    "date": "2026-07-20",
    "dayOfWeek": "Monday",
    "type": "video",
    "chapterNum": 10,
    "chapterTitle": "Thinking in Objects",
    "title": "Ch 10: Thinking in Objects (Part 2)",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/10slide.ppt",
    "videos": [
      {
        "videoId": "NSDD8LUwCeM",
        "title": "Java | Chapter 10 (Part 2) | Thinking in Objects",
        "duration": "00:33:27",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:33:27",
        "thumbnail": "https://i.ytimg.com/vi/NSDD8LUwCeM/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=NSDD8LUwCeM"
      }
    ],
    "task": {
      "taskId": "task_10_3",
      "title": "Exercise 10.3: MyInteger Class Design",
      "description": "Implement MyInteger class with static/non-static helper methods (isEven, isOdd, isPrime) and parseInt(String). The class name must be Exercise10_03.",
      "codeTemplate": "public class Exercise10_03 {\n    public static void main(String[] args) {\n        MyInteger val = new MyInteger(17);\n        System.out.println(\"Is Prime: \" + val.isPrime());\n    }\n}\n\nclass MyInteger {\n    // Write MyInteger logic here\n    \n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Is Prime: true",
          "description": "MyInteger 17 is prime check"
        }
      ]
    }
  },
  {
    "day": 38,
    "date": "2026-07-21",
    "dayOfWeek": "Tuesday",
    "type": "video",
    "chapterNum": 10,
    "chapterTitle": "Thinking in Objects",
    "title": "Ch 10: Queue API & Point Distances",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/10slide.ppt",
    "videos": [
      {
        "videoId": "UnpEgotT5hg",
        "title": "Java | Chapter 10 (Part 4) | Thinking in Objects",
        "duration": "00:29:34",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:29:34",
        "thumbnail": "https://i.ytimg.com/vi/UnpEgotT5hg/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=UnpEgotT5hg"
      }
    ],
    "task": {
      "taskId": "task_10_4",
      "title": "Exercise 10.4: MyPoint Coordinates Distance",
      "description": "Define a MyPoint class with x and y, default (0,0), constructor, and distance methods. In main, compute distance between (0,0) and (10,30.5). The class name must be Exercise10_04.",
      "codeTemplate": "public class Exercise10_04 {\n    public static void main(String[] args) {\n        MyPoint p1 = new MyPoint();\n        MyPoint p2 = new MyPoint(10, 30.5);\n        System.out.println(\"Distance: \" + p1.distance(p2));\n    }\n}\n\nclass MyPoint {\n    // Write coordinate distance methods\n    \n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Distance: 32.1",
          "description": "Distance between (0,0) and (10,30.5)"
        }
      ]
    }
  },
  {
    "day": 39,
    "date": "2026-07-22",
    "dayOfWeek": "Wednesday",
    "type": "video",
    "chapterNum": 10,
    "chapterTitle": "Thinking in Objects",
    "title": "Ch 10: Circle2D & Rectangles Composition",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/10slide.ppt",
    "videos": [
      {
        "videoId": "NSDD8LUwCeM",
        "title": "OOP Composites & Geometries",
        "duration": "00:33:27",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:33:27",
        "thumbnail": "https://i.ytimg.com/vi/NSDD8LUwCeM/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=NSDD8LUwCeM"
      }
    ],
    "task": {
      "taskId": "task_10_11",
      "title": "Exercise 10.11: Circle2D Geometric Methods",
      "description": "Define a Circle2D class with double variables x, y, and radius. Add getArea(), contains(double, double), and contains(Circle2D). The class name must be Exercise10_11.",
      "codeTemplate": "public class Exercise10_11 {\n    public static void main(String[] args) {\n        Circle2D c1 = new Circle2D(2, 2, 5.5);\n        System.out.println(\"Area: \" + c1.getArea());\n    }\n}\n\nclass Circle2D {\n    // Implement Circle2D fields and functions here\n    \n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Area: 95.033",
          "description": "Circle area with radius 5.5"
        }
      ]
    }
  },
  {
    "day": 40,
    "date": "2026-07-23",
    "dayOfWeek": "Thursday",
    "type": "video",
    "chapterNum": 10,
    "chapterTitle": "Thinking in Objects",
    "title": "Ch 10: Mersenne Primes & BigInteger Classes",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/10slide.ppt",
    "videos": [
      {
        "videoId": "6hQ2pw4LqYk",
        "title": "BigInteger API & High Precision Calculation",
        "duration": "00:38:18",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:38:18",
        "thumbnail": "https://i.ytimg.com/vi/6hQ2pw4LqYk/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=6hQ2pw4LqYk"
      }
    ],
    "task": {
      "taskId": "task_10_17",
      "title": "Exercise 10.17: Large Square Numbers",
      "description": "Find the first 10 square numbers that are greater than Long.MAX_VALUE. Use BigInteger class. The class name must be Exercise10_17.",
      "codeTemplate": "import java.math.BigInteger;\n\npublic class Exercise10_17 {\n    public static void main(String[] args) {\n        // Print first 10 squares > Long.MAX_VALUE\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "9223372036854775807",
          "description": "Squares exceed Long.MAX_VALUE threshold"
        }
      ]
    }
  },
  {
    "day": 41,
    "date": "2026-07-24",
    "dayOfWeek": "Friday",
    "type": "off",
    "chapterNum": null,
    "chapterTitle": "Rest",
    "title": "🏖️ Rest Day"
  },
  {
    "day": 42,
    "date": "2026-07-25",
    "dayOfWeek": "Saturday",
    "type": "project",
    "chapterNum": null,
    "chapterTitle": "Mini Project 2",
    "title": "Mini-Project 2: Bank Account Manager",
    "slides": null,
    "videos": [],
    "task": {
      "taskId": "proj_atm_submit",
      "title": "Bank Account Manager Submission",
      "description": "Build a CLI bank system that manages a customer, their account, and a stock portfolio. Set up customer parameters (name, balance, interest rate), record creation date/time, handle 2-3 stocks (percentage change and total value), run exactly 5 random transactions ($10-$500 deposit/withdraw without overdrawing), and print an encapsulated final summary.",
      "projectInfo": {
        "covers": "Ch 9–10 (Objects and Classes, built-in API classes, thinking in objects, composition)",
        "goal": "Build a small CLI bank system that manages a customer, their account, and a small stock portfolio — then simulates some activity and prints a report.",
        "requirements": [
          {
            "title": "1. Setting up the customer",
            "description": "Ask the user for their name and a starting account balance. Ask the user for an annual interest rate for the account (e.g., 4 for 4%). The account should remember the moment it was created (its creation date/time)."
          },
          {
            "title": "2. Stock portfolio",
            "description": "Ask the user to enter 2–3 stocks they own. For each stock, ask for a symbol/name (e.g., 'AAPL'), its previous closing price, and its current price. Report the percentage change between the previous closing price and the current price. Report the total current value of all the stocks combined."
          },
          {
            "title": "3. Simulated transactions",
            "description": "The app should automatically perform 5 random transactions on the account — each one either a deposit or a withdrawal of a random amount (somewhere between $10 and $500). For each transaction, print what happened and the new balance. A withdrawal should never be allowed to take the balance below zero — if a random withdrawal would do that, the app should skip it (or reduce it) and say so instead of producing a negative balance."
          },
          {
            "title": "4. Interest",
            "description": "Using the annual interest rate the user provided, the app should calculate and display the monthly interest the account would earn at its final balance."
          },
          {
            "title": "5. Time since creation",
            "description": "The app should display when the account was created. The app should also calculate and display how many days have passed since the account was created (it's fine if this shows 0 for a freshly-created account — the calculation should still run and display a number)."
          },
          {
            "title": "6. Final summary",
            "description": "At the end, the app prints one combined report showing customer name, final account balance, monthly interest at the final balance, account creation date and days since creation, each stock's percentage change, and total value of the stock portfolio."
          }
        ],
        "sampleRun": "Enter your name: Sara\nEnter starting balance: 1000\nEnter annual interest rate (%): 4\n\nEnter stock 1 symbol: AAPL\nEnter AAPL previous closing price: 180\nEnter AAPL current price: 185\n\nEnter stock 2 symbol: TSLA\nEnter TSLA previous closing price: 250\nEnter TSLA current price: 240\n\n--- Running Transactions ---\n[Transaction 1] Deposit of $312.50 -> New Balance: $1312.50\n[Transaction 2] Withdraw of $400.00 -> New Balance: $912.50\n[Transaction 3] Deposit of $88.20  -> New Balance: $1000.70\n[Transaction 4] Withdraw of $50.00 -> New Balance: $950.70\n[Transaction 5] Deposit of $120.00 -> New Balance: $1070.70\n\n===== ACCOUNT SUMMARY =====\nCustomer: Sara\nFinal Balance: $1070.70\nMonthly Interest: $3.57\nAccount Created: Thu Jun 11 14:32:05 2026\nDays Since Creation: 0\n\n--- Stock Portfolio ---\nAAPL: 180.00 -> 185.00 (+2.78%)\nTSLA: 250.00 -> 240.00 (-4.00%)\nTotal Portfolio Value: $425.00\n============================"
      },
      "checklist": [
        "App asks for customer name, starting balance, and annual interest rate",
        "App records and can later display the account's creation date/time",
        "App accepts 2–3 stocks with symbol, previous closing price, and current price",
        "App correctly calculates each stock's percentage change (both positive and negative cases)",
        "App correctly calculates total portfolio value of all stocks combined",
        "App runs exactly 5 random transactions, each clearly labeled as deposit or withdrawal with an amount between $10–$500",
        "Each transaction prints the new balance immediately after it happens",
        "Balance never goes negative — a withdrawal that would overdraw is handled gracefully (skipped, reduced, or rejected)",
        "App correctly calculates monthly interest based on final balance and interest rate",
        "App displays days since account creation",
        "Final summary reports customer name, balance, interest, creation date, stock changes, and portfolio value",
        "Running the program again produces different random transactions but same correct overall structure"
      ]
    }
  },
  {
    "day": 43,
    "date": "2026-07-26",
    "dayOfWeek": "Sunday",
    "type": "video",
    "chapterNum": 11,
    "chapterTitle": "Inheritance and Polymorphism",
    "title": "Ch 11: Inheritance and Polymorphism (Part 1)",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/11slide.ppt",
    "videos": [
      {
        "videoId": "Ly1wkba3EZk",
        "title": "Java | Chapter 11 | Inheritance and Polymorphism",
        "duration": "00:44:36",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:44:36",
        "thumbnail": "https://i.ytimg.com/vi/Ly1wkba3EZk/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=Ly1wkba3EZk"
      }
    ],
    "task": {
      "taskId": "task_11_1",
      "title": "Exercise 11.1: Triangle & GeometricObject Class",
      "description": "Define Triangle subclass that extends GeometricObject superclass. Include double variables side1, side2, side3, constructors, and getArea(). The class name must be Exercise11_01.",
      "codeTemplate": "public class Exercise11_01 {\n    public static void main(String[] args) {\n        Triangle t = new Triangle(1.0, 1.5, 1.0);\n        System.out.println(\"Area: \" + t.getArea());\n    }\n}\n\nclass GeometricObject {\n    // Superclass fields and methods\n}\n\nclass Triangle extends GeometricObject {\n    // Subclass properties\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Area: 0.496",
          "description": "Area of triangle sides (1.0, 1.5, 1.0) is ~0.496"
        }
      ]
    }
  },
  {
    "day": 44,
    "date": "2026-07-27",
    "dayOfWeek": "Monday",
    "type": "video",
    "chapterNum": 11,
    "chapterTitle": "Inheritance and Polymorphism",
    "title": "Ch 11: Inheritance and Polymorphism (Part 2)",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/11slide.ppt",
    "videos": [
      {
        "videoId": "OrQM3Luv6zg",
        "title": "Java | Chapter 11 (Part 2) | Inheritance and Polymorphism",
        "duration": "00:32:21",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:32:21",
        "thumbnail": "https://i.ytimg.com/vi/OrQM3Luv6zg/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=OrQM3Luv6zg"
      }
    ],
    "task": {
      "taskId": "task_11_2",
      "title": "Exercise 11.2: Polymorphic Person Hierarchy",
      "description": "Design Person, Student, Employee, Faculty, and Staff classes. Override toString() in each class to return the class name and person name. The class name must be Exercise11_02.",
      "codeTemplate": "public class Exercise11_02 {\n    public static void main(String[] args) {\n        Person p = new Student(\"Alice\");\n        System.out.println(p.toString());\n    }\n}\n\nclass Person {\n    String name;\n    public Person(String name) { this.name = name; }\n    public String toString() { return \"Person: \" + name; }\n}\n// Write Student, Employee subclasses here\n",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Student: Alice",
          "description": "Overridden toString() returns 'Student: Alice'"
        }
      ]
    }
  },
  {
    "day": 45,
    "date": "2026-07-28",
    "dayOfWeek": "Tuesday",
    "type": "video",
    "chapterNum": 11,
    "chapterTitle": "Inheritance and Polymorphism",
    "title": "Ch 11: Polymorphic Accounts & Checking/Savings",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/11slide.ppt",
    "videos": [
      {
        "videoId": "QZE1PQaOhoQ",
        "title": "Java | Chapter 11 (Part 3) | Inheritance and Polymorphism",
        "duration": "00:22:04",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:22:04",
        "thumbnail": "https://i.ytimg.com/vi/QZE1PQaOhoQ/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=QZE1PQaOhoQ"
      }
    ],
    "task": {
      "taskId": "task_11_3",
      "title": "Exercise 11.3: Checking and Savings Subclasses",
      "description": "Extend custom Account class to create CheckingAccount (with overdraft limit) and SavingsAccount. Override withdraw() method to restrict savings overdrafts. The class name must be Exercise11_03.",
      "codeTemplate": "public class Exercise11_03 {\n    public static void main(String[] args) {\n        // Write subclasses checks here\n        \n    }\n}\n\nclass Account {\n    double balance;\n}\n// Write subclasses extending Account here\n",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "CheckingAccount",
          "description": "CheckingAccount overrides methods properly"
        }
      ]
    }
  },
  {
    "day": 46,
    "date": "2026-07-29",
    "dayOfWeek": "Wednesday",
    "type": "video",
    "chapterNum": 11,
    "chapterTitle": "Inheritance and Polymorphism",
    "title": "Ch 11: Transactions Tracking List",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/11slide.ppt",
    "videos": [
      {
        "videoId": "OrQM3Luv6zg",
        "title": "OOP ArrayList Collections",
        "duration": "00:32:21",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:32:21",
        "thumbnail": "https://i.ytimg.com/vi/OrQM3Luv6zg/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=OrQM3Luv6zg"
      }
    ],
    "task": {
      "taskId": "task_11_8",
      "title": "Exercise 11.8: Custom Transactions List",
      "description": "Modify your Account class to include an ArrayList of Transaction objects. Add deposit and withdraw methods that append records to this list. The class name must be Exercise11_08.",
      "codeTemplate": "import java.util.ArrayList;\n\npublic class Exercise11_08 {\n    public static void main(String[] args) {\n        // Create account, record transactions, print records\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Transaction",
          "description": "Account transaction lists tracked and printable"
        }
      ]
    }
  },
  {
    "day": 47,
    "date": "2026-07-30",
    "dayOfWeek": "Thursday",
    "type": "video",
    "chapterNum": 11,
    "chapterTitle": "Inheritance and Polymorphism",
    "title": "Ch 11: Polymorphism Design Recaps",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/11slide.ppt",
    "videos": [
      {
        "videoId": "Ly1wkba3EZk",
        "title": "Dynamic Binding and Casting Lectures",
        "duration": "00:44:36",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:44:36",
        "thumbnail": "https://i.ytimg.com/vi/Ly1wkba3EZk/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=Ly1wkba3EZk"
      }
    ]
  },
  {
    "day": 48,
    "date": "2026-07-31",
    "dayOfWeek": "Friday",
    "type": "off",
    "chapterNum": null,
    "chapterTitle": "Rest",
    "title": "🏖️ Rest Day"
  },
  {
    "day": 49,
    "date": "2026-08-01",
    "dayOfWeek": "Saturday",
    "type": "video",
    "chapterNum": 11,
    "chapterTitle": "Inheritance and Polymorphism",
    "title": "Practice: Inheritance Review Tasks",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/11slide.ppt",
    "videos": [],
    "task": {
      "taskId": "task_11_recap",
      "title": "Inheritance Override Mechanics",
      "description": "Define a Person class, superclass of Student. Override equals() to check student identities. Make it compile checked.",
      "codeTemplate": "public class TestEquals {\n    public static void main(String[] args) {\n        System.out.println(\"Equals check successful\");\n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Equals check successful",
          "description": "Verification check"
        }
      ]
    }
  },
  {
    "day": 50,
    "date": "2026-08-02",
    "dayOfWeek": "Sunday",
    "type": "video",
    "chapterNum": 13,
    "chapterTitle": "Abstract Classes and Interfaces",
    "title": "Ch 13: Abstract Classes & Geometry Rules",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/13slide.ppt",
    "videos": [
      {
        "videoId": "bfouLyURcWE",
        "title": "Java | Chapter 13 | Abstract Classes and Interfaces",
        "duration": "00:29:49",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:29:49",
        "thumbnail": "https://i.ytimg.com/vi/bfouLyURcWE/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=bfouLyURcWE"
      }
    ],
    "task": {
      "taskId": "task_13_1",
      "title": "Exercise 13.1: Abstract Triangle Class",
      "description": "Define a Triangle class that extends the abstract GeometricObject class. Implement getArea() and getPerimeter() abstract methods. The class name must be Exercise13_01.",
      "codeTemplate": "public class Exercise13_01 {\n    public static void main(String[] args) {\n        // Test abstract implementations\n        \n    }\n}\n\nabstract class GeometricObject {\n    // Abstract superclass definition\n    public abstract double getArea();\n    public abstract double getPerimeter();\n}\n\nclass Triangle extends GeometricObject {\n    // Implement abstract methods here\n    public double getArea() { return 0.0; }\n    public double getPerimeter() { return 0.0; }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "GeometricObject",
          "description": "Triangle implements abstract GeometricObject"
        }
      ]
    }
  },
  {
    "day": 51,
    "date": "2026-08-03",
    "dayOfWeek": "Monday",
    "type": "video",
    "chapterNum": 13,
    "chapterTitle": "Abstract Classes and Interfaces",
    "title": "Ch 13: Implementing Interfaces (Comparable & Cloneable)",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/13slide.ppt",
    "videos": [
      {
        "videoId": "jqmjxcs2T0w",
        "title": "Java | Chapter 13 (Part 2) | Abstract Classes and Interfaces",
        "duration": "00:39:20",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:39:20",
        "thumbnail": "https://i.ytimg.com/vi/jqmjxcs2T0w/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=jqmjxcs2T0w"
      }
    ],
    "task": {
      "taskId": "task_13_5",
      "title": "Exercise 13.5: Comparable GeometricObject",
      "description": "Modify the GeometricObject class to implement the Comparable interface and define a static max() method. The class name must be Exercise13_05.",
      "codeTemplate": "public class Exercise13_05 {\n    public static void main(String[] args) {\n        // Compare geometric objects using max()\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "max",
          "description": "max() method successfully declared and executed"
        }
      ]
    }
  },
  {
    "day": 52,
    "date": "2026-08-04",
    "dayOfWeek": "Tuesday",
    "type": "video",
    "chapterNum": 12,
    "chapterTitle": "Exception Handling and Text IO",
    "title": "Ch 12: Exception Handling (Part 1)",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/12slide.ppt",
    "videos": [
      {
        "videoId": "Y61XfRGzhC0",
        "title": "Java | Chapter 12 | Exception Handling and Text IO",
        "duration": "00:40:12",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:40:12",
        "thumbnail": "https://i.ytimg.com/vi/Y61XfRGzhC0/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=Y61XfRGzhC0"
      }
    ],
    "task": {
      "taskId": "task_12_2",
      "title": "Exercise 12.2: InputMismatchException Safe Input",
      "description": "Write a program that prompts the user to read two integers and displays their sum. Protect the program from InputMismatchException by prompting for integers until correct input is entered. The class name must be Exercise12_02.",
      "codeTemplate": "import java.util.Scanner;\nimport java.util.InputMismatchException;\n\npublic class Exercise12_02 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Read two integers, handle InputMismatchException\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "5 10",
          "expected": "Sum: 15",
          "description": "Sum of 5 and 10 is 15"
        }
      ]
    }
  },
  {
    "day": 53,
    "date": "2026-08-05",
    "dayOfWeek": "Wednesday",
    "type": "video",
    "chapterNum": 12,
    "chapterTitle": "Exception Handling and Text IO",
    "title": "Ch 12: Try-Catch Array Boundaries Protection",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/12slide.ppt",
    "videos": [
      {
        "videoId": "9J38Cm1SjHQ",
        "title": "Java | Chapter 12 (Part 2) | Exception Handling and Text IO",
        "duration": "00:25:52",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:25:52",
        "thumbnail": "https://i.ytimg.com/vi/9J38Cm1SjHQ/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=9J38Cm1SjHQ"
      }
    ],
    "task": {
      "taskId": "task_12_3",
      "title": "Exercise 12.3: Array Index Out of Bounds Exception",
      "description": "Write a program that creates an array of 100 random double elements, prompts the user to enter index. If index is out of bounds, catch the ArrayIndexOutOfBoundsException and print 'Out of bounds'. The class name must be Exercise12_03.",
      "codeTemplate": "import java.util.Scanner;\n\npublic class Exercise12_03 {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Write logic here\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "150",
          "expected": "Out of bounds",
          "description": "Index 150 is out of bounds"
        }
      ]
    }
  },
  {
    "day": 54,
    "date": "2026-08-06",
    "dayOfWeek": "Thursday",
    "type": "video",
    "chapterNum": 12,
    "chapterTitle": "Exception Handling and Text IO",
    "title": "Ch 12: Write and Read Data Files",
    "slides": "https://fcai.smartpharaohs.com/pl2/2025/Slides/12slide.ppt",
    "videos": [
      {
        "videoId": "Y61XfRGzhC0",
        "title": "Exception IO Text File Handlers",
        "duration": "00:40:12",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:40:12",
        "thumbnail": "https://i.ytimg.com/vi/Y61XfRGzhC0/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=Y61XfRGzhC0"
      }
    ],
    "task": {
      "taskId": "task_12_15",
      "title": "Exercise 12.15: Write/Read Data File",
      "description": "Write code to check if a file named 'Exercise12_15.txt' exists. If not, write 100 random integers into it. Read it back and print them in sorted order. The class name must be Exercise12_15.",
      "codeTemplate": "import java.io.*;\nimport java.util.*;\n\npublic class Exercise12_15 {\n    public static void main(String[] args) {\n        // Read, sort, and print file data\n        \n    }\n}",
      "testCases": [
        {
          "id": 1,
          "input": "",
          "expected": "Sorted file content",
          "description": "Output displays file integers sorted"
        }
      ]
    }
  },
  {
    "day": 55,
    "date": "2026-08-07",
    "dayOfWeek": "Friday",
    "type": "off",
    "chapterNum": null,
    "chapterTitle": "Rest",
    "title": "🏖️ Rest Day"
  },
  {
    "day": 56,
    "date": "2026-08-08",
    "dayOfWeek": "Saturday",
    "type": "project",
    "chapterNum": null,
    "chapterTitle": "Mini Project 3",
    "title": "Mini-Project 3: Multi-Account Bank Simulator",
    "slides": null,
    "videos": [],
    "task": {
      "taskId": "proj_library_submit",
      "title": "Multi-Account Bank Simulator Submission",
      "description": "Build a CLI banking program that manages several accounts of Savings and Checking types, demonstrating inheritance and polymorphism. Savings accounts have per-transaction limits and cannot go negative. Checking accounts allow negative balances up to an overdraft limit and charge flat transaction fees. Implement running histories for all transactions and output mixed account summaries.",
      "projectInfo": {
        "covers": "Ch 11 (Inheritance & Polymorphism) and Ch 13 (Abstract Classes & Interfaces)",
        "goal": "Build a CLI banking program that manages several accounts of two different types, each with its own rules, and demonstrates that a program can treat both types 'the same way' while each still behaves according to its own rules.",
        "requirements": [
          {
            "title": "1. Two account types",
            "description": "The app supports two kinds of accounts that share basic fields (ID, owner name, balance) but have different rules:\n- Savings account: Withdrawals cannot take the balance below zero. Has a withdrawal limit per transaction (e.g., no single withdrawal over $1000).\n- Checking account: Allows negative balance down to a fixed overdraft limit (e.g., -$500). Every withdrawal has a small flat fee (e.g., $1.50) automatically subtracted."
          },
          {
            "title": "2. Creating accounts",
            "description": "Ask the user how many accounts they want to create in total. For each account, ask for the owner's name, starting balance, and account type (Savings or Checking). Store all accounts in a single collection."
          },
          {
            "title": "3. Performing transactions",
            "description": "Allow the user to perform a series of transactions (deposit or withdraw) on any account by number/ID until they type DONE. Apply transactions polymorphically using that account's own overridden rules. Print success or rejection messages."
          },
          {
            "title": "4. Transaction history",
            "description": "Every account keeps a running list of everything that happened to it (deposits, successful withdrawals, fees, and rejected attempts). Allow displaying history for any account on request."
          },
          {
            "title": "5. Final report",
            "description": "At the end, loop through all accounts in a single collection and print ID, owner name, type, final balance, and full transaction history."
          },
          {
            "title": "6. Summary statistics",
            "description": "Display the total number of Savings vs Checking accounts created, the combined balance across all accounts, and the single account with the highest balance."
          }
        ],
        "sampleRun": "How many accounts do you want to create? 2\n\n--- Account 1 ---\nOwner name: Sara\nStarting balance: 1000\nType (Savings/Checking): Savings\n\n--- Account 2 ---\nOwner name: Omar\nStarting balance: 200\nType (Savings/Checking): Checking\n\n--- Transactions (type DONE to stop) ---\nAccount ID: 1\nDeposit or Withdraw: Withdraw\nAmount: 1500\n-> Rejected: withdrawal exceeds per-transaction limit ($1000) for Savings account #1\n\nAccount ID: 2\nDeposit or Withdraw: Withdraw\nAmount: 600\n-> Rejected: withdrawal would exceed overdraft limit (-$500) for Checking account #2\n\nAccount ID: 2\nDeposit or Withdraw: Withdraw\nAmount: 100\n-> Withdraw $100.00 + $1.50 fee -> New Balance: $98.50\n\nAccount ID: 1\nDeposit or Withdraw: Deposit\nAmount: 500\n-> Deposit $500.00 -> New Balance: $1500.00\n\nAccount ID: DONE\n\n===== FINAL REPORT =====\n[Account #1] Owner: Sara | Type: Savings | Balance: $1500.00\n  History:\n    - Deposit $1000.00 (initial balance)\n    - Rejected withdrawal of $1500.00 (exceeds per-transaction limit)\n    - Deposit $500.00\n\n[Account #2] Owner: Omar | Type: Checking | Balance: $98.50\n  History:\n    - Deposit $200.00 (initial balance)\n    - Rejected withdrawal of $600.00 (exceeds overdraft limit)\n    - Withdraw $100.00 + $1.50 fee\n\n===== SUMMARY =====\nSavings accounts: 1\nChecking accounts: 1\nCombined balance across all accounts: $1598.50\nHighest balance: Account #1 (Sara) with $1500.00\n========================="
      },
      "checklist": [
        "App asks how many accounts to create, collecting owner name, starting balance, and type (Savings/Checking) for each",
        "All created accounts are stored together in one polymorphically typed collection",
        "Savings withdrawals never allow negative balances, rejecting with a message if they would",
        "Savings withdrawals over the per-transaction limit are rejected with a clear message",
        "Checking withdrawals allow negative balances down to a fixed overdraft limit (e.g. -$500), rejecting beyond that",
        "Checking withdrawals automatically deduct a flat fee (e.g. $1.50) from the balance",
        "App loops to process multiple transactions by account ID (deposit or withdraw) until user exits",
        "Each transaction prints either success and new balance, or a clear rejection reason",
        "Every account maintains a list of successful deposits, withdrawals, fees, and rejected transaction attempts",
        "App allows displaying any account's full transaction history on demand",
        "Final report loops through all accounts (mixed Savings/Checking) in a single loop to print balances and histories",
        "Summary statistics show total counts of each account type, combined balances, and the account with the highest balance",
        "Running the program again with different operations gives consistent and correct results"
      ]
    }
  },
  {
    "day": 57,
    "date": "2026-08-09",
    "dayOfWeek": "Sunday",
    "type": "video",
    "chapterNum": 14,
    "chapterTitle": "Final Course Project",
    "title": "Final Capstone: OOP Architecture Design",
    "slides": null,
    "videos": [
      {
        "videoId": "RK2ABib7pmI",
        "title": "OOP Design Principles Recap",
        "duration": "00:35:04",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:35:04",
        "thumbnail": "https://i.ytimg.com/vi/RK2ABib7pmI/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=RK2ABib7pmI"
      }
    ]
  },
  {
    "day": 58,
    "date": "2026-08-10",
    "dayOfWeek": "Monday",
    "type": "video",
    "chapterNum": 14,
    "chapterTitle": "Final Course Project",
    "title": "Final Capstone: Polymorphism Recap",
    "slides": null,
    "videos": [
      {
        "videoId": "eDxRQEmkoGM",
        "title": "OOP Polymorphism Recap",
        "duration": "00:32:29",
        "assignedStart": "00:00:00",
        "assignedEnd": "00:32:29",
        "thumbnail": "https://i.ytimg.com/vi/eDxRQEmkoGM/hqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=eDxRQEmkoGM"
      }
    ]
  },
  {
    "day": 59,
    "date": "2026-08-11",
    "dayOfWeek": "Tuesday",
    "type": "project",
    "chapterNum": null,
    "chapterTitle": "Final Course Project",
    "title": "Final Capstone Project",
    "slides": null,
    "videos": [],
    "task": {
      "taskId": "proj_capstone_start",
      "title": "Final Capstone: Systems Setup",
      "description": "Set up the architecture of your Final Capstone project. This must be a clean OOP implementation of a complex command-line program of your choice (e.g. CLI inventory parser, CLI chess game, or a text-based strategy game). Draft your UML diagrams and initialize your classes.",
      "checklist": [
        "Select a complex command-line program topic (e.g. chess, library manager, stock tracker, strategy game)",
        "Design UML class diagrams showing properties, methods, and relationships",
        "Set up the Git repository and push your initial structure to GitHub"
      ]
    }
  },
  {
    "day": 60,
    "date": "2026-08-12",
    "dayOfWeek": "Wednesday",
    "type": "project",
    "chapterNum": null,
    "chapterTitle": "Final Course Project",
    "title": "Final Capstone Project",
    "slides": null,
    "videos": [],
    "task": {
      "taskId": "proj_capstone_dev",
      "title": "Final Capstone: Development & Testing",
      "description": "Flesh out the logic. Write custom Exception Handlers, utilize abstract parent components, implement Comparable interfaces, and set up simple File IO storage to make data persistent. Verify all modules.",
      "checklist": [
        "Implement parent classes and inheritance hierarchies cleanly",
        "Implement polymorphic data collections to manage subclass types in a unified list",
        "Utilize abstract parent components where subclasses provide specific overrides",
        "Implement Comparable or Cloneable interface methods for geometric comparisons or item duplication"
      ]
    }
  },
  {
    "day": 61,
    "date": "2026-08-13",
    "dayOfWeek": "Thursday",
    "type": "project",
    "chapterNum": null,
    "chapterTitle": "Final Course Project",
    "title": "Final Capstone Project",
    "slides": null,
    "videos": [],
    "task": {
      "taskId": "proj_capstone_submit",
      "title": "Final Capstone Submission",
      "description": "Publish your Final Capstone project onto GitHub. Add a comprehensive README.md summarizing instructions, design details, and instructions for running the program. Submit your GitHub repository URL and development notes below to complete your final evaluation!",
      "checklist": [
        "Add custom try-catch Exception Handling block validators to catch runtime inputs safely",
        "Incorporate File IO (FileReader/FileWriter or Scanner/PrintWriter) to persist data locally",
        "Push final code to GitHub and write a comprehensive README.md with run/gameplay instructions"
      ]
    }
  },
  {
    "day": 62,
    "date": "2026-08-14",
    "dayOfWeek": "Friday",
    "type": "off",
    "chapterNum": null,
    "chapterTitle": "Rest",
    "title": "🏖️ Rest Day - Graduation Practice Complete!"
  },
  {
    "day": 63,
    "date": "2026-08-15",
    "dayOfWeek": "Saturday",
    "type": "video",
    "chapterNum": 14,
    "chapterTitle": "Final Course Project",
    "title": "Practice: Final Knowledge Recaps & Graduation",
    "slides": null,
    "videos": [],
    "task": {
      "taskId": "task_graduation",
      "title": "Graduation Evaluation Quiz",
      "description": "Answer this graduation evaluation check to confirm full OOP mastery and graduate from the course!",
      "codeTemplate": "// Congratulations on completing the Java OOP course!",
      "testCases": [],
      "quiz": [
        {
          "question": "Which concept allows a variable to refer to different types of objects at runtime?",
          "options": [
            "Encapsulation",
            "Polymorphism",
            "Abstraction"
          ],
          "correctIdx": 1
        }
      ]
    }
  }
];

export const TOPIC_DOMAINS = [
  {
    "id": "intro",
    "name": "Network & Java Fundamentals",
    "chapters": [
      1,
      2
    ],
    "count": 2
  },
  {
    "id": "selections",
    "name": "Selections & Strings",
    "chapters": [
      3,
      4
    ],
    "count": 2
  },
  {
    "id": "loops",
    "name": "Control Flow & Loops",
    "chapters": [
      5
    ],
    "count": 1
  },
  {
    "id": "methods",
    "name": "Methods & Helpers",
    "chapters": [
      6
    ],
    "count": 1
  },
  {
    "id": "arrays",
    "name": "Arrays (1D & 2D)",
    "chapters": [
      7,
      8
    ],
    "count": 2
  },
  {
    "id": "oop_basic",
    "name": "Classes, Objects & Encapsulation",
    "chapters": [
      9,
      10
    ],
    "count": 2
  },
  {
    "id": "oop_adv",
    "name": "Inheritance, Polymorphism & Interfaces",
    "chapters": [
      11,
      13
    ],
    "count": 2
  },
  {
    "id": "exceptions",
    "name": "Exception Handling & Text IO",
    "chapters": [
      12
    ],
    "count": 1
  }
];
