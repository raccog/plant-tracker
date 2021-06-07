function post_record(record, id) {
    if (record.length != 8) return;

    var xhr = new XMLHttpRequest();
    var url = "post/table_record";
    xhr.open("POST", url);

    xhr.setRequestHeader
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            console.log(xhr.responseText);
        }
    }
    xhr.send(JSON.stringify({"record": record, "id": id}));
}