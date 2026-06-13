const fs = require('fs');
const path = require('path');

const courseDataPath = path.join(__dirname, '../src/lib/courseData.js');
let content = fs.readFileSync(courseDataPath, 'utf8');

// Define Project 1 Info
const project1Info = {
  covers: "Ch 1–8 (Java basics, variables, I/O, expressions, conditionals, math/strings, loops, methods, arrays, matrices)",
  goal: "Build a command-line program that helps a student analyze a set of exam scores and course credit hours, and produces a GPA report based on university grading regulations.",
  requirements: [
    {
      title: "1. Collecting scores & credit hours",
      description: "Ask the user how many courses they want to enter. If the number entered is 0 or negative, keep asking until a valid positive number is given. Then ask the user to enter each course's score (percentage) and credit hours. For each course, first ask for the score (percentage), and immediately after, ask for the credit hours of that course. Scores must be between 0 and 100, and credit hours must be greater than 0. Reject invalid values and ask again until valid."
    },
    {
      title: "2. Basic statistics",
      description: "After all course data is collected, the app should report: the weighted average score of all the courses (weighted by credit hours: sum(score * credit hours) / sum(credit hours)), the highest score, the lowest score, and the number of courses with a score higher than 80 (this threshold of 80 is fixed — the app doesn't need to ask the user for it)."
    },
    {
      title: "3. Letter grades per course",
      description: "For each individual score entered, the app assigns a letter grade using the university scale:\n- 90% and above → A+\n- 85% to < 90% → A\n- 80% to < 85% → B+\n- 75% to < 80% → B\n- 70% to < 75% → C+\n- 65% to < 70% → C\n- 60% to < 65% → D+\n- 50% to < 60% → D\n- Below 50% → F\nThe app should display the full list of letter grades, one per course, in the same order the scores were entered (e.g., [B+, A, C+, D+, A+])."
    },
    {
      title: "4. A 'bonus number'",
      description: "The app should take the highest score and produce a 'bonus number' by adding together its individual digits (e.g., a score of 92 produces a bonus number of 11, since 9 + 2 = 11)."
    },
    {
      title: "5. Name check",
      description: "Ask the user for their name. The app should check whether the name reads the same forwards and backwards (ignoring case), and tell the user whether their name is a 'palindrome' or not."
    },
    {
      title: "6. GPA calculator",
      description: "For each course, determine its grade points using this scale:\n- 90% and above → 4.0\n- 85% to < 90% → 3.75\n- 80% to < 85% → 3.4\n- 75% to < 80% → 3.1\n- 70% to < 75% → 2.8\n- 65% to < 70% → 2.5\n- 60% to < 65% → 2.25\n- 50% to < 60% → 2.0\n- Below 50% → 1.0\nCalculate the Cumulative GPA using the formula: GPA = sum(Grade Points * Credit Hours) / sum(Credit Hours). Determine the Overall General Estimate (التقدير العام): GPA >= 3.4 is Excellent (ممتاز), 2.8 to < 3.4 is Very Good (جيد جداً), 2.4 to < 2.8 is Good (جيد), 2.0 to < 2.4 is Pass (مقبول), 1.4 to < 2.0 is Weak (ضعيف), and GPA < 1.4 is Very Weak (ضعيف جداً)."
    },
    {
      title: "7. Final report",
      description: "At the end, the app prints a single clean summary that includes all of the above: the list of courses with scores and credit hours, the weighted average score, highest score, lowest score, count of courses above 80, the list of letter grades (one per course), the bonus number, the palindrome result, the weighted GPA, and the Overall General Estimate."
    }
  ],
  sampleRun: `How many courses? 5\nEnter score for course 1: 83\nEnter credit hours for course 1: 3\nEnter score for course 2: 150\nInvalid score, please enter a value between 0 and 100:\nEnter score for course 2: 86\nEnter credit hours for course 2: 4\nEnter score for course 3: 72\nEnter credit hours for course 3: 2\nEnter score for course 4: 60\nEnter credit hours for course 4: 3\nEnter score for course 5: 92\nEnter credit hours for course 5: 3\n\nWhat's your name? Ahmed\n\n===== GRADE REPORT =====\nStudent: Ahmed\nIs your name a palindrome? false\nScores & Credits: [83% (3 hrs), 86% (4 hrs), 72% (2 hrs), 60% (3 hrs), 92% (3 hrs)]\nAverage Score (Weighted): 79.53\nHighest Score: 92   Lowest Score: 60\nCourses with score above 80: 3\nLetter Grades: [B+, A, C+, D+, A+]\nBonus number (digit sum of highest score): 11\nWeighted GPA: 3.30\nOverall Grade: Very Good (جيد جداً)\n=========================`
};

