let video;
let poseNet;
let poses = [];
let timer = 60;
let timerRunning = false;
let music;
let swish = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-basketball-swish-2039.mp3");

let objects = [];
let score = 0;
let gameStarted = false;
let menuStarted = false;

// Posició cercle (cistella)
const circleX = 640;
const circleY = 50;
const circleRadius = 200;

// BOTÓ MENÚ
function startGameMenu() {
    document.getElementById("menu").style.display = "none";
    menuStarted = true;

    // 🔥 INICIAR JOC DIRECTAMENT
    music.play();
    startTimer();
}

function createObject() {
    objects.push({
        x: random(width),
        y: 0,
        speed: random(3, 6)
    });
}

function setup() {
    createCanvas(1280, 720);

    setInterval(() => {
        if (gameStarted) {
            createObject();
        }
    }, 1000);

    music = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3");
    music.loop = true;
    
    video = createCapture(VIDEO);
    video.size(1280, 720);
    video.hide();

    poseNet = ml5.poseNet(video, () => console.log("PoseNet carregat!"));
    poseNet.on('pose', gotPoses);
}

function gotPoses(results) {
    poses = results;
}

function draw() {

    // ⛔ Esperar menú
    if (!menuStarted) return;

    background(20);
    image(video, 0, 0);

    // OBJECTES (pilotes)
    if (gameStarted) {
        for (let i = objects.length - 1; i >= 0; i--) {
            let obj = objects[i];

            obj.y += obj.speed;

            // PILOTA
            fill(255, 140, 0);
            ellipse(obj.x, obj.y, 40);

            stroke(0);
            line(obj.x - 20, obj.y, obj.x + 20, obj.y);
            noFill();
            arc(obj.x, obj.y, 40, 40, HALF_PI, PI + HALF_PI);
            arc(obj.x, obj.y, 40, 40, -HALF_PI, HALF_PI);
            noStroke();

            // CISTELLA
            let d = dist(obj.x, obj.y, circleX, circleY);
            swish.play();
            if (d < circleRadius) {
                objects.splice(i, 1);
                score += 2;
                continue;
            }

            // eliminar si surt
            if (obj.y > height) {
                objects.splice(i, 1);
            }
        }
    }

    // CISTELLA (visual)
    stroke(255);
    strokeWeight(4);
    noFill();
    ellipse(circleX, circleY, circleRadius * 2);
    noStroke();

    // COL·LISIONS (mans i peus)
    if (poses.length > 0) {
        let pose = poses[0].pose;
        let parts = ['leftWrist', 'rightWrist', 'leftAnkle', 'rightAnkle'];

        for (let i = objects.length - 1; i >= 0; i--) {
            let obj = objects[i];

            for (let j = 0; j < pose.keypoints.length; j++) {
                let kp = pose.keypoints[j];

                if (kp.score > 0.2 && parts.includes(kp.part)) {
                    let d = dist(kp.position.x, kp.position.y, obj.x, obj.y);

                    if (d < 30) {
                        objects.splice(i, 1);
                        score++;
                        break;
                    }
                }
            }
        }

        // DIBUIXAR MANS/PEUS
        for (let i = 0; i < pose.keypoints.length; i++) {
            let keypoint = pose.keypoints[i];

            if (keypoint.score > 0.2 &&
                (keypoint.part.includes('Wrist') || keypoint.part.includes('Ankle'))) {
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 12, 12);
            }
        }
    }

    // TIMER
    if (timerRunning) {
        fill(255, 0, 0);
        textSize(64);
        textAlign(CENTER, CENTER);
        text(timer, width / 2, height / 2);

        if (timer > 0 && frameCount % 60 === 0) {
            timer--;
        }

        if (timer === 0) {
            resetGame();
        }
    }

    // PUNTUACIÓ
    fill(255);
    textSize(32);
    text("Punts: " + score, 100, 50);
}

// INICI JOC
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        gameStarted = true;
    }
}

// RESET
function resetGame() {
    timerRunning = false;
    gameStarted = false;

    music.pause();
    music.currenttime = 0;

document.getElementById("gameOver").style.display = "flex";
    document.getElementById("finalScore").innerText = "Punts: " + score;
}