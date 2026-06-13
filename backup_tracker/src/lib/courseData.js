// Reorganized Java Course Schedule (June 15, 2026 - July 31, 2026)
// Fridays are OFF (Rest Days). Every active day is hourly balanced (~45m).
// Tasks are paired alongside lectures; no task exists on its own day.
// Video start/end timings specified in hh:mm:ss format for exact segment splitting.

export const COURSE_TITLE = "Java Mastering Course: Zero to OOP Hero";
export const START_DATE = "2026-06-15";
export const END_DATE = "2026-07-31";

export const courseSchedule = [
  // Week 1
  {
    day: 1,
    date: "2026-06-15",
    dayOfWeek: "Monday",
    type: "video",
    chapterNum: 1,
    chapterTitle: "Introduction to Computers, Programs, and Java",
    title: "Ch 1: Hardware, Operating Systems & Setup",
    videos: [
      {
        videoId: "WnMPk6_8qDo",
        title: "Java | Chapter 1 | Introduction to Computers, Programs, and Java",
        duration: "00:59:30",
        assignedStart: "00:00:00",
        assignedEnd: "00:59:30",
        thumbnail: "https://i.ytimg.com/vi/WnMPk6_8qDo/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=WnMPk6_8qDo"
      }
    ]
  },
  {
    day: 2,
    date: "2026-06-16",
    dayOfWeek: "Tuesday",
    type: "video",
    chapterNum: 1,
    chapterTitle: "Introduction to Computers, Programs, and Java",
    title: "Ch 1: First Java Program & Syntax Check",
    videos: [
      {
        videoId: "r_0n_M38Or0",
        title: "Java | Chapter 1 (Part 2) | Introduction to Computers, Programs, and Java",
        duration: "00:15:52",
        assignedStart: "00:00:00",
        assignedEnd: "00:15:52",
        thumbnail: "https://i.ytimg.com/vi/r_0n_M38Or0/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=r_0n_M38Or0"
      }
    ],
    task: {
      taskId: "task_1",
      title: "Your First Java Program",
      description: "Write a simple Java program that prints 'Hello World' to the console. You must match the class name 'HelloWorld' and have a valid main method.",
      codeTemplate: `public class HelloWorld {\n    public static void main(String[] args) {\n        // Write your print statement here\n        \n    }\n}`,
      testCases: [
        { id: 1, input: "", expected: "Hello World", description: "Output should exactly contain 'Hello World'" }
      ],
      quiz: [
        {
          question: "Which of the following is the correct entry point method signature for a Java application?",
          options: [
            "public void main(String[] args)",
            "public static void main(String[] args)",
            "public static int main(String[] args)",
            "void main(args[])"
          ],
          correctIdx: 1
        }
      ]
    }
  },
  {
    day: 3,
    date: "2026-06-17",
    dayOfWeek: "Wednesday",
    type: "video",
    chapterNum: 2,
    chapterTitle: "Elementary Programming",
    title: "Ch 2: Variables, Types & Simple Calculations",
    videos: [
      {
        videoId: "M7XLFoSm1yw",
        title: "Java | Chapter 2 | Elementary Programming",
        duration: "01:26:25",
        assignedStart: "00:00:00",
        assignedEnd: "00:45:00",
        thumbnail: "https://i.ytimg.com/vi/M7XLFoSm1yw/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=M7XLFoSm1yw"
      }
    ]
  },
  {
    day: 4,
    date: "2026-06-18",
    dayOfWeek: "Thursday",
    type: "video",
    chapterNum: 2,
    chapterTitle: "Elementary Programming",
    title: "Ch 2: Console Inputs & Scanners",
    videos: [
      {
        videoId: "M7XLFoSm1yw",
        title: "Java | Chapter 2 | Elementary Programming",
        duration: "01:26:25",
        assignedStart: "00:45:00",
        assignedEnd: "01:26:25",
        thumbnail: "https://i.ytimg.com/vi/M7XLFoSm1yw/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=M7XLFoSm1yw"
      }
    ]
  },
  {
    day: 5,
    date: "2026-06-19",
    dayOfWeek: "Friday",
    type: "off",
    chapterNum: null,
    chapterTitle: "Rest",
    title: "🏖️ Rest Day"
  },
  {
    day: 6,
    date: "2026-06-20",
    dayOfWeek: "Saturday",
    type: "video",
    chapterNum: 2,
    chapterTitle: "Elementary Programming",
    title: "Ch 2: Expressions, Arithmetic & Circle Calculator",
    videos: [
      {
        videoId: "ORW7sE95NlU",
        title: "Java | Chapter 2 (Part 2) | Elementary Programming",
        duration: "00:26:00",
        assignedStart: "00:00:00",
        assignedEnd: "00:26:00",
        thumbnail: "https://i.ytimg.com/vi/ORW7sE95NlU/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=ORW7sE95NlU"
      }
    ],
    task: {
      taskId: "task_2",
      title: "Calculate Circle Area & Perimeter",
      description: "Complete the calculation program. The program needs to calculate the area and perimeter of a circle with a radius given by the variable 'radius'. Area = PI * radius * radius. Perimeter = 2 * PI * radius. Use Math.PI.",
      codeTemplate: `public class CircleCalc {\n    public static void main(String[] args) {\n        double radius = 5.5;\n        // Calculate area and perimeter\n        double area = 0.0;\n        double perimeter = 0.0;\n        \n        // Write code here\n        \n        System.out.println("Area: " + area);\n        System.out.println("Perimeter: " + perimeter);\n    }\n}`,
      testCases: [
        { id: 1, input: "", expected: "Area: 95.033", description: "Area should be ~95.033" }
      ],
      quiz: [
        {
          question: "Which class is commonly used in Java to read user input from the console?",
          options: ["Reader", "Input", "Scanner", "System.in"],
          correctIdx: 2
        }
      ]
    }
  },
  {
    day: 7,
    date: "2026-06-21",
    dayOfWeek: "Sunday",
    type: "video",
    chapterNum: 3,
    chapterTitle: "Selections",
    title: "Ch 3: Conditionals & Selections Part 1",
    videos: [
      {
        videoId: "lGtJeCGeJEA",
        title: "Java | Chapter 3 | Selections",
        duration: "01:00:57",
        assignedStart: "00:00:00",
        assignedEnd: "01:00:57",
        thumbnail: "https://i.ytimg.com/vi/lGtJeCGeJEA/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=lGtJeCGeJEA"
      }
    ]
  },
  // Week 2
  {
    day: 8,
    date: "2026-06-22",
    dayOfWeek: "Monday",
    type: "video",
    chapterNum: 3,
    chapterTitle: "Selections",
    title: "Ch 3: Conditionals & Leap Year Checker",
    videos: [
      {
        videoId: "687TPQNBap8",
        title: "Java | Chapter 3 (Part 2) | Selections",
        duration: "00:51:17",
        assignedStart: "00:00:00",
        assignedEnd: "00:51:17",
        thumbnail: "https://i.ytimg.com/vi/687TPQNBap8/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=687TPQNBap8"
      }
    ],
    task: {
      taskId: "task_3",
      title: "Check Leap Year",
      description: "Write code that checks if a year is a leap year. A year is leap if it is divisible by 4 but not by 100, OR it is divisible by 400. Set boolean 'isLeapYear' accordingly.",
      codeTemplate: `public class LeapYearCheck {\n    public static void main(String[] args) {\n        int year = 2024;\n        boolean isLeapYear = false;\n        \n        // Write logic here\n        \n        System.out.println("Leap Year: " + isLeapYear);\n    }\n}`,
      testCases: [
        { id: 1, input: "", expected: "Leap Year: true", description: "2024 is a leap year" }
      ],
      quiz: [
        {
          question: "Which represents the logical AND operator in Java?",
          options: ["&", "AND", "&&", "||"],
          correctIdx: 2
        }
      ]
    }
  },
  {
    day: 9,
    date: "2026-06-23",
    dayOfWeek: "Tuesday",
    type: "video",
    chapterNum: 4,
    chapterTitle: "Mathematical Functions, Characters, and Strings",
    title: "Ch 4: Math Functions & Characters",
    videos: [
      {
        videoId: "DeCBRPWCkoc",
        title: "Java | Chapter 4 | Mathematical Functions, Characters, and Strings",
        duration: "01:19:42",
        assignedStart: "00:00:00",
        assignedEnd: "00:40:00",
        thumbnail: "https://i.ytimg.com/vi/DeCBRPWCkoc/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=DeCBRPWCkoc"
      }
    ]
  },
  {
    day: 10,
    date: "2026-06-24",
    dayOfWeek: "Wednesday",
    type: "video",
    chapterNum: 4,
    chapterTitle: "Mathematical Functions, Characters, and Strings",
    title: "Ch 4: Strings & Extract Username",
    videos: [
      {
        videoId: "DeCBRPWCkoc",
        title: "Java | Chapter 4 | Mathematical Functions, Characters, and Strings",
        duration: "01:19:42",
        assignedStart: "00:40:00",
        assignedEnd: "01:19:42",
        thumbnail: "https://i.ytimg.com/vi/DeCBRPWCkoc/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=DeCBRPWCkoc"
      }
    ],
    task: {
      taskId: "task_4",
      title: "Format and Extract Username",
      description: "Given an email address e.g. 'john.doe@gmail.com', extract the part before the '@' sign, convert it to uppercase, and assign it to the variable 'username'.",
      codeTemplate: `public class EmailExtract {\n    public static void main(String[] args) {\n        String email = "john.doe@gmail.com";\n        String username = "";\n        \n        // Write logic here\n        \n        System.out.println("Username: " + username);\n    }\n}`,
      testCases: [
        { id: 1, input: "", expected: "Username: JOHN.DOE", description: "Extracted username in upper case" }
      ],
      quiz: [
        {
          question: "Which method is used to compare string content for equality?",
          options: ["==", "equals()", "compare()"],
          correctIdx: 1
        }
      ]
    }
  },
  {
    day: 11,
    date: "2026-06-25",
    dayOfWeek: "Thursday",
    type: "video",
    chapterNum: 5,
    chapterTitle: "Loops",
    title: "Ch 5: Loops (For & While Loops)",
    videos: [
      {
        videoId: "NZzu49ffrgY",
        title: "Java | Chapter 5 | Loops",
        duration: "00:55:09",
        assignedStart: "00:00:00",
        assignedEnd: "00:55:09",
        thumbnail: "https://i.ytimg.com/vi/NZzu49ffrgY/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=NZzu49ffrgY"
      }
    ]
  },
  {
    day: 12,
    date: "2026-06-26",
    dayOfWeek: "Friday",
    type: "off",
    chapterNum: null,
    chapterTitle: "Rest",
    title: "🏖️ Rest Day"
  },
  {
    day: 13,
    date: "2026-06-27",
    dayOfWeek: "Saturday",
    type: "video",
    chapterNum: 5,
    chapterTitle: "Loops",
    title: "Ch 5: Loops & Factorial Calculator",
    videos: [
      {
        videoId: "xQ1x_C9LwmI",
        title: "Java | Chapter 5 (Part 2) | Loops",
        duration: "00:50:57",
        assignedStart: "00:00:00",
        assignedEnd: "00:50:57",
        thumbnail: "https://i.ytimg.com/vi/xQ1x_C9LwmI/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=xQ1x_C9LwmI"
      }
    ],
    task: {
      taskId: "task_5",
      title: "Factorial Calculation",
      description: "Write a loop to calculate the factorial of a given number 'n' (e.g. 5! = 120). Assign the result to 'factorial'.",
      codeTemplate: `public class FactorialCalc {\n    public static void main(String[] args) {\n        int n = 5;\n        long factorial = 1;\n        \n        // Write loop here\n        \n        System.out.println("Factorial: " + factorial);\n    }\n}`,
      testCases: [
        { id: 1, input: "", expected: "Factorial: 120", description: "Factorial of 5 is 120" }
      ],
      quiz: [
        {
          question: "Which keyword exits a loop immediately?",
          options: ["continue", "break", "exit"],
          correctIdx: 1
        }
      ]
    }
  },
  {
    day: 14,
    date: "2026-06-28",
    dayOfWeek: "Sunday",
    type: "video",
    chapterNum: 6,
    chapterTitle: "Methods",
    title: "Ch 6: Defining and Invoking Helper Methods",
    videos: [
      {
        videoId: "LZ-S5v1Y6bs",
        title: "Java | Chapter 6 | Methods",
        duration: "00:46:23",
        assignedStart: "00:00:00",
        assignedEnd: "00:46:23",
        thumbnail: "https://i.ytimg.com/vi/LZ-S5v1Y6bs/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=LZ-S5v1Y6bs"
      }
    ]
  },
  // Week 3
  {
    day: 15,
    date: "2026-06-29",
    dayOfWeek: "Monday",
    type: "video",
    chapterNum: 6,
    chapterTitle: "Methods",
    title: "Ch 6: Methods & Prime Tester Challenge",
    videos: [
      {
        videoId: "qUCj_jK_MFQ",
        title: "Java | Chapter 6 (Part 2) | Methods",
        duration: "00:46:14",
        assignedStart: "00:00:00",
        assignedEnd: "00:46:14",
        thumbnail: "https://i.ytimg.com/vi/qUCj_jK_MFQ/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=qUCj_jK_MFQ"
      }
    ],
    task: {
      taskId: "task_6",
      title: "Prime Number Tester Method",
      description: "Implement a helper method 'isPrime(int number)' that returns true if the number is prime and false otherwise. Call it from main for the number 29.",
      codeTemplate: `public class PrimeTest {\n    public static void main(String[] args) {\n        int num = 29;\n        System.out.println("Is Prime: " + isPrime(num));\n    }\n    \n    public static boolean isPrime(int n) {\n        // Write method logic here\n        return false;\n    }\n}`,
      testCases: [
        { id: 1, input: "", expected: "Is Prime: true", description: "29 is a prime number" }
      ],
      quiz: [
        {
          question: "What does overloading a method mean in Java?",
          options: [
            "Defining multiple methods with the same name but different parameters",
            "Defining a method in a child class with the same parameters"
          ],
          correctIdx: 0
        }
      ]
    }
  },
  {
    day: 16,
    date: "2026-06-30",
    dayOfWeek: "Tuesday",
    type: "video",
    chapterNum: 7,
    chapterTitle: "Single-Dimensional Arrays",
    title: "Ch 7: Single-Dimensional Arrays (Part 1)",
    videos: [
      {
        videoId: "qvh6RfT_Kek",
        title: "Java | Chapter 7 | Single-Dimensional Arrays",
        duration: "00:51:08",
        assignedStart: "00:00:00",
        assignedEnd: "00:51:08",
        thumbnail: "https://i.ytimg.com/vi/qvh6RfT_Kek/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=qvh6RfT_Kek"
      }
    ]
  },
  {
    day: 17,
    date: "2026-07-01",
    dayOfWeek: "Wednesday",
    type: "video",
    chapterNum: 7,
    chapterTitle: "Single-Dimensional Arrays",
    title: "Ch 7: Single-Dimensional Arrays (Part 2)",
    videos: [
      {
        videoId: "Hkg3wKVPznA",
        title: "Java | Chapter 7 (Part 2) | Single-Dimensional Arrays",
        duration: "01:02:00",
        assignedStart: "00:00:00",
        assignedEnd: "01:02:00",
        thumbnail: "https://i.ytimg.com/vi/Hkg3wKVPznA/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=Hkg3wKVPznA"
      }
    ]
  },
  {
    day: 18,
    date: "2026-07-02",
    dayOfWeek: "Thursday",
    type: "video",
    chapterNum: 7,
    chapterTitle: "Single-Dimensional Arrays",
    title: "Ch 7: Array Recaps & Max Finder Task",
    videos: [
      {
        videoId: "qvh6RfT_Kek",
        title: "Java | Chapter 7 | Single-Dimensional Arrays",
        duration: "00:51:08",
        assignedStart: "00:20:00",
        assignedEnd: "00:40:00",
        thumbnail: "https://i.ytimg.com/vi/qvh6RfT_Kek/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=qvh6RfT_Kek"
      }
    ],
    task: {
      taskId: "task_7",
      title: "Find Maximum Element in Array",
      description: "Write code to traverse a single-dimensional int array and find the maximum element. Set it to 'maxVal'.",
      codeTemplate: `public class FindMax {\n    public static void main(String[] args) {\n        int[] numbers = {4, 12, 9, 30, 21, 5};\n        int maxVal = numbers[0];\n        \n        // Write traversal logic here\n        \n        System.out.println("Max: " + maxVal);\n    }\n}`,
      testCases: [
        { id: 1, input: "", expected: "Max: 30", description: "Maximum value is 30" }
      ],
      quiz: [
        {
          question: "How do you obtain the size of an array named 'myList' in Java?",
          options: ["myList.size()", "myList.length", "myList.size"],
          correctIdx: 1
        }
      ]
    }
  },
  {
    day: 19,
    date: "2026-07-03",
    dayOfWeek: "Friday",
    type: "off",
    chapterNum: null,
    chapterTitle: "Rest",
    title: "🏖️ Rest Day"
  },
  {
    day: 20,
    date: "2026-07-04",
    dayOfWeek: "Saturday",
    type: "video",
    chapterNum: 8,
    chapterTitle: "Multi-Dimensional Arrays",
    title: "Ch 8: Multi-Dimensional Arrays & Matrix Sum",
    videos: [
      {
        videoId: "xzSy-sEt4W4",
        title: "Java | Chapter 8 | Multi-Dimensional Arrays",
        duration: "00:44:29",
        assignedStart: "00:00:00",
        assignedEnd: "00:44:29",
        thumbnail: "https://i.ytimg.com/vi/xzSy-sEt4W4/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=xzSy-sEt4W4"
      }
    ],
    task: {
      taskId: "task_8",
      title: "Sum a 2D Array Matrix",
      description: "Calculate the total sum of all elements inside a 2D grid matrix. Store the result in 'gridSum'.",
      codeTemplate: `public class MatrixSum {\n    public static void main(String[] args) {\n        int[][] grid = {\n            {1, 2, 3},\n            {4, 5, 6},\n            {7, 8, 9}\n        };\n        int gridSum = 0;\n        \n        // Write code here\n        \n        System.out.println("Sum: " + gridSum);\n    }\n}`,
      testCases: [
        { id: 1, input: "", expected: "Sum: 45", description: "Sum should equal 45" }
      ],
      quiz: [
        {
          question: "In a 2D array double[][] matrix = new double[4][5];, how many rows are there?",
          options: ["4", "5", "20"],
          correctIdx: 0
        }
      ]
    }
  },
  {
    day: 21,
    date: "2026-07-05",
    dayOfWeek: "Sunday",
    type: "video",
    chapterNum: 9,
    chapterTitle: "Objects and Classes",
    title: "Ch 9: Objects and Classes (Part 1)",
    videos: [
      {
        videoId: "RK2ABib7pmI",
        title: "Java | Chapter 9 | Objects and Classes",
        duration: "00:35:04",
        assignedStart: "00:00:00",
        assignedEnd: "00:35:04",
        thumbnail: "https://i.ytimg.com/vi/RK2ABib7pmI/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=RK2ABib7pmI"
      }
    ]
  },
  // Week 4
  {
    day: 22,
    date: "2026-07-06",
    dayOfWeek: "Monday",
    type: "video",
    chapterNum: 9,
    chapterTitle: "Objects and Classes",
    title: "Ch 9: Objects and Classes (Part 2)",
    videos: [
      {
        videoId: "eDxRQEmkoGM",
        title: "Java | Chapter 9 (Part 2) | Objects and Classes",
        duration: "00:32:29",
        assignedStart: "00:00:00",
        assignedEnd: "00:32:29",
        thumbnail: "https://i.ytimg.com/vi/eDxRQEmkoGM/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=eDxRQEmkoGM"
      }
    ]
  },
  {
    day: 23,
    date: "2026-07-07",
    dayOfWeek: "Tuesday",
    type: "video",
    chapterNum: 9,
    chapterTitle: "Objects and Classes",
    title: "Ch 9: Objects and Classes (Part 3)",
    videos: [
      {
        videoId: "jFw0ZkDXU6U",
        title: "Java | Chapter 9 (Part 3) | Objects and Classes",
        duration: "00:38:40",
        assignedStart: "00:00:00",
        assignedEnd: "00:38:40",
        thumbnail: "https://i.ytimg.com/vi/jFw0ZkDXU6U/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=jFw0ZkDXU6U"
      }
    ]
  },
  {
    day: 24,
    date: "2026-07-08",
    dayOfWeek: "Wednesday",
    type: "video",
    chapterNum: 9,
    chapterTitle: "Objects and Classes",
    title: "Ch 9: Classes & Rectangle Constructor Task",
    videos: [
      {
        videoId: "Vd3gfjFgalY",
        title: "Java | Chapter 9 (Part 4) | Objects and Classes",
        duration: "00:22:51",
        assignedStart: "00:00:00",
        assignedEnd: "00:22:51",
        thumbnail: "https://i.ytimg.com/vi/Vd3gfjFgalY/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=Vd3gfjFgalY"
      }
    ],
    task: {
      taskId: "task_9",
      title: "Create Rectangle Class",
      description: "Define a Rectangle class with double properties width and height, a constructor, and helper methods getArea() and getPerimeter(). Instantiate it in main with 4.0 width and 40.0 height.",
      codeTemplate: `public class TestRectangle {\n    public static void main(String[] args) {\n        Rectangle r = new Rectangle(4.0, 40.0);\n        System.out.println("Area: " + r.getArea());\n    }\n}\n\nclass Rectangle {\n    // Write Rectangle fields, constructor and methods here\n    \n}`,
      testCases: [
        { id: 1, input: "", expected: "Area: 160.0", description: "Rectangle area calculation" }
      ],
      quiz: [
        {
          question: "What is the purpose of a constructor in Java?",
          options: ["To destroy objects", "To initialize the state of a new object"],
          correctIdx: 1
        }
      ]
    }
  },
  {
    day: 25,
    date: "2026-07-09",
    dayOfWeek: "Thursday",
    type: "video",
    chapterNum: 10,
    chapterTitle: "Thinking in Objects",
    title: "Ch 10: Thinking in Objects (Part 1)",
    videos: [
      {
        videoId: "6hQ2pw4LqYk",
        title: "Java | Chapter 10 | Thinking in Objects",
        duration: "00:38:18",
        assignedStart: "00:00:00",
        assignedEnd: "00:38:18",
        thumbnail: "https://i.ytimg.com/vi/6hQ2pw4LqYk/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=6hQ2pw4LqYk"
      }
    ]
  },
  {
    day: 26,
    date: "2026-07-10",
    dayOfWeek: "Friday",
    type: "off",
    chapterNum: null,
    chapterTitle: "Rest",
    title: "🏖️ Rest Day"
  },
  {
    day: 27,
    date: "2026-07-11",
    dayOfWeek: "Saturday",
    type: "video",
    chapterNum: 10,
    chapterTitle: "Thinking in Objects",
    title: "Ch 10: Thinking in Objects (Part 2)",
    videos: [
      {
        videoId: "NSDD8LUwCeM",
        title: "Java | Chapter 10 (Part 2) | Thinking in Objects",
        duration: "00:33:27",
        assignedStart: "00:00:00",
        assignedEnd: "00:33:27",
        thumbnail: "https://i.ytimg.com/vi/NSDD8LUwCeM/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=NSDD8LUwCeM"
      }
    ]
  },
  {
    day: 28,
    date: "2026-07-12",
    dayOfWeek: "Sunday",
    type: "video",
    chapterNum: 10,
    chapterTitle: "Thinking in Objects",
    title: "Ch 10: Encapsulation & Account Task",
    videos: [
      {
        videoId: "UnpEgotT5hg",
        title: "Java | Chapter 10 (Part 4) | Thinking in Objects",
        duration: "00:29:34",
        assignedStart: "00:00:00",
        assignedEnd: "00:29:34",
        thumbnail: "https://i.ytimg.com/vi/UnpEgotT5hg/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=UnpEgotT5hg"
      }
    ],
    task: {
      taskId: "task_10",
      title: "Data Encapsulation with Getters & Setters",
      description: "Encapsulate an Account class with a private balance and a private id. Add getter methods and a deposit(double amt) method. Make sure it prints the updated balance after deposit.",
      codeTemplate: `public class TestAccount {\n    public static void main(String[] args) {\n        Account acc = new Account(1122, 20000);\n        acc.deposit(3000);\n        System.out.println("Balance: " + acc.getBalance());\n    }\n}\n\nclass Account {\n    // Write encapsulated Account class here\n    \n}`,
      testCases: [
        { id: 1, input: "", expected: "Balance: 23000.0", description: "Deposit 3000 to initial 20000 balance" }
      ],
      quiz: [
        {
          question: "Which modifier prevents a variable from being changed after assignment?",
          options: ["static", "private", "final"],
          correctIdx: 2
        }
      ]
    }
  },
  // Week 5
  {
    day: 29,
    date: "2026-07-13",
    dayOfWeek: "Monday",
    type: "video",
    chapterNum: 11,
    chapterTitle: "Inheritance and Polymorphism",
    title: "Ch 11: Inheritance and Polymorphism (Part 1)",
    videos: [
      {
        videoId: "Ly1wkba3EZk",
        title: "Java | Chapter 11 | Inheritance and Polymorphism",
        duration: "00:44:36",
        assignedStart: "00:00:00",
        assignedEnd: "00:44:36",
        thumbnail: "https://i.ytimg.com/vi/Ly1wkba3EZk/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=Ly1wkba3EZk"
      }
    ]
  },
  {
    day: 30,
    date: "2026-07-14",
    dayOfWeek: "Tuesday",
    type: "video",
    chapterNum: 11,
    chapterTitle: "Inheritance and Polymorphism",
    title: "Ch 11: Inheritance and Polymorphism (Part 2)",
    videos: [
      {
        videoId: "OrQM3Luv6zg",
        title: "Java | Chapter 11 (Part 2) | Inheritance and Polymorphism",
        duration: "00:32:21",
        assignedStart: "00:00:00",
        assignedEnd: "00:32:21",
        thumbnail: "https://i.ytimg.com/vi/OrQM3Luv6zg/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=OrQM3Luv6zg"
      }
    ]
  },
  {
    day: 31,
    date: "2026-07-15",
    dayOfWeek: "Wednesday",
    type: "video",
    chapterNum: 11,
    chapterTitle: "Inheritance and Polymorphism",
    title: "Ch 11: Inheritance Override Task",
    videos: [
      {
        videoId: "QZE1PQaOhoQ",
        title: "Java | Chapter 11 (Part 3) | Inheritance and Polymorphism",
        duration: "00:22:04",
        assignedStart: "00:00:00",
        assignedEnd: "00:22:04",
        thumbnail: "https://i.ytimg.com/vi/QZE1PQaOhoQ/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=QZE1PQaOhoQ"
      }
    ],
    task: {
      taskId: "task_11",
      title: "Extending the Person Class",
      description: "Create a Student subclass that extends the Person superclass. Override the toString() method of Person in Student to return Student as output.",
      codeTemplate: `public class TestInheritance {\n    public static void main(String[] args) {\n        Person p = new Student();\n        System.out.println(p.toString());\n    }\n}\n\nclass Person {\n    public String toString() {\n        return "Person";\n    }\n}\n\n// Write Student subclass extending Person here\n`,
      testCases: [
        { id: 1, input: "", expected: "Student", description: "Override returns 'Student'" }
      ],
      quiz: [
        {
          question: "Which keyword does a class use to inherit from a parent in Java?",
          options: ["implements", "extends", "super"],
          correctIdx: 1
        }
      ]
    }
  },
  {
    day: 32,
    date: "2026-07-16",
    dayOfWeek: "Thursday",
    type: "video",
    chapterNum: 12,
    chapterTitle: "Exception Handling and Text IO",
    title: "Ch 12: Exception Handling (Part 1)",
    videos: [
      {
        videoId: "Y61XfRGzhC0",
        title: "Java | Chapter 12 | Exception Handling and Text IO",
        duration: "00:40:12",
        assignedStart: "00:00:00",
        assignedEnd: "00:40:12",
        thumbnail: "https://i.ytimg.com/vi/Y61XfRGzhC0/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=Y61XfRGzhC0"
      }
    ]
  },
  {
    day: 33,
    date: "2026-07-17",
    dayOfWeek: "Friday",
    type: "off",
    chapterNum: null,
    chapterTitle: "Rest",
    title: "🏖️ Rest Day"
  },
  {
    day: 34,
    date: "2026-07-18",
    dayOfWeek: "Saturday",
    type: "video",
    chapterNum: 12,
    chapterTitle: "Exception Handling and Text IO",
    title: "Ch 12: Try-Catch Protection Task",
    videos: [
      {
        videoId: "9J38Cm1SjHQ",
        title: "Java | Chapter 12 (Part 2) | Exception Handling and Text IO",
        duration: "00:25:52",
        assignedStart: "00:00:00",
        assignedEnd: "00:25:52",
        thumbnail: "https://i.ytimg.com/vi/9J38Cm1SjHQ/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=9J38Cm1SjHQ"
      }
    ],
    task: {
      taskId: "task_12",
      title: "Divide by Zero Protection",
      description: "Wrap the arithmetic division division statement 'x / y' in a try-catch block to handle ArithmeticException when y = 0. Assign '0' to result in case of failure.",
      codeTemplate: `public class ExceptionDemo {\n    public static void main(String[] args) {\n        int x = 10;\n        int y = 0;\n        int result = -1;\n        \n        // Write try-catch block here\n        \n        System.out.println("Result: " + result);\n    }\n}`,
      testCases: [
        { id: 1, input: "", expected: "Result: 0", description: "Catches exception and sets result to 0" }
      ],
      quiz: [
        {
          question: "Which block in try-catch-finally always executes?",
          options: ["try", "catch", "finally"],
          correctIdx: 2
        }
      ]
    }
  },
  {
    day: 35,
    date: "2026-07-19",
    dayOfWeek: "Sunday",
    type: "video",
    chapterNum: 13,
    chapterTitle: "Abstract Classes and Interfaces",
    title: "Ch 13: Abstract Classes & Geometry Rules",
    videos: [
      {
        videoId: "bfouLyURcWE",
        title: "Java | Chapter 13 | Abstract Classes and Interfaces",
        duration: "00:29:49",
        assignedStart: "00:00:00",
        assignedEnd: "00:29:49",
        thumbnail: "https://i.ytimg.com/vi/bfouLyURcWE/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=bfouLyURcWE"
      }
    ]
  },
  // Week 6
  {
    day: 36,
    date: "2026-07-20",
    dayOfWeek: "Monday",
    type: "video",
    chapterNum: 13,
    chapterTitle: "Abstract Classes and Interfaces",
    title: "Ch 13: Implementing Interfaces (Comparable & Cloneable)",
    videos: [
      {
        videoId: "jqmjxcs2T0w",
        title: "Java | Chapter 13 (Part 2) | Abstract Classes and Interfaces",
        duration: "00:39:20",
        assignedStart: "00:00:00",
        assignedEnd: "00:39:20",
        thumbnail: "https://i.ytimg.com/vi/jqmjxcs2T0w/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=jqmjxcs2T0w"
      }
    ]
  },
  {
    day: 37,
    date: "2026-07-21",
    dayOfWeek: "Tuesday",
    type: "video",
    chapterNum: 13,
    chapterTitle: "Abstract Classes and Interfaces",
    title: "Ch 13: Circle Comparison Task",
    videos: [
      {
        videoId: "nuqLs3MWvU4",
        title: "Java | Chapter 13 (Part 3) | Abstract Classes and Interfaces",
        duration: "00:22:45",
        assignedStart: "00:00:00",
        assignedEnd: "00:22:45",
        thumbnail: "https://i.ytimg.com/vi/nuqLs3MWvU4/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=nuqLs3MWvU4"
      }
    ],
    task: {
      taskId: "task_13",
      title: "Implement the Comparable Interface",
      description: "Implement the 'Comparable<Circle>' interface on a Circle class. Compare Circles based on their radius. Return negative, 0, or positive accordingly.",
      codeTemplate: `public class TestCircleCompare {\n    public static void main(String[] args) {\n        Circle c1 = new Circle(5.0);\n        Circle c2 = new Circle(10.0);\n        System.out.println("Compare result: " + c1.compareTo(c2));\n    }\n}\n\nclass Circle implements Comparable<Circle> {\n    double radius;\n    public Circle(double radius) {\n        this.radius = radius;\n    }\n    // Write compareTo method here\n    \n}`,
      testCases: [
        { id: 1, input: "", expected: "Compare result: -1", description: "c1 is smaller than c2" }
      ],
      quiz: [
        {
          question: "Can an abstract class be instantiated directly using 'new'?",
          options: ["Yes", "No"],
          correctIdx: 1
        }
      ]
    }
  },
  {
    day: 38,
    date: "2026-07-22",
    dayOfWeek: "Wednesday",
    type: "review",
    chapterNum: null,
    chapterTitle: "Synthesis Challenge Preparation",
    title: "OOP Synthesis & Final Project Prep"
  },
  {
    day: 39,
    date: "2026-07-23",
    dayOfWeek: "Thursday",
    type: "video",
    chapterNum: 14,
    chapterTitle: "Final Course Project",
    title: "Final OOP Library System Coding",
    videos: [
      {
        videoId: "RK2ABib7pmI",
        title: "OOP Design Principles Recap",
        duration: "00:35:04",
        assignedStart: "00:00:00",
        assignedEnd: "00:15:00",
        thumbnail: "https://i.ytimg.com/vi/RK2ABib7pmI/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=RK2ABib7pmI"
      }
    ],
    task: {
      taskId: "task_final",
      title: "Design a Complete OOP Library System",
      description: "Define a LibraryItem base class, and Book and Magazine subclasses. Add list tracking, rentals, and show output. Make it look neat and follow OOP abstraction.",
      codeTemplate: `// Write complete Library system here\npublic class LibrarySystem {\n    public static void main(String[] args) {\n        System.out.println("Library active");\n    }\n}`,
      testCases: [
        { id: 1, input: "", expected: "Library active", description: "Compile checker" }
      ]
    }
  },
  {
    day: 40,
    date: "2026-07-24",
    dayOfWeek: "Friday",
    type: "off",
    chapterNum: null,
    chapterTitle: "Rest",
    title: "🏖️ Rest Day"
  },
  {
    day: 41,
    date: "2026-07-25",
    dayOfWeek: "Saturday",
    type: "video",
    chapterNum: 14,
    chapterTitle: "Final Course Project",
    title: "Final Project Code Submissions",
    videos: [
      {
        videoId: "eDxRQEmkoGM",
        title: "OOP Polymorphism Recap",
        duration: "00:32:29",
        assignedStart: "00:00:00",
        assignedEnd: "00:15:00",
        thumbnail: "https://i.ytimg.com/vi/eDxRQEmkoGM/hqdefault.jpg",
        url: "https://www.youtube.com/watch?v=eDxRQEmkoGM"
      }
    ],
    task: {
      taskId: "task_grading",
      title: "Knowledge Evaluation Quiz",
      description: "Complete this 4-question OOP recap to prove mastery of Java OOP.",
      codeTemplate: `// Ready for evaluation`,
      testCases: [],
      quiz: [
        {
          question: "Which concept allows a variable to refer to different types of objects at runtime?",
          options: ["Encapsulation", "Polymorphism", "Abstraction"],
          correctIdx: 1
        }
      ]
    }
  },
  {
    day: 42,
    date: "2026-07-26",
    dayOfWeek: "Sunday",
    type: "review",
    chapterNum: null,
    chapterTitle: "Recap",
    title: "Course Review & Final Knowledge Recap"
  },
  // Week 7
  {
    day: 43,
    date: "2026-07-27",
    dayOfWeek: "Monday",
    type: "review",
    chapterNum: null,
    chapterTitle: "Celebration",
    title: "Completion Celebration & Certifications"
  },
  {
    day: 44,
    date: "2026-07-28",
    dayOfWeek: "Tuesday",
    type: "review",
    chapterNum: null,
    chapterTitle: "Final Feedback",
    title: "Course Summary & Feedback Session"
  },
  {
    day: 45,
    date: "2026-07-29",
    dayOfWeek: "Wednesday",
    type: "review",
    chapterNum: null,
    chapterTitle: "Wrap up",
    title: "Java Mastery Dashboard Celebrations"
  },
  {
    day: 46,
    date: "2026-07-30",
    dayOfWeek: "Thursday",
    type: "review",
    chapterNum: null,
    chapterTitle: "Extra Rest",
    title: "Milestone Celebration Checkpoint"
  },
  {
    day: 47,
    date: "2026-07-31",
    dayOfWeek: "Friday",
    type: "off",
    chapterNum: null,
    chapterTitle: "Rest",
    title: "🏖️ Rest Day - Course Completed!"
  }
];

export const TOPIC_DOMAINS = [
  { id: "intro", name: "Network & Java Fundamentals", chapters: [1, 2], count: 2 },
  { id: "selections", name: "Selections & Strings", chapters: [3, 4], count: 2 },
  { id: "loops", name: "Control Flow & Loops", chapters: [5], count: 1 },
  { id: "methods", name: "Methods & Helpers", chapters: [6], count: 1 },
  { id: "arrays", name: "Arrays (1D & 2D)", chapters: [7, 8], count: 2 },
  { id: "oop_basic", name: "Classes, Objects & Encapsulation", chapters: [9, 10], count: 2 },
  { id: "oop_adv", name: "Inheritance, Polymorphism & Interfaces", chapters: [11, 13], count: 2 },
  { id: "exceptions", name: "Exception Handling & Text IO", chapters: [12], count: 1 }
];
