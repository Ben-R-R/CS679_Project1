// UserData Document

var UserData = {
	drawHUD: function(){
		//theContext.font="20px Georgia";
		theContext.fillStyle = "#000000";
		theContext.font="20px Arial";
		theContext.fillText(this.score,10,20);	
	
	},
	
	score: 0,
	// expected item format: {name, draw(x,y), quantity, activate()}
	// draw(x,y) should be a small-ish drawing. 
	items: {},
	


};

 
