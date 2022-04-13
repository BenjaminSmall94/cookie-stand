'use strict';

CookieShop.prototype.startRow = function(tableBody, rowName) {
  const tableRow = document.createElement('tr');
  tableBody.appendChild(tableRow);
  const rowHeader = document.createElement('th');
  tableRow.appendChild(rowHeader);
  rowHeader.className = 'rowHeader';
  rowHeader.textContent = rowName;
  return tableRow;
};

CookieShop.prototype.renderCookies = function(shop, tableBody, cookieColumnTotal, earliestOpen, latestClose) {
  const tableRow = this.startRow(tableBody, shop.myLoc);
  let rowTotal = 0;
  for(let column = earliestOpen; column < latestClose; column++) {
    let cookieTableData = document.createElement('td');
    tableRow.appendChild(cookieTableData);
    if(shop.dailyCookies[column] !== undefined) {
      let cookieNum = shop.dailyCookies[column];
      cookieTableData.textContent = cookieNum;
      cookieColumnTotal[column] += cookieNum;
      rowTotal += cookieNum;
    }
  }
  let shopTotal = document.createElement('td');
  shopTotal.textContent = rowTotal;
  tableRow.appendChild(shopTotal);
  return shop.totalCookies;
};

CookieShop.prototype.renderWorkers = function(shop, tableBody, workerColumnTotal, earliestOpen, latestClose) {
  const tableRow = this.startRow(tableBody, shop.myLoc);
  let rowMax = 0;
  for(let column = earliestOpen; column < latestClose; column++) {
    let workerTableData = document.createElement('td');
    tableRow.appendChild(workerTableData);
    if(shop.dailyCookies[column] !== undefined) {
      let workerNum;
      if(shop.dailyCookies[column] < 40) {
        workerNum = 2;
      } else {
        workerNum = Math.ceil(shop.dailyCookies[column] / 20);
      }
      workerTableData.textContent = workerNum;
      workerColumnTotal[column] += workerNum;
      if(workerNum > rowMax) {
        rowMax = workerNum;
      }
    }
  }
  let shopTotal = document.createElement('td');
  shopTotal.textContent = rowMax;
  tableRow.appendChild(shopTotal);
  return shop.totalCookies;
};

CookieShop.prototype.setDailyCookies = function() {
  let dailyCookiesArr = [];
  let cookieProportion = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6, 0.5, 0.5, 0.5, 0.5];
  for(let i = this.openTime; i < this.closeTime; i++) {
    let hourlyCust = Math.random() * (this.maxCust - this.minCust + 1) + this.minCust;
    let hourlyCookies = Math.ceil(hourlyCust * this.cookiesPerCust * cookieProportion[i]);
    dailyCookiesArr[i] = hourlyCookies;
    this.totalCookies += dailyCookiesArr[i];
  }
  this.dailyCookies = dailyCookiesArr;
};

const seattleShop = new CookieShop('Seattle', 23, 65, 6.3, 6, 20);
const tokyoShop = new CookieShop('Tokyo', 3, 24, 1.2, 6, 20);
const dubaiShop = new CookieShop('Dubai', 11, 38, 3.7, 6, 20);
const parisShop = new CookieShop('Paris', 20, 38, 3.7, 6, 20);
const limaShop = new CookieShop('Lima', 2, 16, 4.6, 6, 20);
let allShops = [seattleShop, tokyoShop, dubaiShop, parisShop, limaShop];
let widestOpenHours = findRange();
const tableContainer = document.getElementById('cookieShopHourlyValues');
printHTMLCookies(tableContainer, widestOpenHours);
printHTMLWorkers(tableContainer, widestOpenHours);

function printHTMLCookies(tableContainer, widestOpenHours) {
  const cookieTable = setUpTable(tableContainer, 'Cookie Sales');
  let cookieColumnTotal = [];
  printFirstRow(cookieTable, cookieColumnTotal, widestOpenHours[0], widestOpenHours[1], 'Shop Total');
  let overallTotal = printCookieTableBody(cookieTable, cookieColumnTotal, widestOpenHours[0], widestOpenHours[1]);
  printFinalRow(cookieTable, cookieColumnTotal, overallTotal, widestOpenHours[0], widestOpenHours[1]);
}

