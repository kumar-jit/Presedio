document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');

    const fields = ['exampleInputEmail1', 'exampleInputPassword1'];

    fields.forEach(field => {
        document.getElementById(field).addEventListener('keyup', function() {
            validateField(this);
        });
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        event.stopPropagation();

        var isValid = true;

        fields.forEach(field => {
            const input = document.getElementById(field);
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            const data = {
                email: document.getElementById('exampleInputEmail1').value,
                password: document.getElementById('exampleInputPassword1').value
            };

            try {
                let response = await fetch('http://localhost:5000/api/auth/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    let result = await response.json();
                    let token = result.token; 

                    localStorage.setItem('userEmail', result.userEmail);
                    localStorage.setItem('isSeller', result.isSeller);
                    localStorage.setItem('jwt', token);
                    localStorage.setItem('name', result.name);


                    alert('Login successful!');
                    form.reset(); // Reset the form after successful submission
                    fields.forEach(field => {
                        const input = document.getElementById(field);
                        input.classList.remove('is-valid');
                    });
                    window.location.href = './displyProperties.html';
                } else {
                    let data = await response.json();
                    if(data.message  === "Invalid credentials"){
                        fields.forEach(field => {
                            const input = document.getElementById(field);
                            input.classList.add('is-invalid');
                        });
                    }
                    throw new Error(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'Login failed.');
            }
        }
    });

    function validateField(field) {
        if (field.checkValidity()) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            return true;
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            return false;
        }
    }
});

