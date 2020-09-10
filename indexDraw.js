

(async () => {
    function gra(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function getData(y,x) {
        let data = ctx.getImageData(x,y,1,1).data;
        return [data[0],data[1],data[2]]
    }
    function getData2(y,x) {
        let data = outCtx.getImageData(x,y,1,1).data;
        return [data[0],data[1],data[2]]
    }

    let allow = 0;
    function isDiffOkay(f,s) {
        return Math.abs(f[0]-s[0]) + Math.abs(f[1]-s[1]) + Math.abs(f[2]-s[2]) <= allow;
    }


    const fs = require('fs');
    const { createCanvas, loadImage } = require('canvas');

    const image = await loadImage('out.png');

    const size = {w:image.width, h: image.height};
    const canvas = createCanvas(size.w, size.h);
    const ctx = canvas.getContext('2d');

    const outCanvas = createCanvas(size.w,size.h);
    const outCtx = outCanvas.getContext('2d');

    ctx.drawImage(image,0,0,size.w,size.h);
    outCtx.drawImage(image,0,0,size.w,size.h);
    let was = [];
    for (let i = 0; i < image.height; i++){
        let nStr = [];
        for(let g = 0; g < image.width; g++){
            nStr.push(false);
        }
        was.push(nStr);
    }


    function startDFS(y,x){
        console.log("--------NEW--------");
        console.log("******************");

        let am = 1;
        let color = getData(y,x);
        let xTotal = 0;
        let yTotal  = 0;
        let queue = [{x:x,y:y}];
        let claster = [];

        function dfs(y,x) {
            if (!was[y][x]) {
                let r = Math.min(image.width - 1, x + 1);
                let l = Math.max(x - 1, 0);
                let u = Math.max(y - 1, 0);
                let d = Math.min(image.height - 1, y + 1);
                let rC = getData(y, r);
                let lC = getData(y, l);
                let uC = getData(u, x);
                let dC = getData(d, x);
                was[y][x] = true;
                xTotal+=x;
                yTotal+=y;
                claster.push({y:y, x:x});
                if (!was[y][r] && isDiffOkay(rC, color)) {
                    preColor[0] += rC[0];
                    preColor[1] += rC[1];
                    preColor[2] += rC[2];
                    preAm++;
                    preQueue.push({x: r, y: y});
                }
                if (!was[y][l] && isDiffOkay(lC, color)) {
                    preColor[0] += lC[0];
                    preColor[1] += lC[1];
                    preColor[2] += lC[2];
                    preAm++;
                    preQueue.push({x: l, y: y});
                }
                if (!was[u][x] && isDiffOkay(uC, color)) {
                    preColor[0] += uC[0];
                    preColor[1] += uC[1];
                    preColor[2] += uC[2];
                    preAm++;
                    preQueue.push({x: x, y: u});
                }
                if (!was[d][x] && isDiffOkay(dC, color)) {
                    preColor[0] += dC[0];
                    preColor[1] += dC[1];
                    preColor[2] += dC[2];
                    preAm++;
                    preQueue.push({x: x, y: d});
                }
            }
        }
        let preColor = [0,0,0];
        let preQueue = [];
        let preAm = 0;
        while (queue.length){
            preColor = [0,0,0];
            preQueue = [];
            preAm = 0;
            for (let i = 0; i < queue.length; i++){
                dfs(queue[i].y,queue[i].x);
            }
            color[0] = Math.round((color[0]*am + preColor[0])/(preAm+am));
            color[1] = Math.round((color[1]*am + preColor[1])/(preAm+am));
            color[2] = Math.round((color[2]*am + preColor[2])/(preAm+am));
            am+=preAm;
            queue = [];
            for (let i = 0; i < preQueue.length; i++){
                queue.push(preQueue[i])
            }
        }
        if (color[0] != 0){
            outCtx.fillStyle = getRandomColor();
            for (let i = 0; i < claster.length; i++){
                outCtx.fillRect(claster[i].x,claster[i].y,1,1)
            }
        }
    }
    for (let i = 0; i < size.h; i+=1){
        for (let g = 0; g < size.w; g+=1){
            // d = true;
            if (!was[i][g]){
                startDFS(i,g);
            }
        }
    }
    var buf = outCanvas.toBuffer();
    fs.writeFileSync("test.jpg", buf);


})();
