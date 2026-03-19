let talps = document.querySelectorAll("#joc img");
let puntuacio = 0;

let time = 30;

let talpActual = [];

let intervalTalp;

let intervaltime;

function Startgame(){
    puntuacio = 0;
    time = 30;

    document.getElementById("points").innerHTML = puntuacio;
    document.getElementById("time").innerHTML = "Time: " + time;

    intervalTalp = setInterval(nouTalp,1000);

    intervaltime = setInterval(counter,1000);
}

function nouTalp(){

for(let i=0; i<9;i++){
    talps[i].src="topoNo.jpg";
}

talpActual = [];

while(talpActual.length < 3){
    let pos = Math.floor(Math.random()*9);

    if(!talpActual.includes(pos)) {
        talpActual.push(pos);
        talps[pos].src="topoSi.jpg";

    }
}
}

function cop(pos){
    talps[pos].src="topoPam.jpg";

    if(talpActual.includes(pos)){

        puntuacio+= 10;
        document.getElementById("points").innerHTML = puntuacio;

        var audio = new Audio("boing.mp3");
        audio.play();


    }
}

function counter(){
    time--;

    document.getElementById("time").innerHTML = "Time:" + time;

    if(time <= 0){

        clearInterval(intervalTalp);
        clearInterval(intervaltime);

        alert("Fi de joc! Puntuacio: "+ puntuacio)
    }
}

