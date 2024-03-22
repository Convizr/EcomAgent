export const DatePickerExtension = {
  name: 'DatePicker',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
  render: ({ trace, element }) => {
    const datePickerContainer = document.createElement('div');
    const today = new Date().toISOString().split('T')[0];

    datePickerContainer.innerHTML = `
          <style>
            .calendar-container {
              padding: 20px; /* Vergroot de padding om de textbubble groter te maken */
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
              max-width: 200px; /* Stel een maximale breedte in om de datepicker kleiner te maken */
              padding: 10px;
              border-radius: 5px;
              border: 1px solid #ccc;
              font-size: 16px;
              cursor: pointer; /* Maakt het duidelijk dat je op het veld kan klikken */
            }
          </style>
          <div class="calendar-container">
            <div class="calendar">
              <input type="date" id="datePicker" name="datePicker" min="${today}">
            </div>
          </div>
        `;

    const input = datePickerContainer.querySelector('#datePicker');
    input.addEventListener('change', function (event) {
      console.log('Date selected:', event.target.value);
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { date: event.target.value },
      });
    });

    element.appendChild(datePickerContainer);
    console.log('DatePicker rendered with adjusted styles for larger bubble');
  },
};