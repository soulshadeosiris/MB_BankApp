const form = document.getElementById('signUpForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // get form data
    const formData = new FormData(form);
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        phoneNumber: formData.get('phoneNumber'),
        dateOfBirth: formData.get('dateOfBirth')
    };

    try {
        // send POST request to create user
        const response = await fetch('http://localhost:8080/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            // read error text from server
            const errorText = await response.text();
            throw new Error(errorText);
        }

        // success
        alert('User created successfully!');

        form.reset();

        // redirect to login after short delay
        setTimeout(() => {
            window.location.href = "log_in.html";
        }, 100);

    } catch (err) {
        console.error(err);
        alert('Error: ' + err.message);
    }
});
