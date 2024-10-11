export const NoNameFormExtension = {
    name: 'NoNameForm',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'no_name_form' || (trace.payload && trace.payload.name === 'no_name_form'),
    render: ({ trace, element }) => {
      console.log('Rendering NoNameFormExtension');
  
      let payloadObj;
      if (typeof trace.payload === 'string') {
        payloadObj = JSON.parse(trace.payload);
      } else {
        payloadObj = trace.payload || {};
      }
  
      const { orderProductSize = '' } = payloadObj;
      console.log('Payload:', payloadObj);
  
      const formContainer = document.createElement('form');
  
      formContainer.innerHTML = `
        <style>
          label {
            display: block;
            margin: 10px 0 5px;
            font-size: 14px;
            font-weight: bold;
          }
          .quantity-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 5px 0 20px 0;
          }
          .quantity-btn {
            border: 1px solid #ccc;
            padding: 8px;
            cursor: pointer;
            font-size: 18px;
            background-color: #f9f9f9;
            width: 30px;
            text-align: center;
          }
          .quantity-btn:hover {
            background-color: #ddd;
          }
          .quantity-input {
            width: 50px;
            text-align: center;
            font-size: 16px;
            border: 1px solid #ccc;
            margin: 0 5px;
          }
          input[readonly] {
            background-color: #f9f9f9;
            color: #555;
            cursor: not-allowed;
          }
          .hidden {
            display: none;
          }
          .visible {
            display: block;
          }
          input[type="submit"] {
            background-color: #c1b5a0;
            color: #000;
            border: none;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            width: 90%;
            transition: transform 0.2s;
          }
          input[type="submit"]:hover {
            transform: scale(1.05);
            background-color: #a39481;
          }
          fieldset {
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 5px;
          }
          legend {
            font-size: 16px;
            font-weight: bold;
          }
        </style>
  
        <fieldset id="orderDetails">
          <legend>Order Details:</legend>
  
          <label for="quantity">Quantity:</label>
          <div class="quantity-container">
            <div class="quantity-btn" id="decreaseBtn">-</div>
            <input type="number" id="quantity" name="quantity" value="1" min="1" class="quantity-input">
            <div class="quantity-btn" id="increaseBtn">+</div>
          </div>
  
          <label for="size">Selected Size:</label>
          <input type="text" id="size" name="size" value="${orderProductSize}" readonly>
        </fieldset>
  
        <input type="submit" value="Check out">
      `;
  
      // Functies voor de hoeveelheidselector
      const decreaseBtn = formContainer.querySelector('#decreaseBtn');
      const increaseBtn = formContainer.querySelector('#increaseBtn');
      const quantityInput = formContainer.querySelector('#quantity');
  
      decreaseBtn.addEventListener('click', () => {
        if (parseInt(quantityInput.value) > 1) {
          quantityInput.value = parseInt(quantityInput.value) - 1;
        }
      });
  
      increaseBtn.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
      });
  
      formContainer.addEventListener('submit', function (event) {
        event.preventDefault();
  
        // Versturen van de payload met het aantal en geselecteerde maat
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: {
            orderQuantity: formContainer.querySelector('#quantity').value,
            orderSize: formContainer.querySelector('#size').value, // Read-only size value
          },
        });
      });
  
      element.appendChild(formContainer);
    },
  };
  
  export const PersonalInfoFormExtension = {
    name: 'PersonalInfoForm',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'personal_info_form' || (trace.payload && trace.payload.name === 'personal_info_form'),
    render: ({ trace, element }) => {
      console.log('Rendering PersonalInfoFormExtension');
  
      const formContainer = document.createElement('form');
  
      formContainer.innerHTML = `
        <style>
          label {
            display: block;
            margin: 10px 0 5px;
            font-size: 14px;
            font-weight: bold;
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
            background-color: #c1b5a0;
            color: #000;
            border: none;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            width: 90%;
            transition: transform 0.2s;
          }
          input[type="submit"]:hover {
            transform: scale(1.05);
            background-color: #a39481;
          }
        </style>
  
        <fieldset id="personalInfo">
          <legend>Personal Information:</legend>
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
  
          <label for="country">Country:</label>
          <input type="text" id="country" name="country" required>
        </fieldset>
  
        <input type="submit" value="Submit">
      `;
  
      formContainer.addEventListener('submit', function (event) {
        event.preventDefault();
  
        const fullName = formContainer.querySelector('#fullName').value;
        const email = formContainer.querySelector('#email').value;
        const address = formContainer.querySelector('#address').value;
        const postalCode = formContainer.querySelector('#postalCode').value;
        const city = formContainer.querySelector('#city').value;
        const country = formContainer.querySelector('#country').value;
        const apartmentNumber = formContainer.querySelector('#apartmentNumber').value || null;
  
        // Versturen van de payload
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: {
            customerFullName: fullName,
            customerEmail: email,
            customerAddress: address,
            customerPostalCode: postalCode,
            customerCity: city,
            customerCountry: country,
            customerApartmentNumber: apartmentNumber,
          },
        });
      });
  
      element.appendChild(formContainer);
    },
  };
  