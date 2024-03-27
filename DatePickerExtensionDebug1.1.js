export const DatePickerExtension = {
    name: 'DatePicker',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
    render: ({ trace, element }) => {
      // Haal 'checkAvailableDates' direct als string uit de trace.payload
      let checkAvailableDates = trace.payload;
      console.log('Available date:', checkAvailableDates);
  
      const datePickerContainer = document.createElement('div');
      const today = new Date().toISOString().split('T')[0];
  
      // Als checkAvailableDates een geldige datumstring bevat, gebruik deze dan
      const availableDate = checkAvailableDates; // We gaan ervan uit dat dit een geldige datumstring is zoals "2024-03-28"
  
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
              <input type="date" id="datePicker" name="datePicker" min="${today}" value="${availableDate}" readonly>
            </div>
          </div>
      `;
  
      const input = datePickerContainer.querySelector('#datePicker');
  
      // Aangezien we nu werken met een enkele beschikbare datum, stellen we deze in als de waarde van de datepicker
      // en maken we het veld readonly zodat de gebruiker deze datum niet kan wijzigen
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
  