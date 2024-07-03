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
        <div class='my-gofile-upload'>Drag and drop a file here or click to upload</div>
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

  export const TwoPartFormExtension = {
    name: 'TwoPartForm',
    type: 'response',
    match: ({ trace }) =>
        trace.type === 'two_part_form' || trace.payload.name === 'two_part_form',
    render: ({ trace, element }) => {
        console.log('Rendering TwoPartFormExtension');
        
        let payloadObj;
        if (typeof trace.payload === 'string') {
            payloadObj = JSON.parse(trace.payload);
        } else {
            payloadObj = trace.payload;
        }

        const { orderAvailableSizes, orderProductSize, orderProductColor } = payloadObj;
        console.log('Payload:', payloadObj);

        const formContainer = document.createElement('form');
        const today = new Date().toISOString().split('T')[0];

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
                    background-color: rgb(150, 182, 212);
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                input[type="submit"]:hover {
                    background-color: rgb(130, 162, 192);
                }
            </style>

            <fieldset id="orderDetails">
                <legend>Order Details:</legend>
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" name="quantity" min="1" required>

                <label for="size">Size:</label>
                <select id="size" name="size" required>
                    <option value="">Select a size</option>
                    ${orderAvailableSizes.split(',').map(size => 
                        `<option value="${size}" ${size.trim() === orderProductSize.trim() ? 'selected' : ''}>${size}</option>`).join('')}
                </select>

                <label for="color">Color:</label>
                <input type="text" id="color" name="color" value="${orderProductColor}" readonly>
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
            const size = formContainer.querySelector('#size').value;

            const customerInfoSection = formContainer.querySelector('#customerInfo');

            if (quantity && size) {
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

            // Sending each form field as a separate key-value pair in the payload
            window.voiceflow.chat.interact({
                type: 'complete',
                payload: {
                    orderQuantity: formContainer.querySelector('#quantity').value,
                    orderSize: formContainer.querySelector('#size').value,
                    customerFullName: fullName,
                    customerEmail: email,
                    customerAddress: address,
                    customerPostalCode: postalCode,
                    customerCity: city,
                    customerApartmentNumber: apartmentNumber
                },
            });
        });

        element.appendChild(formContainer);
    },
};


export const NoNameFormExtension = {
  name: 'NoNameForm',
  type: 'response',
  match: ({ trace }) =>
      trace.type === 'no_name_form' || trace.payload.name === 'no_name_form',
  render: ({ trace, element }) => {
      console.log('Rendering NoNameFormExtension');
      
      let payloadObj;
      if (typeof trace.payload === 'string') {
          payloadObj = JSON.parse(trace.payload);
      } else {
          payloadObj = trace.payload;
      }

      const { orderAvailableSizes, orderProductSize, orderProductColor } = payloadObj;
      console.log('Payload:', payloadObj);

      const formContainer = document.createElement('form');
      const today = new Date().toISOString().split('T')[0];

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
                  background-color: rgb(150, 182, 212);
                  color: white;
                  border: none;
                  padding: 10px;
                  border-radius: 4px;
                  cursor: pointer;
              }
              input[type="submit"]:hover {
                  background-color: rgb(130, 162, 192);
              }
          </style>

          <fieldset id="orderDetails">
              <legend>Order Details:</legend>
              <label for="quantity">Quantity:</label>
              <input type="number" id="quantity" name="quantity" min="1" required>

              <label for="size">Size:</label>
              <select id="size" name="size" required>
                  <option value="">Select a size</option>
                  ${orderAvailableSizes.split(',').map(size => 
                      `<option value="${size}" ${size.trim() === orderProductSize.trim() ? 'selected' : ''}>${size}</option>`).join('')}
              </select>

              <label for="color">Color:</label>
              <input type="text" id="color" name="color" value="${orderProductColor}" readonly>
          </fieldset>

          <input type="submit" value="Submit">
      `;

      formContainer.addEventListener('submit', function (event) {
          event.preventDefault();

          // Sending each form field as a separate key-value pair in the payload
          window.voiceflow.chat.interact({
              type: 'complete',
              payload: {
                  orderQuantity: formContainer.querySelector('#quantity').value,
                  orderSize: formContainer.querySelector('#size').value,
                  orderColor: formContainer.querySelector('#color').value
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
    trace.type === 'personal_info_form' || trace.payload.name === 'personal_info_form',
  render: ({ trace, element }) => {
    console.log('Rendering PersonalInfoFormExtension');

    const formContainer = document.createElement('form');

    formContainer.innerHTML = `
      <style>
        label {
          display: block;
          margin: 10px 0 5px;
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
          background-color: rgb(150, 182, 212);
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        input[type="submit"]:hover {
          background-color: rgb(130, 162, 192);
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
      const apartmentNumber = formContainer.querySelector('#apartmentNumber').value || null;

      // Sending each form field as a separate key-value pair in the payload
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: {
          customerFullName: fullName,
          customerEmail: email,
          customerAddress: address,
          customerPostalCode: postalCode,
          customerCity: city,
          customerApartmentNumber: apartmentNumber
        },
      });
    });

    element.appendChild(formContainer);
  },
};