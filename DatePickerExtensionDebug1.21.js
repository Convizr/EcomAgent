export const DatePickerExtension = {
    name: 'DatePicker',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
    render: ({ trace, element }) => {
      // Haal de checkAvailableDates waarde uit de payload
      let checkAvailableDates = trace.payload;
      console.log('Available date:', checkAvailableDates);
  
      const datePickerContainer = document.createElement('div');
      const today = new Date().toISOString().split('T')[0];
  
      // Verwerk en formatteer de beschikbare datum voor gebruik in het input element
      // De aanname hier is dat checkAvailableDates een object is met een datum property
      // Voorbeeld: {"checkAvailableDates": "2024-03-28"}
      const availableDateString = checkAvailableDates ? checkAvailableDates.checkAvailableDates : null;
      const formattedAvailableDate = availableDateString ? availableDateString : today; // Gebruik vandaag als fallback
  
      datePickerContainer.innerHTML = `
            <style>
            .calendar-container {
              padding: 20px;
              background: white;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
              max-width: fit-content;
            }
            .calendar {
              border-radius: 5px;
              padding: 10px;
            }
            input[type="date"] {
              max-width: 200px;
              padding: 10px;
              border-radius: 5px;
              border: 1px solid #ccc;
              font-size: 16px;
              cursor: pointer;
            }
          </style>
          <div class="calendar-container">
            <div class="calendar">
              <input type="date" id="datePicker" name="datePicker" min="${today}" value="${formattedAvailableDate}" readonly>
            </div>
          </div>
      `;
  
      const input = datePickerContainer.querySelector('#datePicker');
      input.readOnly = true;
  
      input.addEventListener('change', function (event) {
        console.log('Date selected:', event.target.value);
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: { date: event.target.value },
        });
      });
  
      element.appendChild(datePickerContainer);
      console.log('DatePicker rendered with hardcoded date from Voiceflow runtime');
    },
};
