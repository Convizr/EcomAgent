export const CustomFormExtension = {
  name: 'CustomForm',
  type: 'response',
  match: ({ trace }) =>
      trace.type === 'custom_form' || trace.payload.name === 'custom_form',
  render: ({ trace, element }) => {
      const formContainer = document.createElement('form');
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      formContainer.innerHTML = `
          <style>
              label {
                  font-size: 0.9em;
                  color: #333;
              }
              input[type="text"], input[type="email"], input[type="number"], input[type="date"], select, input[type="checkbox"] {
                  width: 80%;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  padding: 10px;
                  margin: 5px 0 20px 0;
              }
              .submit {
                  background-color: #4CAF50;
                  color: white;
                  padding: 14px 20px;
                  margin: 10px 0;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  width: 100%;
              }
              .submit:hover {
                  background-color: #45a049;
              }
              fieldset {
                border: 1px solid #ddd;
                padding: 10px;
                margin-top: 10px;
            }
        
            legend {
                padding: 0 5px;
                font-weight: bold;
                font-size: 0.9em;
            }
        
            .checkbox-group {
                display: flex;
                flex-direction: column;
            }
        
            .checkbox-group label {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
                cursor: pointer;
                position: relative;
                padding-left: 25px;
            }
        
            .checkbox-group input[type="checkbox"] {
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                position: absolute;
                left: 0;
                cursor: pointer;
            }
        
            .checkbox-group input[type="checkbox"]::before {
                content: '';
                display: block;
                position: absolute;
                left: 0;
                top: 50%;
                width: 16px;
                height: 16px;
                border: 1px solid #888;
                border-radius: 3px;
                transform: translateY(-50%);
            }
        
            .checkbox-group input[type="checkbox"]:checked::after {
                content: '';
                position: absolute;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 3px 3px 0;
                transform: translate(4px, -2px) rotate(45deg);
                left: 4px;
                top: 50%;
                background-color: #4CAF50;
            }
        
            /* Customize the look of checkboxes when they are checked */
            .checkbox-group input[type="checkbox"]:checked::before {
                background-color: #4CAF50;
                border-color: #4CAF50;
            }
        
            /* Adding some hover effects */
            .checkbox-group label:hover input[type="checkbox"]::before {
                border-color: #333;
            }
        
            .checkbox-group label input[type="checkbox"]:focus::before {
                outline: none;
                border-color: #2e6ee1;
            }
          </style>

          <label for="quantity">Quantity:</label>
          <input type="number" id="quantity" name="quantity" min="1" required><br>

          <label for="budget">Budget:</label>
          <input type="text" id="budget" name="budget" required><br>

          <label for="color">Color:</label>
          <input type="text" id="color" name="color" required><br>

          <fieldset>
            <legend>Target audience:</legend>
            <label><input type="checkbox" name="gender" value="male">Male</label><br>
            <label><input type="checkbox" name="gender" value="female">Female</label><br>
            <label><input type="checkbox" name="gender" value="family">Family</label><br>
            <label><input type="checkbox" name="gender" value="kids">Kids</label>
          </fieldset><br>

          <label for="deadline">Deadline:</label>
          <input type="date" id="deadline" name="deadline" min="${today}" required><br>

          <fieldset>
              <legend>Do you need wrapping?</legend>
              <label><input type="checkbox" name="wrappingOptions" value="Ribbon">Ribbon</label><br>
              <label><input type="checkbox" name="wrappingOptions" value="Tag">Tag</label><br>
              <label><input type="checkbox" name="wrappingOptions" value="Wrapping">Wrapping</label>
          </fieldset><br>

          <label for="delivery">Delivery:</label>
          <select id="delivery" name="delivery" required>
              <option value="one delivery to one location">One delivery to one location</option>
              <option value="multiple locations packed for each">Multiple locations packed for each</option>
          </select><br>

          <input type="submit" value="Submit" class="submit">
      `;

      formContainer.addEventListener('submit', function (event) {
          event.preventDefault();
      
          const quantity = formContainer.querySelector('#quantity').value;
          const budget = formContainer.querySelector('#budget').value;
          const color = formContainer.querySelector('#color').value;
          const gender = Array.from(formContainer.querySelectorAll('input[name="gender"]:checked')).map(el => el.value);
          const deadline = formContainer.querySelector('#deadline').value;
          const wrappingOptions = Array.from(formContainer.querySelectorAll('input[name="wrappingOptions"]:checked')).map(el => el.value);
          const delivery = formContainer.querySelector('#deadline').value;

          // Sending each form field as a separate key-value pair in the payload
          window.voiceflow.chat.interact({
              type: 'complete',
              payload: {
                  orderQuantity: quantity,
                  orderBudget: budget,
                  orderColor: color,
                  orderTargetAudience: gender.join(', '),
                  orderDeadline: deadline,
                  orderWrappingOptions: wrappingOptions.join(', '), // Join wrapping options into a single string
                  orderDelivery: delivery
              },
          });
      });

      element.appendChild(formContainer);
  },
}

