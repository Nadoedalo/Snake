var Snake = function(fieldX, fieldY, startSnakeSize, blockSize, speed, responsiveMode){
    this.fieldX = fieldX || this.fieldX;
    this.fieldY = fieldY || this.fieldY;
    this.startSnakeSize = startSnakeSize || this.startSnakeSize;
    this.blockSize = blockSize || this.blockSize;
    this.emptyFieldsObj = {}; // returns {x0y0 : {x: 0, y : 0}, x1y0 : {x : 1, y : 0}}
    this.speed = speed || this.speed;
    this.endGame = false;
    this.generateEmptyFields = function(){
            var x, y;
        for(x = 0; x < this.fieldX; x++){
            for(y = 0; y < this.fieldY; y++){
                this.addEmptyField(x, y);
            }
        }
    };
    this.responsiveMode = responsiveMode || this.responsiveMode;
    this.getEmptyField = function(x, y){
        return this.emptyFieldsObj['x'+x+'y'+y];
    };
    this.addEmptyField = function(x, y){
        return this.emptyFieldsObj['x'+x+'y'+y] = {x : x, y : y};
    };
    this.deleteEmptyField = function(x, y){
        return delete this.emptyFieldsObj['x'+x+'y'+y];
    };
    this.snakeBlocksArr = [
/*        {
            x : 0,
            y : 0
        }*/
    ];
    this.snakeDirection = { //possible values RIGHT 1, 0; LEFT -1, 0; UP 0, 1; DOWN 0, -1;
        x : 1,
        y : 0
    };
    this.switchDirection = function(direction){
        var x = 0, y = 0, res = false;
        direction = direction || this.nextMove;
        if(direction === 'right'){
            x = 1;
        }else if(direction === 'left'){
            x = -1;
        }else if(direction === 'up'){
            y = -1;
        }else if(direction === 'down'){
            y = 1;
        }
        if(
            !(y && y + this.snakeDirection.y === 0)
            &&
            !(x && x + this.snakeDirection.x === 0)
        ){
            this.snakeDirection = {
                x : x,
                y : y
            };
            res = true;
        }
        return res; // Direction changed or not
    };
    this.nextMove = 'right';
    this.goRight = function(){
        if(responsiveMode){
            this.moveSnake('right')
        }else{
            this.setNextMove('right');
        }
    };
    this.goLeft = function(){
        if(responsiveMode){
            this.moveSnake('left')
        }else{
            this.setNextMove('left');
        }
    };
    this.goUp = function(){
        if(responsiveMode){
            this.moveSnake('up')
        }else{
            this.setNextMove('up');
        }
    };
    this.goDown = function(){
        if(responsiveMode){
            this.moveSnake('down')
        }else{
            this.setNextMove('down');
        }
    };
    this.setNextMove = function(move){this.nextMove = move;};
    this.snakeCollisionCheck = function(){
        var head,
            res = false; // no collision with food
        if(!this.foodCollisionCheck()){
            head = this.snakeBlocksArr[this.snakeBlocksArr.length - 1];
            if(!this.getEmptyField(head.x, head.y)){
                alert('Lol you died, lol lol you died!');
                this.endGame = true;
            }
        }else {
            this.spawnFood();
            res = true;
        }
        return res;
    };
    this.foodCollisionCheck = function(){
        var head = this.snakeBlocksArr[this.snakeBlocksArr.length - 1],
            foodLength = this.foodCoord.length,
            i,
            res = false;
        for(i = 0; i < foodLength; i++){
            if(head.x === this.foodCoord[i].x && head.y === this.foodCoord[i].y){
                this.addEmptyField(this.foodCoord[i].x, this.foodCoord[i].y);
                this.foodCoord.splice(i, 1);
                this.addSnakeLength();
                res = true;
                break; //only one collision per check
            }
        }
        return res; //were food collision or not
    };
    this.foodCoord = [
        /*{
            x : 0,
            y : 0
        }*/
    ];
    this.el = (function(){
        var el = document.createElement('canvas');
        el.width = this.fieldX * this.blockSize;
        el.height = this.fieldY * this.blockSize;
        el.style.cssText = 'background: black; position: absolute; top: 0; z-index: 1000000;';
        return el;
    }.bind(this))();
    this.ctx = this.el.getContext("2d");
    this.spawnFood = function(){
        var keys = window.Object.keys(this.emptyFieldsObj), //better structure? Still iterable
            length = keys.length, //because elements != index in array
            rand;
        if(length === 0){
            alert('no block left. Congrats!');
            this.endGame = true;
            return false;
        }
        rand = (Math.random() * length)|0;
        this.foodCoord.push(this.emptyFieldsObj[keys[rand]]);
        this.deleteEmptyField(this.emptyFieldsObj[keys[rand]].x, this.emptyFieldsObj[keys[rand]].y);
        this.renderFood();
    };
    this.addSnakeLength = function(){
        var last = this.snakeBlocksArr[this.snakeBlocksArr.length - 1] || {x : -this.snakeDirection.x, y : -this.snakeDirection.y},
            x = last.x + this.snakeDirection.x,
            y = last.y + this.snakeDirection.y,
            newBlock = {
                x : x,
                y : y
            };
        this.snakeBlocksArr.push(newBlock);
        this.deleteEmptyField(x, y);
        this.renderSnake(); //TODO observe and listen to array change
    };
    this.renderSnake = function(){
        var temp,
            x, y,
            length = this.snakeBlocksArr.length;
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);  //TODO erase only changed block
        this.ctx.fillStyle = "#cccccc";
        for(var i = 0; i < length; i++){
            temp = this.snakeBlocksArr[i];
            x = temp.x * this.blockSize;
            y = temp.y * this.blockSize;
            this.ctx.fillRect(x, y, this.blockSize, this.blockSize);
        }
        this.renderFood();
    };
    this.renderFood= function(){
        var temp,
            x, y,
            length = this.foodCoord.length;
        this.ctx.fillStyle = "#00B300";
        for(var i = 0; i < length; i++){
            temp = this.foodCoord[i];
            x = temp.x * this.blockSize;
            y = temp.y * this.blockSize;
            this.ctx.fillRect(x, y, this.blockSize, this.blockSize);
        }
    };
    this.moveSnake = function(direction){
        var first = this.snakeBlocksArr.shift(),
            last = this.snakeBlocksArr[this.snakeBlocksArr.length - 1],
            firstX = first.x,
            firstY = first.y;
        this.switchDirection(direction);
        first.x = this.snakeDirection.x + last.x;
        first.y = this.snakeDirection.y + last.y;
        this.addEmptyField(firstX, firstY);
        this.snakeBlocksArr.push(first);
        this.snakeCollisionCheck();
        this.deleteEmptyField(first.x, first.y);
        this.renderSnake(); //TODO observe and listen to array change
    };
    this.init = function(){
        this.generateEmptyFields();
        for(var i = 0; i < this.startSnakeSize; i++){
            this.addSnakeLength();
        }
        this.renderSnake();
        this.spawnFood();
    };
    this.init();
    return this;
};
Snake.prototype = {
    fieldX : 60, //blockSize * fieldX px
    fieldY : 20, //blockSize * fieldY px
    startSnakeSize : 3, // how long the snake is
    blockSize : 10, //px
    speed : 0.1, //seconds to next move
    responsiveMode : true
};
var snake = new Snake();
document.body.appendChild(snake.el);
document.addEventListener('keydown', function(e){ //save keybingings in settings?
    switch(e.keyCode){
        case 37://LEFT 37
            snake.goLeft();
            break;
        case 38://UP 38
            snake.goUp();
            break;
        case 39://RIGHT 39
            snake.goRight();
            break;
        case 40://DOWN 40
            snake.goDown();
            break;
    }
});
(function gameLoop(instance){
    if(!instance.endGame){
        setTimeout(function(){
            instance.moveSnake();
            gameLoop(instance);
        }.bind(this), instance.speed * 1000);
    }
})(snake);