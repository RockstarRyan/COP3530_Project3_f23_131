
function runAjax() {
    var xhr = new XMLHttpRequest();
    //xhr.responseType = "JSON";
    xhr.onload = function(e) {
        //var arrOfStrings = JSON.parse(xhr.response);
        document.getElementById('result').innerHTML = this.responseText;
    }
    //xhr.open("GET", "pythoncode.py?text=" + text, true);
    xhr.open("GET", "test.php", true);
    xhr.send();
}