const mouse = {
	x: window.innerWidth/2,
	y: window.innerHeight/2
}


window.addEventListener('mousemove', function (event) {
	mouse.x = event.x
	mouse.y = event.y
})

class Canvas
{
	constructor(element, context = '2d') {
		this.canvas = element
		this.context = this.canvas.getContext('2d')
		this.colors = ['#e57373', '#9a275a', '#274156', '#d81e5b', '#3a335']

		window.addEventListener('resize', () => this.init())

		this.init()
	}

	init() {
		this.stop()
		this.clear()

		this.resize()

		this.createParticles()
		this.animate()
	}

	stop() {
		window.cancelAnimationFrame(this.animationFrame)
	}

	clear() {
		this.context.fillStyle = 'rgba(0, 0, 0, 0.05)'
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	randomColor() {
		return this.colors[Math.floor(Math.random() * this.colors.length)];
	}

	createParticles() {
		this.particles = []

		for (let i = 0; i < 75; i++) {
			let radius = (Math.random() * 2) + 1
			this.particles.push(new Particle({
				context: this.context, 
				x: window.innerWidth/2, 
				y: window.innerHeight/2, 
				color: this.randomColor(),
				radius: radius
			}))
		}
	}

	disperse() {
		this.particles.forEach(particle => {
			particle.disperse()
		});
	}

	draw() {
		this.clear();

		for (let i = 0; i < this.particles.length; i++) {		
			this.particles[i].draw()
		}
	}

	animate() {
		this.draw();
		this.animationFrame = window.requestAnimationFrame(() => this.animate());
	}
}

class Particle
{
	constructor (options) {
		this.context = options.context
		this.lastPoint = {x: options.x, y: options.y}
		this.lastMouse = {x: options.x, y: options.y}
		this.x = options.x
		this.y = options.y
		this.radius = options.radius || 10
		this.color = options.color
		this.radians = Math.random() * Math.PI * 2
		this.velocity = 0.06
		this.distanceFromCenter = this.randomInt(75, 175)
		this.rotation = true
	}

	draw() {
		this.context.beginPath();
		this.context.strokeStyle = this.color;
		this.context.lineWidth = this.radius;
		this.context.moveTo(this.lastPoint.x, this.lastPoint.y)
		this.context.lineTo(this.x, this.y)
		this.context.stroke()
		this.context.closePath()
		this.update()
	}

	randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	disperse() {
		this.rotation = false
	}

	update() {
		this.lastMouse.x += (mouse.x - this.lastMouse.x) * this.velocity;
		this.lastMouse.y += (mouse.y - this.lastMouse.y) * this.velocity;

		this.lastPoint = {x: this.x, y: this.y}
		this.radians += this.velocity
		if (this.rotation == true) {
			this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter
			this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter
		} else {
			this.x += -this.x * this.velocity * 0.5
			this.y += -this.y * this.velocity * 0.5
		}
	}
}

const cnvs = new Canvas(document.querySelector('canvas'))

const loading = function () {
	let element = document.querySelector('h5')
	let i = 1
	setInterval(function () {
		if (i == 100) {
			cnvs.disperse();
			return;
		}
		i++
		element.innerHTML = `Loading: ${i}%`
	},500);
}

loading();