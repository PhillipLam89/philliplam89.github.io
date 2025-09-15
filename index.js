var angle360 = Math.PI * 2
class Planet {
    constructor(game) {
        this.game = game
        this.x = this.game.width * 0.5
        this.y = this.game.height * 0.5
        this.radius = 80
        this.image = window.planet //id set as HTML attr
        console.log('planet created')
    }
    draw(context) {
        context.drawImage(this.image, this.x - 100, this.y - 100)
        if (this.game.debug) {
            context.strokeStyle = 'white'
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, angle360)
            context.stroke()
        }
    }
}

class Projectile {
    constructor(game) {
        this.game = game
        this.x;
        this.y;
        this.radius = 10
        this.speedX = 1
        this.speedY = 1
        this.speedMod = 4
        this.free = true // true means obj is inactive, ready to be used
    }
    start(x,y, speedX, speedY) { //to create projectile at correct user-clicked spot 
        this.free = false
        this.x = x
        this.y = y
        this.speedX = speedX * this.speedMod 
        this.speedY = speedY * this.speedMod
    }
    reset() {
        this.free = true
    }
    draw(context) { //only draw current "free objs"
        if (!this.free) {
            context.save()
            context.beginPath()
              
            context.arc(this.x,this.y,this.radius,0, angle360)
            context.fillStyle = 'gold'
            context.fill()
            context.restore()
        }
    }
    update() {
        if (!this.free) {
            this.x += this.speedX 
            this.y += this.speedY
        }
        //resets bullets if outside screen area
        const isOffScreen = 
          (this.x < 0 || this.x > this.game.width
                      ||
           this.y < 0 || this.y > this.game.height)
        
        isOffScreen && this.reset()       
    }

}

class Enemy {
    constructor(game) {
        this.game = game
        this.x = 0
        this.y = 0
        this.radius = 40
        this.width = this.radius * 2
        this.height = this.radius * 2
        this.speedX = 0
        this.speedY = 0
        this.free = true
    }
    start() {
        this.free = false
        this.x = Math.random() * this.game.width
        this.y = Math.random() * this.game.height
        const aim = this.game.calcAim(this, this.game.planet) // aim must be calculated AFTER enemy x/y positions
        this.speedX = aim[0]
        this.speedY = aim[1]
    }
    reset() {
        this.free = true
    }
    draw(context) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, angle360)
        context.stroke()
    }
    update() {
        if (!this.free) {
            this.x+= this.speedX
            this.y+= this.speedY
            // ememy count and spawns will be controlled inside Game Class
        }
    }

}   
class Game { //control everything here
    constructor(canvas) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.planet = new Planet(this)
        this.player = new Player(this)
        this.debug = true

        //manage projectiles below
        this.projectilePool = []
        this.numberOfProjectiles = 15
        this.createProjectilePool() //fills this.projectilePool array with ammo
      
        //manage enemy spawns below
        this.enemyPool = []
        this.numberOfEnemies = 4
        this.createEnemyPool()
        this.enemyPool[0].start()
        this.enemyPool[1].start()
        this.enemyPool[2].start()
        this.enemyPool[3].start()
   

        this.mouse = {
            x:0,
            y:0
        }
        //global events
        window.onmousemove =  (e) => {
            this.mouse.x = e.offsetX
            this.mouse.y = e.offsetY
        }
        window.onmousedown =  (e) => {
            this.mouse.x = e.offsetX
            this.mouse.y = e.offsetY
            this.player.shoot() //shoot projectile when user clicks on coord-plane
        }
        window.onkeyup =  (e) => {
             if (e.key.toLocaleLowerCase() == 'd') {
                this.debug = !this.debug
                window.debugTitle.style.display =
                     this.debug ? 'block' : 'none'           
             }
        }        
    }
    render(context) {
        this.planet.draw(context)
        this.player.draw(context)
        this.player.update()
        // this.planet.x = this.planet.x + 0.2
        // if (this.planet.x > 800) this.planet.x = this.width / 2
        
        this.projectilePool.forEach(proj => {
            proj.draw(context)
            proj.update()
        })

        this.enemyPool.forEach(enemy => {
            enemy.draw(context)
            enemy.update()
        })        
   
    }
    calcAim(a,b) {
        const dx = a.x-b.x
        const dy = a.y-b.y
        const distance = Math.hypot(dx,dy)
        const aimX = dx / distance * -1 //cosine of angle (use +1 for hard mode)
        const aimY = dy / distance  * -1//sine of angle (use +1 for hard mode)
        return new Array(aimX,aimY,dx,dy, distance)
    }
    createProjectilePool() {
        while (this.projectilePool.length < this.numberOfProjectiles) {
             this.projectilePool.push(new Projectile(this))
        }
    }
    getProjectile() {
        return this.projectilePool.find(proj => proj.free)
    }
    createEnemyPool() {
        while (this.enemyPool.length < this.numberOfEnemies) {
             this.enemyPool.push(new Enemy(this))
        }        
    }
    getEnemy() {
        return this.enemyPool.find(enemy => enemy.free)
    }
}


//player (manage visuals, behaviors, and controls)
class Player { //gets instantiated when class Game runs
    constructor(game) {
        this.game = game
        this.x = this.game.width * 0.5
        this.y = this.game.height * 0.5
        this.radius = 40
        this.image = window.playerHTML
        this.angle = 0
        console.log('player creatd')
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.rotate(this.angle)
      
        context.drawImage(this.image, -this.radius, -this.radius)
      
        if (this.game.debug) {
            context.beginPath()
            context.strokeStyle = 'dodgerblue'
            context.arc(0,0,this.radius,0,angle360) //draws circle around player in debug mode
            context.stroke()
        }

        context.restore()

    }
    update() { //to move player arounds
        this.aim = this.game.calcAim(this.game.planet,this.game.mouse) //determines which way the player faces when mouse moves
        this.x = this.game.planet.x + (this.game.planet.radius +this.radius)* this.aim[0]
        this.y = this.game.planet.y + (this.game.planet.radius +this.radius)* this.aim[1]
        //atan2 takes care of all quadrants!
        // this.angle = Math.atan2(this.aim[3], this.aim[2])
     
        //alternative to atan2
        this.angle = Math.acos(this.aim[0] * -1 ,this.aim[4]) 
        if (this.game.mouse.y >= 397 && this.game.mouse.y <= 699) {     
            this.angle = this.angle * -1 
        }
    }
    shoot() {
        const projectile = this.game.getProjectile()
        if (projectile) projectile.start(this.x + this.radius * this.aim[0], this.y + this.radius * this.aim[1], this.aim[0], this.aim[1])
     
    }
}
var game = null
window.onload = function() {
    const canvas = window.canvas1
    const ctx = canvas.getContext('2d')
    canvas.width = 800
    canvas.height = 800
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 4

    game = new Game(canvas)
    


    function animate() {
        ctx.clearRect(0,0,canvas.width,canvas.height)
        game.render(ctx)
        window.requestAnimationFrame(animate)
    }
    window.requestAnimationFrame(animate)
}
