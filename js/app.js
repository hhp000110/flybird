function rand(a,b){
    return parseInt(a+(b-a)*Math.random());
}
function main(){
    let back = document.getElementById("gameBack");
    //获取游戏背景
    let start = document.getElementById("gameStart");
    let end = document.getElementById("gameEnd");
    let scoreEl = document.getElementById('score');
    let score = 0;
    let ok = false;
    //游戏是否开始（防止重复开始游戏）
    let g = 2;
    //掉落速度
    let speed = 1;
    //笨笨鸟速度
    let obstacleinterval;
    const bird_left = 300;
    //笨笨鸟初始位置
    const bird_h = 40;
    const bird_w = 40;
    //苯苯鸟的高度和宽度
    const obstacle_width = 5;
    //障碍物宽度
    const intervalArray = [];
    
    function BirdFly() {
        g = 2;
        let v = 8;
        bird.style.top = parseInt(bird.style.top)-20+'px';
        const flyinterval = setInterval(() => {
            bird.style.top = parseInt(bird.style.top)-v+'px';
            v--;
        }, 20);
        setTimeout(() => {
            window.clearInterval(flyinterval);
        }, 160);
    }


    function CreateBird(){
        var bird = document.createElement('img');
            ok = true;
            bird.id = 'bird';
            bird.style.top = '300px';
            back.appendChild(bird);
            document.onkeydown = function(event) {
                let e = event||arguments.callee.caller.arguments[0]||window.event;
                if(e.keyCode == 88){
                    BirdFly();
                    if(isDead())GameEnd(true);
                }
            }
    }
    //创造小鸟

    function CreateObstacle(){
        let ot = document.createElement('div');
        let ob = document.createElement('div');
        ot.className = 'obstacle-top';
        const tall = rand(0,300);
        const tall_b = rand(tall+150,500);
        ob.className = 'obstacle-bottom';
        ot.style.height = tall+'px';
        ob.style.top = tall_b +'px';
        ot.style.left = '895px';
        ob.style.left = '895px';
        back.appendChild(ot);
        back.appendChild(ob);
        let moveinterval = setInterval(() => {
            const x = parseInt(ot.style.left)-speed;
            ot.style.left = x+'px';
            ob.style.left = ot.style.left;
            if(x>=bird_left-obstacle_width&&x<=bird_left+bird_w){
                const current_top = parseInt(bird.style.top);
                if(current_top<=tall||current_top>=tall_b-bird_h){
                    GameEnd(true);
                }
            }
        }, 10);
        intervalArray.push(moveinterval);
        setTimeout(() => {
            window.clearInterval(moveinterval);
            ot.remove();
            ob.remove();
        }, 9500);
        //一段时间后，销毁障碍物
    }
    //创造障碍物

    function ScoreChange(){
        return setInterval(() => {
            score++;
            scoreEl.innerHTML = '当前分数：'+score;
            if(score>=150&&speed===1){
                speed = 2;
                window.clearInterval(obstacleinterval);
                obstacleinterval = setInterval(CreateObstacle, 1250);
                intervalArray.push(obstacleinterval);
            }
            if(score>=350&&speed===2){
                speed = 3;
                window.clearInterval(obstacleinterval);
                obstacleinterval = setInterval(CreateObstacle, 1000);
                intervalArray.push(obstacleinterval);
            }
        }, 100);
    }
    //分数增加计时器+难度增加功能

    function GameEnd(dead = false){
        if(dead){
            alert('你的分数是：'+score+'\n输了呢，不要气馁哟ヽ(✿ﾟ▽ﾟ)ノ')
        }
        if(ok){
            ok = false;
            while (intervalArray.length>0){
                window.clearInterval(intervalArray.pop());
            }
            let ots = document.getElementsByClassName('obstacle-top');
            let obs = document.getElementsByClassName('obstacle-bottom');
            for(let i=ots.length-1;i>=0;i--){
                ots[i].remove();
            }
            for(let i=obs.length-1;i>=0;i--){
                obs[i].remove();
            }
            //删除障碍物们
            scoreEl.innerHTML = '当前分数：0';
            score = 0;
            bird.remove();
            document.onkeydown = undefined;
            speed = 1;
        }
    }
    //游戏结束

    function isDead(){
        const y = parseInt(bird.style.top);
        if(y <0 || y>=459){
            return true;
        }
    }
    //判定小鸟是否挂掉

    function BirdFall(){
        intervalArray.push(setInterval(() => {
            g++;
        }, 500));
        return setInterval(() => {
            bird.style.top = parseInt(bird.style.top)+g+'px';
            if(isDead())GameEnd(true);
        }, 30);
    }
    //小鸟不断往下掉
    
    function GameStart(){
        if(ok)return;
        CreateBird();
        //设立主角小鸟和它可以按回车往上飞
        intervalArray.push(BirdFall());
        intervalArray.push(ScoreChange());
        obstacleinterval = setInterval(CreateObstacle, 2000)
        intervalArray.push (obstacleinterval);
    }

    start.onclick = GameStart;
    end.onclick = ()=>{
        GameEnd(false);
    }
}
window.onload = main;