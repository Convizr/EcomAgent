export const DatePickerExtension = {
    name: 'DatePicker',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
    render: ({ trace, element }) => {
      let availableDates = [];
      try {
        let payloadObj;
        if (typeof trace.payload === 'string') {
          console.log('Attempting to parse payload as string:', trace.payload);
          payloadObj = JSON.parse(trace.payload);
        } else {
          payloadObj = trace.payload; // Assume it's already an object
        }

        // Log the content that will be parsed to ensure it's what you expect
        console.log('Payload object:', payloadObj);
        console.log('Attempting to parse checkAvailableDates:', payloadObj.checkAvailableDates);

        availableDates = JSON.parse(payloadObj.checkAvailableDates);
        console.log('Parsed available dates:', availableDates);
      } catch (error) {
        console.error('Error parsing dates:', error);
      }

    // Dynamically create the dropdown options based on the available dates
    const datePickerContainer = document.createElement('div');
    datePickerContainer.innerHTML = `
      <style>
        .date-picker-container {
          padding: 20px;
          background: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          max-width: fit-content;
        }
        select.date-picker {
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
          font-size: 16px;
          cursor: pointer;
        }
      </style>
      <div class="date-picker-container">
        <select id="datePicker" name="datePicker" class="date-picker">
        ${availableDates.map(date => `<option value="${date}">${date}</option>`).join('')}
        </select>
      </div>
    `;

    const select = datePickerContainer.querySelector('#datePicker');

    select.addEventListener('change', function (event) {
      console.log('Date selected:', event.target.value);
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { date: event.target.value },
      });
    });

    element.appendChild(datePickerContainer);
    console.log('DatePicker rendered with selectable dates from Voiceflow runtime');
  },
};
