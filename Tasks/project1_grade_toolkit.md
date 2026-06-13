# Mini Project 1 — "Class Grade Toolkit" (CLI)
**Covers:** Ch 1–8 (Java basics, variables, I/O, expressions, conditionals, math/strings, loops, methods, arrays, matrices)

---

## 🎯 Goal
Build a command-line program that helps a student analyze a set of exam scores and course credit hours, and produces a GPA report based on university grading regulations.

---

## 📋 What the App Should Do

### 1. Collecting scores & credit hours
- Ask the user how many courses they want to enter.
- If the number entered is `0` or negative, keep asking until a valid positive number is given.
- Then ask the user to enter each course's score (percentage) and credit hours:
  - For each course, first ask for the **score (percentage)**, and **immediately after**, ask for the **credit hours** of that course.
  - The score must be between `0` and `100`. If the user enters something outside that range, reject it and ask again for that same score.
  - The credit hours must be a positive number (greater than `0`). If the user enters a non-positive value, reject it and ask again for that same course's credit hours.
  - The program must not move on to the next course until valid values for both score and credit hours are given.

### 2. Basic statistics
After all course data is collected, the app should report:
- The **weighted average score** of all the courses (weighted by credit hours: $\sum (\text{score} \times \text{credit hours}) / \sum \text{credit hours}$).
- The **highest** score.
- The **lowest** score.
- The **number of courses with a score higher than 80** (this threshold of 80 is fixed — the app doesn't need to ask the user for it).

### 3. Letter grades per course
- For **each individual score** entered, the app assigns a letter grade using the university scale:
  - 90% and above → A+
  - 85% to < 90% → A
  - 80% to < 85% → B+
  - 75% to < 80% → B
  - 70% to < 75% → C+
  - 65% to < 70% → C
  - 60% to < 65% → D+
  - 50% to < 60% → D
  - Below 50% → F
- The app should display the full list of letter grades, one per course, in the same order the scores were entered (e.g., `[B+, A, C+, D+, A+]`).

### 4. A "bonus number"
- The app should take the highest score and produce a "bonus number" by adding together its individual digits (e.g., a score of 92 produces a bonus number of 11, since 9 + 2 = 11).

### 5. Name check
- Ask the user for their name.
- The app should check whether the name reads the same forwards and backwards (ignoring case), and tell the user whether their name is a "palindrome" or not.

### 6. GPA calculator
- For each course, determine its **grade points** based on the score percentage:
  - 90% and above → 4.0
  - 85% to < 90% → 3.75
  - 80% to < 85% → 3.4
  - 75% to < 80% → 3.1
  - 70% to < 75% → 2.8
  - 65% to < 70% → 2.5
  - 60% to < 65% → 2.25
  - 50% to < 60% → 2.0
  - Below 50% → 1.0
- Calculate the **Cumulative GPA** using the formula:
  $$\text{GPA} = \frac{\sum (\text{Course Grade Points} \times \text{Course Credit Hours})}{\sum \text{Course Credit Hours}}$$
- Determine the **Overall General Estimate (التقدير العام)** based on the calculated GPA:
  - GPA $\ge$ 3.4 → Excellent (ممتاز)
  - 2.8 to < 3.4 → Very Good (جيد جداً)
  - 2.4 to < 2.8 → Good (جيد)
  - 2.0 to < 2.4 → Pass (مقبول)
  - 1.4 to < 2.0 → Weak (ضعيف)
  - GPA < 1.4 → Very Weak (ضعيف جداً)
- Display both the calculated GPA (rounded to 2 decimal places) and the Overall General Estimate.

### 7. Final report
At the end, the app prints a single clean summary that includes **all** of the above: the list of courses with their scores and credit hours, the weighted average, highest score, lowest score, count of courses above 80, the list of letter grades (one per course), the bonus number, the palindrome result, the weighted GPA, and the Overall General Estimate.

**Example of what a run might look like:**
```
How many courses? 5
Enter score for course 1: 83
Enter credit hours for course 1: 3
Enter score for course 2: 150
Invalid score, please enter a value between 0 and 100:
Enter score for course 2: 86
Enter credit hours for course 2: 4
Enter score for course 3: 72
Enter credit hours for course 3: 2
Enter score for course 4: 60
Enter credit hours for course 4: 3
Enter score for course 5: 92
Enter credit hours for course 5: 3

What's your name? Ahmed

===== GRADE REPORT =====
Student: Ahmed
Is your name a palindrome? false
Scores & Credits: [83% (3 hrs), 86% (4 hrs), 72% (2 hrs), 60% (3 hrs), 92% (3 hrs)]
Average Score (Weighted): 79.53
Highest Score: 92   Lowest Score: 60
Courses with score above 80: 3
Letter Grades: [B+, A, C+, D+, A+]
Bonus number (digit sum of highest score): 11
Weighted GPA: 3.30
Overall Grade: Very Good (جيد جداً)
=========================
```

---

## ✅ Checklist (verify by running the program)

- [ ] App asks how many courses, and rejects 0 or negative values
- [ ] App reads that many scores and credit hours from the user sequentially (score, then credit hours for each course)
- [ ] Any score outside 0–100 or credit hours <= 0 is rejected with a message, and the app re-asks for that value until valid
- [ ] App correctly reports the weighted average score of the courses entered
- [ ] App correctly reports the highest score
- [ ] App correctly reports the lowest score
- [ ] App correctly reports the number of courses with a score higher than 80 (fixed threshold, no need to ask the user)
- [ ] App correctly assigns a letter grade (A+/A/B+/B/C+/C/D+/D/F) to each individual score and can display the full list of letter grades in entry order
- [ ] App displays a correct "bonus number" (digit sum of the highest score)
- [ ] App asks for the user's name and correctly identifies whether it's a palindrome (case-insensitive)
- [ ] App correctly converts each score to grade points (4.0/3.75/3.4/3.1/2.8/2.5/2.25/2.0/1.0) and calculates GPA as the credit-weighted average of those grade points
- [ ] App determines and displays the correct Overall General Estimate based on the GPA
- [ ] App prints one final report containing all results together, in a readable format
- [ ] Running the program multiple times with different inputs gives correct, consistent results
