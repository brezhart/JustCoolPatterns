









(async () => {





    function f(y,x) {
        return  Math.tan(x^y)> 0.5;
    }


    const fs = require('fs');
    const { createCanvas} = require('canvas');


    let gridSize = (1<<8);

    let p = 1;


    const canvas = createCanvas(gridSize*p, gridSize*p);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,gridSize*p,gridSize*p);
    ctx.fillStyle = "#000000";
    for (let i = 0; i < gridSize; i++){
        for (let g = 0; g < gridSize; g++){
            if (f(i,g)){
                ctx.fillRect(i*p,g*p,p,p );
            }
        }
    }
    var buf = canvas.toBuffer();
    fs.writeFileSync(`out.png`, buf);
})();
