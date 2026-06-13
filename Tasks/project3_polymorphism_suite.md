# Mini Project 3 — "Multi-Account Bank Simulator" (CLI)
**Covers:** Ch 11 (Inheritance & Polymorphism) and Ch 13 (Abstract Classes &
Interfaces)

---

## 🎯 Goal
Build a CLI banking program that manages **several accounts of two different
types**, each with its own rules, and demonstrates that a program can treat
both types "the same way" while each still behaves according to its own
rules.

---

## 📋 What the App Should Do

### 1. Two account types
The app supports two kinds of accounts that share the basic idea of "an
account with an ID, an owner name, and a balance that can be deposited into
and withdrawn from" — but each type has its own rules:

- **Savings account**
  - Withdrawals are never allowed to take the balance below zero. If a
    withdrawal would do that, it's rejected with a message and the balance
    is unchanged.
  - Has a withdrawal limit **per transaction** (e.g., no single withdrawal
    over $1000). A withdrawal above this limit is rejected with a message.

- **Checking account**
  - Allows the balance to go **negative**, down to a fixed overdraft limit
    (e.g., -$500). A withdrawal that would exceed this limit is rejected
    with a message.
  - Every withdrawal from a checking account has a small **flat fee**
    (e.g., $1.50) automatically subtracted in addition to the withdrawal
    amount itself.

### 2. Creating accounts
- Ask the user how many accounts they want to create in total.
- For each account, ask for:
  - The owner's name
  - The starting balance
  - The account type (Savings or Checking)
- Store all created accounts together in a single collection.

### 3. Performing transactions
- After all accounts are created, let the user perform a series of
  transactions until they choose to stop. For each transaction, ask for:
  - Which account (by number/ID)
  - Whether it's a deposit or withdrawal
  - The amount
- Apply the transaction according to **that account's own rules** (the
  checks above) — the app should not need to ask "what type is this account"
  before deciding what to do; the right behavior should happen automatically
  based on the account itself.
- Print the result of each transaction (success with new balance, or a
  rejection message explaining why).

### 4. Transaction history
- Every account — regardless of type — keeps a running list of everything
  that happened to it (deposits, successful withdrawals, fees charged, and
  rejected attempts).
- The app can display the full history for any account on request.

### 5. Final report
- After the user is done with transactions, the app loops through **all
  accounts together** (in one list, mixing both types) and prints, for each
  account:
  - Account ID, owner name, and type
  - Final balance
  - Full transaction history
- The correct type-specific details (overdraft vs. no-negative-balance,
  fees vs. withdrawal limits) should be visible in the history without the
  app treating each account type as a special case during this final
  printout.

### 6. Summary statistics
At the very end, the app also displays:
- The total number of Savings accounts vs. Checking accounts created
- The combined balance across **all** accounts
- Which single account (by ID/owner) currently has the **highest balance**

---

## Example of what a run might look like

```
How many accounts do you want to create? 2

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
=========================
```

---

## ✅ Checklist (verify by running the program)

- [ ] App asks how many accounts to create, then collects owner name,
      starting balance, and type (Savings/Checking) for each
- [ ] All created accounts are stored together in one collection
- [ ] Savings withdrawals never take the balance below zero, and are
      rejected with a clear message if they would
- [ ] Savings withdrawals over the per-transaction limit are rejected with a
      clear message
- [ ] Checking withdrawals can take the balance negative, but never beyond
      the overdraft limit — rejected with a clear message if they would
- [ ] Checking withdrawals automatically apply the flat fee on top of the
      withdrawal amount
- [ ] The app processes a series of transactions (by account ID,
      deposit/withdraw, amount) until the user signals they're done
- [ ] Each transaction prints either a success message with the new balance,
      or a rejection message explaining why
- [ ] Every account keeps a transaction history including deposits,
      successful withdrawals (with fees if applicable), and rejected
      attempts
- [ ] The app can display any account's full history on request
- [ ] The final report loops through all accounts (mixed types, one list)
      and prints ID, owner, type, balance, and history for each — with
      correct type-specific behavior visible automatically
- [ ] Summary statistics correctly report: count of each account type,
      combined balance across all accounts, and which account has the
      highest balance
- [ ] Running the program with different numbers of accounts and different
      transactions produces correct, consistent results
