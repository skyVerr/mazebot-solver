"use strict";
exports.__esModule = true;
var Node = /** @class */ (function () {
    function Node(x, y) {
        this.x = x;
        this.y = y;
        this.walkable = true;
        this.neighbors = new Array();
        this.fCost = 0;
        this.gCost = 0;
    }
    Node.prototype.getGcost = function () {
        if (!!!this.parent)
            return 0;
        this.gCost = this.getDistance(this, this.parent);
        return this.gCost + this.parent.getGcost();
    };
    Node.prototype.getFcost = function (end) {
        this.hCost = this.getDistance(this, end);
        return this.getGcost() + this.hCost;
    };
    Node.prototype.getDistance = function (start, end) {
        return Math.sqrt(((start.x - end.x) * (start.x - end.x)) + ((start.y - end.y) * (start.y - end.y)));
    };
    Node.prototype.getPath = function (path) {
        if (path === void 0) { path = []; }
        path.push(this);
        if (!!!this.parent) {
            return path;
        }
        return this.parent.getPath(path);
    };
    return Node;
}());
module.exports = Node;