// Define Project 2 Info
const project2Info = {
  covers: "Ch 9–10 (Objects and Classes, built-in API classes, thinking in objects, composition)",
  goal: "Build a small CLI bank system that manages a customer, their account, and a small stock portfolio — then simulates some activity and prints a report.",
  requirements: [
    {
      title: "1. Setting up the customer",
      description: "Ask the user for their name and a starting account balance. Ask the user for an annual interest rate for the account (e.g., 4 for 4%). The account should remember the moment it was created (its creation date/time)."
    },
    {
      title: "2. Stock portfolio",
      description: "Ask the user to enter 2–3 stocks they own. For each stock, ask for a symbol/name (e.g., 'AAPL'), its previous closing price, and its current price. Report the percentage change between the previous closing price and the current price. Report the total current value of all the stocks combined."
    },
    {
      title: "3. Simulated transactions",
      description: "The app should automatically perform 5 random transactions on the account — each one either a deposit or a withdrawal of a random amount (somewhere between $10 and $500). For each transaction, print what happened and the new balance. A withdrawal should never be allowed to take the balance below zero — if a random withdrawal would do that, the app should skip it (or reduce it) and say so instead of producing a negative balance."
    },
    {
      title: "4. Interest",
      description: "Using the annual interest rate the user provided, the app should calculate and display the monthly interest the account would earn at its final balance."
    },
    {
      title: "5. Time since creation",
      description: "The app should display when the account was created. The app should also calculate and display how many days have passed since the account was created (it's fine if this shows 0 for a freshly-created account — the calculation should still run and display a number)."
    },
    {
      title: "6. Final summary",
      description: "At the end, the app prints one combined report showing customer name, final account balance, monthly interest at the final balance, account creation date and days since creation, each stock's percentage change, and total value of the stock portfolio."
    }
  ],
  sampleRun: `Enter your name: Sara
Enter starting balance: 1000
Enter annual interest rate (%): 4

Enter stock 1 symbol: AAPL
Enter AAPL previous closing price: 180
Enter AAPL current price: 185

Enter stock 2 symbol: TSLA
Enter TSLA previous closing price: 250
Enter TSLA current price: 240

--- Running Transactions ---
[Transaction 1] Deposit of $312.50 -> New Balance: $1312.50
[Transaction 2] Withdraw of $400.00 -> New Balance: $912.50
[Transaction 3] Deposit of $88.20  -> New Balance: $1000.70
[Transaction 4] Withdraw of $50.00 -> New Balance: $950.70
[Transaction 5] Deposit of $120.00 -> New Balance: $1070.70

===== ACCOUNT SUMMARY =====
Customer: Sara
Final Balance: $1070.70
Monthly Interest: $3.57
Account Created: Thu Jun 11 14:32:05 2026
Days Since Creation: 0

--- Stock Portfolio ---
AAPL: 180.00 -> 185.00 (+2.78%)
TSLA: 250.00 -> 240.00 (-4.00%)
Total Portfolio Value: $425.00
============================`
};

