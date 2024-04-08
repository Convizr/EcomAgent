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
            </style>

            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" min="1" required><br>

            <label for="budget">Budget:</label>
            <input type="text" id="budget" name="budget" required><br>

            <label for="gender">Gender:</label>
            <select id="gender" name="gender" required>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="both">Both</option>
            </select><br>

            <label for="deadline">Deadline:</label>
            <input type="date" id="deadline" name="deadline" min="${today}" required><br>

            <input type="submit" value="Submit" class="submit">
        `;

        formContainer.addEventListener('submit', function (event) {
            event.preventDefault();
        
            const quantity = formContainer.querySelector('#quantity').value;
            const budget = formContainer.querySelector('#budget').value;
            const gender = formContainer.querySelector('#gender').value;
            const deadline = formContainer.querySelector('#deadline').value;
        
            // Sending each form field as a separate key-value pair in the payload
            window.voiceflow.chat.interact({
                type: 'complete',
                payload: {
                    orderQuantity: quantity,
                    orderBudget: budget,
                    orderGender: gender,
                    orderDeadline: deadline
                },
            });
        });

        element.appendChild(formContainer);
    },
}

export const GofileUploadExtension = {
    name: 'GofileUpload',
    type: 'response',
    match: ({ trace }) => trace.type === 'ext_gofileUpload' || trace.payload.name === 'ext_gofileUpload',
    render: async ({ trace, element }) => {
        // Assuming the payload has been corrected to include quotes around the API key
        gofileApiKey = trace.payload;
  
      if (!gofileApiKey) {
        console.error('Gofile API key is not provided.');
        return;
      }
  
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
              'Authorization': `Bearer ${gofileApiKey}`
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
                  'Authorization': `Bearer ${gofileApiKey}`
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