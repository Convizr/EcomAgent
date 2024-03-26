export const DatePickerExtension = {
    name: 'DatePicker',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_date_picker' || trace.payload.name === 'ext_date_picker',
    render: ({ trace, element }) => {
      // De huidige datum vaststellen voor de minimale datumselectie.
      const today = new Date().toISOString().split('T')[0];
      // Container voor de datepicker aanmaken.
      const datePickerContainer = document.createElement('div');

      console.log("checkAvailableDates at start:", window.checkAvailableDates);

      let availableDates = [];

      // Controleer of de checkAvailableDates-string bestaat en parse het.
      if (typeof window.checkAvailableDates === 'string') {
        try {
          // Parsing van de JSON-string naar een object.
          const datesObject = JSON.parse(window.checkAvailableDates);
          console.log('Parsed checkAvailableDates:', datesObject);

          // Verzamel de unieke beschikbare datums uit het datesObject.
          const uniqueDates = new Set(datesObject.records.map(record => record.fields['Available Date']));
          availableDates = [...uniqueDates]; // Omzetten van de Set naar een Array
        } catch (e) {
          console.error('Parsing error for checkAvailableDates:', e);
          return; // Stop de uitvoering als er een parse-fout optreedt
        }
      } else {
        console.error('checkAvailableDates is not a string or not defined.');
        return; // Stop de uitvoering als checkAvailableDates niet gedefinieerd is of geen string
      }

      // HTML-opmaak voor de datepicker.
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

      // De verwijzing naar het datepicker input-element.
      const input = datePickerContainer.querySelector('#datePicker');

      // Event listener toevoegen die reageert wanneer de gebruiker een datum kiest.
      input.addEventListener('change', function (event) {
        const selectedDate = event.target.value;
        const isAvailable = availableDates.includes(selectedDate);
        console.log('Date selected:', selectedDate, 'Is available:', isAvailable);
        
        // Stuur de geselecteerde datum en beschikbaarheidsstatus terug naar Voiceflow.
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: { date: selectedDate, status: isAvailable ? "Available" : "Other" },
        });
      });

      // Voeg de datepicker toe aan de pagina.
      element.appendChild(datePickerContainer);
      console.log('DatePicker rendered with adjusted styles for larger bubble');
    },
};
