/*

	THE EVENT FRAMEWORK CODE

*/

/*===========================================
  _     _     _   _   _           _      
 | |   (_)___| |_| \ | | ___   __| | ___ 
 | |   | / __| __|  \| |/ _ \ / _` |/ _ \
 | |___| \__ \ |_| |\  | (_) | (_| |  __/
 |_____|_|___/\__|_| \_|\___/ \__,_|\___|
                                         
===========================================*/

function ListNode(data, prev, next){
	this.data = data;
	this.prev = prev;
	this.next = next;
	
		
}

/*======================================================
  _     _     _   ___ _                 _             
 | |   (_)___| |_|_ _| |_ ___ _ __ __ _| |_ ___  _ __ 
 | |   | / __| __|| || __/ _ \ '__/ _` | __/ _ \| '__|
 | |___| \__ \ |_ | || ||  __/ | | (_| | || (_) | |   
 |_____|_|___/\__|___|\__\___|_|  \__,_|\__\___/|_|   
                                                      
======================================================*/

function ListIterator(_List){
	this.currentNode = _List.head.next;
	this._List = _List;
	this.firstData = _List.head.next.data;
	
	this.first = function(){
		return this.firstData;
	}
	this.hasNext = function(){
	    if(this.currentNode === this._List.tail){
			return false;
		}
		return (this.currentNode.next !== this._List.tail);
	}
	
	this.atEnd = function(){
			return (this.currentNode === this._List.tail);
	}
	
	this.removeCurrent = function(){
		this._List.deleteNode(this.currentNode);
	}
	
	this.next = function(){
		if(this.currentNode === this._List.tail){
			throw StopIteration;
		} else{
			this.currentNode = this.currentNode.next;
			return this.currentNode.data;
		}
	}
	
	
	
}


/*==========================
  _     _     _   
 | |   (_)___| |_ 
 | |   | / __| __|
 | |___| \__ \ |_ 
 |_____|_|___/\__|
                  
===========================*/

function List(){
	this.head = new ListNode(null, null, null);
	this.tail = new ListNode(null, this.head, null);
	
	this.head.next = this.tail;
	
	this.pushBack = function(data){
		var newNode = new ListNode(data, this.tail.prev, this.tail);
		this.tail.prev.next = newNode;
		this.tail.prev = newNode;		    
	}
	
	this.popFront = function(){
	    var retNode = this.head.next;
	    if (retNode === this.tail){
			return null;
		}
		
		retNode.prev.next = retNode.next;
		retNode.next.prev = retNode.prev;
		
		return retNode.data;
	}
	
	this.deleteNode = function(node){
	
	    
		if((node !== this.head) && (node !== this.tail)){
			
			node.prev.next = node.next;
			node.next.prev = node.prev;
			
			return node.next;
		} else {
			return null;
		}
	}
	
	this.printList = function(){
		var cNode = this.head;
		do{
		   console.log(cNode.data);
		   cNode = cNode.next;
		} while(cNode != this.tail);
	}
	
	this.printListBackwards = function(){
		var cNode = this.tail;
		do{
		   console.log(cNode.data);
		   cNode = cNode.prev;
		} while(cNode != this.head);
	}
		
}

List.prototype.__iterator__ = function(){
  return new ListIterator(this);
};

function Event(eventFunc, runTime){
	this.eventFunc = eventFunc;
	this.runTime = runTime;
}

var events = new List();

function addEvent(eventFunc, runIn){
	events.pushBack(new Event(eventFunc, runIn + totalTime))	
}

var totalTime = 0;

function runEvents(frameTime){
	totalTime += frameTime;
	
	var EventIter = events.__iterator__();
	
	for(var curr = EventIter.first(); !EventIter.atEnd(); curr = EventIter.next()){
		if(curr.runTime < totalTime){
			var nextRun = curr.eventFunc();
			if(nextRun > 0){
				curr.runTime = nextRun + totalTime;
			} else {
			    EventIter.removeCurrent();
			}
				
		}
	}
	
}