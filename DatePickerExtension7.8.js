export const DatePickerExtension = {
  name: 'DatePicker',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
  render: ({ trace, element }) => {
    // Haal 'checkAvailableDates' uit de trace.payload
    let { checkAvailableDates } = trace.payload;
    console.log(checkAvailableDates);
    
    const datePickerContainer = document.createElement('div');
    const today = new Date().toISOString().split('T')[0];

    let availableDates = [];

    // Verwerk de 'checkAvailableDates' data om unieke beschikbare datums te verkrijgen
    try {
      const data = JSON.parse(checkAvailableDates);
      const uniqueDates = new Set();
      data.records.forEach(record => {
        const date = new Date(record.fields['Available Date']);
        uniqueDates.add(date.toISOString().split('T')[0]);
      });
      availableDates = [...uniqueDates];
    } catch (error) {
      console.error('Error parsing available dates from provided data:', error);
    }

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
            <input type="date" id="datePicker" name="datePicker" min="${today}">
          </div>
        </div>
    `;

    const input = datePickerContainer.querySelector('#datePicker');

    if (availableDates.length === 1) {
      input.value = availableDates[0];
      input.readOnly = true;
    } else if (availableDates.length > 1) {
      const dataListId = 'availableDatesList';
      input.setAttribute('list', dataListId);
      const dataList = document.createElement('datalist');
      dataList.id = dataListId;
      availableDates.forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        dataList.appendChild(option);
      });
      datePickerContainer.appendChild(dataList);
    }

    input.addEventListener('change', function (event) {
      console.log('Date selected:', event.target.value);
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { date: event.target.value },
      });
    });

    element.appendChild(datePickerContainer);
    console.log('DatePicker rendered with data from Voiceflow runtime');
  },
};
