// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
    var num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

class Shape {
    constructor(x, y, velX, velY, exists) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = true;
    };
};

class Ball extends Shape {
    constructor(x, y, velX, velY, exists, color, size) {
        super(x, y, velX, velY, exists);
        this.color = color;
        this.size = size;
    };
};

class EvilCircle extends Shape {
    constructor(x, y, velX, velY, exists, color, size) {
        super(x, y, velX, velY, exists);
        this.velX = 20;
        this.velY = 20;
        this.color = 'white';
        this.size = 10;
    }
}

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

EvilCircle.prototype.checkBounds = function () {
    if ((this.x + this.size) >= width) {
        this.x = -10;
    }

    if ((this.x - this.size) <= 0) {
        this.x = -10;
    }

    if ((this.y + this.size) >= height) {
        this.y = -10;
    }

    if ((this.y - this.size) <= 0) {
        this.y = -10;
    }
}

EvilCircle.prototype.setControls = function () {
    var _this = this;
    window.onkeydown = function (e) {
        if (e.keyCode === 65 || e.keyCode === 37) { // Added AWSD or Arrow Key controls
            _this.x -= _this.velX;
        } else if (e.keyCode === 68 || e.keyCode === 39) {
            _this.x += _this.velX;
        } else if (e.keyCode === 87 || e.keyCode === 38) {
            _this.y -= _this.velY;
        } else if (e.keyCode === 83 || e.keyCode === 40) {
            _this.y += _this.velY;
        }
    }
}

Ball.prototype.collisionDetect = function () {
    for (var j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

EvilCircle.prototype.collisionDetect = function () {
    for (var j = 0; j < balls.length; j++) {
        if (balls[j].exists === true) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
            }
        }
    }
}

var balls = [];

while (balls.length < 25) { // Change to add more balls
    var size = random(10, 20);
    var ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        true,
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    );

    balls.push(ball);
}

function loop() {
    var evilCircle = new EvilCircle(50, 50, 0, 0, true, 'blue', 10);
    evilCircle.setControls();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'; // Can change transparency level to affect the tail
    ctx.fillRect(0, 0, width, height);

    for (var i = 0; i < balls.length; i++) {
        if (balls[i].exists === true) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
        evilCircle.draw();
        evilCircle.checkBounds();
        evilCircle.collisionDetect();
    }

    requestAnimationFrame(loop);
}

loop();




