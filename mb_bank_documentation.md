# MB Bank Project Documentation

## Project Overview
**MB Bank** is a web-based banking application built with **Spring Boot** (backend) and **HTML/CSS/JS** (frontend). The application allows users to:

- Register and log in.
- Create multiple accounts (e.g., Main, Savings).
- Deposit and withdraw funds.
- View recent transactions.
- Display account balances dynamically.

The project emphasizes a clean, minimalistic UI, responsive design, and interactive user experience.

---

## Table of Contents
1. [Architecture](#architecture)  
2. [Backend](#backend)  
   - [Models](#models)  
   - [Controllers](#controllers)  
   - [Services](#services)  
   - [Repositories](#repositories)  
   - [API Endpoints](#api-endpoints)  
3. [Frontend](#frontend)  
   - [Pages](#pages)  
   - [Dropdown Accounts](#dropdown-accounts)  
   - [Deposit & Withdraw Forms](#deposit--withdraw-forms)  
4. [Usage](#usage)  
5. [Future Improvements](#future-improvements)  

---

## Architecture

```
Frontend: HTML / CSS / JavaScript
       |
       v
Backend: Spring Boot (Controllers, Services, Repositories)
       |
       v
Database: H2 / MySQL (Accounts, Users, Transactions)
```

The application follows a **Controller-Service-Repository** pattern.  
- **Controller**: handles HTTP requests.  
- **Service**: business logic for accounts and transactions.  
- **Repository**: communicates with the database using JPA.  

---

## Backend

### Models

#### User
- id: Long  
- firstName: String  
- lastName: String  
- email: String  
- password: String  
- accounts: List<Account>  

#### Account
- id: Long  
- accountNumber: Long  
- balance: Double  
- transactions: List<Transaction>  

#### Transaction
- id: Long  
- type: DEPOSIT | WITHDRAW  
- amount: Double  
- createdAt: LocalDateTime  
- account: Account  

---

### Controllers

- **AccountController**
  - Create / Update / Delete / Get accounts
  - Deposit / Withdraw actions
- **TransactionController**
  - Create and fetch transactions by account

---

### Services

- **AccountService**
  - `createAccount(userId, account)`
  - `withdraw(accountId, amount)`
  - `deposit(accountId, amount)`
  - `showBalance(accountId)`
- **TransactionService**
  - `createTransaction(transaction)`
  - `getAllTransactionsByAccount(accountId)`
  - `getTransactionById(transactionId)`

---

### Repositories

- **UserRepository**  
- **AccountRepository**  
- **TransactionRepository**  

All extend **JpaRepository** for easy CRUD operations.

---

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/{userId}/accounts` | Create account |
| GET | `/users/{userId}/accounts` | Get all accounts of user |
| GET | `/users/{userId}/accounts/{accountId}` | Get account by ID |
| POST | `/users/{userId}/accounts/{accountId}/deposit` | Deposit funds |
| POST | `/users/{userId}/accounts/{accountId}/withdraw` | Withdraw funds |
| GET | `/accounts/{accountId}/transactions` | Get all transactions for account |
| GET | `/accounts/{accountId}/transactions/{transactionId}` | Get transaction by ID |

---

## Frontend

### Pages

1. **Dashboard**  
   - Shows user accounts and balances.
   - Shows recent transactions dynamically.

2. **Deposit Page**  
   - Dropdown for accounts
   - Input field for deposit amount
   - Button to submit deposit
   - Updates balance and transaction list in real-time

3. **Withdraw Page**  
   - Similar layout to Deposit
   - Handles withdrawals

4. **Account Creation Page**  
   - Allows creating multiple accounts
   - Displays account type (Main, Savings) and balance

---

### Dropdown Accounts

- Dynamically populated from backend via fetch API  
- Shows last 4 digits of account number and balance
- Updates `selectedAccountId` when clicked

```javascript
// Example
const div = document.createElement("div");
div.className = "option";
div.textContent = `Account #${account.accountNumber} - Balance: $${account.balance.toFixed(2)}`;
div.addEventListener("click", () => {
    selectedAccountId = account.id;
    accountDisplay.textContent = `Account #${account.accountNumber}`;
});
accountDropdown.appendChild(div);
```

---

### Deposit & Withdraw Forms

- Form validates input (`amount > 0`)  
- Sends POST request to `/deposit` or `/withdraw`  
- Updates balance on success
- Refreshes dropdown accounts

```javascript
const response = await fetch(endpoint, { method: "POST" });
const newBalance = Number(await response.json());
alert(`Deposit successful! New balance: $${newBalance.toFixed(2)}`);
```

---

## Usage

1. Register and log in  
2. Create one or more accounts  
3. Deposit or withdraw funds  
4. View recent transactions and updated balances

---

## Future Improvements

- Add multiple card management for accounts  
- Implement transaction history pagination  
- Add email notifications for transactions  
- Improve error handling and validation  
- Mobile-responsive UI

