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
window.onload = function() {
    // I am putting my "Application object" inside this function
    // which might be a little bit inelegant, but it works
    
    // figure out what the "requestAnimationFrame" function is called
    // the problem is that different browsers call it differently
    // if we don't have it at all, just use setTimeout
    var reqFrame =window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element){
            window.setTimeout(callback, 1000 / 60);
        };


    // "application" level variables (not totally global, but used by all
    // of the functions defined inside this function
	// get the canvas (assumes that its there)
	var theCanvas = document.getElementById("mycanvas");
	var theContext = theCanvas.getContext("2d");
    // these are effectively the constants
    var ballcolor = "#FFFF00";      // yellow fill
    var ballstroke = "#000000";     // black outline
    var circ = Math.PI*2;           // complete circle

    // make everything go the same speed
    var speed = 4.0;
    var radius = 5.0;
    
    // create a prototype ball
    // this is a slightly weird way to make an object, but it's very
    // javascripty
    var aBall = {
        "x" : 100,
        "y" : 100,
        "vX" : 10,
        "vY" : 10,
        "ballcolor" : "#FFFF00",
        "newVX" : 0,
        "team" : 0,
        "health" : 100,
        draw : function() {
        
            theContext.strokeStyle = ballstroke;
            theContext.fillStyle = this.ballcolor;
            
            theContext.beginPath();
	            theContext.arc(this.x,this.y,radius,0,circ,true); 
	            theContext.moveTo(this.x,this.y);
	            theContext.lineTo(this.x + 4*this.vX, this.y + 4*this.vY);
            theContext.closePath();
            
            theContext.stroke();
            theContext.fill();
        },
    
        // make 'em "bounce" when they go over the edge
        // no loss of velocity
        move: function() {
            this.x += this.vX;
            this.y += this.vY;
            if (this.x > theCanvas.width) {
            	this.x = 0;// theCanvas.width
            	this.vY = -this.vY;
                /*if (this.vX > 0) {
                    this.vX = -this.vX;
                }  */
            }
            if (this.y > theCanvas.height) {
            	this.y = 0;
            	this.vX = -this.vX;
                /*if (this.vY > 0) {
                    this.vY = -this.vY;
                } */
            }
            if (this.x < 0) {
            	this.x = theCanvas.width;
            	this.vY = -this.vY;
                /*if (this.vX < 0) {
                    this.vX = -this.vX;
                }  */
            }
            if (this.y < 0) {
            	this.y = theCanvas.height;
            	this.vX = -this.vX;
                /*if (this.vY < 0) {
                    this.vY = -this.vY;
                } */
            }
        },

        // normalize the velocity to the given speed
        //         // if your velocity is zero, make a random velocity
        norm: function () {
            var z = Math.sqrt(this.vX * this.vX + this.vY * this.vY );
            if (z<.001) {
                this.vX = (Math.random() - .5) * speed;
                this.vY = (Math.random() - .5) * speed;
                this.norm();
            } else {
                z = speed / z;
                this.vX *= z;
                this.vY *= z;
            }
        }
    };

    // this is so Javascripty it makes my head hurt:
    // to create a new Ball object, we make a new empty object
    // and set its prototype to be the first ball
    // (we probably could use create as well)
    // then we set some other stuff if we want
    function makeBall(x,y,color,team) {
        Empty = function () {};
        Empty.prototype = aBall;    // don't ask why not ball.prototype=aBall;
        ball = new Empty();
        ball.x = x;
        ball.y = y;
        ball.ballcolor = color;
        ball.team = team;
        ball.health = 100;
        return ball;
    }
    
    // make an array of balls
    theBlues = [];
    theReds = [];
    
    allBalls = [];
    
    for (var i=0; i<40; i++) {
        b = makeBall( 50+Math.random()*500, 50+Math.random()*300 , "#0000FF", 1);
        allBalls.push(b)
        b = makeBall( 50+Math.random()*500, 50+Math.random()*300 , "#FF0000", 0);
        allBalls.push(b)
        b = makeBall( 50+Math.random()*500, 50+Math.random()*300 , "#FF00FF", 3);
        allBalls.push(b)
    }
    
    //for (var i=0; i<40; i++) {
    //    b = makeBall( 50+Math.random()*500, 50+Math.random()*300 , "#0000FF");
    //    theBlues.push(b)
    //}
    
    //for (var i=0; i < 40; i++){
	//	b = makeBall( 50+Math.random()*500, 50+Math.random()*300,"#FF0000" );
    //    theReds.push(b)
	//}

    // this function will do the drawing
    function drawBalls(ballList) {
        
        // draw the balls - too bad we can't use for i in theBalls
        for (var i=0; i < ballList.length; i++) {
            ballList[i].draw();
        }
    }
    
    // bouncing behavior - if two balls are on top of each other,
    // have them react in a simple way
    // this assumes that everything has the same radius as the prototype
    function bounce(ballList) {
        var rad = 2 * radius;
        rad = rad*rad;
        
        for(var i=ballList.length-1; i>=0; i--) {
            var bi = ballList[i];
            var bix = bi.x;
            var biy = bi.y;
            // notice that we do the n^2 checks here, slightly painful
            for(var j=i-1; j>=0; j--) {
                var bj = ballList[j];
                var bjx = bj.x;
                var bjy = bj.y;
                var dx = bjx - bix;
                var dy = bjy - biy;
                var d = dx*dx+dy*dy;
                if (d < rad) {
                    bj.vX = dy;
                    bj.vY = dx;
                    bi.vX = -dx;
                    bi.vY = -dy;
                }
            }
        }
    }
        
    // Reynold's like alignment
    // each boid tries to make it's velocity to be similar to its neighbors
    // recipricol falloff in weight (allignment parameter + d
    // this assumes the velocities will be renormalized
    function align(ballList)
    {
        var ali = 25; // alignment parameter - between 0 and 1
    
        // make temp arrays to store results
        // this is inefficient, but the goal here is to make it work first
        //var newVX = new Array(ballList.length);
        //var newVY = new Array(ballList.length);
    
        // do the n^2 loop over all pairs, and sum up the contribution of each
        for(var i=ballList.length-1; i>=0; i--) {
            var bi = ballList[i];
            var bix = bi.x;
            var biy = bi.y;
            ballList[i].newVX = 0;
            ballList[i].newVY = 0;
    
            for(var j=ballList.length-1; j>=0; j--) {
            
                var bj = ballList[j];
                //if (bj == bi){
				//	break;
				//}
				// compute the distance for falloff
                var dx = bj.x - bix;
                var dy = bj.y - biy;
                var d = Math.sqrt(dx*dx+dy*dy);
                
                var dd = Math.pow(d, 1.8)
                
                var personalSpace = 10
                
                if(bj.team == bi.team){
				  	if(d < 100){
						ballList[i].newVX  += (bj.vX / (dd+ali));
		                ballList[i].newVY  += (bj.vY / (dd+ali));
		        	} else {
					    ballList[i].newVX  -= ((bix - bj.x) * .1 ) / (dd)
	               		ballList[i].newVY  -= ((biy - bj.y) * .1 ) / (dd)
					}
					if(d < personalSpace ){
						//ballList[i].newVX  += ((dx * .01 ) / d) * 0.001
	                	//ballList[i].newVY  += ((dy * .01 ) / d) * 0.001
		                
					}
					  
				  	
	                
				} else {
				    ballList[i].newVX  += ((bix - bj.x) * .01 ) / (dd)
	                ballList[i].newVY  += ((biy - bj.y) * .01 ) / (dd)
				}
                
            }
        }
        
        var cX = theCanvas.width/2
        var cY = theCanvas.height/2
        
        for(var i=ballList.length-1; i>=0; i--) {
        	// The balls want to be in the center of of the field:
        		
        	
        	
            ballList[i].vX = ballList[i].newVX + (cX - ballList[i].x) * .00005; //+ (1 - Math.random()*2) * .03;
            ballList[i].vY = ballList[i].newVY + (cY - ballList[i].y) * .00005; //+ (1 - Math.random()*2) * .03;
            if(Math.random() * 100 > 99){
			   	//angleTemp = Math.random()
			//	ballList[i].vX = 2 - Math.random()*4;
            //	ballList[i].vY = 2 - Math.random()*4;
			}
        } 
    }
    
    //move the balls
    function moveBalls(ballList) {
       align(ballList);
       bounce(ballList);
       for (var i=0; i<ballList.length; i++) {
           ballList[i].norm();
           ballList[i].move();
       }
    }
     
    // what to do when things get clicked
    function doClick(evt){
        // a catch - we need to adjust for where the canvas is!
        // this is quite ugly without some degree of support from
        // a library
        allBalls .push( 
			makeBall
			(
				evt.pageX - theCanvas.offsetLeft,
	        	evt.pageY - theCanvas.offsetTop,
	        	"#008800",
	        	2
			)
		);
    }
    theCanvas.addEventListener("click",doClick,false);

    // what we need to do is define a function that updates the position
    // draws, then schedules another iteration in the future
    // WARNING: this is the simplest, but not the best, way to do this
    function drawLoop() {
        moveBalls(allBalls );     // new position
      
	    // clear the window
        theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
        
        drawBalls(allBalls );     // show things
       
        reqFrame(drawLoop);
    }
    drawLoop();
}
