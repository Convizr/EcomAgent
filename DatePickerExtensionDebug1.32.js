export const DatePickerExtension = {
    name: 'DatePicker',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
    render: ({ trace, element }) => {
      // Let's log the payload to see exactly what we're working with
      console.log('Raw payload:', trace.payload);
      
      // Initialize the variable that will hold our formatted dates string
      let checkAvailableDates = '';
  
      try {
        // Parse the payload as JSON
        let parsedPayload = JSON.parse(trace.payload);
  
        // Now we have a JSON object, we can extract checkAvailableDates
        if (parsedPayload && parsedPayload.checkAvailableDates) {
          // If it's already a string, we can use it directly
          if (typeof parsedPayload.checkAvailableDates === 'string') {
            checkAvailableDates = parsedPayload.checkAvailableDates;
          } else {
            // If it's an object, let's try to process it
            // Assuming it might be an array of objects like the API response example you provided
            const datesArray = parsedPayload.checkAvailableDates.records.map(record => record.fields['Available Date']);
  
            // Now we remove duplicates and sort
            const uniqueSortedDates = Array.from(new Set(datesArray)).sort((a, b) => new Date(a) - new Date(b));
            
            // Join into a string
            checkAvailableDates = uniqueSortedDates.join(', ');
          }
        }
      } catch (e) {
        console.error('Error parsing payload:', e);
      }
  
      // Now checkAvailableDates should be a string of dates, sorted and unique
      console.log('Processed available dates:', checkAvailableDates);
  
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
