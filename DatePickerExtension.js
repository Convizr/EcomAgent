export const DatePickerExtension = {
    name: 'DatePicker',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
    render: ({ trace, element }) => {
      const datePickerContainer = document.createElement('div');
  
      datePickerContainer.innerHTML = `
            <style>
              .calendar {
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 10px;
              }
              input[type="date"] {
                width: 100%;
                padding: 10px;
                margin: 5px 0;
                border-radius: 5px;
                border: 1px solid #ccc;
                font-size: 16px;
              }
            </style>
            <div class="calendar">
              <input type="date" id="datePicker" name="datePicker">
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
      console.log('DatePicker rendered');
    },
  };  