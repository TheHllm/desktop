let canvas;
let ctx;
let width;
let height;

// Rows of dots
let gLines = [];
function generateRows(scale=40){
    if(Math.random() > 0.5){
        gLines = [];
    }
    let rows = [];
    for(let y = 0; y < height; y += scale / 2){
        let row = [];
        for(let x = 0; x < width; x += scale){
            row.push({x: x, y: y, col: "#FFFFFF"})
        }
        rows.push(row);
        
        row = [];
        for(let x = 0; x < width; x += scale){
            row.push({x: x + scale /2, y: y + scale / 4, col: "#FFFFFF"})
        }
        rows.push(row);
    }

    let lines = [];
    for(let y = 0; y < rows.length; y+=2){
        for(let i = 0; i < rows[y].length; i++){
            addIfPointsIfValid(lines, rows[y], rows[y+1], i, i);
            addIfPointsIfValid(lines, rows[y], rows[y+1], i, i-1);
            addIfPointsIfValid(lines, rows[y+1], rows[y+2], i, i);
            addIfPointsIfValid(lines, rows[y+1], rows[y+2], i, i+1);

            // vertical
            addIfPointsIfValid(lines, rows[y], rows[y+2], i, i);
            addIfPointsIfValid(lines, rows[y+1], rows[y+3], i, i);
        }
    }

    lines.forEach((line) => {
        if((Math.random() * 100) > 70){
            gLines.push(line);
        }
    });
}

function addIfPointsIfValid(lineAr, ar1, ar2, index1, index2){
    if(ar1 && ar2){
        if(index1 >= 0 && index1 < ar1.length && index2 >= 0 && index2 < ar2.length){
            lineAr.push({p1: ar1[index1], p2: ar2[index2]});
        }
    }
}

function circle(pos, size, style = "#FFFFFF"){
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI, false);
    ctx.fill();
}

function line(l){
    ctx.beginPath();
    ctx.moveTo(l.p1.x, l.p1.y);
    ctx.lineTo(l.p2.x, l.p2.y);
    ctx.stroke();
}

function frame(){
    ctx.fillStyle = "#181818"
    ctx.fillRect(0,0, width, height);

    let mp = getMousePos();

    let c1 = {r: 110, g:110, b:110};
    let c2 = {r: 140, g: 120, b:255}
    
    gLines.forEach( (l) =>{
        let lp = linePos(l);
        let d = 6000/Math.sqrt(distSquared(lp, mp));
        let b = clamp(d+50, 0, 255)
        //ctx.strokeStyle = "rgb("+[b,b,b].join(',')+")";
        //ctx.strokeStyle = toRgbStr(mix(c1, c2, b/255));
        ctx.strokeStyle = toRgbStr(c1);
        line(l);
    });

    //requestAnimationFrame(frame);
}

function linePos(l){
    return {x: (l.p1.x + l.p2.x)/2, y: (l.p1.y + l.p2.y)/2}
}

function distSquared(p1, p2){
    return (p1.x - p2.x)**2 + (p1.y - p2.y)**2;
}

function resize(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    width = canvas.width;
    height = canvas.height;
    generateRows();
    requestAnimationFrame(frame);
}

let mouse = {x: 0, y:0};
let mouseIsOnScreen = false;

function onMove(evt){
    mouseIsOnScreen = true;
    let rect = canvas.getBoundingClientRect();
    mouse = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function clamp(val, min, max){
    if(val < min){
        return min;
    }else if(val > max){
        return max;
    }else{
        return val;
    }
}

function mix(c1, c2, prct){
    function m(a,b, p){
        return a * (1-p) + b * p
    }
    return {
        r: m(c1.r, c2.r, prct),
        g: m(c1.g, c2.g, prct),
        b: m(c1.b, c2.b, prct),
    };
}
function toRgbStr(c){
    return "rgb(" + [c.r, c.g, c.b].join(',')+ ")"
}

function getMousePos(){
    if(!mouseIsOnScreen){
        // randomly move the 'mouse' around the screen
        mouse.x = clamp(mouse.x + Math.random() * 2, 0, width);
        mouse.y = clamp(mouse.y + Math.random() * 2, 0, height);
    }

    return mouse;
}

window.addEventListener('mousemove', onMove);
window.addEventListener('mouseenter', function(){mouseIsOnScreen=true;})
window.addEventListener('mouseout', function(){mouseIsOnScreen=false;})

window.addEventListener('load', function(){
    canvas = document.getElementsByTagName('canvas')[0];
    ctx = canvas.getContext("2d");
    resize();
    setInterval(resize, 1000 * 60 * 1);
});

window.addEventListener('resize', resize);