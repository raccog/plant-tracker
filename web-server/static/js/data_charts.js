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
        xaxis: 'x',
        yaxis: 'y1',
        name: 'FloraMicro',
        mode: 'lines',
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
        xaxis: 'x',
        yaxis: 'y1',
        name: 'FloraVeg',
        mode: 'lines',
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
        xaxis: 'x',
        yaxis: 'y1',
        name: 'FloraBloom',
        mode: 'lines',
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
        xaxis: 'x',
        yaxis: 'y1',
        name: 'CalMag',
        mode: 'lines',
        line: {
            dash: 'dash',
            color: 'rgb(0, 255, 255)',
            shape: 'spline',
            width: 2
        }
    };
    const phupdata = {
        x: labels,
        y: [],
        xaxis: 'x',
        yaxis: 'y1',
        name: 'pH Up',
        mode: 'lines',
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
        xaxis: 'x',
        yaxis: 'y1',
        name: 'pH Down',
        mode: 'lines',
        line: {
            dash: 'dash',
            color: 'rgb(255, 128, 0)',
            shape: 'spline',
            width: 2
        }
    };
    const percentdata = {
        x: labels,
        y: [],
        xaxis: 'x',
        yaxis: 'y2',
        name: 'Nutrient Percentage',
        mode: 'lines+markers',
        line: {
            dash: 'solid',
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
        percentdata['y'].push(nutrient_data[id][key][2]);
    }
    const data = [microdata, vegdata, bloomdata, calmagdata, phupdata, phdowndata, percentdata];
    const layout = {
      title: 'mL per Gallon of Nutrients and Supplements Over Time',
      xaxis: {
          title: "Date"
      },
      yaxis1: {
        title: 'mL per Gallon'
      },
      yaxis2: {
        title: 'Percent (%)'
      },
      grid: {
        rows: 2,
        columns: 1,
        subplots: ['xy1', 'xy2'],
        roworder:'bottom to top'
      },
    };
    const config = {responsive: true}
    Plotly.newPlot(mychart, data, layout, config);
}

// GET requests
getNutrientSchedule(_ => checkCurrentAndSchedule(_ => replaceChart(selected_plant)));
getCurrentPlants(_ => checkCurrentAndSchedule(_ => replaceChart(selected_plant)));
getNutrientData(selected_plant, _ => replaceChart(selected_plant));

