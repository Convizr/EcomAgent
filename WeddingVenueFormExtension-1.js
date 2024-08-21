export const WeddingVenueFormExtension = {
    name: 'WeddingVenueForm',
    type: 'response',
    match: ({ trace }) =>
        trace.type === 'wedding_venue_form' || trace.payload.name === 'wedding_venue_form',
    render: ({ trace, element }) => {
        const formContainer = document.createElement('form');

        formContainer.innerHTML = `
            <style>
                label {
                    display: block;
                    margin: 10px 0 5px;
                }
                input {
                    width: 100%;
                    padding: 8px;
                    margin: 5px 0 20px 0;
                    display: inline-block;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                input[type="submit"] {
                    background-color: rgb(173, 32, 31);
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                input[type="submit"]:hover {
                    background-color: rgb(138, 26, 25);
                }
            </style>

            <fieldset id="weddingDetails">
                <legend>Wedding Venue Details:</legend>
                <label for="brideName">Bride's Name:</label>
                <input type="text" id="brideName" name="brideName" required>

                <label for="groomName">Groom's Name:</label>
                <input type="text" id="groomName" name="groomName" required>

                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>

                <label for="phone">Phone Number:</label>
                <input type="tel" id="phone" name="phone" required pattern="\\d+" title="Please enter a valid phone number">
            </fieldset>

            <input type="submit" value="Submit">
        `;

        formContainer.addEventListener('submit', function (event) {
            event.preventDefault();

            const brideName = formContainer.querySelector('#brideName').value;
            const groomName = formContainer.querySelector('#groomName').value;
            const email = formContainer.querySelector('#email').value;
            const phone = formContainer.querySelector('#phone').value;

            // Sending each form field as a separate key-value pair in the payload
            window.voiceflow.chat.interact({
                type: 'complete',
                payload: {
                    brideName,
                    groomName,
                    email,
                    phone
                },
            });
        });

        element.appendChild(formContainer);
    },
};