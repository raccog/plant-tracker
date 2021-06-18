var p0 = document.getElementById("p0");
var p1 = document.getElementById("p1");
var msg = document.getElementById("msg");

function postPlants(plants) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/post/new_grow", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(plants));
}

function onSubmit() {
    var t0 = p0.value;
    var t1 = p1.value;
    console.assert(t0 != "" && t1 != "");
    if (confirm('Are you sure you want to change to a new grow with plants: '
        + t0 + ' and ' + t1 + '? This cannot be undone in a GUI yet.')) {
        postPlants([t0, t1]);
        msg.style.color = 'green';
        msg.textContent = 'New grow was set';
    } else {
        msg.style.color = 'red';
        msg.textContent = 'Process to set a new grow was cancelled.';
    }
}