// Define Project 3 Info
const project3Info = {
  covers: "Ch 11 (Inheritance & Polymorphism) and Ch 13 (Abstract Classes & Interfaces)",
  goal: "Build a CLI banking program that manages several accounts of two different types, each with its own rules, and demonstrates that a program can treat both types 'the same way' while each still behaves according to its own rules.",
  requirements: [
    {
      title: "1. Two account types",
      description: "The app supports two kinds of accounts that share basic fields (ID, owner name, balance) but have different rules:\n- Savings account: Withdrawals cannot take the balance below zero. Has a withdrawal limit per transaction (e.g., no single withdrawal over $1000).\n- Checking account: Allows negative balance down to a fixed overdraft limit (e.g., -$500). Every withdrawal has a small flat fee (e.g., $1.50) automatically subtracted."
    },
    {
      title: "2. Creating accounts",
      description: "Ask the user how many accounts they want to create in total. For each account, ask for the owner's name, starting balance, and account type (Savings or Checking). Store all accounts in a single collection."
    },
    {
      title: "3. Performing transactions",
      description: "Allow the user to perform a series of transactions (deposit or withdraw) on any account by number/ID until they type DONE. Apply transactions polymorphically using that account's own overridden rules. Print success or rejection messages."
    },
    {
      title: "4. Transaction history",
      description: "Every account keeps a running list of everything that happened to it (deposits, successful withdrawals, fees, and rejected attempts). Allow displaying history for any account on request."
    },
    {
      title: "5. Final report",
      description: "At the end, loop through all accounts in a single collection and print ID, owner name, type, final balance, and full transaction history."
    },
    {
      title: "6. Summary statistics",
      description: "Display the total number of Savings vs Checking accounts created, the combined balance across all accounts, and the single account with the highest balance."
    }
  ],
  sampleRun: `How many accounts do you want to create? 2

--- Account 1 ---
Owner name: Sara
Starting balance: 1000
Type (Savings/Checking): Savings

--- Account 2 ---
Owner name: Omar
Starting balance: 200
Type (Savings/Checking): Checking

--- Transactions (type DONE to stop) ---
Account ID: 1
Deposit or Withdraw: Withdraw
Amount: 1500
-> Rejected: withdrawal exceeds per-transaction limit ($1000) for Savings account #1

Account ID: 2
Deposit or Withdraw: Withdraw
Amount: 600
-> Rejected: withdrawal would exceed overdraft limit (-$500) for Checking account #2

Account ID: 2
Deposit or Withdraw: Withdraw
Amount: 100
-> Withdraw $100.00 + $1.50 fee -> New Balance: $98.50

Account ID: 1
Deposit or Withdraw: Deposit
Amount: 500
-> Deposit $500.00 -> New Balance: $1500.00

Account ID: DONE

===== FINAL REPORT =====
[Account #1] Owner: Sara | Type: Savings | Balance: $1500.00
  History:
    - Deposit $1000.00 (initial balance)
    - Rejected withdrawal of $1500.00 (exceeds per-transaction limit)
    - Deposit $500.00

[Account #2] Owner: Omar | Type: Checking | Balance: $98.50
  History:
    - Deposit $200.00 (initial balance)
    - Rejected withdrawal of $600.00 (exceeds overdraft limit)
    - Withdraw $100.00 + $1.50 fee

===== SUMMARY =====
Savings accounts: 1
Checking accounts: 1
Combined balance across all accounts: $1598.50
Highest balance: Account #1 (Sara) with $1500.00
=========================`
};

// Functions to format and replace task structures
const day25Search = `    day: 25,
    date: "2026-07-08",
    dayOfWeek: "Wednesday",
    type: "project",
    chapterNum: null,
    chapterTitle: "Mini Project 1",
    title: "Mini-Project 1: Class Grade Toolkit",
    slides: null,
    videos: [],
    task: {
      taskId: "proj_grade_start",
      title: "Class Grade Toolkit (Setup & Statistics)",
      description: "Build a command-line program that helps a student analyze a set of exam scores and produces a grade report. Initiate your setup: read valid positive score counts, implement validation rules to reject any scores outside 0-100, and calculate basic statistics (average, highest, lowest, and count above 80).",
      checklist: [
        "App asks how many scores, and rejects 0 or negative values",
        "App reads that many scores from the user",
        "Any score outside 0–100 is rejected with a message, and the app re-asks for that score until valid",
        "App correctly reports the average of the scores entered",
        "App correctly reports the highest score",
        "App correctly reports the lowest score",
        "App correctly reports the number of courses with a score higher than 80 (fixed threshold of 80)"
      ]
    }`;

const day25Replace = `    day: 25,
    date: "2026-07-08",
    dayOfWeek: "Wednesday",
    type: "project",
    chapterNum: null,
    chapterTitle: "Mini Project 1",
    title: "Mini-Project 1: Class Grade Toolkit",
    slides: null,
    videos: [],
    task: {
      taskId: "proj_grade_start",
      title: "Class Grade Toolkit (Setup & Statistics)",
      description: "Build a command-line program that helps a student analyze a set of exam scores and produces a grade report. Initiate your setup: read valid positive score counts, implement validation rules to reject any scores outside 0-100, and calculate basic statistics (average, highest, lowest, and count above 80).",
      projectInfo: ${JSON.stringify(project1Info, null, 6)},
      checklist: [
        "App asks how many scores, and rejects 0 or negative values",
        "App reads that many scores from the user",
        "Any score outside 0–100 is rejected with a message, and the app re-asks for that score until valid",
        "App correctly reports the average of the scores entered",
        "App correctly reports the highest score",
        "App correctly reports the lowest score",
        "App correctly reports the number of courses with a score higher than 80 (fixed threshold of 80)"
      ]
    }`;

