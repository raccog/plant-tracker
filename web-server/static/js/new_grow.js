var p0 = document.getElementById("p0");
var p1 = document.getElementById("p1");

function onSubmit() {
    var t0 = p0.value;
    var t1 = p1.value;
    console.assert(t0 != "" && t1 != "");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/post/new_grow", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify([t0, t1]));
}