export const CustomInternalFormExtension = {
  name: 'CustomInternalForm',
  type: 'response',
  match: ({ trace }) =>
      trace.type === 'custom_internal_form' || trace.payload.name === 'custom_internal_form',
  render: ({ trace, element }) => {
      const formContainer = document.createElement('form');
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      formContainer.innerHTML = `
          <style>
              label {
                  font-size: 0.9em;
                  color: #333;
              }
              input[type="text"], input[type="email"], input[type="number"], input[type="date"], select {
                  width: 80%;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  padding: 10px;
                  margin: 5px 0 20px 0;
              }
              .submit {
                  background-color: #4CAF50;
                  color: white;
                  padding: 14px 20px;
                  margin: 10px 0;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  width: 100%;
              }
              .submit:hover {
                  background-color: #45a049;
              }
              fieldset {
                border: 1px solid #ddd;
                padding: 10px;
                margin-top: 10px;
            }
        
            legend {
                padding: 0 5px;
                font-weight: bold;
                font-size: 0.9em;
            }
        
            .checkbox-group {
                display: flex;
                flex-direction: column;
            }
        
            .checkbox-group label {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
                cursor: pointer;
                position: relative;
                padding-left: 25px;
            }
        
            .checkbox-group input[type="checkbox"] {
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                position: absolute;
                left: 0;
                cursor: pointer;
            }
        
            .checkbox-group input[type="checkbox"]::before {
                content: '';
                display: block;
                position: absolute;
                left: 0;
                top: 50%;
                width: 16px;
                height: 16px;
                border: 1px solid #888;
                border-radius: 3px;
                transform: translateY(-50%);
            }
        
            .checkbox-group input[type="checkbox"]:checked::after {
                content: '';
                position: absolute;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 3px 3px 0;
                transform: translate(4px, -2px) rotate(45deg);
                left: 4px;
                top: 50%;
                background-color: #4CAF50;
            }
        
            /* Customize the look of checkboxes when they are checked */
            .checkbox-group input[type="checkbox"]:checked::before {
                background-color: #4CAF50;
                border-color: #4CAF50;
            }
        
            /* Adding some hover effects */
            .checkbox-group label:hover input[type="checkbox"]::before {
                border-color: #333;
            }
        
            .checkbox-group label input[type="checkbox"]:focus::before {
                outline: none;
                border-color: #2e6ee1;
            }
          </style>

          <label for="company">Company:</label>
          <input type="text" id="company" name="company" required><br>

          <label for="clientName">Client Name:</label>
          <input type="text" id="clientName" name="clientName" required><br>

          <label for="clientEmail">Client Email:</label>
          <input type="text" id="clientEmail" name="clientEmail" required><br>

          <label for="quantity">Quantity:</label>
          <input type="number" id="quantity" name="quantity" min="1" required><br>

          <label for="budget">Budget:</label>
          <input type="text" id="budget" name="budget" required><br>

          <label for="color">Color:</label>
          <input type="text" id="color" name="color" required><br>

          <fieldset>
            <legend>Target audience:</legend>
            <label><input type="checkbox" name="gender" value="male">Male</label><br>
            <label><input type="checkbox" name="gender" value="female">Female</label><br>
            <label><input type="checkbox" name="gender" value="family">Family</label><br>
            <label><input type="checkbox" name="gender" value="kids">Kids</label>
          </fieldset><br>

          <label for="deadline">Deadline:</label>
          <input type="date" id="deadline" name="deadline" min="${today}" required><br>

          <fieldset>
              <legend>Do you need wrapping?</legend>
              <label><input type="checkbox" name="wrappingOptions" value="Ribbon">Ribbon</label><br>
              <label><input type="checkbox" name="wrappingOptions" value="Tag">Tag</label><br>
              <label><input type="checkbox" name="wrappingOptions" value="Wrapping">Wrapping</label>
          </fieldset><br>

          <label for="delivery">Delivery:</label>
          <select id="delivery" name="delivery" required>
              <option value="one delivery to one location">One delivery to one location</option>
              <option value="multiple locations packed for each">Multiple locations packed for each</option>
          </select><br>

          <input type="submit" value="Submit" class="submit">
      `;

      formContainer.addEventListener('submit', function (event) {
          event.preventDefault();
      
          const company = formContainer.querySelector('#company').value;
          const clientName = formContainer.querySelector('#clientName').value;
          const clientEmail = formContainer.querySelector('#clientEmail').value;
          const quantity = formContainer.querySelector('#quantity').value;
          const budget = formContainer.querySelector('#budget').value;
          const color = formContainer.querySelector('#color').value;
          const gender = Array.from(formContainer.querySelectorAll('input[name="gender"]:checked')).map(el => el.value);
          const deadline = formContainer.querySelector('#deadline').value;
          const wrappingOptions = Array.from(formContainer.querySelectorAll('input[name="wrappingOptions"]:checked')).map(el => el.value);
          const delivery = formContainer.querySelector('#deadline').value;
      
          // Sending each form field as a separate key-value pair in the payload
          window.voiceflow.chat.interact({
              type: 'complete',
              payload: {
                  orderCompany: company,
                  orderClientName: clientName,
                  orderClientEmail: clientEmail,
                  orderQuantity: quantity,
                  orderBudget: budget,
                  orderColor: color,
                  orderTargetAudience: gender.join(', '),
                  orderDeadline: deadline,
                  orderWrappingOptions: wrappingOptions.join(', '), // Join wrapping options into a single string
                  orderDelivery: delivery
              },
          });
      });

      element.appendChild(formContainer);
  },
};

