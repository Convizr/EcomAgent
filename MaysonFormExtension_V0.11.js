export const ConfirmFormExtension = {
    name: 'ConfirmForm',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'confirm_form' || (trace.payload && trace.payload.name === 'confirm_form'),
    render: ({ trace, element }) => {
      console.log('Rendering ConfirmFormExtension');
  
      const formContainer = document.createElement('form');
  
      formContainer.innerHTML = `
        <style>
          label {
            display: block;
            margin: 10px 0 5px;
            font-size: 14px;
            font-weight: bold;
          }
          select, .quantity-input {
            width: 100%;
            padding: 8px;
            margin: 5px 0 20px 0;
            display: inline-block;
            border: 1px solid #ccc;
            box-sizing: border-box;
          }
          input[type="submit"] {
            background-color: #000;
            color: #fff;
            border: none;
            padding: 10px 30px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s, transform 0.2s;
            width: 70%;
            display: block;
            margin: 10px auto 0 auto;
            border-radius: 0;
          }
          input[type="submit"]:hover {
            background-color: #f9b2b2;
            color: #000;
            transform: scale(1.05);
          }
          .quantity-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 10px 0 15px 0;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 0;
            background-color: #fff;
            padding: 2px 0;
          }
          .quantity-btn {
            border: none;
            background-color: #fff;
            padding: 4px 9px;
            cursor: pointer;
            font-size: 18px;
            width: 30px;
            text-align: center;
            color: #333;
          }
          .quantity-input {
            width: 40px;
            color: #333;
            text-align: center;
            font-size: 15px;
            border: none;
            margin: 0;
            background-color: #fff;
            appearance: none;
            -moz-appearance: textfield;
          }
        </style>
  
        <fieldset id="confirmForm"">
          <legend>Confirm Order:</legend>
          <label for="quantity">Aantal:</label>
          <div class="quantity-container">
            <button type="button" class="quantity-btn" id="decreaseBtn">-</button>
            <input type="number" id="quantity" name="quantity" value="1" min="1" class="quantity-input">
            <button type="button" class="quantity-btn" id="increaseBtn">+</button>
          </div>
        </fieldset>
  
        <input type="submit" value="Bevestigen">
      `;
  
      // Add event listeners for quantity control buttons
      const quantityInput = formContainer.querySelector('#quantity');
      const decreaseBtn = formContainer.querySelector('#decreaseBtn');
      const increaseBtn = formContainer.querySelector('#increaseBtn');
  
      decreaseBtn.addEventListener('click', () => {
        if (parseInt(quantityInput.value) > 1) {
          quantityInput.value = parseInt(quantityInput.value) - 1;
        }
      });
  
      increaseBtn.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
      });
  
      // Event listener for form submission
      formContainer.addEventListener('submit', function (event) {
        event.preventDefault();
        const quantity = quantityInput.value;
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: {
            selectedQuantity: quantity,
          },
        });
      });
  
      element.appendChild(formContainer);
    },
  };

  export const VariantSelectionFormWithDetails = {
    name: 'VariantSelectionFormWithDetails',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'variant_selection_form_with_details' || (trace.payload && trace.payload.name === 'variant_selection_form_with_details'),
    render: ({ trace, element }) => {
      console.log('Rendering VariantSelectionFormWithDetails');

      let payloadObj;
      if (typeof trace.payload === 'string') {
        payloadObj = JSON.parse(trace.payload);
      } else {
        payloadObj = trace.payload || {};
      }

      const { variantIDs = '', variantTitles = '', variantPrices = '' } = payloadObj;
      const idsArray = variantIDs.split(',');
      const titlesArray = variantTitles.split(',');
      const pricesArray = variantPrices.split(',').map(price => parseFloat(price.trim()));

      const formContainer = document.createElement('form');

      formContainer.innerHTML = `
        <style>
          label {
            display: block;
            margin: 10px 0 5px;
            font-size: 14px;
            font-weight: bold;
          }
          select, .quantity-input {
            width: 100%;
            padding: 8px;
            margin: 5px 0 20px 0;
            display: inline-block;
            border: 1px solid #ccc;
            box-sizing: border-box;
          }
          input[type="submit"] {
            background-color: #000;
            color: #fff;
            border: none;
            padding: 10px 30px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s, transform 0.2s;
            width: 70%;
            display: block;
            margin: 10px auto 0 auto;
            border-radius: 0;
          }
          input[type="submit"]:hover {
            background-color: #f9b2b2;
            color: #000;
            transform: scale(1.05);
          }
          .quantity-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 10px 0 15px 0;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 0;
            background-color: #fff;
            padding: 2px 0;
          }
          .quantity-btn {
            border: none;
            background-color: #fff;
            padding: 4px 9px;
            cursor: pointer;
            font-size: 18px;
            width: 30px;
            text-align: center;
            color: #333;
          }
          .quantity-input {
            width: 40px;
            color: #333;
            text-align: center;
            font-size: 15px;
            border: none;
            margin: 0;
            background-color: #fff;
            appearance: none;
            -moz-appearance: textfield;
          }
        </style>

        <fieldset id="variantSelectionForm">
          <legend>Selecteer Variant:</legend>

          <label for="variant">Variant:</label>
          <select id="variant" name="variant" required>
            ${titlesArray.map((title, index) => 
              `<option value="${index}">${title.trim()}</option>`
            ).join('')}
          </select>

          <div id="priceDisplay">Prijs: €${pricesArray[0].toFixed(2)}</div>

          <div class="quantity-container">
            <button type="button" class="quantity-btn" id="decreaseBtn">-</button>
            <input type="number" id="quantity" name="quantity" value="1" min="1" class="quantity-input">
            <button type="button" class="quantity-btn" id="increaseBtn">+</button>
          </div>
        </fieldset>

        <input type="submit" value="Bevestigen">
      `;

      const variantSelect = formContainer.querySelector('#variant');
      const priceDisplay = formContainer.querySelector('#priceDisplay');
      const quantityInput = formContainer.querySelector('#quantity');

      variantSelect.addEventListener('change', () => {
        const selectedIndex = variantSelect.value;
        const price = pricesArray[selectedIndex];
        priceDisplay.textContent = `Prijs: €${price.toFixed(2)}`;
      });

      const decreaseBtn = formContainer.querySelector('#decreaseBtn');
      const increaseBtn = formContainer.querySelector('#increaseBtn');

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

        const selectedIndex = formContainer.querySelector('#variant').value;
        const selectedTitle = titlesArray[selectedIndex].trim();
        const selectedID = idsArray[selectedIndex].trim();
        const selectedPrice = pricesArray[selectedIndex];
        const selectedQuantity = parseInt(quantityInput.value);

        window.voiceflow.chat.interact({
          type: 'complete',
          payload: {
            selectedTitle: selectedTitle,
            selectedVariantID: selectedID,
            selectedPrice: selectedPrice,
            selectedQuantity: selectedQuantity,
          },
        });
      });

      element.appendChild(formContainer);
    },
  };