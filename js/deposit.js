const select = document.querySelector('.select');
const header = select.querySelector('.select-header');
const value = select.querySelector('.select-value');
const dropdown = select.querySelector('.select-dropdown');

// toggle dropdown visibility
header.onclick = () => {
  dropdown.style.display =
    dropdown.style.display === 'block' ? 'none' : 'block';
};

// select option
document.querySelectorAll('.option').forEach(option => {
  option.onclick = () => {
    value.textContent = option.textContent.trim();
    dropdown.style.display = 'none';
  };
});

// get current user from sessionStorage
const user = JSON.parse(sessionStorage.getItem("user"));
if (!user) {
    alert("Please log in first!");
    window.location.href = "log_in.html";
}

// select form elements
const form = document.getElementById("depositForm");
const amountInput = form.querySelector("input[name='amount']");
const accountDropdown = form.querySelector(".select-dropdown");
const accountDisplay = form.querySelector(".select-value");

// current selected account
let selectedAccountId = null;

// load user accounts and populate dropdown
async function loadAccounts() {
    try {
        const response = await fetch(`http://localhost:8080/users/${user.id}/accounts`);
        if (!response.ok) throw new Error("Failed to load accounts");

        const accounts = await response.json();
        accountDropdown.innerHTML = ""; // clear old options

        accounts.forEach(account => {
            const div = document.createElement("div");
            div.className = "option";
            div.textContent = `Account #${account.accountNumber} - Balance: $${account.balance.toFixed(2)}`;
            div.addEventListener("click", () => {
                selectedAccountId = account.id;
                accountDisplay.textContent = `Account #${account.accountNumber}`;
            });
            accountDropdown.appendChild(div);
        });

        if (accounts.length > 0) {
            selectedAccountId = accounts[0].id;
            accountDisplay.textContent = `Account #${accounts[0].accountNumber}`;
        }
    } catch (err) {
        console.error(err);
        alert("Error loading accounts: " + err.message);
    }
}

// handle form submission
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    if (!selectedAccountId) {
        alert("Please select an account");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert("Enter a valid amount");
        return;
    }

    // check if it's deposit or withdraw
    const isDeposit = form.querySelector(".deposit-btn") !== null;

    const endpoint = `http://localhost:8080/users/${user.id}/accounts/${selectedAccountId}/${isDeposit ? "deposit" : "withdraw"}?amount=${amount}`;

    try {
        const response = await fetch(endpoint, {
            method: "POST"
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || "Transaction failed");
        }

        // backend returns balance
        const data = await response.json();
        alert(`Deposit successful! New balance: $${data.balance.toFixed(2)}`);        
        
        // reload accounts+
        await loadAccounts();
        amountInput.value = "";
    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    }
});

// init
loadAccounts();
