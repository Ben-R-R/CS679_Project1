// tutor.js - Javascript canvas, animation, and boids tutorial.
// 	Mike Gleicher, Sept 3, 2012
//	this file will "evolve" as you check out different versions
//	(it starts with revision 3, since HG numbers all versions of the project)

// phase 3 - draws a yellow circle in the canvas
// phase 4 - code re-organized
// phase 5 - animation 
// phase 6 - reqAnimFrame
// phase 7 - objectness
// phase 8 - object creation
// phase 9 - multiple objects
// phase 10 - click to add
// phase 11 - bouncing
// phase 12 - bouncing off of each other
// phase 13 - with alignment

// note: I am choosing to do this as an "onload" function for the
// window (so it gets run when the window is done loading), rather 
// than as a function of the canvas.
window.onload = function () {

    // I am putting my "Application object" inside this function
    // which might be a little bit inelegant, but it works

    // figure out what the "requestAnimationFrame" function is called
    // the problem is that different browsers call it differently
    // if we don't have it at all, just use setTimeout
    var reqFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function FrameRequestCallback */callback, /* DOMElement Element */element) {
            window.setTimeout(callback, 1000 / 60);
        };


    // "application" level variables (not totally global, but used by all
    // of the functions defined inside this function
    // get the canvas (assumes that its there)
    theCanvas = document.getElementById("mycanvas");
    theContext = theCanvas.getContext("2d");

    var alpha = 1.0;
    var alphaModifier = -0.01;
    allBalls = [];
    var gameStarted = false;
    for (var i = 0; i < 20; i++) {
        b = makeBall(50 + Math.random() * 500, 50 + Math.random() * 300, "#0000FF", chomperTeam);
        allBalls.push(b)
        b = makeBall(50 + Math.random() * 500, 50 + Math.random() * 300, "#FF0000", mosquitoTeam);
        allBalls.push(b)
        b = makeBall(50 + Math.random() * 500, 50 + Math.random() * 300, "#FF00FF", 0);
        allBalls.push(b)
    }

    // this function will do the drawing
    function drawBalls(ballList) {

        // draw the balls - too bad we can't use for i in theBalls
        for (var i = 0; i < ballList.length; i++) {
            ballList[i].draw();
        }
    }

    // bouncing behavior - if two balls are on top of each other,
    // have them react in a simple way
    function bounce(ballList) {

        for (var i = ballList.length - 1; i >= 0; i--) {
            var bi = ballList[i];
            var bix = bi.x;
            var biy = bi.y;
            // notice that we do the n^2 checks here, slightly painful
            for (var j = i - 1; j >= 0; j--) {
                var bj = ballList[j];
                var bjx = bj.x;
                var bjy = bj.y;
                var rad = bi.radius + bj.radius;
                rad = rad * rad;
                var dx = bjx - bix;
                var dy = bjy - biy;
                var d = dx * dx + dy * dy;
                if (d < rad && (bj.team != bi.team)) {
                    bj.collide(bi, -dy, -dx);
                    bi.collide(bj, dy, dx);
                    //bj.vX = dy;
                    //bj.vY = dx;
                    //bi.vX = -dx;
                    //bi.vY = -dy;
                }
            }
        }
    }


    // this assumes the velocities will be renormalized
    function align(ballList) {
        // do the n^2 loop over all pairs, and sum up the contribution of each
        for (var i = ballList.length - 1; i >= 0; i--) {
            var bi = ballList[i];
            var bix = bi.x;
            var biy = bi.y;
            ballList[i].newVX = 0;
            ballList[i].newVY = 0;

            bi.beginUpdate();

            for (var j = ballList.length - 1; j >= 0; j--) {

                var bj = ballList[j];

                // compute the distance for falloff
                var dx = bj.x - bix;
                var dy = bj.y - biy;
                var d = Math.sqrt(dx * dx + dy * dy);
                bi.addInfluence(bj, d, dx, dy);
            }
        }
        // need to finish the updated after everyone has finished 
        for (var i = ballList.length - 1; i >= 0; i--) {
            ballList[i].finishUpdate();
        }
    }

    //move the balls
    function moveBalls(ballList) {
        align(ballList);
        bounce(ballList);
        for (var i = 0; i < ballList.length; i++) {
            ballList[i].norm();
            ballList[i].move();
            if (ballList[i].health < 0) {
                //console.log(ballList[i].team);
                ballList[i].onDeath();
                ballList[i].remove = true;
                allBalls.sort(cull);
                allBalls.pop();
                i--;
            }
        }
    }

    function cull(a, b) {//sorting function for Stuff, puts stuff tagged for removal at end to be popped.
        if (a.remove) { return 1; }
        else if (b.remove) { return -1; }
        else { return 0; }
    }




    Stuff = []; //holds all miscellaneous objects (except Tank)

    function moveStuff() {//simple method, just goes through misc objects and runs move commands
        for (var i = 0; i < Stuff.length; i++) {
            Stuff[i].move();
        }
    }


    var aBomb = {	//Prototype for bombs shot by Tank, goes in straight line to destination then explodes into a group of P-swarmers
        "x": 0,
        "y": 0,
        "type": 0, //used to differentiate from pickups
        "speed": 10, //speed of bombs (constant)
        "vX": 0,
        "vY": 0,
        "radius": 10,
        "progress": 0, //how many steps taken so far
        "steps": 0, //Number of steps until target is reached
        "yield": 10, //Number of swarmers carried
        "remove": false, //flips to true when the object should be removed

        draw: function () {

            var _X = this.x + originX;
            var _Y = this.y + originY;

            theContext.strokeStyle = ballstroke;
            theContext.fillStyle = "#555555"; //TODO: color changes as nears destination (gray to red, 555555 to FF0000)
            theContext.beginPath();
            theContext.arc(_X, _Y, this.radius, 0, circ, true);
            theContext.closePath();
            theContext.stroke();
            theContext.fill();
        },
        move: function () {
            if (this.progress < this.steps) {
                this.x += this.vX;
                this.y += this.vY;
                this.progress++;
            } else {
                this.remove = true; //Flags, sorts and removes from list
                Stuff.sort(cull);
                Stuff.pop();
                for (var i = 0; i < this.yield; i++) {//Spawns swarmers per bomb yield
                    allBalls.push(
    					makeBall(
    						this.x + this.radius * Math.cos(i * circ / this.yield) / 2,
    						this.y + this.radius * Math.sin(i * circ / this.yield) / 2,
    						"#008800",
    						1
    					)
    				);
                }
            }
        }
    }

    // what to do when things get clicked
    function doClick() {

        theta = Math.atan2(mousey - Tank.y, mousex - Tank.x);
        Empty = function () { };
        Empty.prototype = aBomb;
        bomb = new Empty();
        bomb.x = Tank.x + Tank.radius * Math.cos(theta);
        bomb.y = Tank.y + Tank.radius * Math.sin(theta);
        bomb.vX = aBomb.speed * Math.cos(theta);
        bomb.vY = aBomb.speed * Math.sin(theta);
        dx = mousex - bomb.x;
        dy = mousey - bomb.y;
        bomb.steps = Math.sqrt(dx * dx + dy * dy) / aBomb.speed;
        Stuff.push(bomb);
    }

    theCanvas.addEventListener("click", doClick, false);


    function firstKeyHit(key) {
        if (key === 90) {
            //console.log(key)
            //allBalls.push( makeBall(Tank.x,Tank.y, "#008800", shieldTeam ) );
            UserData.useItem();
        }
    }

    var keysDown = {}; //holds all keys currently pressed
    window.addEventListener("keydown", function (e) {
        if (!(e.keyCode in keysDown)) {
            firstKeyHit(e.keyCode);
        }
        keysDown[e.keyCode] = true;

    }, false);
    window.addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);


    var mouseDown = false;
    var dragging = false;
    var dragOrigX = 0;
    var dragOrigY = 0;
    var dragPixX = 0;
    var dragPixY = 0;
    var preDragOrigX = 0;
    var preDragOrigY = 0;

    theCanvas.addEventListener("mousedown", function (e) {
        if (e.ctrlKey && e.button === 0) {
            dragging = true;
            dragOrigX = e.pageX - theCanvas.offsetLeft;
            dragOrigY = e.pageY - theCanvas.offsetTop;

            preDragOrigX = originX;
            preDragOrigY = originY;

        }
        if (e.button == 0) {
            gameStarted = true;
        }

    }, false);

    theCanvas.addEventListener("mouseup", function (e) {
        if (e.button === 0) {
            dragging = false;
        }

    }, false);

    theCanvas.addEventListener("mousemove", function (e) {
        if (dragging) {
            dragPixX = (e.pageX - theCanvas.offsetLeft) - dragOrigX;
            dragPixY = (e.pageY - theCanvas.offsetTop) - dragOrigY;

            originX = preDragOrigX + dragPixX;
            originY = preDragOrigY + dragPixY;
        }
        mousex = (e.pageX - theCanvas.offsetLeft) - originX;
        mousey = (e.pageY - theCanvas.offsetTop) - originY;

    }, false);

    function receive() {	//translates keystrokes from WASD to velocity changes
        xstop = true;
        ystop = true;

        if (38 in keysDown || 87 in keysDown) {	//Up
            Tank.vY -= Tank.accel;
            if (Tank.vY < -Tank.speed) { Tank.vY = -Tank.speed; }
            ystop = false;
        }
        if (40 in keysDown || 83 in keysDown) {	//Down
            Tank.vY += Tank.accel;
            if (Tank.vY > Tank.speed) { Tank.vY = Tank.speed; }
            ystop = false;
        }
        if (37 in keysDown || 65 in keysDown) {	//Left
            Tank.vX -= Tank.accel;
            if (Tank.vX < -Tank.speed) { Tank.vX = -Tank.speed; }
            xstop = false;
        }
        if (39 in keysDown || 68 in keysDown) {	//Right
            Tank.vX += Tank.accel;
            if (Tank.vX > Tank.speed) { Tank.vX = Tank.speed; }
            xstop = false;
        }
        if (xstop) {	//No x movement
            if (Math.abs(Tank.vX) < Tank.accel) { Tank.vX = 0; }
            else if (Tank.vX > 0) { Tank.vX -= Tank.accel; }
            else { Tank.vX += Tank.accel; }
        }
        if (ystop) {	//No y movement
            if (Math.abs(Tank.vY) < Tank.accel) { Tank.vY = 0; }
            else if (Tank.vY > 0) { Tank.vY -= Tank.accel; }
            else { Tank.vY += Tank.accel; }
        }
        if (32 in keysDown) { Tank.beamOn = true; } else { Tank.beamOn = false; }

    }

    function drawField() {
        var _X = 0 + originX;
        var _Y = 0 + originY;

        theContext.strokeStyle = "#000000";
        theContext.fillStyle = "#EEEEEE";
        theContext.beginPath();
        theContext.moveTo(_X, _Y);

        theContext.lineTo(_X, _Y + fieldSizeY);
        theContext.lineTo(_X + fieldSizeX, _Y + fieldSizeY);
        theContext.lineTo(_X + fieldSizeX, _Y);
        theContext.lineTo(_X, _Y);
        theContext.closePath();
        theContext.stroke();
        theContext.fill();
    }

    function tankDamage(balls) {	//This function calculates all damage the tank takes and receives
        var chomperDamage = 1; //Damage dealt by chompers
        var chomperBeam = 1; //Damage dealt to chompers by beam
        var mosquitoBeam = 1; //Damage dealt to mosquitoes by beam
        var dx = 0;
        var dy = 0;
        var d = 0;
        for (var i = 0; i < balls.length; i++) {
            if (balls[i].team !== p_swarmTeam) {
                dx = balls[i].x - Tank.x;
                dy = balls[i].y - Tank.y;
                d = Math.sqrt(dx * dx + dy * dy); //distance from ball to tank
                if (balls[i].team == chomperTeam && d <= Tank.radius + balls[i].radius) {	//Chomper damage check
                    Tank.health -= chomperDamage;
                }
                //TODO: Beam damage code
            }
        }
    }

    function tankEffects(stuffList) {	//this function evaluates effect of tank interacting with non-ball objects, such as pickups
        for (var i = 0; i < stuffList.length; i++) {
            //TODO: put pickup code in here
        }
    }

    var spawnEvent = function () {

        allBalls.push(makeBall(50 + Math.random() * 500, 50 + Math.random() * 300, "#0000FF", chomperTeam));
        return 1000;
    }

    addEvent(spawnEvent, 1000);



    // what we need to do is define a function that updates the position
    // draws, then schedules another iteration in the future
    // WARNING: this is the simplest, but not the best, way to do this
    function drawLoop() {


        receive(); 	//evaluate effect of current keystrokes
        if (gameStarted) {

            runEvents(1000 / 60);

            moveBalls(allBalls);     //calculate new positions of balls

            moveStuff(); 	//calculate new positions/qualities of other objects

            Tank.move(); 	//calculate new position of tank

            tankDamage(allBalls); //calculates damage

            tankEffects(Stuff); //checks pickups etc

            // clear the window
            theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
            drawField();
            Tank.draw(); //show tank

            drawBalls(allBalls);     //show balls

            drawBalls(Stuff);
            UserData.drawHUD(Tank.health);
        } else {
            displayMenu();
        }

        reqFrame(drawLoop); 	//set up another iteration of loop

    }
    drawLoop();

    function displayMenu() {
        theContext.fillStyle = "#000000";
        theContext.font = "80px Arial";
        theContext.fillText("The Beekeeper", 100, 100);

        theContext.font = "40px Arial";
        theContext.fillText("Controls: ", 100, 200);

        theContext.font = "30px Arial";
        theContext.fillText("Control your tank:          WASD or Arrow Keys", 100, 260);

        theContext.font = "30px Arial";
        theContext.fillText("Fire Bee Bomb:              Left Click Mouse", 100, 300);

        theContext.font = "30px Arial";
        theContext.fillText("Guide bees:                    Mouse cursor", 100, 340);

        theContext.font = "30px Arial";
        theContext.fillText("Laser Beam:                   Space", 100, 380);


        theContext.font = "30px Arial";
        theContext.fillText("Laser Beam:                   Space", 100, 380);



        theContext.fillStyle = "rgba(255, 0, 0, " + alpha + ")"
        theContext.font = "50px Arial";
        theContext.fillText("Click anywhere to begin", 100, 450);

        alpha += alphaModifier;
        if (alpha < 0 || alpha > 1.0) {
            alphaModifier = -alphaModifier;
        }
        alpha += alphaModifier;


    }
}
