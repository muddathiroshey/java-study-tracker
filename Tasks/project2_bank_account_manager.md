# Mini Project 2 — "Bank Account Manager" (CLI)
**Covers:** Ch 9–10 (Objects and Classes, built-in API classes, thinking in
objects, composition)

---

## 🎯 Goal
Build a small CLI bank system that manages a customer, their account, and a
small stock portfolio — then simulates some activity and prints a report.

---

## 📋 What the App Should Do

### 1. Setting up the customer
- Ask the user for their name and a starting account balance.
- Ask the user for an **annual interest rate** for the account (e.g., 4 for
  4%).
- The account should remember the moment it was created (its creation
  date/time).

### 2. Stock portfolio
- Ask the user to enter 2–3 stocks they own. For each stock, ask for:
  - A symbol/name (e.g., "AAPL")
  - Its previous closing price
  - Its current price
- For each stock, the app should be able to report the **percentage
  change** between the previous closing price and the current price.
- The app should be able to report the **total current value** of all the
  stocks combined.

### 3. Simulated transactions
- The app should automatically perform **5 random transactions** on the
  account — each one either a deposit or a withdrawal of a random amount
  (somewhere between $10 and $500).
- For each transaction, print what happened and the new balance, e.g.:
  ```
  [Transaction 1] Deposit of $245.30 -> New Balance: $1245.30
  [Transaction 2] Withdraw of $120.00 -> New Balance: $1125.30
  ```
- A withdrawal should never be allowed to take the balance below zero — if
  a random withdrawal would do that, the app should skip it (or reduce it)
  and say so instead of producing a negative balance.

### 4. Interest
- Using the annual interest rate the user provided, the app should
  calculate and display the **monthly interest** the account would earn at
  its final balance.

### 5. Time since creation
- The app should display when the account was created.
- The app should also calculate and display **how many days** have passed
  since the account was created (it's fine if this shows 0 for a
  freshly-created account — the calculation should still run and display a
  number).

### 6. Final summary
At the end, the app prints one combined report showing:
- Customer name
- Final account balance
- Monthly interest at the final balance
- Account creation date and days since creation
- Each stock's percentage change
- Total value of the stock portfolio

**Example of what a run might look like:**
```
Enter your name: Sara
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
============================
```

---

## ✅ Checklist (verify by running the program)

- [ ] App asks for customer name, starting balance, and annual interest
      rate
- [ ] App records and can later display the account's creation date/time
- [ ] App accepts 2–3 stocks with symbol, previous price, and current price
- [ ] App correctly calculates each stock's percentage change (positive and
      negative cases both work)
- [ ] App correctly calculates total portfolio value
- [ ] App runs exactly 5 random transactions, each clearly labeled as
      deposit or withdrawal with an amount in the $10–$500 range
- [ ] Each transaction prints the new balance immediately after it happens
- [ ] Balance never goes negative — a withdrawal that would overdraw is
      handled gracefully (skipped, reduced, or rejected with a message)
- [ ] App correctly calculates monthly interest based on the final balance
      and the user-provided annual rate
- [ ] App displays days since account creation (correctly computed, even if
      it's 0)
- [ ] Final summary includes all of: customer name, final balance, monthly
      interest, creation date, days since creation, stock changes, and
      total portfolio value
- [ ] Running the program again produces different random transactions but
      the same correct overall structure
