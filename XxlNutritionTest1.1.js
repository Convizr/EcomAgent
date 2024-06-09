export const ProductFormExtension = {
    name: 'ProductForm',
    type: 'response',
    match: ({ trace }) =>
        trace.type === 'product_form' || trace.payload.name === 'product_form',
    render: ({ trace, element }) => {
        let payloadObj;
        if (typeof trace.payload === 'string') {
            payloadObj = JSON.parse(trace.payload);
        } else {
            payloadObj = trace.payload;
        }

        const orderProductSize = payloadObj.orderProductSize;
        const orderProductTaste = payloadObj.orderProductTaste;

        // Function to get unique, non-zero values
        const getUniqueValues = (values) => {
            if (values === '0' || !values) return [];
            return [...new Set(values.split(', ').map(val => val.trim()))];
        };

        // Get unique sizes and tastes
        const uniqueSizes = getUniqueValues(orderProductSize);
        const uniqueTastes = getUniqueValues(orderProductTaste);

        // Generate size options HTML
        const sizeOptionsHTML = uniqueSizes.length ? uniqueSizes.map(size => `<option value="${size}">${size}</option>`).join('') : '<option value="">No sizes available</option>';

        // Generate taste options HTML only if there are valid taste options
        const tasteOptionsHTML = uniqueTastes.length ? uniqueTastes.map(taste => `<option value="${taste}">${taste}</option>`).join('') : '';

        const formContainer = document.createElement('form');
        formContainer.innerHTML = `
            <style>
                label {
                    display: block;
                    margin: 10px 0 5px;
                }
                input, select {
                    width: 100%;
                    padding: 8px;
                    margin: 5px 0 20px 0;
                    display: inline-block;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                .hidden {
                    display: none;
                }
                .visible {
                    display: block;
                }
                input[type="submit"] {
                    background-color: #B3A199;
                    color: white;
                }
                input[type="submit"]:hover {
                    background-color: #9e8975;
                }
            </style>

            <fieldset id="orderDetails">
                <legend>Order Details:</legend>
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" name="quantity" min="1" required>

                ${uniqueSizes.length ? `
                    <label for="size">Size:</label>
                    <select id="size" name="size" required>
                        <option value="">Select a size</option>
                        ${sizeOptionsHTML}
                    </select>
                ` : ''}

                ${uniqueTastes.length ? `
                    <label for="taste">Taste:</label>
                    <select id="taste" name="taste" required>
                        <option value="">Select a taste</option>
                        ${tasteOptionsHTML}
                    </select>
                ` : ''}
            </fieldset>

            <fieldset id="customerInfo" class="hidden">
                <legend>Customer Information:</legend>
                <label for="fullName">Full Name:</label>
                <input type="text" id="fullName" name="fullName" required>

                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>

                <label for="address">Address:</label>
                <input type="text" id="address" name="address" required>

                <label for="apartmentNumber">Apartment Number (Optional):</label>
                <input type="text" id="apartmentNumber" name="apartmentNumber">

                <label for="postalCode">Postal Code:</label>
                <input type="text" id="postalCode" name="postalCode" required>

                <label for="city">City:</label>
                <input type="text" id="city" name="city" required>
            </fieldset>

            <input type="submit" value="Submit">
        `;

        formContainer.addEventListener('change', function (event) {
            const quantity = formContainer.querySelector('#quantity').value;
            const size = formContainer.querySelector('#size') ? formContainer.querySelector('#size').value : true;
            const taste = formContainer.querySelector('#taste') ? formContainer.querySelector('#taste').value : true;

            const customerInfoSection = formContainer.querySelector('#customerInfo');

            if (quantity && size && taste) {
                customerInfoSection.classList.remove('hidden');
                customerInfoSection.classList.add('visible');
            } else {
                customerInfoSection.classList.add('hidden');
                customerInfoSection.classList.remove('visible');
            }
        });

        formContainer.addEventListener('submit', function (event) {
            event.preventDefault();

            const fullName = formContainer.querySelector('#fullName').value;
            const email = formContainer.querySelector('#email').value;
            const address = formContainer.querySelector('#address').value;
            const postalCode = formContainer.querySelector('#postalCode').value;
            const city = formContainer.querySelector('#city').value;
            const apartmentNumber = formContainer.querySelector('#apartmentNumber').value || null;

            // Build the payload with conditionally included fields
            const payload = {
                orderQuantity: formContainer.querySelector('#quantity').value,
                customerFullName: fullName,
                customerEmail: email,
                customerAddress: address,
                customerPostalCode: postalCode,
                customerCity: city,
                customerApartmentNumber: apartmentNumber,
            };

            if (formContainer.querySelector('#size')) {
                payload.orderSize = formContainer.querySelector('#size').value;
            }

            if (formContainer.querySelector('#taste')) {
                payload.orderTaste = formContainer.querySelector('#taste').value;
            }

            // Sending each form field as a separate key-value pair in the payload
            window.voiceflow.chat.interact({
                type: 'complete',
                payload: payload,
            });
        });

        element.appendChild(formContainer);
    },
};