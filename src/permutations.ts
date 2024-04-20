/* Copyright © 2024, Trevor Gunn
   SPDX-License-Identifier: GPL-3.0-or-later */

class Permutation {
    n: number = 0;
    list: number[] = [];
    cycles: number[][] = [];

    fromList(lst: number[]) {
        this.n = lst.length;
        this.list = lst.slice();
        this.cycles = [];
        for (let i = 1; i <= this.n; i++) {
            if (!lst[i - 1]) {
                continue;
            }
            let first = i;
            let cycle = [i];
            let next: number
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

    fromCycles(cycles: number[][], n: number) {
        this.cycles = sortCycles(cycles);
        this.n = n;
        this.list = Array.from({ length: n }, (_, i) => i + 1); // [1..n]
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

    parseList(str: string): this {
        const lst = str.replace(/[^0-9,]/g, '').split(',').map(Number);
        if (isPermutation(lst))
            this.fromList(lst);
        return this;
    }

    parseCycles(str: string, n: number | null = null): this {
        const trimStr = str.replace(/^\s*\(|\)\s*$|\s/g, '');
        const list = trimStr.replace(/\)\(/g, ',').replace(/[^0-9,]/g, '').split(',').map(Number);
        n = Math.max(...list, n);
        if (new Set(list).size != list.length) { // check for duplicates
            return;
        }
        const lists = trimStr.replace(/[^0-9,()]/g, '').split(')(');
        let cycles = lists.map(l => l.split(',').map(Number));
        this.fromCycles(cycles, n);
        return this;
    }

    equals(perm: Permutation): boolean {
        if (this.n !== perm.n) {
            return false;
        }
        for (let i = 0; i < this.n; i++) {
            if (this.list[i] !== perm.list[i]) {
                return false;
            }
        }
        return true;
    }

    mul(y: this): Permutation {
        const n = Math.max(this.n, y.n);
        let prod = new Permutation();
        const cycles = y.cycles.concat(this.cycles);
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
        prod.fromCycles(newCycles, n);
        return prod;
    }

    constructor(lst: number[] | number[][] = [], n: number | null = null) {
        if (isList(lst))
            this.fromList(lst);
        else if (n)
            this.fromCycles(lst, n);
    }
}

function cmpCycle(c1: number[], c2: number[]): number {
    return Math.min(...c1) - Math.min(...c2);
}

function sortCycles(cycles: number[][]): number[][] {
    const newCycles = cycles.filter((cycle) => cycle.length > 1).sort(cmpCycle);
    let retCycles = []
    for (const cycle of newCycles) {
        const m = Math.min(...cycle);
        const j = cycle.findIndex((x) => x === m);
        const left = cycle.slice(0, j);
        const right = cycle.slice(j);
        retCycles.push(right.concat(left));
    }
    return retCycles;
}

function isList(lst: number[] | number[][]): lst is number[] {
    return lst.length == 0 || typeof lst[0] == 'number';
}

function isPermutation(lst: number[]): boolean {
    const sorted = lst.slice().sort();
    for (let i = 0; i < lst.length; i++) {
        if (sorted[i] != i + 1)
            return false;
    }
    return true;
}
