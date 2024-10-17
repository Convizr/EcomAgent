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
          color: #fff;
          border: none;
          padding: 10px 30px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s, transform 0.2s;
          width: 100%;
        }
        input[type="submit"]:hover {
          background-color: #a39481;
          transform: scale(1.05);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }
      </style>

      <fieldset id="confirmForm">
        <legend>Confirm Order:</legend>
        <label for="quantity">Aantal:</label>
        <input type="number" id="quantity" name="quantity" value="1" min="1" required>
      </fieldset>

      <input type="submit" value="Bevestigen">
    `;

    // Event listener voor het versturen van het formulier
    formContainer.addEventListener('submit', function (event) {
      event.preventDefault();

      const quantity = formContainer.querySelector('#quantity').value;

      // Versturen van de payload met het ingevulde aantal
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: {
          orderQuantity: quantity,
        },
      });
    });

    element.appendChild(formContainer);
  },
};

export const VariantSelectionFormExtension = {
    name: 'VariantSelectionForm',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'variant_selection_form' || (trace.payload && trace.payload.name === 'variant_selection_form'),
    render: ({ trace, element }) => {
      console.log('Rendering VariantSelectionFormExtension');
  
      // Parse de payload om de benodigde gegevens op te halen
      let payloadObj;
      if (typeof trace.payload === 'string') {
        payloadObj = JSON.parse(trace.payload);
      } else {
        payloadObj = trace.payload || {};
      }
  
      const { variantTitles = '' } = payloadObj;
      console.log('Payload:', payloadObj);
  
      // Maak het formulier
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
            color: #fff;
            border: none;
            padding: 10px 30px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s, transform 0.2s;
            width: 100%;
          }
          input[type="submit"]:hover {
            background-color: #a39481;
            transform: scale(1.05);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          }
        </style>
  
        <fieldset id="variantSelectionForm">
          <legend>Selecteer Variant:</legend>
  
          <label for="quantity">Aantal:</label>
          <input type="number" id="quantity" name="quantity" value="1" min="1" required>
  
          <label for="variant">Variant Title:</label>
          <select id="variant" name="variant" required>
            ${variantTitles.split(',').map(variant => 
              `<option value="${variant.trim()}">${variant.trim()}</option>`).join('')}
          </select>
        </fieldset>
  
        <input type="submit" value="Bevestigen">
      `;
  
      // Event listener voor het versturen van het formulier
      formContainer.addEventListener('submit', function (event) {
        event.preventDefault();
  
        const quantity = formContainer.querySelector('#quantity').value;
        const selectedVariant = formContainer.querySelector('#variant').value;
  
        // Versturen van de payload met het aantal en de geselecteerde variant
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: {
            orderQuantity: quantity,
            selectedVariant: selectedVariant,
          },
        });
      });
  
      element.appendChild(formContainer);
    },
  };