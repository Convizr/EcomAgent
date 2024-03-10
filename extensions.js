export const FileUploadExtension = {
  name: 'FileUpload',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_fileUpload' || trace.payload.name === 'ext_fileUpload',
  render: ({ trace, element }) => {
    const fileUploadContainer = document.createElement('div');
    fileUploadContainer.innerHTML = `
      <style>
        .my-file-upload {
          border: 2px dashed rgba(46, 110, 225, 0.3);
          padding: 20px;
          text-align: center;
          cursor: pointer;
        }
      </style>
      <div class='my-file-upload'>Drag and drop a file here or click to upload</div>
      <input type='file' style='display: none;'>
    `;

    const fileInput = fileUploadContainer.querySelector('input[type=file]');
    const fileUploadBox = fileUploadContainer.querySelector('.my-file-upload');
    const apiToken = 'EvEuWYBkF0alyFBFEpiH00K8fv8Uzy1b'; // Je Gofile API token

    fileUploadBox.addEventListener('click', function () {
      fileInput.click();
    });

    fileInput.addEventListener('change', async function () {
      const file = fileInput.files[0];
      console.log('File selected:', file);

      fileUploadContainer.innerHTML = `<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/upload/upload.gif" alt="Upload" width="50" height="50">`;

      var data = new FormData();
      data.append('file', file);

      try {
        // Upload de file naar Gofile
        const uploadResponse = await fetch('https://store1.gofile.io/uploadFile', {
          method: 'POST',
          body: data,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          if (uploadResult.status === "ok") {
            console.log('File uploaded:', uploadResult);

            // Genereer een directe link voor het geüploade bestand
            const directLinkResponse = await fetch(`https://api.gofile.io/contents/${uploadResult.data.fileId}/directLinks`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiToken}`,
              },
            });

            if (directLinkResponse.ok) {
              const directLinkResult = await directLinkResponse.json();
              console.log('Direct link:', directLinkResult.data.directLink);

              fileUploadContainer.innerHTML = '<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/check/check.gif" alt="Done" width="50" height="50">';
              window.voiceflow.chat.interact({
                type: 'complete',
                payload: { file: directLinkResult.data.directLink },
              });
            } else {
              throw new Error('Failed to generate direct link');
            }
          } else {
            throw new Error('Upload failed: ' + uploadResult.status);
          }
        } else {
          throw new Error('Upload failed: ' + uploadResponse.statusText);
        }
      } catch (error) {
        console.error(error);
        fileUploadContainer.innerHTML = '<div>Error during upload</div>';
      }
    });

    element.appendChild(fileUploadContainer);
  },
};
