$(function () {
    var id = new URL(window.location.href).pathname.split('/')[2];
    getCourse();
    //host = location.origin.replace(/^http/, 'ws');
    host = "http://localhost:3000";
    var socket = io.connect(host);
    socket.on('connect', function (data) {
        socket.emit('join', `${id}`);
    });
    socket.on('updatePoll', function (data) {
        refresh(data);
    });

    function refresh(question) {
        $('#id').text(`id: ${id}`);
        $("#question").text(question.vote.question);
        let arr = question.vote.answers;
        $("p").remove();
        for (var i = 0; i < arr.length; i++) {
            $("#delete").before(
                `<p class='subtitle is-5' style='margin-top:5px;'> ${arr[i].answertext}, votes: ${arr[i].votes}</p>`
            );
        }
    }

    function getCourse() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var question = JSON.parse(this.responseText);
                console.log(question);
                refresh(question);
            } else if (this.readyState == 4 && this.status == 404) {
                alert("There was an error");
            }
        };
        xhttp.open("GET", `/api/party/${id}`, true);
        xhttp.send();
    }

    $("#delete").click(function () {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                window.location.href = `/`;
            } else if (this.readyState == 4 && this.status == 404) {
                alert("There was an error");
            }
        };
        xhttp.open("DELETE", `/api/party/${id}`, true);
        xhttp.send();
    });
});