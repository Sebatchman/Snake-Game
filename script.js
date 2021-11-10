const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const scoreEl = document.querySelector('#scoreNum');
const StartGameBtn = document.querySelector('#startBtn');
const StartGameWrapper = document.querySelector('#StartGameButton');
const Length = document.querySelector('#score');
const finalScoreNum = document.querySelector('#finalScoreNum');
let snakeSizeX = 10;
let snakeSizeY = 10;
const fruitSize = 10;
const scale = 10;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let LEFT = false;
let RIGHT = false;
let UP = false;
let DOWN = false;
let interval_1_Id;
let score = 0;
let fruitArray = ['#9720D2', '#FF769B', '#5A7EFF', '#FFCC01', '#FF5D26'];
let numberArrayX = [0, 40, 60, 80, 100, 140, 180, 220, 260, 280, 230, 110, 290, 200, 190];
let numberArrayY = [50, 140, 90, 20, 60, 120, 80, 100, 30, 70, 40, 10, 0];

Length.style.display = 'none';
finalScoreNum.style.display = 'none';

function Snake() {
	this.x = 130;
	this.y = 70;
	this.xSpeed = snakeSizeX * 1;
	this.ySpeed = 0;
	this.tail = [];
	this.total = 3; 
	this.draw = function() {
		c.fillStyle = '#15AD00';
		for (let i = 0; i < this.tail.length; i++) {
			c.fillRect(this.tail[i].x, this.tail[i].y, snakeSizeX, snakeSizeY);
		}
		c.beginPath();
		c.fillStyle = '#206526';
		c.fillRect(this.x, this.y, snakeSizeX, snakeSizeY);
		c.closePath();
	}
	this.update = function() {
		for (let i = 0; i < this.tail.length - 1; i++) {
			this.tail[i] = this.tail[i + 1];
		}
		this.tail[this.total - 1] = {x: this.x, y: this.y};
		this.x += this.xSpeed;
		this.y += this.ySpeed;
			if (this.x > canvas.width - 10) {
				this.x = 0;
			}
			if (this.y > canvas.height - 10) {
				this.y = 0;
			}
			if (this.x < 0) {
				this.x = canvas.width - 10;
			}
			if (this.y < 0) {
				this.y = canvas.height - 10;
		}
	}

	this.changeDir = function(dir) {
		switch(dir) {
			case 'Right':
				this.xSpeed = snakeSizeX;
				this.ySpeed = 0;
				break;
			case 'Left':
				this.xSpeed = -snakeSizeX;
				this.ySpeed = 0;
				break;
			case 'Up':
				this.xSpeed = 0;
				this.ySpeed = -snakeSizeY;
				break;
			case 'Down':
				this.xSpeed = 0;
				this.ySpeed = snakeSizeY;
			break;
		}
	}
	this.CollisionDetect = function(fruit) {
		if (this.x === fruit.x && this.y === fruit.y) {
			this.total++;
			this.fillStyle = fruit.fillStyle;
			return true;
		}
		return false;
	}
	this.snakeCollision = function() {
		for (i = 0; i < this.tail.length; i++) {
			if (this.x === this.tail[i].x &&
				this.y === this.tail[i].y) {
					this.total = 0;
					this.tail = [];
					clearInterval(interval_1_Id);
					playAudio('gameOver.wav');
					finalScoreNum.innerHTML = score;
					finalScoreNum.style.display = 'grid';
					StartGameWrapper.style.display = 'grid';
			}
		}
	}
}

function Fruit() {
	this.x;
	this.y;

	this.Location = function() {
		this.x = (Math.floor(Math.random() * rows - 1) + 1) * scale;
			if (this.x >= canvas.width) {
			this.x = shuffle(numberArrayX)[0];
		} 
			if (this.x <= canvas.width) {
			this.x = shuffle(numberArrayX)[0];
		}
		this.y = (Math.floor(Math.random() * columns - 1) + 1) * scale;
			if (this.y >= canvas.height) {
			this.y = shuffle(numberArrayY)[0];
		}
			if (this.y <= canvas.height) {
			this.y = shuffle(numberArrayY)[0];
		}
	}

	this.draw = function() {
		c.fillStyle = shuffle(fruitArray)[0];
		c.fillRect(this.x, this.y, fruitSize, fruitSize);
	}
}

window.addEventListener('keydown', (e) => {
	const dir = e.key.replace('Arrow', '');
	snake.changeDir(dir);
	playAudio('snakeMove.wav');
})

function shuffle(array) {
	let currentIndex = array.length, randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
	[array[currentIndex], array[randomIndex]] = [
	array[randomIndex], array[currentIndex]];
	}
	return array;
}

function playAudio(audio) {
	const soundEffect = new Audio(audio);
	soundEffect.play();
}

function animate() {
	snake = new Snake();
	fruit = new Fruit();
	fruit.Location();
	interval_1_Id = setInterval(() => {
			c.clearRect(0, 0, canvas.width, canvas.height);			
			snake.update();
			snake.draw();
			fruit.draw();
		if (snake.CollisionDetect(fruit)) {	
		score = snake.total + 1;
		scoreEl.innerHTML = score;
		fruit.Location();
		snake.draw.fillStyle = fruit.draw.fillStyle;
		playAudio('eatFruit.mp3');
		}
		snake.snakeCollision();
	}, 130);
}

StartGameWrapper.addEventListener('click', () => {
	StartGameWrapper.style.display = 'none';
	animate();
	score = 4;
	scoreEl.innerHTML = score;
	Length.style.display = 'flex';
	finalScoreNum.style.display = 'none';
	playAudio('gameStart.wav');
})



