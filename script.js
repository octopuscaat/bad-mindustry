//var enemySprite = ["dagger.png", "enemys/mace.png"];
var player;
var gameArea;
var playerBullets = [];
var aim;
var difficulty = 1;
var baseHealth = NaN;
var canShoot = true;
var playerShotTick = Date.now();
var buildTick = Date.now();
var damageTick = Date.now();
var turretBulletTick = Date.now();
var turrets = [];
var walls = [];
var enemys = [];
var turretBullets = [];
var buildKey = 81;
var copper = 100;
var buildMaterials = [0, 0, 0];
function startGame() {
    player = new component(30, 30, "gamma.png", 225, 225,"image");
   
    aim = new component(10,10,"red",0,0);
    gameArea.start();
}




var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousemove', function (e) {
            gameArea.x = e.pageX;
            gameArea.y = e.pageY;
            
        })
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            gameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('mousedown', function (r) {
            gameArea.x2 = r.pageX;
            gameArea.y2 = r.pageY;
        })
        window.addEventListener('mouseup', function (r) {
            gameArea.x2 = false;
            gameArea.y2 = false;
        })
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}



function component(width, height, color, x, y, type, tier) {
    this.type = type;
    this.time = 0;
    this.attackSpeed = 2.3;
    this.weaponCount = 2;
    this.hp = 5;
    this.damage = 9;
    this.blockHealth = 320;
    this.blockDamage = 18;
    this.config = 0;
    this.moveSpeed = 1;
    this.tier = tier;
    //this.tier = tier;
    if(tier == undefined) {
        this.tier = 1;
    }
    if(type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;    
    this.setStats = function(newHealth,newDamage) {
        this.hp = newHealth;
        this.damage = newDamage;
       // this.attackSpeed = newAttackSpeed;
      //  this.weaponCount = newWeaponCount;
      //  this.moveSpeed = newMoveSpeed;
    } 
    this.update = function() {
        if(type == "image") {
            var ctx = gameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();    
        } else {
        var ctx = gameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();    
    }
    }
    this.updateBlock = function() {
        if(type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }
}




function updateGameArea() {
   
    updateBullet();
    gameArea.clear();
     
   // player.moveAngle = 0;
   // player.speed = 0;
    
    if (gameArea.x && gameArea.y) {
        aim.x = gameArea.x - 10;
        aim.y = gameArea.y - 10;        
    }    
    if (gameArea.keys && gameArea.keys[37]) {
        player.x -= 1;
        
        }
    if (gameArea.keys && gameArea.keys[39]) {
        player.x += 1;
        
        }
    if (gameArea.keys && gameArea.keys[38]) {
        
        player.y -= 1; 
         
        
    }
     if (gameArea.keys && gameArea.keys[70]) {
        
        copper += 10;
         
        
    }
    if (gameArea.keys && gameArea.keys[40]) {
        
        player.y += 1;
        
        }
        if(gameArea.keys && gameArea.keys[81]) {
            buildWall(aim.x, aim.y);
        }
         if(gameArea.keys && gameArea.keys[69]) {
            buildTurret(aim.x, aim.y);
        }
         if(gameArea.keys && gameArea.keys[9]) {
            
        }
        if(gameArea.x2 && gameArea.y2) {
            if(clock(playerShotTick, 500) == true) {
                playerShotTick = Date.now();
            
            shoot(player.x,player.y);
            }
          
        } else {
           // document.getElementById("debug").innerHTML = difficulty;
        }
  
    
  //document.getElementById("debug").innerHTML = difficulty;
        
        var dx = (aim.x - player.x)
var  dy = (aim.y - player.y)
var playerRot = Math.atan2(dy,dx);
player.angle = playerRot + (Math.PI/2);



//d//ocument.getElementById("debug").innerHTML = diffculty;

    

spawnEnemy();




 updateComponents();
  updateBullet(player.angle);
  
   updateTurretBullet();
   updateInteractions();
  
  shootTurret(); 
  aim.newPos();
aim.update(); 
  player.newPos();
    player.update();
     ctx = gameArea.context;
    ctx.fillStyle = "black";
  ctx.font = '20px serif';
  ctx.fillText("copper: " + copper, 20, 20);
}
function shoot(x,y) {
   playerBullets.push(new component(10,10,"yellow",x, y));
    
}
function shootTurret() {
        for(var i = 0; i < turrets.length; i++) {
       //    if(clock(turretBulletTick, 500) == true) {
         if(turrets[i].time >= 30) {
             //  turretBulletTick= Date.now();
             turrets[i].time = 0;
             if(enemys[0] != undefined) {
             turretBullets.push(new component(10,10,"yellow",turrets[i].x, turrets[i].y));
             //copper -= 1;
             }
            } else {
                turrets[i].time++;
            }
        }
}
function updateTurretBullet() {
    for(var i = 0; i < turretBullets.length; i++) {
        if(turretBullets[i].config == 0) {
            if(enemys[0] != undefined) {
            dx = enemys[0].x - turretBullets[i].x;
            dy = enemys[0].y - turretBullets[i].y;
            ang = Math.atan2(dy,dx);
            turretBullets[i].angle = ang + Math.PI/2;
            turretBullets[i].moveAngle = 0;
            turretBullets[i].config = 1;
        }
        }
        turretBullets[i].speed = 5;
        turretBullets[i].newPos();
        turretBullets[i].update();
        if(turretBullets[i].x > 500 || turretBullets[i].x < 0 || turretBullets[i].y < 0 || turretBullets[i].y > 300) {
            turretBullets.splice(i,1);
        }
    }
}
function updateBullet(rot) {
         for (var i = 0; i < playerBullets.length; i += 1) {
        if(playerBullets[i].config == 0) {
            
            playerBullets[i].angle = rot;
            playerBullets[i].moveAngle = 0;
            playerBullets[i].config = 1;
       }
       playerBullets[i].speed = 1;
       
       playerBullets[i].newPos();
       playerBullets[i].update();
       
   }
};

function updateComponents() {
    for(var i = 0; i < walls.length; i++) {
        walls[i].update();
        if(walls[i].blockHealth <= 0) {
            walls.splice(i,1);
        }
    }
    for(var i = 0; i < enemys.length; i++) {
        
        enemys[i].update();
        if(enemys[i].x < 0) {
            enemys.splice(i,1);
            baseHealth -= 1;
        }
        if(enemys[i].hp <= 0) {
            //enemys[i].tier = 1;
            difficulty = difficulty + enemys[i].tier;
          document.getElementById("debug").innerHTML = difficulty; //+ enemys[i].tier;
            enemys.splice(i,1);
            
            copper += 10 * enemys[i].tier + Math.round(difficulty/10);
        }
        
    }
    for(var i = 0; i < turrets.length; i++) {
        if(enemys[0] != undefined) {
         dx = enemys[0].x - turrets[i].x;
            dy = enemys[0].y - turrets[i].y;
            turrets[i].angle = Math.atan2(dy,dx) + Math.PI/2;
        }
          //  turrets[i].newPos();
           if(gameArea.keys && gameArea.keys[90] && aim.x > turrets[i].x && aim.x < turrets[i].x + turrets[i].width && aim.y < turrets[i].y && aim.y > turrets[i].y + turrets[i].height) {
            turrets.splice(i,1);
            
            copper += 20;
        }
        turrets[i].update();
    }
}


function clock(startTime, endTime) {
    
    if(startTime + endTime < Date.now()) {
      
        return(true);
    }
}


function buildWall(x,y) {
    if(copper >= 6) {
        
    if(clock(buildTick, 1000)) {
        buildTick = Date.now();
        copper -= 6;
    walls.push(new component(30,30,"copperWall.png",x,y,"image"));
    for(var i = 0; i < walls.length; i++) {
        walls[i].update();
    }
    }
    }
}


function buildTurret(x,y) {
    if(copper >= 35) {
        
    if(clock(buildTick, 2000)) {
        buildTick = Date.now();
        copper -= 35;
    turrets.push(new component(30,30,"duo.png",x,y,"image"));
    for(var i = 0; i < turrets.length; i++) {
         
        turrets[i].update();
        
    }
    }
    }
}

 
function spawnEnemy() {
  //  var enemyStrong = new component(1.25,1.25,enemySprite[1], 400,ranY,"image");
    
    var randSpawn = Math.floor(Math.random()*50);
    var ranY = Math.floor(Math.random() * 200) + 35;
   if(randSpawn == 1) {
       
    
    enemys.push(new component(30,30,"dagger.png", 400, ranY, "image", 1));
}
    if(randSpawn == 2 && difficulty > 25) {
        enemys.push(new component(37.5,37.5,"enemys/mace.png", 400, ranY, "image", 2));
        enemys[enemys.length-1].setStats(10,32);
    }
}


function updateInteractions() {
    for(var i = 0; i < enemys.length; i++) {
        enemys[i].moveSpeed = 1
        var eLeft = enemys[i].x;
        var eRight = enemys[i].x + enemys[i].width;
        var eTop = enemys[i].y;
        var eBottom = enemys[i].y + enemys[i].height;
        for(var a = 0; a < walls.length; a++) {
            var wLeft = walls[a].x;
        var wRight = walls[a].x + walls[a].width;
        var wTop = walls[a].y;
        var wBottom = walls[a].y + walls[a].height;
            if(eLeft < wRight && eRight > wLeft && eTop < wBottom && eBottom > wTop) {
                enemys[i].moveSpeed = 0;
                damageSpeed = 1000 / (enemys[i].attackSpeed*enemys[i].weaponCount);
                  if(clock(damageTick, damageSpeed) == true) {
               damageTick = Date.now();
                walls[a].blockHealth -= enemys[i].damage;
                  }
                  
            }
            
        }
        enemys[i].x -= enemys[i].moveSpeed;
        for(var a = 0; a < playerBullets.length; a++) {
                var bLeft = playerBullets[a].x;
        var bRight = playerBullets[a].x + playerBullets[a].width;
        var bTop = playerBullets[a].y;
        var bBottom = playerBullets[a].y + playerBullets[a].height;
            if(eLeft < bRight && eRight > bLeft && eTop < bBottom && eBottom > bTop) {
                enemys[i].hp -= 1;
                playerBullets.splice(a,1);
                
            }
        }
        for(var a = 0; a < turretBullets.length; a++) {
                var tLeft = turretBullets[a].x;
        var tRight = turretBullets[a].x + turretBullets[a].width;
        var tTop = turretBullets[a].y;
        var tBottom = turretBullets[a].y + turretBullets[a].height;
            if(eLeft < tRight && eRight > tLeft && eTop < tBottom && eBottom > tTop) {
                enemys[i].hp -= 1;
                turretBullets.splice(a,1);
                
            }
        }
    }
}



































