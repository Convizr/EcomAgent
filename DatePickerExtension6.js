export const DatePickerExtension = {
    name: 'DatePicker',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
    render: async ({ trace, element }) => {
      const datePickerContainer = document.createElement('div');
      const today = new Date().toISOString().split('T')[0]; // Zorg ervoor dat 'today' correct is gedefinieerd
  
      // Configureer de Airtable API-aanroep
      const airtableApiKey = 'patzVDrXh2i3OLbHv.6c8aa0f5723f1be2d563268e10676cf4d60c79033a9b1306f3ae34e3d065db4b';
      const airtableBaseId = 'appHvQYXHVbngfCy6';
      const airtableTableName = 'tblYEvNwKAkByxrzP';
      const filterByFormula = "Status='Needed'";
      const airtableQueryUrl = `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTableName)}?filterByFormula=${encodeURIComponent(filterByFormula)}`;
  
      let availableDates = [];
      try {
        const response = await fetch(airtableQueryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${airtableApiKey}`,
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
            const result = await response.json();
            // Gebruik een Set om unieke datums op te slaan
            const uniqueDates = new Set();
            result.records.forEach(record => {
              const date = new Date(record.fields['Available Date']);
              uniqueDates.add(date.toISOString().split('T')[0]);
            });
    
            availableDates = [...uniqueDates]; // Zet de Set om naar een Array
          } else {
            throw new Error('Network response was not ok.');
          }
        } catch (error) {
          console.error('Error fetching available dates from Airtable:', error);
        }

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

    // Verwerk beschikbare datums
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

    // Voeg de event listener toe die de geselecteerde datum verwerkt
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
