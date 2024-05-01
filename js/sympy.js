// const { loadPyodide } = require("pyodide");
// import { loadPyodide } from "pyodide";
async function main() {
    const pyodide = await loadPyodide({
        packages: ["sympy"]
    });
    pyodide.runPython(`
        from sympy.abc import x
        from sympy import *
        print("hello from python")
    `);
    return pyodide;
}
const pyodidePromise = main();
async function testEqual(expr1, expr2) {
    const pyodide = await pyodidePromise;
    const val = pyodide.runPython(`(${expr1}).equals(${expr2})`);
    return val;
}
