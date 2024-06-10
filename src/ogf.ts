/* Copyright © 2024, Sera Gunn
   SPDX-License-Identifier: GPL-3.0-or-later */

function randint(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randsigned(max: number): number {
    return (Math.random() < 0.5 ? -1 : 1) * randint(1, max);
}

function geo(a: number, r: number): string {
    const abs_r = Math.abs(r);
    const r_text = (r < 0 ? "+" : "-") + (abs_r == 1 ? "" : abs_r)
    return (a < 0 ? "-" : "") + "\\frac{" + Math.abs(a) + "}{1" + r_text + "x}";
}

function geoRE(a: number, r: number): RegExp {
    const a_re = a == 1 ? "" : (a == -1 ? "-\\s*" : a + "\\s*\\*?\\s*");
    const ratio_re = r == 1 ? "" : (r > 0 ? r + "\\^n" : "\\(" + r + "\\)\\^n");
    const re = new RegExp(a == 1 && r == 1 ? "^\\s*1\\s*$" : "^\\s*" + a_re + ratio_re + "\\s*$");
    return re;
}

function seq(a: number, an: number, r: number, rn: number): string {
    let seq = "0,".repeat(an);
    for (let i = 0; i < Math.floor((10 - an)/rn); i++) {
        seq += a * r**i;
        seq += "," + "0,".repeat(rn - 1);
    }
    return seq;
}

function monomialRE(coef: number, exp: number): RegExp {
    if (exp == 0) {
        return new RegExp("^\\s*" + coef + "\\s*$");
    }
    let re = "^\\s*";
    re += coef == 1 ? "" : (coef == -1 ? "-\\s*" : coef + "\\s*\\*?\\s*");
    re += exp == 1 ? "x" : "x\\^" + exp;
    re += "\\s*$";
    return new RegExp(re);
}
