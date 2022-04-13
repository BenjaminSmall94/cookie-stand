'use strict';

let allShops = [];
const seattleShop = new CookieShop('Seattle', 23, 65, 6.3, 6, 20);
const tokyoShop = new CookieShop('Tokyo', 3, 24, 1.2, 6, 20);
const dubaiShop = new CookieShop('Dubai', 11, 38, 3.7, 6, 20);
const parisShop = new CookieShop('Paris', 20, 38, 3.7, 6, 20);
const limaShop = new CookieShop('Lima', 2, 16, 4.6, 6, 20);
allShops.push(seattleShop, tokyoShop, dubaiShop, parisShop, limaShop);
printHTMLCookies();

function printHTMLCookies() {
  const allListContainer = document.getElementById('cookieShopHourlyValues');
  const cityTable = document.createElement('table');
  allListContainer.appendChild(cityTable);
  let openHours = findRange();
  let columnTotals = [];
  printFirstRow(cityTable, openHours[0], openHours[1], columnTotals);
  const tableBody = document.createElement('tbody');
  cityTable.appendChild(tableBody);
  let overallTotal = 0;
  for(let row = 0; row < allShops.length; row++) {
    overallTotal += allShops[row].render(allShops[row], tableBody, columnTotals, openHours[0], openHours[1]);
  }
  printFinalRow(cityTable, columnTotals, overallTotal, openHours[0], openHours[1]);
}

function findRange() {
  let earliestOpen;
  let latestClose;
  for(let i = 0; i < allShops.length; i++) {
    console.log(allShops[i].myLoc);
    console.log(allShops[i].closeTime);
    if(earliestOpen === undefined) {
      earliestOpen = allShops[i].openTime;
    } else if (allShops[i].openTime < earliestOpen) {
      earliestOpen = allShops[i].openTime;
    }
    if(latestClose === undefined) {
      latestClose = allShops[i].closeTime;
    } else if (allShops[i].closeTime > latestClose) {
      latestClose = allShops[i].closeTime;
    }
  }
  return [earliestOpen, latestClose];
}

function printFinalRow(cityTable, columnTotals, overallTotal, open, close) {
  const tableFoot = document.createElement('tfoot');
  const finalRow = document.createElement('tr');
  const columnTotalHeader = document.createElement('th');
  cityTable.appendChild(tableFoot);
  tableFoot.appendChild(finalRow);
  finalRow.appendChild(columnTotalHeader);
  columnTotalHeader.className = 'rowHeader';
  columnTotalHeader.textContent = 'Totals';
  for(let column = open; column < close; column++) {
    let columnTotalData = document.createElement('td');
    finalRow.appendChild(columnTotalData);
    columnTotalData.textContent = columnTotals[column];
  }
  let totalData = document.createElement('td');
  finalRow.appendChild(totalData);
  totalData.textContent = overallTotal;
  console.log(columnTotals);
}

function printFirstRow(cityTable, open, close, columnTotals) {
  const tableHead = document.createElement('thead');
  const firstRow = document.createElement('tr');
  cityTable.appendChild(tableHead);
  tableHead.appendChild(firstRow);
  let firstEl = document.createElement('th');
  firstRow.appendChild(firstEl);
  firstEl.id = 'firstEl';
  for(let i = open; i < close; i++) {
    columnTotals[i] = 0;
    let hourHeader = document.createElement('th');
    if (i === 0) {
      hourHeader.textContent = '12:00am';
    } else if(i > 0 && i < 12) {
      hourHeader.textContent = `${i}:00am`;
    } else if (i === 12) {
      hourHeader.textContent = `${i}:00pm`;
    } else if (i > 12 && i < 24) {
      hourHeader.textContent = `${i - 12}:00pm`;
    } else {
      hourHeader.textContent = 'Invalid Time';
    }
    firstRow.appendChild(hourHeader);
  }
  let rowTotalHeader = document.createElement('th');
  firstRow.appendChild(rowTotalHeader);
  rowTotalHeader.textContent = 'Daily Total';
}

function CookieShop(loc, min, max, avgCookies, open, close) {
  this.myLoc = loc;
  this.minCust = min;
  this.maxCust = max;
  this.cookiesPerCust = avgCookies;
  this.openTime = open;
  this.closeTime = close;
  this.dailyCookies = [];
  this.totalCookies = 0;

  this.setDailyCookies = function() {
    let dailyCookiesArr = [];
    for(let i = this.openTime; i < this.closeTime; i++) {
      let hourlyCust = Math.random() * (this.maxCust - this.minCust + 1) + this.minCust;
      let hourlyCookies = Math.ceil(hourlyCust * this.cookiesPerCust);
      dailyCookiesArr[i] = hourlyCookies;
      this.totalCookies += dailyCookiesArr[i];
    }
    this.dailyCookies = dailyCookiesArr;
  };

  this.render = function(shop, tableBody, columnTotals, earliestOpen, latestClose) {
    const tableRow = document.createElement('tr');
    tableBody.appendChild(tableRow);
    const rowHeader = document.createElement('th');
    tableRow.appendChild(rowHeader);
    rowHeader.className = 'rowHeader';
    rowHeader.textContent = shop.myLoc;
    let rowTotal = 0;
    for(let column = earliestOpen; column < latestClose ; column++) {
      let tableData = document.createElement('td');
      tableRow.appendChild(tableData);
      if(shop.dailyCookies[column] !== undefined) {
        let cookieNum = shop.dailyCookies[column];
        tableData.textContent = cookieNum;
        columnTotals[column] += cookieNum;
        rowTotal += cookieNum;
      }
    }
    let shopTotal = document.createElement('td');
    shopTotal.textContent = rowTotal;
    tableRow.appendChild(shopTotal);
    return shop.totalCookies;
  };
  this.setDailyCookies();
}
