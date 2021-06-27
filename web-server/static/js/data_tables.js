// Data from server
let current_plants;
const nutrient_data = {};

// DOM elements
// Inputs
const inpPlant = document.getElementById('plant');

// Page state
let selected_plant = inpPlant.value;

// Callbacks
function pullCurrentPlants(responseText) {
    current_plants = tryParseJSON(responseText);
}

function updatePlant(value) {
    selected_plant = value;
    changeTable(selected_plant);
}

// GET requests
getRequest('/get/current.json', pullCurrentPlants, retrieveErrorMsg('current plants'));

// Setup
changeTable(selected_plant);

// Page functions
async function changeTable(id) {
    if (nutrient_data[id] == null) {
        getNutrientData(id);
    } else {
        replaceTable(id);
    }
}

function getNutrientData(id) {
    const cb = function(responseText) {
        nutrient_data[id] = tryParseJSON(responseText);
        replaceTable(id);
    };
    getRequest('/get/nutrient_' + id + '.json', cb, retrieveErrorMsg('plant with id (' + id + ')'));
}

function replaceTable(id) {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    
    for (let key in nutrient_data[id]) {
        const row = document.createElement('tr');
        const date = document.createElement('td');
        date.appendChild(document.createTextNode(new Date(parseFloat(key) * 1000).toLocaleString('en-US', { timeZone: 'EST' })));
        row.appendChild(date);
        for (let v of nutrient_data[id][key]) {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(v));
            row.appendChild(td);
        }
        tbody.appendChild(row);
    }

    const oldTable = document.getElementById('data_table');
    table.appendChild(tbody);
    document.body.appendChild(table);
    oldTable.remove();
    table.id = 'data_table';
}
