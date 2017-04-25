function countAni(count, dom){
    var div_by = 100,
        speed = Math.round(count / div_by),
        run_count = 1,
        int_speed = 24;

    var int = setInterval(function() {
        if(run_count < div_by){
            dom.text(speed * run_count);
            run_count++;
        } else if(parseInt(dom.text()) < count) {
            var curr_count = parseInt(dom.text()) + 1;
            dom.text(curr_count);
        } else {
            clearInterval(int);
        }
    }, int_speed);

    return false;
}

countAni(495, $('.count'));
countAni(947, $('.count2'));
countAni(328, $('.count3'));
countAni(10328, $('.count4'));