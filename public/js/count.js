function countAni(count, target){
    var div_by = 100,
        speed = Math.round(count / div_by),
        run_count = 1,
        int_speed = 24;

    var int = setInterval(function() {
        if(run_count < div_by){
            target.text(speed * run_count);
            run_count++;
        } else if(parseInt(target.text()) < count) {
            var curr_count = parseInt(target.text()) + 1;
            target.text(curr_count);
        } else {
            clearInterval(int);
        }
    }, int_speed);
}

;(function loadNewUser(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        var num = parseInt(xhr.responseText);
        countAni(num, $('.count'));
    }
    xhr.open('GET','/newuser', true);
    xhr.send();
})()

;(function loadPageView(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        var num = parseInt(xhr.responseText);
        countAni(num, $('.count2'));
    }
    xhr.open('GET','/pageview', true);
    xhr.send();
})()

;(function loadTempNum(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        var num = parseInt(xhr.responseText);
        countAni(num, $('.count3'));
    }
    xhr.open('GET','/tempnum', true);
    xhr.send();
})()

;(function loadTotalUser(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        var num = parseInt(xhr.responseText);
        countAni(num, $('.count4'));
    }
    xhr.open('GET','/totaluser', true);
    xhr.send();
})()