export const GofileUploadExtension = {
    name: 'GofileUpload',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_gofileUpload' || trace.payload.name === 'ext_gofileUpload',
    render: async ({ trace, element }) => {
      const gofileUploadContainer = document.createElement('div');
      gofileUploadContainer.innerHTML = `
        <style>
          .my-gofile-upload {
            border: 2px dashed rgba(46, 110, 225, 0.3);
            padding: 20px;
            text-align: center;
            cursor: pointer;
          }
        </style>
        <div class='my-gofile-upload'>Click to upload your design</div>
        <input type='file' style='display: none;'>
      `;
  
      const fileInput = gofileUploadContainer.querySelector('input[type=file]');
      const gofileUploadBox = gofileUploadContainer.querySelector('.my-gofile-upload');
  
      gofileUploadBox.addEventListener('click', () => {
        fileInput.click();
      });
  
      fileInput.addEventListener('change', async () => {
        const file = fileInput.files[0];
        console.log('File selected:', file);
  
        let uploadServer;
        try {
          const serverResponse = await fetch('https://api.gofile.io/servers', {
            method: 'GET',
          });
          const serverData = await serverResponse.json();
          if (serverData.status === 'ok' && serverData.data.servers.length > 0) {
            const euServer = serverData.data.servers.find(server => server.zone === 'eu');
            uploadServer = euServer ? euServer.name : serverData.data.servers[0].name;
          } else {
            throw new Error('No available servers');
          }
        } catch (error) {
          console.error('Error fetching Gofile server:', error);
          return;
        }
  
        const formData = new FormData();
        formData.append('file', file);
  
        try {
          const uploadResponse = await fetch(`https://${uploadServer}.gofile.io/contents/uploadFile`, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer EvEuWYBkF0alyFBFEpiH00K8fv8Uzy1b'
            },
            body: formData,
          });
          const uploadData = await uploadResponse.json();
          if (uploadData.status === 'ok') {
            console.log('File uploaded:', uploadData.data);
  
            try {
              const directLinkResponse = await fetch(`https://api.gofile.io/contents/${uploadData.data.fileId}/directLinks`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer EvEuWYBkF0alyFBFEpiH00K8fv8Uzy1b`
                },
              });
              const directLinkData = await directLinkResponse.json();
              if (directLinkData.status === 'ok') {
                console.log('Direct link:', directLinkData.data.directLink);
                
                gofileUploadContainer.innerHTML = `<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/check/check.gif" alt="Done" width="50" height="50">`;

                window.voiceflow.chat.interact({
                  type: 'complete',
                  payload: {
                    file: directLinkData.data.directLink
                  },
                });
              } else {
                throw new Error('Direct link creation failed');
              }
            } catch (error) {
              console.error('Error creating direct link:', error);
            }
          } else {
            throw new Error('Upload failed');
          }
        } catch (error) {
          console.error('Error uploading file to Gofile:', error);
        }
      });
  
      element.appendChild(gofileUploadContainer);
    },
  };