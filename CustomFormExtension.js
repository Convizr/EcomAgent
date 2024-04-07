export const CustomFormExtension = {
    name: 'CustomForm',
    type: 'response',
    match: ({ trace }) =>
        trace.type === 'custom_form' || trace.payload.name === 'custom_form',
    render: ({ trace, element }) => {
        const formContainer = document.createElement('form');
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        formContainer.innerHTML = `
            <style>
                label {
                    font-size: 0.9em;
                    color: #333;
                }
                input[type="text"], input[type="email"], input[type="number"], input[type="date"], select {
                    width: 100%;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 10px;
                    margin: 5px 0 20px 0;
                }
                .submit {
                    background-color: #4CAF50;
                    color: white;
                    padding: 14px 20px;
                    margin: 10px 0;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 100%;
                }
                .submit:hover {
                    background-color: #45a049;
                }
            </style>

            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" min="1" required><br>

            <label for="budget">Budget:</label>
            <input type="text" id="budget" name="budget" required><br>

            <label for="gender">Gender:</label>
            <select id="gender" name="gender" required>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="both">Both</option>
            </select><br>

            <label for="deadline">Deadline:</label>
            <input type="date" id="deadline" name="deadline" min="${today}" required><br>

            <input type="submit" value="Submit" class="submit">
        `;

        formContainer.addEventListener('submit', function (event) {
            event.preventDefault();

            const quantity = formContainer.querySelector('#quantity').value;
            const budget = formContainer.querySelector('#budget').value;
            const gender = formContainer.querySelector('#gender').value;
            const deadline = formContainer.querySelector('#deadline').value;

            // Sending each form field as a separate key-value pair in the payload
            window.voiceflow.chat.interact({
                type: 'complete',
                payload: {
                    quantity,
                    budget,
                    gender,
                    deadline
                },
            });
        });

        element.appendChild(formContainer);
    },
}
