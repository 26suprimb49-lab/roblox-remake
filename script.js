const game = document.getElementById("game");
const menu = document.getElementById("menu");
const playBtn = document.getElementById("playBtn");

const ui = document.getElementById("ui");
const towerButton = document.getElementById("towerButton");

const moneyText = document.getElementById("money");
const hpText = document.getElementById("baseHp");

let money = 200;
let baseHp = 100;

let placingTower = false;

let towers = [];
let enemies = [];
let bullets = [];

playBtn.onclick = () => {

    menu.style.display = "none";
    game.style.display = "block";

    ui.style.display = "block";
    towerButton.style.display = "block";

    setInterval(spawnEnemy, 1500);

    gameLoop();
};

towerButton.onclick = () => {

    placingTower = true;
};

game.addEventListener("click", (e) => {

    if(!placingTower) return;

    if(money < 50) return;

    let tower = document.createElement("div");
    tower.className = "tower";

    let x = e.clientX - 25;
    let y = e.clientY - 25;

    tower.style.left = x + "px";
    tower.style.top = y + "px";

    game.appendChild(tower);

    towers.push({
        el:tower,
        x:x,
        y:y,
        cooldown:0
    });

    money -= 50;

    moneyText.innerText = money;

    placingTower = false;
});

function spawnEnemy(){

    let enemy = document.createElement("div");
    enemy.className = "enemy";

    game.appendChild(enemy);

    enemies.push({
        el:enemy,
        x:-60,
        y:325,
        hp:5,
        path:0
    });
}

function shoot(tower, enemy){

    let bullet = document.createElement("div");
    bullet.className = "bullet";

    game.appendChild(bullet);

    bullets.push({
        el:bullet,
        x:tower.x + 25,
        y:tower.y + 25,
        target:enemy
    });
}

function gameLoop(){

    // ENEMIES
    enemies.forEach((enemy, eIndex) => {

        if(enemy.path === 0){

            enemy.x += 2;

            if(enemy.x >= 470){
                enemy.path = 1;
            }
        }
        else if(enemy.path === 1){

            enemy.y += 2;

            if(enemy.y >= 520){
                enemy.path = 2;
            }
        }
        else if(enemy.path === 2){

            enemy.x += 2;
        }

        enemy.el.style.left = enemy.x + "px";
        enemy.el.style.top = enemy.y + "px";

        // REACH BASE
        if(enemy.x > window.innerWidth - 180){

            baseHp -= 10;

            hpText.innerText = baseHp;

            enemy.el.remove();

            enemies.splice(eIndex,1);

            if(baseHp <= 0){

                alert("GAME OVER");

                location.reload();
            }
        }
    });

    // TOWERS
    towers.forEach((tower) => {

        if(tower.cooldown > 0){
            tower.cooldown--;
        }

        enemies.forEach((enemy) => {

            let dx = enemy.x - tower.x;
            let dy = enemy.y - tower.y;

            let dist = Math.sqrt(dx*dx + dy*dy);

            if(dist < 200 && tower.cooldown <= 0){

                shoot(tower, enemy);

                tower.cooldown = 50;
            }
        });
    });

    // BULLETS
    bullets.forEach((bullet, bIndex) => {

        if(!bullet.target) return;

        let dx = bullet.target.x - bullet.x;
        let dy = bullet.target.y - bullet.y;

        let dist = Math.sqrt(dx*dx + dy*dy);

        bullet.x += dx / dist * 6;
        bullet.y += dy / dist * 6;

        bullet.el.style.left = bullet.x + "px";
        bullet.el.style.top = bullet.y + "px";

        if(dist < 10){

            bullet.target.hp--;

            bullet.el.remove();

            bullets.splice(bIndex,1);

            if(bullet.target.hp <= 0){

                money += 25;

                moneyText.innerText = money;

                bullet.target.el.remove();

                enemies.splice(enemies.indexOf(bullet.target),1);
            }
        }
    });

    requestAnimationFrame(gameLoop);
}