const day26Search = `    day: 26,
    date: "2026-07-09",
    dayOfWeek: "Thursday",
    type: "project",
    chapterNum: null,
    chapterTitle: "Mini Project 1",
    title: "Mini-Project 1: Class Grade Toolkit",
    slides: null,
    videos: [],
    task: {
      taskId: "proj_grade_dev",
      title: "Class Grade Toolkit (Grades & GPA)",
      description: "Flesh out student details: calculate standard letter grades (A/B/C/D/F) for each course, calculate a 'bonus number' by summing the digits of the highest score (e.g. 95 -> 14), perform a case-insensitive palindrome check on the student's name, and compute GPA based on course grade points.",
      checklist: [
        "App correctly assigns a letter grade (A/B/C/D/F) to each individual score and displays the list in entry order",
        "App displays a correct 'bonus number' (digit sum of the highest score)",
        "App asks for the user's name and correctly identifies whether it's a palindrome (case-insensitive)",
        "App correctly converts each score to grade points (4.0/3.0/2.0/1.0/0.0) and calculates GPA"
      ]
    }`;

const day26Replace = `    day: 26,
    date: "2026-07-09",
    dayOfWeek: "Thursday",
    type: "project",
    chapterNum: null,
    chapterTitle: "Mini Project 1",
    title: "Mini-Project 1: Class Grade Toolkit",
    slides: null,
    videos: [],
    task: {
      taskId: "proj_grade_dev",
      title: "Class Grade Toolkit (Grades & GPA)",
      description: "Flesh out student details: calculate standard letter grades (A/B/C/D/F) for each course, calculate a 'bonus number' by summing the digits of the highest score (e.g. 95 -> 14), perform a case-insensitive palindrome check on the student's name, and compute GPA based on course grade points.",
      projectInfo: ${JSON.stringify(project1Info, null, 6)},
      checklist: [
        "App correctly assigns a letter grade (A/B/C/D/F) to each individual score and displays the list in entry order",
        "App displays a correct 'bonus number' (digit sum of the highest score)",
        "App asks for the user's name and correctly identifies whether it's a palindrome (case-insensitive)",
        "App correctly converts each score to grade points (4.0/3.0/2.0/1.0/0.0) and calculates GPA"
      ]
    }`;

const day28Search = `    day: 28,
    date: "2026-07-11",
    dayOfWeek: "Saturday",
    type: "project",
    chapterNum: null,
    chapterTitle: "Mini Project 1",
    title: "Mini-Project 1: Class Grade Toolkit",
    slides: null,
    videos: [],
    task: {
      taskId: "proj_grade_submit",
      title: "Class Grade Toolkit Submission",
      description: "Complete and publish your Grade Toolkit command-line Java program to GitHub. Write a clear README.md with run instructions and a sample screenshot or execution log. Submit your repository link and development summary below to complete Mini-Project 1.",
      checklist: [
        "App prints one final report containing all results together, in a readable format",
        "Running the program multiple times with different inputs gives correct, consistent results",
        "Git repository initialized and pushed to GitHub with a solid README.md"
      ]
    }`;

const day28Replace = `    day: 28,
    date: "2026-07-11",
    dayOfWeek: "Saturday",
    type: "project",
    chapterNum: null,
    chapterTitle: "Mini Project 1",
    title: "Mini-Project 1: Class Grade Toolkit",
    slides: null,
    videos: [],
    task: {
      taskId: "proj_grade_submit",
      title: "Class Grade Toolkit Submission",
      description: "Complete and publish your Grade Toolkit command-line Java program to GitHub. Write a clear README.md with run instructions and a sample screenshot or execution log. Submit your repository link and development summary below to complete Mini-Project 1.",
      projectInfo: ${JSON.stringify(project1Info, null, 6)},
      checklist: [
        "App prints one final report containing all results together, in a readable format",
        "Running the program multiple times with different inputs gives correct, consistent results",
        "Git repository initialized and pushed to GitHub with a solid README.md"
      ]
    }`;

