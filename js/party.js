$(function () {
    console.log(localStorage.getItem('party'));
    var thequestion = JSON.parse(localStorage.getItem('party'));
    console.log(thequestion);
    $('#question').text(thequestion.vote.question);
    var answers = thequestion.vote.answers;
    for (var i = 0; i < answers.length; i++) {
        var ans = answers[i];
        $('#submit').before(
            ` <input type="radio" id="${i}" name="radio" value="${i}"><label class="radio" for="${i}"style="font-size: 20px; margin: 5px;">${ans.answertext}</label></input><br>`
        );
    }
    var index = -1;
    $('input[type="radio"]').change(function () {
        index = $(this).val();
        if (this.checked) {
            thequestion.vote.answers[index].votes++;
        } else {
            thequestion.vote.answers[index].votes--;
        }
        console.log(thequestion);
    })

    $("#submit").click(function () {
        if (index != -1) {
            var alreadyvoted = JSON.parse(localStorage.getItem('votedlist'));
            if (alreadyvoted) {
                if (alreadyvoted.includes(thequestion.id)) {
                    return alert('You have already voted on this.');
                } else {
                    alreadyvoted.push(thequestion.id);
                    localStorage.setItem('votedlist', JSON.stringify(alreadyvoted));
                }
            } else {
                var alreadyvoted = [];
                alreadyvoted[0] = thequestion.id;
                localStorage.setItem('votedlist', JSON.stringify(alreadyvoted));
            }
            var label = $('label').eq(index);
            label.addClass("has-text-success");
            label.text(label.text() + " ✔");
            label.css("font-weight", "bold");
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("updated");
                } else {
                    console.log(this.readyState);
                }
            };
            xhttp.open("PUT", `/party/${thequestion.id}`, true);
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(JSON.stringify(thequestion));
        } else {
            alert("You must select an option before voting");
        }
    });
})