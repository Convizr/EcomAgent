export const DatePickerExtension = {
    name: 'DatePicker',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
    render: ({ trace, element }) => {
      // Let's parse the payload to get it as an object
      let payloadObject;
      try {
        payloadObject = JSON.parse(trace.payload);
      } catch (error) {
        console.error('Failed to parse payload:', trace.payload);
        // Handle error, perhaps set a default value or show an error message
        payloadObject = { checkAvailableDates: '' }; // default or error value
      }
  
      // Now we extract checkAvailableDates from the parsed object
      const checkAvailableDatesString = payloadObject.checkAvailableDates || '';
      console.log('Available dates string:', checkAvailableDatesString);

      // Split the string into an array of dates
      const availableDates = checkAvailableDatesString.split(',').map(date => date.trim());

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
