'use strict';
const fs = require('node:fs');
const readline = require('node:readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs });
const prefectureDateMap = new Map(); // key:都道府県, value:集計データのオブジェクト

rl.on('line', lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2016 || year === 2021) {
        let value = null;
        if (prefectureDateMap.has(prefecture)) {
            value = prefectureDateMap.get(prefecture)
        } else {
            value = {
                before: 0,
                after: 0,
                change: null,
            };
        }
        if (year === 2016) {
            value.before = popu;
        }
        if (year === 2021) {
            value.after = popu;
        }
        prefectureDateMap.set(prefecture, value)
    }
});

rl.on('close', () => {
    for (const [key, value] of prefectureDateMap) {
        value.change = value.after / value.before;
    }
    const rankingArray = Array.from(prefectureDateMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value], i) => {
        return `${i + 1}位 ${key}: ${value.before}=>${value.after} 変化率: ${value.change}`;
    });
    console.log(rankingStrings);
});