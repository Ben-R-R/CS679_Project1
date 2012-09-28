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
    var swarmCount = 0;
    allBalls = [];
    var gameOver = false;
    var gameStarted = false;
    for (var i = 0; i < 3; i++) {
        b = makeBall(50 + Math.random() * 500, 50 + Math.random() * 300, "#0000FF", chomperTeam);
        allBalls.push(b)
        b = makeBall(50 + Math.random() * 500, 50 + Math.random() * 300, "#FF0000", mosquitoTeam);
        allBalls.push(b)
        b = makeBall(50 + Math.random() * 500, 50 + Math.random() * 300, "#FF00FF", 0);
        allBalls.push(b)
        if (i % 19 == 0) {
            //b = makeBall( 50 + Math.random() * (fieldSizeX - 100), 50+Math.random() * (fieldSizeY - 100) , "#FF00FF", lurkerTeam);

        }

    }
    function spawnStart() {
        allBalls = [];
        Stuff = []
        for (var i = 0; i < 3; i++) {
            b = makeBall(50 + Math.random() * 500, 50 + Math.random() * 300, "#0000FF", chomperTeam);
            allBalls.push(b)
            b = makeBall(50 + Math.random() * 500, 50 + Math.random() * 300, "#FF0000", mosquitoTeam);
            allBalls.push(b)
            b = makeBall(50 + Math.random() * 500, 50 + Math.random() * 300, "#FF00FF", 0);
            allBalls.push(b)
            if (i % 19 == 0) {
                //b = makeBall( 50 + Math.random() * (fieldSizeX - 100), 50+Math.random() * (fieldSizeY - 100) , "#FF00FF", lurkerTeam);
                b = makeBall(800, 800, "#FF00FF", lurkerTeam);

                allBalls.push(b)
            }

        }
    }
    allBalls.push(makeBall(fieldSizeX / 2, fieldSizeY / 2, "#FF00FF", lurkerTeam))
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
                if (ballList[i].team == p_swarmTeam) { swarmCount--; }
                else { ballList[i].onDeath(); }
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
            if (Stuff[i].remove) {
                Stuff.sort(cull);
                Stuff.pop();
            }
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
        "yield": 40, //Number of swarmers carried
        "remove": false, //flips to true when the object should be removed

        draw: function () {

            var _X = this.x + originX;
            var _Y = this.y + originY;

            theContext.strokeStyle = ballstroke;
            theContext.fillStyle = "#555555";
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
                for (var i = 0; i < this.yield; i++) {//Spawns swarmers per bomb yield
                    swarmCount++;
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
        },
        acquire: function () { }
    }

    // what to do when things get clicked
    function doClick() {

        if (UserData.items[1].quantity > 0) {
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
            UserData.items[1].quantity -= 1;
        }

    }

    theCanvas.addEventListener("click", doClick, false);


    function firstKeyHit(key) {
        if (key === 90) {
            //console.log(key)
            //allBalls.push( makeBall(Tank.x,Tank.y, "#008800", shieldTeam ) );
            UserData.useItem();
        }
    }

    function restart() {
        gameStarted = true;
        gameOver = false;
        mosquitoSpawnRate = 5000;
        chomperSpawnRate = 1000;
        spawnStart();
        Tank.reset();
        UserData.reset();
        BombItem.reset();
        ShieldItem.reset();
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
        if (32 in keysDown) {
        	Tank.beamOn = true;
        	if(!gameOver) {gameStarted = true;}
        }
        else { Tank.beamOn = false; }
        if (82 in keysDown && gameOver) {restart(); gameStarted = true;}

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
        var lurkerDamage = 3; //Damage dealt by Lurkers
        var chomperBeam = 1; //Damage dealt to chompers by beam
        var mosquitoBeam = 1; //Damage dealt to mosquitoes by beam

        var beamR = 5; // Beam radius
        var beamL = (Tank.beaml + Tank.radius); // beam length, define in like this because it makes the math easyer, and is only a little wrong. 
        var dx = 0;
        var dy = 0;
        var d = 0;

        var uBX = Math.cos(Tank.heading); // unit vector pointing along the Beam's line of action
        var uBY = Math.sin(Tank.heading);

        var uPX = uBY; 					  // unit vector purpendicular to the beam. 
        var uPY = -uBX;

        var vBX = beamL * uBX;     // vector of the beam
        var vBY = beamL * uBY;

        var bRad = 0 // ball radius 

        var collision = false;

        var projBeam = 0; // projection along the beam

        for (var i = 0; i < balls.length; i++) {
            if (balls[i].team !== p_swarmTeam && balls[i].team !== shieldTeam) {
                dx = balls[i].x - Tank.x;
                dy = balls[i].y - Tank.y;
                d = Math.sqrt(dx * dx + dy * dy); //distance from ball to tank
                if (balls[i].team == chomperTeam && d <= Tank.radius + balls[i].radius) {	//Chomper damage check
                    Tank.health -= chomperDamage;
                }
                if (balls[i].team == lurkerTeam && d <= Tank.radius + balls[i].radius) {	//Chomper damage check
                    Tank.health -= lurkerDamage;
                }

                bRad = balls[i].radius;
                collision = false;

                // short curcuit balls that are way away:
                if (Tank.beamOn && d < beamL + bRad + beamR) {

                    // make sure they are close to the line
                    if (Math.abs(dx * uPX + dy * uPY) < (beamR + bRad)) {

                        // are they out back?
                        projBeam = dx * uBX + dy * uBY;
                        if (projBeam < 0) {
                            if (d > (bRad + beamR)) {
                                collision = true;
                            }
                        } else {
                            collision = true;
                        }
                    }
                }


                if (collision) {
                    balls[i].health -= 10;
                    smallExplosion(balls[i].x, balls[i].y)
                }

            }
        }
    }

    function tankEffects(sList) {	//this function evaluates effect of tank interacting with non-ball objects, such as pickups
        var dx = 0;
        var dy = 0;
        var d = 0;
        for (var i = 0; i < sList.length; i++) {
            dx = sList[i].x - Tank.x;
            dy = sList[i].y - Tank.y;
            d = Math.sqrt(dx * dx + dy * dy);
            if (d <= Tank.radius + sList[i].radius) {
                sList[i].acquire();
                if (sList[i].remove) {
                    Stuff.sort(cull);
                    Stuff.pop();
                }
            }
        }
    }

    var chomperSpawnEvent = function () {

        allBalls.push(makeBall(50 + Math.random() * (fieldSizeX - 100), 50 + Math.random() * (fieldSizeY - 100), "#0000FF", chomperTeam));

        chomperSpawnRate -= 1;

        if (chomperSpawnRate < 300) {
            chomperSpawnRate = 300
        }

        return chomperSpawnRate;
    }

    var mosquitoSpawnEvent = function () {

        allBalls.push(makeBall(50 + Math.random() * (fieldSizeX - 100), 50 + Math.random() * (fieldSizeY - 100), "#0000FF", mosquitoTeam));

        mosquitoSpawnRate -= 1;

        if (mosquitoSpawnRate < 300) {
            mosquitoSpawnRate = 300
        }

        return mosquitoSpawnRate;
    }

    var PRegenEvent = function () {
        if (swarmCount < 50) {
            allBalls.push(makeBall(Tank.x, Tank.y, "#008800", p_swarmTeam));
            swarmCount++;
        }
        return 10;
    }

	var megaChomperEvent = function(){
		for (var i = 0; i < 20; i ++){
			allBalls.push(makeBall(50 + Math.random() * (fieldSizeX - 100), 50 + Math.random() * (fieldSizeY - 100), "#0000FF", chomperTeam));
		}
		
		return Math.random() * 30000 + 30 * 1000; // every thirty seconds to a minute
	}
	
	var megaMosquitoEvent = function(){
		for (var i = 0; i < 20; i ++){
			allBalls.push(makeBall(50 + Math.random() * (fieldSizeX - 100), 50 + Math.random() * (fieldSizeY - 100), "#0000FF", mosquitoTeam));
		}
		
		return Math.random() * 30000 + 45 * 1000; //
	}
	
	var megaLurkerEvent = function(){
		
		for (var i = 0; i < 3; i ++){ // three Lurkers is evil enough
			var lurkerX = 50 + Math.random() * (fieldSizeX - 100);
			var lurkerY = 50 + Math.random() * (fieldSizeY - 100);
			var lurkerD = Math.sqrt(Math.pow(Tank.x - lurkerX, 2) + Math.pow(Tank.y - lurkerY, 2));
			
			// create an exclusion zone around the tank so that lurkers don't
			// spawn on top of you.
			if ( lurkerD < 400){
				lurkerX = Tank.x + ((Tank.x - lurkerX) / lurkerD) * 400;
				lurkerY = Tank.y + ((Tank.y - lurkerY) / lurkerD) * 400;
				 
			}
			
			allBalls.push(makeBall(lurkerX , lurkerY , "#0000FF", lurkerTeam));
		}
		
		return Math.random() * 30000 +  3 * 60 * 1000; // at least 3 minutes between lurker events 
	}

    addEvent(chomperSpawnEvent, chomperSpawnRate);
    addEvent(mosquitoSpawnEvent, mosquitoSpawnRate);
    addEvent(PRegenEvent, 10);
	addEvent(megaChomperEvent, 30000);
	addEvent(megaMosquitoEvent, 45000);
	addEvent(megaLurkerEvent, 3 * 60 * 1000); // if you manage to survive for three minutes... mwahahahahaha
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

            drawParticles();

            drawBalls(allBalls);     //show balls

            drawBalls(Stuff);

            if (Tank.health <= 0) {
                gameStarted = false;
                gameOver = true;
                Tank.health = 0;
                swarmCount = 0;
                Tank.x = 400;
                Tank.y = 400;
            }
            UserData.drawHUD(Tank.health);

        } else {
            if (gameOver) {
                displayGameOver();
            } else {
                displayMenu();
            }
        }

        reqFrame(drawLoop); 	//set up another iteration of loop

    }

    drawLoop();
    function displayGameOver() {
        theContext.fillStyle = "#000000";
        theContext.font = "80px Arial";
        theContext.fillText("Game Over", 100, 100);

        theContext.font = "80px Arial";
        theContext.fillText("Score: " + UserData.score, 100, 250);

        theContext.font = "50px Arial";
        theContext.fillText("Press R to restart", 100, 350);
    }
    function displayMenu() {
        theContext.fillStyle = "#000000";
        theContext.font = "80px Arial";
        theContext.fillText("Hover Tank", 100, 100);

        theContext.font = "40px Arial";
        theContext.fillText("Controls: ", 100, 200);

        theContext.font = "30px Arial";
        theContext.fillText("Control your tank:          WASD or Arrow Keys", 100, 260);

        theContext.font = "30px Arial";
        theContext.fillText("Fire Swarm Bomb:         Left Click Mouse", 100, 300);

        theContext.font = "30px Arial";
        theContext.fillText("Guide Swarm:                Mouse cursor", 100, 340);

        theContext.font = "30px Arial";
        theContext.fillText("Laser Beam:                  Space", 100, 380);

        theContext.font = "30px Arial";
        theContext.fillText("Shield:                            Z", 100, 420);

        theContext.font = "40px Arial";
        theContext.fillText("Enemies: ", 100, 490);

        theContext.font = "30px Arial";
        theContext.fillText("Chomper", 100, 530);

        theContext.strokeStyle = ballstroke;
        theContext.fillStyle = "#0000FF";
        var _X = 250;
        var _Y = 562;
        var radius = 10;
        var mouthAngle = 0.4;

        if (mouthAngle > 2 * Math.PI) {
            mouthAngle = 0;
        }

        var theta = Math.PI / 8 * (Math.sin(mouthAngle) + 1);

        var phi = Math.atan2(1, 1);
        theContext.beginPath();
        theContext.arc(_X, _Y, radius, phi - theta, phi + theta, true);
        theContext.lineTo(_X, _Y);
        theContext.closePath();
        theContext.stroke();
        theContext.fill();


        theContext.fillStyle = "#000000";
        theContext.font = "30px Arial";
        theContext.fillText("Mosquito", 100, 570);

        _X = 250;
        _Y = 520;
        theContext.fillStyle = "#FFCC00";
        theContext.beginPath();
        theContext.moveTo(_X, _Y);
        theContext.lineTo(_X + 1 * 10, _Y + 4 * 1.5);
        theContext.closePath();
        theContext.closePath();
        theContext.stroke();

        theContext.beginPath();
        theContext.arc(_X, _Y, 5, 0, circ, true);
        //theContext.moveTo(_X, _Y);
        //theContext.lineTo(_X + 4 * this.vX, _Y + 4 * this.vY);
        theContext.closePath();

        theContext.stroke();
        theContext.fill();

        theContext.strokeStyle = "#000000";
        theContext.fillStyle = "#000000";
        theContext.font = "30px Arial";
        theContext.fillText("Lurker", 100, 610);


        _X = 250;
        _Y = 610;
        radius = 30;
        theContext.strokeStyle = "#000000";
        theContext.fillStyle = "#330066";

        theContext.beginPath();
        theContext.arc(_X, _Y, radius, circ / 2, circ / 2 + circ / 6, false);
        theContext.arc(_X - radius, _Y, radius, circ / 2 + 2 * circ / 6, circ, false);

        theContext.arc(_X + radius, _Y, radius, circ / 2, circ / 2 + circ / 6, false);
        theContext.arc(_X, _Y, radius, circ / 2 + 2 * circ / 6, circ, false);

        theContext.arc(_X + radius / 2, _Y, radius / 2, 0, circ / 2, true);
        theContext.arc(_X - radius / 2, _Y, radius / 2, 0, circ / 2, true);

        theContext.fill();

        theContext.moveTo(_X, _Y)
        theContext.lineTo(_X, _Y + radius / 3)

        var r6 = radius / 6
        var r2 = radius / 2

        for (var i = 2; i < 6; i++) {

            var __Y1 = Math.sqrt(Math.pow(r2, 2) - Math.pow(r2 - i * r6, 2))

            var __Y2 = Math.sqrt(Math.pow(radius, 2) - Math.pow(i * r6, 2))

            theContext.moveTo(_X - i * r6, _Y - __Y1)
            theContext.lineTo(_X - i * r6 + r2 / 2 * Math.sin(0), _Y + __Y2)

            theContext.moveTo(_X + i * r6, _Y - __Y1)
            theContext.lineTo(_X + i * r6 - r2 / 2 * Math.sin(0), _Y + __Y2)
        }



        theContext.stroke();


        theContext.fillStyle = "rgba(255, 0, 0, " + alpha + ")"
        theContext.font = "50px Arial";
        theContext.fillText("Press space to begin.", 150, 692);

        alpha += alphaModifier;
        if (alpha < 0 || alpha > 1.0) {
            alphaModifier = -alphaModifier;
        }
        alpha += alphaModifier;


    }
}
