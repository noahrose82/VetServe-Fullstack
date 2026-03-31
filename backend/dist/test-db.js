"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function test() {
    const [rows] = await db_1.pool.query('SELECT 1 + 1 AS result');
    console.log(rows);
    process.exit(0);
}
test();
