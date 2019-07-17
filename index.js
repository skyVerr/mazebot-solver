const fetch = require('node-fetch');
const Node = require('./node.class');
const url = 'https://api.noopschallenge.com';
var mazePath;
var startingPosition;
var endingPosition;
var map;
var maze;
var grid;

async function startGame(){
    var path = await race();
    console.log(path);
    while (!!mazePath) {
        
    map  = await getMaze(mazePath);
    
    mapSizeY = map.length;
    mapSizeX = map[0].length;
    console.log(map);
    maze = new Object;
    grid = new Array();

    //Create Grid
    for (let i = 0; i < map.length; i++) {
        grid[i] = new Array();
    }

    for (let i = 0; i < map.length; i++) {
        let test = ""
        for (let j = 0; j < map.length; j++) {
            let node = new Node(j,i);
            node.walkable = map[i][j]=='X'?false:true;
            let coords = j+','+i;
            maze[coords] = node;
        }
    }

    // Initialize Neighbor
    Object.values(maze).forEach(node => {
        let x = node.x;
        let y = node.y;
        if (node.walkable) {
            if ( !!maze[ (x-1) +','+ y] && !!maze[ (x-1) +','+ y].walkable) {
                node.neighbors.push(maze[ (x-1) +','+ y])
            }
            if ( !!maze[ (x+1) +','+ y] && !!maze[ (x+1) +','+ y].walkable) {
                node.neighbors.push(maze[ (x+1) +','+ y])
            }
            if ( !!maze[ x +','+ (y-1)] && !!maze[ x +','+ (y-1)].walkable) {
                node.neighbors.push(maze[ x +','+ (y-1)])
            }
            if ( !!maze[ x +','+ (y+1)] && !!maze[ x +','+ (y+1)].walkable) {
                node.neighbors.push(maze[ x +','+ (y+1)])
            }
        }
    });

    //Solution
    let start = maze[startingPosition[0]+','+startingPosition[1]];
    let end = maze[endingPosition[0]+','+endingPosition[1]];

    let open = new Array();
    let close = new Array();
    start.open = true;
    start.fCost = start.getFcost(end);
    open.push(start);
    let current = start;



    while (true) {
        current = getLowFcost(open);
        open = open.filter(node=> {return !(current.x == node.x && current.y == node.y)})
        
        close.push(current);


        // for (let i = 0; i < open.length; i++) {
        //     if(current.fCost < open[i].fCost)
        //       current == open[i];
        // }

        if(current.x == end.x && current.y == end.y) break;
        
        current.neighbors.forEach(neighbor => {
            let includes = false;
            for (let i = 0; i < close.length; i++) {
                const node = close[i];
                if(node.x == neighbor.x && node.y == neighbor.y){
                    // console.log("close",[node.x,node.y]);
                    includes =true;
                    break;
                }
            }
            if(includes) return;
            let tempParent = neighbor.parent;
            neighbor.parent = current;
            let newPath = neighbor.getFcost(end);
            neighbor.parent = tempParent;
            if(newPath<neighbor.fCost || !open.includes(neighbor)){
                neighbor.parent = current;
                neighbor.fCost = neighbor.getFcost(end);
                if(!open.includes(neighbor)){
                    open.push(neighbor);
                }
            }
        });
        
    
    }

    let path = end.getPath();
    path.reverse();
    let direction = {
        '-10': 'E',
        '01': 'N',
        '10': 'W',
        '0-1': 'S'
    };
    
    let solution = "";
    current = maze[startingPosition[0] + ','+ startingPosition[1]];
    for (let i = 1; i < path.length; i++) {
        const node = path[i];
        // console.log(current.x, current.y, ''+(current.x-node.x)+''+(current.y-node.y));
        solution += direction[''+(current.x-node.x)+''+(current.y-node.y)];
        current = node;
    }
    // console.log(current.x, current.y, end.x, end.y);
    // solution += direction[''+(current.x-end.x)+''+(current.y-end.y)];

    let res = await fetch(url+mazePath, {
        method: 'POST',
        body:    JSON.stringify({directions: solution}),
        headers: { 'Content-Type': 'application/json' },
    });
    console.log(solution);
    res = await res.json();
    console.log(res);
    mazePath = res.nextMaze;
    }
}

async function getRandomMaze(){
    let res = await fetch("https://api.noopschallenge.com/mazebot/random?maxSize=10",
    {
        headers: { 'Content-Type': 'application/json' }
    });
    res = await res.json();

    
    mazePath = res.mazePath;
    startingPosition = res.startingPosition;
    endingPosition = res.endingPosition;
    return res.map;
}

async function race(){
    let res = await fetch("https://api.noopschallenge.com/mazebot/race/start",
    {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({login: 'Verrrr'})
    });
    res = await res.json();
    console.log(res);
    mazePath = res.nextMaze;
    return res.nextMaze
    
    mazePath = res.mazePath;
    startingPosition = res.startingPosition;
    endingPosition = res.endingPosition;
    return res.map;
}

async function getMaze(path){
    let res = await fetch(url+path);
    res = await res.json();
    mazePath = res.mazePath;
    startingPosition = res.startingPosition;
    endingPosition = res.endingPosition;
    return res.map;
}



function getLowFcost(openList){
    openList = openList.sort((a, b) => {
      var n = a.fCost - b.fCost;
      if(n !== 0){
        return n;
      }
      return a.hCost - b.hCost;
    });
    return openList[0]; 
}

console.clear();
startGame();