const day42Search = `    day: 42,
    date: "2026-07-25",
    dayOfWeek: "Saturday",
    type: "project",
    chapterNum: null,
    chapterTitle: "Mini Project 2",
    title: "Mini-Project 2: Bank Account Manager",
    slides: null,
    videos: [],
    task: {
      taskId: "proj_atm_submit",
      title: "Bank Account Manager Submission",
      description: "Build a CLI bank system that manages a customer, their account, and a stock portfolio. Set up customer parameters (name, balance, interest rate), record creation date/time, handle 2-3 stocks (percentage change and total value), run exactly 5 random transactions ($10-$500 deposit/withdraw without overdrawing), and print an encapsulated final summary.",
      checklist: [
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
    }`;

const day42Replace = `    day: 42,
    date: "2026-07-25",
    dayOfWeek: "Saturday",
    type: "project",
    chapterNum: null,
    chapterTitle: "Mini Project 2",
    title: "Mini-Project 2: Bank Account Manager",
    slides: null,
    videos: [],
    task: {
      taskId: "proj_atm_submit",
      title: "Bank Account Manager Submission",
      description: "Build a CLI bank system that manages a customer, their account, and a stock portfolio. Set up customer parameters (name, balance, interest rate), record creation date/time, handle 2-3 stocks (percentage change and total value), run exactly 5 random transactions ($10-$500 deposit/withdraw without overdrawing), and print an encapsulated final summary.",
      projectInfo: ${JSON.stringify(project2Info, null, 6)},
      checklist: [
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
    }`;

const day56Search = `    day: 56,
    date: "2026-08-08",
    dayOfWeek: "Saturday",
    type: "project",
    chapterNum: null,
    chapterTitle: "Mini Project 3",
    title: "Mini-Project 3: Multi-Account Bank Simulator",
    slides: null,
    videos: [],
    task: {
      taskId: "proj_library_submit",
      title: "Multi-Account Bank Simulator Submission",
      description: "Build a CLI banking program that manages several accounts of Savings and Checking types, demonstrating inheritance and polymorphism. Savings accounts have per-transaction limits and cannot go negative. Checking accounts allow negative balances up to an overdraft limit and charge flat transaction fees. Implement running histories for all transactions and output mixed account summaries.",
      checklist: [
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
    }`;

const day56Replace = `    day: 56,
    date: "2026-08-08",
    dayOfWeek: "Saturday",
    type: "project",
    chapterNum: null,
    chapterTitle: "Mini Project 3",
    title: "Mini-Project 3: Multi-Account Bank Simulator",
    slides: null,
    videos: [],
    task: {
      taskId: "proj_library_submit",
      title: "Multi-Account Bank Simulator Submission",
      description: "Build a CLI banking program that manages several accounts of Savings and Checking types, demonstrating inheritance and polymorphism. Savings accounts have per-transaction limits and cannot go negative. Checking accounts allow negative balances up to an overdraft limit and charge flat transaction fees. Implement running histories for all transactions and output mixed account summaries.",
      projectInfo: ${JSON.stringify(project3Info, null, 6)},
      checklist: [
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
    }`;

// Perform replacements
let replacedCount = 0;

if (content.includes(day25Search)) {
  content = content.replace(day25Search, day25Replace);
  replacedCount++;
} else {
  console.log("Warning: day25Search text not found exactly");
}

if (content.includes(day26Search)) {
  content = content.replace(day26Search, day26Replace);
  replacedCount++;
} else {
  console.log("Warning: day26Search text not found exactly");
}

if (content.includes(day28Search)) {
  content = content.replace(day28Search, day28Replace);
  replacedCount++;
} else {
  console.log("Warning: day28Search text not found exactly");
}

if (content.includes(day42Search)) {
  content = content.replace(day42Search, day42Replace);
  replacedCount++;
} else {
  console.log("Warning: day42Search text not found exactly");
}

if (content.includes(day56Search)) {
  content = content.replace(day56Search, day56Replace);
  replacedCount++;
} else {
  console.log("Warning: day56Search text not found exactly");
}

console.log("Replaced days count:", replacedCount);

if (replacedCount === 5) {
  fs.writeFileSync(courseDataPath, content, 'utf8');
  console.log("Success: Updated all 5 project days in courseData.js");
} else {
  console.log("Failure: Could not update all project days.");
  process.exit(1);
}
