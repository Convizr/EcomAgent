export const InstantQuoteExtension = {
    name: 'InstantQuote',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_instant_quote' || trace.payload.name === 'ext_instant_quote',
    render: ({ trace, element }) => {
      const formContainer = document.createElement('form');
      
      formContainer.innerHTML = `
        <style>
          .material, .shape, .unit, .length {
            margin-bottom: 20px;
          }
          .material label {
            display: inline-block;
            width: 80px;
            height: 80px;
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 5px;
          }
          .material input[type="radio"]:checked + label {
            border-color: #2e6ee1;
          }
          .material img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }
          .shape label {
            display: inline-block;
            width: 50px;
            height: 50px;
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 5px;
            text-align: center;
            line-height: 50px;
          }
          .shape input[type="radio"]:checked + label {
            border-color: #2e6ee1;
          }
          .square {
            background-color: #f0f0f0;
          }
          .triangle {
            width: 0;
            height: 0;
            border-left: 25px solid transparent;
            border-right: 25px solid transparent;
            border-bottom: 50px solid #f0f0f0;
          }
          .circle {
            background-color: #f0f0f0;
            border-radius: 50%;
          }
          .submit {
            background: linear-gradient(to right, #2e6ee1, #2e7ff1);
            border: none;
            color: white;
            padding: 10px;
            border-radius: 5px;
            width: 100%;
            cursor: pointer;
          }
        </style>
  
        <div class="material">
          <label>Material colour *</label><br>
          <input type="radio" id="material_ultra" name="material" value="ultra" required>
          <label for="material_ultra">
            <img src="https://cdn.shopify.com/s/files/1/0380/4171/4827/t/6/assets/dpo_custom_option_53337_ultra50-test.jpg?v=1612125046" alt="Ultra 50">
          </label>
          <input type="radio" id="material_flexi" name="material" value="flexi" required>
          <label for="material_flexi">
            <img src="https://cdn.shopify.com/s/files/1/0380/4171/4827/t/6/assets/dpo_custom_option_66840_flexi30-test.jpg?v=1612125052" alt="Flexi 30">
          </label>
        </div>
  
        <div class="shape">
          <label>Shape *</label><br>
          <input type="radio" id="shape_square" name="shape" value="square" required>
          <label for="shape_square">
            <div class="square">Square</div>
          </label>
          <input type="radio" id="shape_triangle" name="shape" value="triangle" required>
          <label for="shape_triangle">
            <div class="triangle"></div>
          </label>
          <input type="radio" id="shape_circle" name="shape" value="circle" required>
          <label for="shape_circle">
            <div class="circle">Circle</div>
          </label>
        </div>
  
        <div class="unit">
          <label>Unit *</label><br>
          <input type="radio" id="unit_cm" name="unit" value="cm" required>
          <label for="unit_cm">cm</label>
          <input type="radio" id="unit_m" name="unit" value="m" required>
          <label for="unit_m">m</label>
          <input type="radio" id="unit_ft" name="unit" value="ft" required>
          <label for="unit_ft">ft</label>
        </div>
  
        <div class="length">
          <label>Length A (finished size) *</label>
          <input type="text" name="lengthA" placeholder="e.g. 5.23" required>
          <label>Length B (finished size) *</label>
          <input type="text" name="lengthB" placeholder="e.g. 5.23" required>
        </div>
  
        <input type="submit" class="submit" value="Submit">
      `;
  
      formContainer.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const material = formContainer.querySelector('input[name="material"]:checked').value;
        const shape = formContainer.querySelector('input[name="shape"]:checked').value;
        const unit = formContainer.querySelector('input[name="unit"]:checked').value;
        const lengthA = formContainer.querySelector('input[name="lengthA"]').value;
        const lengthB = formContainer.querySelector('input[name="lengthB"]').value;
        
        console.log('Material:', material);
        console.log('Shape:', shape);
        console.log('Unit:', unit);
        console.log('Length A:', lengthA);
        console.log('Length B:', lengthB);
  
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: { material, shape, unit, lengthA, lengthB },
        });
      });
  
      element.appendChild(formContainer);
    },
  };  