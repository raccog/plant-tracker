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
    const galhead = document.createElement('th');
    galhead.appendChild(document.createTextNode("Gallons"));
    theadrow.appendChild(galhead);
    const replacehead = document.createElement('th');
    replacehead.appendChild(document.createTextNode("Replaced"));
    theadrow.appendChild(replacehead);
    const percenthead = document.createElement('th');
    percenthead.appendChild(document.createTextNode("Nutrient Strength (%)"));
    theadrow.appendChild(percenthead);
    const weekhead = document.createElement('th');
    weekhead.appendChild(document.createTextNode("Week"));
    theadrow.appendChild(weekhead);
    const phuphead = document.createElement('th');
    phuphead.appendChild(document.createTextNode("pH Up (mL)"));
    theadrow.appendChild(phuphead);
    const phdownhead = document.createElement('th');
    phdownhead.appendChild(document.createTextNode("pH Down (mL)"));
    theadrow.appendChild(phdownhead);
    const microhead = document.createElement('th');
    microhead.appendChild(document.createTextNode("FloraMicro (mL)"));
    theadrow.appendChild(microhead);
    const veghead = document.createElement('th');
    veghead.appendChild(document.createTextNode("FloraVeg (mL)"));
    theadrow.appendChild(veghead);
    const bloomhead = document.createElement('th');
    bloomhead.appendChild(document.createTextNode("FloraBloom (mL)"));
    theadrow.appendChild(bloomhead);
    const calmaghead = document.createElement('th');
    calmaghead.appendChild(document.createTextNode("CalMag (mL)"));
    theadrow.appendChild(calmaghead);
    thead.appendChild(theadrow);
}

// Page state
let selected_plant = inpPlant.value;

// Callbacks
function checkCurrentAndSchedule() {
    if (nutrient_schedule != null && current_plants != null) {
        changeTable(selected_plant);
    }
}

function updatePlant(value) {
    selected_plant = value;
    changeTable(selected_plant);
}

// GET requests
getNutrientSchedule(_ => checkCurrentAndSchedule());
getCurrentPlants(_ => checkCurrentAndSchedule());
getNutrientData(selected_plant, _ => replaceTable[selected_plant]);

// Page functions
async function changeTable(id) {
    if (nutrient_data[id] == null) {
        getNutrientData(id, _ => replaceTable[id]);
    } else {
        await replaceTable(id);
    }
}

async function replaceTable(id) {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    
    while (nutrient_schedule == null) {
        await new Promise(resolve => setTimeout(resolve, 20));
    }
    for (let key in nutrient_data[id]) {
        const row = document.createElement('tr');
        row.classList.add('datarow');
        const date = document.createElement('td');
        date.appendChild(document.createTextNode(new Date(parseFloat(key) * 1000).toLocaleString('en-US', { timeZone: 'EST' })));
        row.appendChild(date);
        for (let i = 0; i < nutrient_data[id][key].length - 1; ++i) {
            let v = nutrient_data[id][key][i];
            if (i == 1) {
                v = v == '1' ? 'Yes' : 'No';
            }
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(v));
            row.appendChild(td);
        }
        const week = nutrient_schedule[nutrient_data[id][key][3]];
        const gals = nutrient_data[id][key][0];
        const percent = nutrient_data[id][key][2];
        for (let i = 0; i < 3; ++i) {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(week[i] * gals * percent * 0.01));
            row.appendChild(td);
        }
        const td = document.createElement('td');
        if (nutrient_data[id][key][6] == '1') {
            td.appendChild(document.createTextNode(week[3] * gals * percent * 0.01));
        } else {
            td.appendChild(document.createTextNode('0'));
        }
        row.appendChild(td);
        tbody.appendChild(row);
    }

    const oldTable = document.getElementById('data_table');
    table.appendChild(thead);
    table.appendChild(tbody);
    document.body.appendChild(table);
    oldTable.remove();
    table.id = 'data_table';
}
