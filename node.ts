export class Node{
    x: number;
    y: number;
    hCost: number;
    gCost: number;
    fCost: number;
    walkable: boolean;
    neighbors: Node[];
    parent: Node;
    
    open: boolean;
    close: boolean;
    start: boolean;
    end: boolean;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
        this.walkable = true;
        this.neighbors = new Array();
        this.fCost = 0;
        this.gCost = 0;
    }

    getGcost(): number{
        if(!!!this.parent)
            return 0;

        this.gCost = this.getDistance(this,this.parent);
        return this.gCost + this.parent.getGcost();
    }

    getFcost(end: Node): number{
        this.hCost = this.getDistance(this, end);
        return this.getGcost() + this.hCost;
    }

    getDistance(start: Node, end: Node) : number{
        return Math.sqrt(((start.x - end.x)*(start.x - end.x))+((start.y - end.y)*(start.y - end.y)));
    }

    getPath(path: Node[]= []): Node[]{
        path.push(this);
        if(!!!this.parent){
            return path;
        }
        return this.parent.getPath(path);
    }
}