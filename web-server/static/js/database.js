function postPlant() {
    if (split) {
        for (let id of current_plants) {
            var g = gal;
            var up = pHupEle.value;
            var down = pHdownEle.value;
            if (!share) {
                var p = percentageEles[id].value * 0.01;
                g *= p;
                up *= p;
                down *= p;
            }

            var data = {
                'id': id,
                'gal': g,
                'percent': percent,
                'week': week,
                'replace': replaceEles[id].value,
                'pHup': up,
                'pHdown': down,
                'calmag': calmag
            };
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/post/new_record", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    } else {
        var data = {
            "id": postPlantEle.value,
            "gal": gal,
            "percent": percent,
            "week": week,
            "replace": replaceSingleEle.value,
            "pHup": pHupEle.value,
            "pHdown": pHdownEle.value,
            "calmag": calmag
        };
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/post/new_record", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
}