// Data from server
let current_plants;

// DOM elements
// Inputs
const inpPlant = document.getElementById('plant');

// Page state
let selected_plant = inpPlant.value;

// Callbacks
function updatePlant(value) {
    selected_plant = value;
}

