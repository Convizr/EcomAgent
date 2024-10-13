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
            margin: 0 0 5px 0;
            font-size: 15px;
            color: #333;
          }
          .quantity-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 10px 0 15px 0; /* Margin top aangepast */
            width: 90%; /* Breedte aangepast naar 90% */
            border: 1px solid #ccc; /* Border toegevoegd aan container */
            border-radius: 5px;
            background-color: #fff;
            padding: 2px 0; /* Padding aangepast naar 2px 0 */
          }
          .quantity-btn {
            border: none; /* Geen rand */
            background-color: #fff; /* Witte achtergrond */
            padding: 4px 9px; /* Padding aangepast */
            cursor: pointer;
            font-size: 18px;
            width: 30px;
            text-align: center;
            transition: background-color 0.2s ease;
            color: #333;
          }
          .quantity-btn:hover {
            background-color: #f9f9f9; /* Geen grijze kleur bij hover */
          }
          .quantity-input {
            width: 40px;
            color: #333;
            text-align: center;
            font-size: 15px;
            border: none;
            margin: 0;
            background-color: #fff; /* Witte achtergrond */
            appearance: none; /* Pijltjes weghalen */
            -moz-appearance: textfield; /* Voor Firefox */
            font-family: Arial, sans-serif;
          }
          .quantity-input::-webkit-outer-spin-button,
          .quantity-input::-webkit-inner-spin-button {
            display: none; /* Pijltjes in Chrome verwijderen */
          }
          input[readonly] {
            color: #333;
            cursor: not-allowed;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 80%; /* Breedte aangepast naar 80% */
            padding: 8px;
            font-size: 15px; /* Consistente lettergrootte */
            text-align: center; /* Tekst gecentreerd */
            font-family: Arial, sans-serif; /* Consistente font-family */
          }
          fieldset {
            border: none;
            padding: 10px;
            padding-bottom: 0; /* Margin bottom verwijderd */
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            background-color: #ffffff;
            font-size: 17px;
          }
          legend {
            font-size: 17px;
            font-weight: bold;
            color: #333;
          }
          .form-group {
            margin-bottom: 15px;
          }
          input[type="submit"] {
            background-color: #c1b5a0;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s, transform 0.2s;
            width: 80%;
            position: relative;
            margin-top: 10px;
            left: 50%;
            transform: translateX(-50%);
          }
          input[type="submit"]:hover {
            background-color: #a39481;
            transform: translateX(-50%) scale(1.05);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          }
        </style>
  
        <fieldset id="orderDetails">
          <legend>Order Details</legend>
  
          <div class="form-group">
            <label for="quantity">Quantity:</label>
            <div class="quantity-container">
              <button type="button" class="quantity-btn" id="decreaseBtn">-</button>
              <input type="number" id="quantity" name="quantity" value="1" min="1" class="quantity-input">
              <button type="button" class="quantity-btn" id="increaseBtn">+</button>
            </div>
          </div>
  
          <div class="form-group">
            <label for="size">Selected Size:</label>
            <input type="text" id="size" name="size" value="${orderProductSize}" readonly>
          </div>
        </fieldset>
  
        <input type="submit" value="Submit">
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
          input, select {
            padding: 8px;
            margin: 5px 0 20px 0;
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
          }
          select {
            background-color: #fff;
            color: #333;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 8px;
            appearance: none;
            -moz-appearance: none;
            -webkit-appearance: none;
          }
          input[readonly] {
            background-color: #f3f3f3;
            color: #333;
            cursor: not-allowed;
            text-align: left;
            font-size: 14px;
            border: 1px solid #ddd;
          }
          input[type="submit"] {
            background-color: #c1b5a0;
            color: #fff;
            border: none;
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s, transform 0.2s;
            width: 80%;
            position: relative;
            margin-top: 10px;
            left: 50%;
            transform: translateX(-50%);
          }
          input[type="submit"]:hover {
            background-color: #a39481;
            transform: translateX(-50%) scale(1.05);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          }
        </style>
  
        <fieldset id="personalInfo">
          <legend>Personal Information:</legend>
          
          <label for="fullName">Full Name:</label>
          <input type="text" id="fullName" name="fullName" required>
  
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
  
          <label for="phoneNumber">Phone Number:</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="Optional">
  
          <label for="address">Address:</label>
          <input type="text" id="address" name="address" required>
  
          <label for="apartmentNumber">Apartment Number:</label>
          <input type="text" id="apartmentNumber" name="apartmentNumber" placeholder="Optional">
  
          <label for="postalCode">Postal Code:</label>
          <input type="text" id="postalCode" name="postalCode" required>
  
          <label for="city">City:</label>
          <input type="text" id="city" name="city" required>
  
          <label for="province">Province:</label>
          <select id="province" name="province" required>
            <option value="">Select a province</option>
            <option value="Eastern Cape">Eastern Cape</option>
            <option value="Free State">Free State</option>
            <option value="Gauteng">Gauteng</option>
            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
            <option value="Limpopo">Limpopo</option>
            <option value="Mpumalanga">Mpumalanga</option>
            <option value="North West">North West</option>
            <option value="Northern Cape">Northern Cape</option>
            <option value="Western Cape">Western Cape</option>
          </select>
  
          <label for="country">Country:</label>
          <input type="text" id="country" name="country" value="South Africa" readonly>
        </fieldset>
  
        <input type="submit" value="Submit">
      `;
  
      formContainer.addEventListener('submit', function (event) {
        event.preventDefault();
  
        const fullName = formContainer.querySelector('#fullName').value;
        const email = formContainer.querySelector('#email').value;
        const phoneNumber = formContainer.querySelector('#phoneNumber').value || null;
        const address = formContainer.querySelector('#address').value;
        const apartmentNumber = formContainer.querySelector('#apartmentNumber').value || null;
        const postalCode = formContainer.querySelector('#postalCode').value;
        const city = formContainer.querySelector('#city').value;
        const province = formContainer.querySelector('#province').value;
        const country = formContainer.querySelector('#country').value;
  
        // Versturen van de payload
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: {
            customerFullName: fullName,
            customerEmail: email,
            customerPhoneNumber: phoneNumber,
            customerAddress: address,
            customerPostalCode: postalCode,
            customerCity: city,
            customerProvince: province,
            customerCountry: country,
            customerApartmentNumber: apartmentNumber,
          },
        });
      });
  
      element.appendChild(formContainer);
    },
  };