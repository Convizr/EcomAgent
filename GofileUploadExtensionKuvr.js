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