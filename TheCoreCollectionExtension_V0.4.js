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
            color: #333;
          }
          .quantity-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 10px 0 20px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          .quantity-btn {
            border: none;
            background-color: #f1f1f1;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 18px;
            transition: background-color 0.2s ease;
            color: #333;
          }
          .quantity-btn:hover {
            background-color: #ddd;
          }
          .quantity-input {
            width: 40px;
            text-align: center;
            font-size: 16px;
            border: none;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            margin: 0;
            background-color: #fafafa;
          }
          input[readonly] {
            background-color: #fafafa;
            color: #555;
            cursor: not-allowed;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          fieldset {
            border: none;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            background-color: #ffffff;
          }
          legend {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
          }
          .form-group {
            margin-bottom: 15px;
          }
          input[type="submit"] {
            background-color: #c1b5a0;
            color: #fff;
            border: none;
            padding: 12px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s, transform 0.2s;
          }
          input[type="submit"]:hover {
            background-color: #a39481;
            transform: scale(1.02);
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
  