function printHTMLWorkers(tableContainer, widestOpenHours) {
  const workerTable = setUpTable(tableContainer, 'Staffing');
  let workerColumnTotal = [];
  printFirstRow(workerTable, workerColumnTotal, widestOpenHours[0], widestOpenHours[1], 'Shop Max');
  let hourlyWorkerMax = printWorkerTableBody(workerTable, workerColumnTotal, widestOpenHours[0], widestOpenHours[1]);
  printFinalRow(workerTable, workerColumnTotal, hourlyWorkerMax, widestOpenHours[0], widestOpenHours[1]);
}

function setUpTable(tableContainer, tableLabel) {
  const lable = document.createElement('h2');
  lable.textContent = 'Daily ' + tableLabel;
  tableContainer.appendChild(lable);
  const table = document.createElement('table');
  tableContainer.appendChild(table);
  return table;
}

function printFirstRow(cookieTable, cookieColumnTotal, open, close, lastHeader) {
  const tableHead = document.createElement('thead');
  const firstRow = document.createElement('tr');
  cookieTable.appendChild(tableHead);
  tableHead.appendChild(firstRow);
  let firstEl = document.createElement('th');
  firstRow.appendChild(firstEl);
  firstEl.id = 'firstEl';
  for(let i = open; i < close; i++) {
    cookieColumnTotal[i] = 0;
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
  rowTotalHeader.textContent = lastHeader;
}

function printCookieTableBody(cookieTable, cookieColumnTotal, earliestOpen, latestClose) {
  const tableBody = document.createElement('tbody');
  cookieTable.appendChild(tableBody);
  let overallTotal = 0;
  for(let row = 0; row < allShops.length; row++) {
    overallTotal += allShops[row].renderCookies(allShops[row], tableBody, cookieColumnTotal, earliestOpen, latestClose);
  }
  return overallTotal;
}

function printWorkerTableBody(cookieTable, cookieColumnTotal, earliestOpen, latestClose) {
  const tableBody = document.createElement('tbody');
  cookieTable.appendChild(tableBody);
  for(let row = 0; row < allShops.length; row++) {
    Math.ceil(allShops[row].renderWorkers(allShops[row], tableBody, cookieColumnTotal, earliestOpen, latestClose));
  }
}

function printFinalRow(cookieTable, cookieColumnTotal, overallTotal, open, close) {
  const tableFoot = document.createElement('tfoot');
  const finalRow = document.createElement('tr');
  const columnTotalHeader = document.createElement('th');
  cookieTable.appendChild(tableFoot);
  tableFoot.appendChild(finalRow);
  finalRow.appendChild(columnTotalHeader);
  columnTotalHeader.className = 'rowHeader';
  columnTotalHeader.textContent = 'Totals';
  let columnMax = 0;
  for(let column = open; column < close; column++) {
    let columnTotalData = document.createElement('td');
    finalRow.appendChild(columnTotalData);
    let columnVal = cookieColumnTotal[column];
    columnTotalData.textContent = columnVal;
    if(columnVal > columnMax) {
      columnMax = columnVal;
    }
  }
  let totalData = document.createElement('td');
  finalRow.appendChild(totalData);
  if(overallTotal === undefined) {
    totalData.textContent = columnMax;
  } else {
    totalData.textContent = overallTotal;
  }
}

function findRange() {
  let earliestOpen;
  let latestClose;
  for(let i = 0; i < allShops.length; i++) {
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

function CookieShop(loc, min, max, avgCookies, open, close) {
  this.myLoc = loc;
  this.minCust = min;
  this.maxCust = max;
  this.cookiesPerCust = avgCookies;
  this.openTime = open;
  this.closeTime = close;
  this.totalCookies = 0;
  this.dailyCookies = [];
  this.setDailyCookies();
}
