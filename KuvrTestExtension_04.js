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
          .material input[type="radio"], .shape input[type="radio"] {
            display: none;
          }
          .material label, .shape label {
            display: inline-block;
            width: 80px;
            height: 80px;
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 5px;
            margin-right: 10px;
          }
          .material input[type="radio"]:checked + label, .shape input[type="radio"]:checked + label {
            border-color: #2e6ee1;
          }
          .material img, .shape img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
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
          .length input {
            width: calc(50% - 10px);
            margin-right: 10px;
          }
          .length label {
            display: block;
            margin-bottom: 5px;
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
          <input type="radio" id="shape_rectangle" name="shape" value="rectangle" required>
          <label for="shape_rectangle">
            <img src="https://cdn.shopify.com/s/files/1/0380/4171/4827/t/6/assets/dpo_custom_option_51083_rectangle.png?v=1609010368" alt="Rectangle">
          </label>
          <input type="radio" id="shape_trapezium" name="shape" value="trapezium" required>
          <label for="shape_trapezium">
            <img src="https://cdn.shopify.com/s/files/1/0380/4171/4827/t/6/assets/dpo_custom_option_76385_trapezium.png?v=1609010382" alt="Trapezium">
          </label>
          <input type="radio" id="shape_triangle" name="shape" value="triangle" required>
          <label for="shape_triangle">
            <img src="https://cdn.shopify.com/s/files/1/0380/4171/4827/t/6/assets/dpo_custom_option_29182_triangle.png?v=1609010396" alt="Triangle">
          </label>
          <input type="radio" id="shape_circle" name="shape" value="circle" required>
          <label for="shape_circle">
            <img src="https://cdn.shopify.com/s/files/1/0380/4171/4827/t/6/assets/dpo_custom_option_66174_circle.png?v=1609010402" alt="Circle">
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
          <label for="lengthA">Length A (finished size) *</label>
          <input type="text" id="lengthA" name="lengthA" placeholder="e.g. 5.23" required>
          <label for="lengthB">Length B (finished size) *</label>
          <input type="text" id="lengthB" name="lengthB" placeholder="e.g. 5.23" required>
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
  