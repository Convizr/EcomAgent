export const DatePickerExtension = {
    name: 'DatePicker',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
    render: ({ trace, element }) => {
        let payloadObj;
        if (typeof trace.payload === 'string') {
            payloadObj = JSON.parse(trace.payload);
        } else {
            payloadObj = trace.payload;
        }

        const availableDates = payloadObj.checkAvailableDates.split(',').map(date => date.trim());
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
            select.date-picker, input.date-input {
              padding: 10px;
              border-radius: 5px;
              border: 1px solid #ccc;
              font-size: 16px;
              cursor: pointer;
              margin-top: 5px;
            }
          </style>
          <div class="date-picker-container">
            <select id="datePicker" name="datePicker" class="date-picker">
              <option value="" disabled selected>Please select a date</option>
              ${availableDates.map(date => `<option value="${date}">${date}</option>`).join('')}
              <option value="request-date">Request date</option>
            </select>
            <input type="date" id="customDateInput" class="date-input" style="display:none;" />
          </div>
        `;

        const select = datePickerContainer.querySelector('#datePicker');
        const customDateInput = datePickerContainer.querySelector('#customDateInput');

        select.addEventListener('change', function (event) {
            if (event.target.value === "request-date") {
                // Hide the select box and show the custom date input
                select.style.display = 'none';
                customDateInput.style.display = 'block';

                customDateInput.addEventListener('change', function() {
                    // When a custom date is selected, use a different type
                    console.log('Custom Date selected:', customDateInput.value);
                    window.voiceflow.chat.interact({
                        type: 'request',
                        payload: { customDate: customDateInput.value },
                    });
                });
            } else {
                console.log('Date selected:', event.target.value);
                window.voiceflow.chat.interact({
                    type: 'complete',
                    payload: { date: event.target.value },
                });
            }
        });

        element.appendChild(datePickerContainer);
        console.log('DatePicker rendered with selectable dates from Voiceflow runtime');
    },
};

export const TimePickerExtension = {
    name: 'TimePicker',
    type: 'response',
    match: ({ trace }) => trace.type === 'ext_time_picker' || trace.payload.name === 'ext_time_picker',
    render: ({ trace, element }) => {
        // Directly using the availableTimes array from the payload object
        let availableTimes = trace.payload || [];
        
        const timePickerContainer = document.createElement('div');
        timePickerContainer.innerHTML = `
          <style>
            .time-picker-container {
              padding: 20px;
              background: white;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
              max-width: fit-content;
            }
            select.time-picker {
              padding: 10px;
              border-radius: 5px;
              border: 1px solid #ccc;
              font-size: 16px;
              cursor: pointer;
              margin-top: 5px;
            }
          </style>
          <div class="time-picker-container">
            <select id="timePicker" name="timePicker" class="time-picker">
              <option value="" disabled selected>Please select a time slot</option>
              ${availableTimes.map(time => `<option value="${time}">${time}</option>`).join('')}
            </select>
          </div>
        `;

        const select = timePickerContainer.querySelector('#timePicker');

        select.addEventListener('change', function (event) {
            console.log('Time slot selected:', event.target.value);
            window.voiceflow.chat.interact({
                type: 'time-slot-selected',
                payload: { timeSlot: event.target.value },
            });
        });

        element.appendChild(timePickerContainer);
        console.log('TimePicker rendered with available time slots.');
    },
};
