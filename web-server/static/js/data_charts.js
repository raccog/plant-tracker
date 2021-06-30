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
    if (nutrient_data[selected_plant] == null) {
        getNutrientData(selected_plant, _ => replaceChart(selected_plant));
    } else {
        replaceChart(selected_plant);
    }
}

function replaceChart(id) {
    if (nutrient_data[id] == null || nutrient_schedule == null) return;
    const labels = Object.keys(nutrient_data[id]);
    for (let i = 0; i < labels.length; ++i) {
        labels[i] = new Date(parseFloat(labels[i]) * 1000);
    }
    const microdata = {
        x: labels,
        y: [],
        name: 'FloraMicro',
        mode: 'lines+markers',
        line: {
            dash: 'solid',
            color: 'rgb(10, 10, 10)',
            shape: 'spline',
            width: 4
        }
    };
    const vegdata = {
        x: labels,
        y: [],
        name: 'FloraVeg',
        mode: 'lines+markers',
        line: {
            dash: 'dashdot',
            color: 'rgb(43, 255, 0)',
            shape: 'spline',
            width: 3
        }
    };
    const bloomdata = {
        x: labels,
        y: [],
        name: 'FloraBloom',
        mode: 'lines+markers',
        line: {
            dash: 'dash',
            color: 'rgb(255, 25, 25)',
            shape: 'spline',
            width: 3
        }
    };
    const calmagdata = {
        x: labels,
        y: [],
        name: 'CalMag',
        mode: 'lines+markers',
        line: {
            dash: 'solid',
            color: 'rgb(0, 255, 255)',
            shape: 'spline',
            width: 3
        }
    };
    const phupdata = {
        x: labels,
        y: [],
        name: 'pH Up',
        mode: 'lines+markers',
        line: {
            dash: 'dash',
            color: 'rgb(0, 0, 255)',
            shape: 'spline',
            width: 2
        }
    };
    const phdowndata = {
        x: labels,
        y: [],
        name: 'pH Down',
        mode: 'lines+markers',
        line: {
            dash: 'dash',
            color: 'rgb(255, 128, 0)',
            shape: 'spline',
            width: 2
        }
    };
    for (let key in nutrient_data[id]) {
        const week = nutrient_data[id][key][3];
        const gals = nutrient_data[id][key][0];
        const percent = nutrient_data[id][key][2] * 0.01;
        microdata['y'].push(nutrient_schedule[week][0] * percent);
        vegdata['y'].push(nutrient_schedule[week][1] * percent);
        bloomdata['y'].push(nutrient_schedule[week][2] * percent);
        if (nutrient_data[id][key][6] == 1) {
            calmagdata['y'].push(nutrient_schedule[week][3] * percent);
        } else {
            calmagdata['y'].push(0);
        }
        phupdata['y'].push(nutrient_data[id][key][4] / gals);
        phdowndata['y'].push(nutrient_data[id][key][5] / gals);
    }
    const data = [microdata, vegdata, bloomdata, calmagdata, phupdata, phdowndata];
    const layout = {
      title: 'mL per Gallon of Nutrients and Supplements Over Time',
      xaxis: {
        title: 'Date'
      },
      yaxis: {
        title: 'mL per Gallon'
      }
    };
    Plotly.newPlot(mychart, data, layout);
}

// GET requests
getNutrientSchedule(_ => checkCurrentAndSchedule(_ => replaceChart(selected_plant)));
getCurrentPlants(_ => checkCurrentAndSchedule(_ => replaceChart(selected_plant)));
getNutrientData(selected_plant, _ => replaceChart(selected_plant));

