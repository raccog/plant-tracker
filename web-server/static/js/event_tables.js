// DOM elements
// Inputs
const inpPlant = document.getElementById('plant');
// Table Head
const thead = document.createElement('thead');
{
    const theadrow = document.createElement('tr');
    const datehead = document.createElement('th');
    datehead.appendChild(document.createTextNode("Timestamp"));
    theadrow.appendChild(datehead);
    const eventhead = document.createElement('th');
    eventhead.appendChild(document.createTextNode("Event"));
    theadrow.appendChild(eventhead);
    thead.appendChild(theadrow);
}

// Page state
let selected_plant = inpPlant.value;

// Callbacks
function updatePlant(value) {
    selected_plant = value;
    changeTable(selected_plant);
}

// GET requests
getCurrentPlants(_ => {if (current_plants != null) changeTable(selected_plant)});
getPlantEvents(selected_plant, _ => replaceTable(selected_plant));

// Page functions
async function changeTable(id) {
    if (plant_events[id] == null) {
        getPlantEvents(id, _ => replaceTable(id));
    } else {
        await replaceTable(id);
    }
}

async function replaceTable(id) {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    
    for (let key in plant_events[id]) {
        const row = document.createElement('tr');
        row.classList.add('datarow');
        const date = document.createElement('td');
        date.appendChild(document.createTextNode(new Date(parseFloat(key) * 1000).toLocaleString('en-US', { timeZone: 'EST' })));
        row.appendChild(date);
        const plant_event = document.createElement('td');
        plant_event.appendChild(document.createTextNode(plant_events[id][key]));
        plant_event.id = 'left_align';
        row.appendChild(plant_event);
        tbody.appendChild(row);
    }

    const oldTable = document.getElementById('event_table');
    table.appendChild(thead);
    table.appendChild(tbody);
    document.body.appendChild(table);
    oldTable.remove();
    table.id = 'event_table';
}
