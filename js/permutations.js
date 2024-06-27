/* Copyright © 2024, Sera Gunn
   SPDX-License-Identifier: GPL-3.0-or-later */
class Permutation {
    fromList(lst) {
        if (!isPermutation(lst)) {
            return;
        }
        this.n = lst.length;
        this.list = lst.slice();
        this.cycles = [];
        for (let i = 1; i <= this.n; i++) {
            if (!lst[i - 1]) {
                continue;
            }
            let first = i;
            let cycle = [i];
            let next;
            [lst[first - 1], next] = [0, lst[first - 1]];
            while (next !== first) {
                cycle.push(next);
                [lst[next - 1], next] = [0, lst[next - 1]];
            }
            if (cycle.length > 1) {
                this.cycles.push(cycle);
            }
        }
    }
    fromCycles(cycles) {
        this.cycles = sortCycles(cycles);
        const flattened = new Set(cycles.reduce((acc, val) => acc.concat(val), []));
        this.n = Math.max(...flattened);
        this.list = Array.from({ length: this.n }, (_, i) => i + 1); // [1..n]
        for (const cycle of cycles) {
            if (cycle.length === 1) {
                continue;
            }
            let prev = cycle[0];
            let first = cycle[0];
            let next = cycle[1];
            for (let i = 1; i < cycle.length; i++) {
                next = cycle[i];
                this.list[prev - 1] = next;
                prev = next;
            }
            this.list[next - 1] = first;
        }
    }
    parseList(str) {
        const lst = str
            .replace(/[^0-9,]/g, "")
            .split(",")
            .map(Number);
        this.fromList(lst);
        return this;
    }
    parseCycles(str) {
        const cycles = readCycles(str, true);
        this.fromCycles(cycles);
        return this;
    }
    equals(y) {
        if (this.cycles.length !== y.cycles.length) {
            return false;
        }
        for (let i = 0; i < this.cycles.length; i++) {
            if (this.cycles[i].length != y.cycles[i].length) {
                return false;
            }
            for (let j = 0; j < this.cycles[i].length; j++) {
                if (this.cycles[i][j] !== y.cycles[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
    mul(y) {
        const cycles = this.cycles.concat(y.cycles);
        return mulCycles(cycles);
    }
    sign() {
        let s = 1;
        for (const cycle of this.cycles) {
            s *= cycle.length % 2 ? 1 : -1;
        }
        return s;
    }
    constructor(lst = []) {
        this.n = 0;
        this.list = [];
        this.cycles = [];
        if (isList(lst))
            this.fromList(lst);
        else
            this.fromCycles(lst);
    }
}
function cmpCycle(c1, c2) {
    return Math.min(...c1) - Math.min(...c2);
}
function sortCycles(cycles) {
    const newCycles = cycles.filter((cycle) => cycle.length > 1).sort(cmpCycle);
    let retCycles = [];
    for (const cycle of newCycles) {
        const m = Math.min(...cycle);
        const j = cycle.findIndex((x) => x === m);
        const left = cycle.slice(0, j);
        const right = cycle.slice(j);
        retCycles.push(right.concat(left));
    }
    return retCycles;
}
function mulCycles(cycles) {
    cycles.reverse();
    let prod = new Permutation();
    let flattened = new Set(cycles.reduce((acc, val) => acc.concat(val), []));
    let newCycles = [];
    while (flattened.size) {
        let first = Math.min(...flattened);
        let x = first;
        flattened.delete(first);
        let newCycle = [first];
        while (true) {
            for (const cycle of cycles) {
                const i = cycle.indexOf(x);
                if (i == -1) {
                    continue;
                }
                x = cycle[(i + 1) % cycle.length];
            }
            if (x == first) {
                break;
            }
            newCycle.push(x);
            flattened.delete(x);
        }
        newCycles.push(newCycle);
    }
    prod.fromCycles(newCycles);
    return prod;
}
function readCycles(str, disjoint = false) {
    const trimStr = str.replace(/^\s*\(|\)\s*$|\s/g, "");
    const list = trimStr
        .replace(/\)\(/g, ",")
        .replace(/[^0-9,]/g, "")
        .split(",")
        .map(Number);
    if (disjoint && new Set(list).size != list.length) {
        // check for duplicates
        return [];
    }
    const lists = trimStr.replace(/[^0-9,()]/g, "").split(")(");
    const cycles = lists.map((l) => l.split(",").map(Number));
    return cycles;
}
function isList(lst) {
    return lst.length == 0 || typeof lst[0] == "number";
}
function isPermutation(lst) {
    const sorted = lst.slice().sort((a, b) => a - b);
    for (let i = 0; i < lst.length; i++) {
        if (sorted[i] != i + 1)
            return false;
    }
    return true;
}
function randomPermutation(n) {
    let array = Array.from({ length: n }, (_, i) => i + 1);
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return new Permutation(array);
}
//# sourceMappingURL=permutations.js.map