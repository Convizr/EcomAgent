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