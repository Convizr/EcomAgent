export const DatePickerExtension = {
    name: 'DatePicker',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
    render: ({ trace, element }) => {
      // Extract the string representation of the dates object from the trace
      let datesObjectString = trace.payload.checkAvailableDates;
      console.log('Dates object string:', datesObjectString);
  
      // Now we need to parse this string to an actual object
      // The string is not valid JSON, so we can't use JSON.parse directly.
      // Instead, we'll manually transform it to a valid JSON string
      const jsonString = datesObjectString.replace(/(\w+:)|(\w+ :)/g, function(matchedStr) {
        return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
      });
      console.log('JSON string:', jsonString);
  
      let availableDates;
      try {
        const datesObject = JSON.parse(jsonString);
        availableDates = datesObject.checkAvailableDates.split(',');
      } catch (error) {
        console.error('Parsing error:', error);
        availableDates = []; // Fallback to an empty array if parsing fails
      }
  
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
          .date-picker {
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
            font-size: 16px;
            cursor: pointer;
          }
        </style>
        <div class="date-picker-container">
          <select id="datePicker" name="datePicker" class="date-picker">
            ${availableDates.map(date => `<option value="${date.trim()}">${date.trim()}</option>`).join('')}
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
  