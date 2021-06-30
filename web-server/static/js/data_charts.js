// DOM elements
// Inputs
const inpPlant = document.getElementById('plant');

// Chart
let mychart = document.getElementById('mychart');

// Page state
let selected_plant = inpPlant.value;

// Callbacks
function updatePlant(value) {
    selected_plant = value;
    replaceChart(selected_plant);
}

function replaceChart(id) {
    if (nutrient_data[id] == null || nutrient_schedule == null) return;
    const labels = Object.keys(nutrient_data[id]);
    for (let i = 0; i < labels.length; ++i) {
        labels[i] = new Date(parseFloat(labels[i]) * 1000);
    }
    const microdata = [];
    for (let key in nutrient_data[id]) {
        const week = nutrient_data[id][key][3];
        const gals = nutrient_data[id][key][0];
        const percent = nutrient_data[id][key][2] * 0.01;
        microdata.push(nutrient_schedule[week][0] * gals * percent);
    }
    const data = [{
        x: labels,
        y: microdata,
        type: 'scatter',
    }];
    Plotly.newPlot(mychart, data);
}

// GET requests
getNutrientSchedule(_ => checkCurrentAndSchedule(_ => replaceChart(selected_plant)));
getCurrentPlants(_ => checkCurrentAndSchedule(_ => replaceChart(selected_plant)));
getNutrientData(selected_plant, _ => replaceChart(selected_plant));

