document.addEventListener("DOMContentLoaded", async () => {
    // get user from sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
        // redirect to login if no user
        window.location.href = "log_in.html";
        return;
    }

    // set welcome message
    const welcomeEl = document.getElementById("welcome");
    welcomeEl.textContent = `Welcome back, ${user.firstName}!`;

    const clientNameEl = document.getElementById("client-name")
    clientNameEl.textContent = `${user.firstName}`;

    try {
        // fetch user accounts
        const accountsResponse = await fetch(`http://localhost:8080/users/${user.id}/accounts`);
        if (!accountsResponse.ok) throw new Error("Failed to fetch accounts");
        const accounts = await accountsResponse.json();

        if (accounts.length === 0) {
            document.getElementById("account-balance").textContent = "$0.00";
            return;
        }

        // pick first account (could add selection later)
        const account = accounts[0];

        // display balance
        document.getElementById("account-balance").textContent = `$${account.balance.toFixed(2)}`;
        document.getElementById("total-balance").textContent = `$${account.balance.toFixed(2)}`;

         // fetch last transactions
        const transactionsResponse = await fetch(`http://localhost:8080/accounts/${account.id}/transactions`);
        if (!transactionsResponse.ok) throw new Error("Failed to fetch transactions");
        const transactions = await transactionsResponse.json();

        const transactionList = document.getElementById("transactions");
        transactionList.innerHTML = ""; // clear container

        // take last 4 transactions
        transactions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4)
            .forEach(tx => {
                const txDiv = document.createElement("div");
                txDiv.classList.add("first-transaction");
                
                // status (+ or -)
                const status = document.createElement("span");
                status.classList.add(tx.type === "DEPOSIT" ? "status-positive" : "status-negative");
                status.textContent = tx.type === "DEPOSIT" ? "+" : "-";

                const txInfo = document.createElement("div");
                txInfo.classList.add("tx-info");

                const operationType = document.createElement("span");
                operationType.classList.add("operation-type");
                operationType.textContent = tx.type.charAt(0) + tx.type.slice(1).toLowerCase(); // Deposit/Withdraw

                const operationValue = document.createElement("span");
                operationValue.classList.add("operation-value");
                operationValue.textContent = `$${tx.amount.toFixed(2)}`;

                // color value green/red based on type
                operationValue.style.color = tx.type === "DEPOSIT" ? "rgb(72, 214, 129)" : "rgb(243, 38, 68)";

                txInfo.appendChild(operationType);
                txInfo.appendChild(operationValue);

                txDiv.appendChild(status);
                txDiv.appendChild(txInfo);

                // separator
                const underline = document.createElement("span");
                underline.classList.add("tx-underline");

                transactionList.appendChild(txDiv);
                transactionList.appendChild(underline);
            });


    } catch (error) {
        console.error(error);
        alert("Error loading dashboard: " + error.message);
    }
});
