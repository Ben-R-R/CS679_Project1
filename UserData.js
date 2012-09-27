// UserData Document

var UserData = {
	drawHUD: function(health){
		//theContext.font="20px Georgia";
		theContext.fillStyle = "#000000";
		theContext.font="20px Arial";
		theContext.fillText(this.score, 10, 20);
		
		theContext.fillStyle = "#0099FF";
		theContext.fillRect = (500, 500, 50, 50);

		theContext.strokeStyle = "#FF0000";
		theContext.fillStyle = "#FF0000";
	
        
    	theContext.beginPath();
    	var startHealthBarX = 580;
		theContext.moveTo(startHealthBarX, 10);

		theContext.lineTo(startHealthBarX, 20);
		theContext.lineTo(startHealthBarX + 200, 20);
		theContext.lineTo(startHealthBarX + 200, 10);
		theContext.closePath();
		theContext.stroke();
		theContext.fill();

		theContext.fillStyle = "#33FF00";


		theContext.beginPath();
		theContext.moveTo(startHealthBarX, 12);

		theContext.lineTo(startHealthBarX, 18);
		//theContext.lineTo(startHealthBarX, 10);
		theContext.lineTo(startHealthBarX + health, 18);
		theContext.lineTo(startHealthBarX + health, 12);
		theContext.closePath();
		theContext.stroke();
		theContext.fill();


		var i_Loc = 20;
		for (var key in this.items) {
			if (this.items.hasOwnProperty(key)) {
				var item = this.items[key];
				
				var textWidth = theContext.measureText("" + item.quantity).width;
				 
			   	item.draw(i_Loc + textWidth + 5, theCanvas.height - 30);
			   	theContext.fillStyle = "#000000";
				
				theContext.fillText(this.items[key].quantity, i_Loc ,theCanvas.height - 13);
				i_Loc += 35 + textWidth	;
			}
		}
		Gauges.draw(20,theCanvas.height - 60);
			
		
	},
	
	score: 0,
	// expected item format: {name, draw(x,y), quantity, activate()}
	// draw(x,y) should be 20 * 20 pixels. 
	items: {},
	
	selectedItem: 0,
	
	useItem : function(){
		if(this.items[this.selectedItem].quantity > 0){
			this.items[this.selectedItem].quantity -= 1;
			this.items[this.selectedItem].activate();
		}
	
	}
	


};

var Gauges = {
	"height" : 10,	//height of each gauge
	"width" : 200,	//width of each gauge
	draw : function(x,y) {
		theContext.strokeStyle = ballstroke;	//black outline
		theContext.fillStyle = "#FFFFFF";	//white empty gauge
		theContext.beginPath();//health gauge
			theContext.moveTo(x, y);
			theContext.lineTo(x, y + this.height);
			theContext.lineTo(x + this.width, y + this.height);
			theContext.lineTo(x + this.width, y);
		theContext.closePath();
		theContext.fill();
		theContext.beginPath();//energy gauge
			theContext.moveTo(x, y + this.height);
			theContext.lineTo(x, y + this.height * 2);
			theContext.lineTo(x + this.width, y + this.height * 2);
			theContext.lineTo(x + this.width, y + this.height);
		theContext.closePath();
		theContext.fill();
		theContext.fillStyle = "#FF0000";
		theContext.beginPath();//health gauge
			theContext.moveTo(x, y);
			theContext.lineTo(x, y + this.height);
			theContext.lineTo(x + this.width * Tank.health / Tank.maxHealth, y + this.height);
			theContext.lineTo(x + this.width * Tank.health / Tank.maxHealth, y);
		theContext.closePath();
		theContext.fill();
		theContext.fillStyle = "#0000FF";
		theContext.beginPath();//energy gauge
			theContext.moveTo(x, y + this.height);
			theContext.lineTo(x, y + this.height * 2);
			theContext.lineTo(x + this.width * Tank.energy / Tank.maxEnergy, y + this.height * 2);
			theContext.lineTo(x + this.width * Tank.energy / Tank.maxEnergy, y + this.height);
		theContext.closePath();
		theContext.fill();
	}
}

var ShieldItem = {
	name : "Shields",
	draw : function(x,y){
		theContext.strokeStyle = "#00FFFF";
	
		theContext.lineWidth = 3;
		
		theContext.beginPath();
	    	theContext.arc(x+10 , y+10 , 10 , 0 , circ); 
	    theContext.closePath();
	    theContext.stroke();
	
	    theContext.lineWidth = 1; // reset linewidth so we don't mess up the other
	    						  // drawing functions 
	} ,
	quantity : 3,
	
	activate : function(){
		for(var i = 0; i < 7; i++) {	//because spirograph shields are awesome.
		allBalls.push( makeBall(Tank.x,Tank.y, "#008800", shieldTeam ) );
		}
	}
	
};

var BombItem = {
	name : "Bombs",
	draw : function(x,y){
	    theContext.strokeStyle = "#000000";
	    theContext.fillStyle = "#000000";
		
		
		theContext.beginPath();
	    	theContext.arc(x+10 , y+10 , 10 , 0 , circ); 
	    theContext.closePath();
	    theContext.fill();
	    
		theContext.beginPath();
	    	theContext.arc(x , y , 10 , circ - circ/8 , 0); 
	    //theContext.closePath();
	    theContext.stroke();
	    
		
		theContext.fillStyle = "#FFFFFF";
	    theContext.beginPath();
	    	theContext.arc(x+8 , y+8 , 5 , 0 , circ); 
	    theContext.closePath();
	    theContext.fill();
	
	
		
	},
	
	quantity : 3,
	
	activate : function (){
		//allBalls.push( makeBall(Tank.x,Tank.y, "#008800", shieldTeam ) );
		
	}

};

UserData.items[0] = ShieldItem;
UserData.items[1] = BombItem;