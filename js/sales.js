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

CookieShop.prototype.render = function(shop, tableBody, columnTotal, earliestOpen, latestClose, isCookies) {
  const tableRow = this.startRow(tableBody, shop.myLoc);
  let maxCookies = 0;
  for(let column = earliestOpen; column < latestClose; column++) {
    let tableData = document.createElement('td');
    tableRow.appendChild(tableData);
    let currNum = shop.dailyCookies[column];
    if(currNum !== undefined) {
      if(currNum > maxCookies) {
        maxCookies = currNum;
      }
      if(isCookies) {
        tableData.textContent = currNum;
        columnTotal[column] += currNum;
      } else {
        if(currNum < 40) {
          tableData.textContent = 2;
          columnTotal[column] += 2;
        } else {
          tableData.textContent = Math.ceil(currNum / 20);
          columnTotal[column] += Math.ceil(currNum / 20);
        }
      }
    }
  }
  let shopTotal = document.createElement('td');
  if(isCookies) {
    shopTotal.textContent = shop.totalCookies;
  } else {
    if(maxCookies < 40) {
      shopTotal.textContent = 2;
    } else {
      shopTotal.textContent = Math.ceil(maxCookies / 20);
    }
  }
  tableRow.appendChild(shopTotal);
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
printHTMLTable(tableContainer, widestOpenHours, 'Cookie Sales', 'Shop Total', true);
printHTMLTable(tableContainer, widestOpenHours, 'Staffing', 'Shop Max', false);

function printHTMLTable(tableContainer, widestOpenHours, h2, rightColumnHeader, isCookies) {
  const cookieTable = setUpTable(tableContainer, h2);
  let columnTotal = [];
  printFirstRow(cookieTable, columnTotal, widestOpenHours[0], widestOpenHours[1], rightColumnHeader);
  printTableBody(cookieTable, columnTotal, widestOpenHours[0], widestOpenHours[1], isCookies);
  printFinalRow(cookieTable, columnTotal, widestOpenHours[0], widestOpenHours[1], isCookies);
}

function setUpTable(tableContainer, tableLabel) {
  const lable = document.createElement('h2');
  lable.textContent = 'Daily ' + tableLabel;
  tableContainer.appendChild(lable);
  const table = document.createElement('table');
  tableContainer.appendChild(table);
  return table;
}

function printFirstRow(cookieTable, columnTotal, open, close, lastHeader) {
  const tableHead = document.createElement('thead');
  const firstRow = document.createElement('tr');
  cookieTable.appendChild(tableHead);
  tableHead.appendChild(firstRow);
  let firstEl = document.createElement('th');
  firstRow.appendChild(firstEl);
  firstEl.id = 'firstEl';
  for(let i = open; i < close; i++) {
    columnTotal[i] = 0;
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

function printTableBody(cookieTable, columnTotal, earliestOpen, latestClose, isCookies) {
  const tableBody = document.createElement('tbody');
  cookieTable.appendChild(tableBody);
  for(let row = 0; row < allShops.length; row++) {
    allShops[row].render(allShops[row], tableBody, columnTotal, earliestOpen, latestClose, isCookies);
  }
}

function printFinalRow(cookieTable, columnTotal, open, close, isCookies) {
  const tableFoot = document.createElement('tfoot');
  const finalRow = document.createElement('tr');
  const columnTotalHeader = document.createElement('th');
  cookieTable.appendChild(tableFoot);
  tableFoot.appendChild(finalRow);
  finalRow.appendChild(columnTotalHeader);
  columnTotalHeader.className = 'rowHeader';
  columnTotalHeader.textContent = 'Totals';
  let columnMax = 0;
  let overallTotal = 0;
  for(let column = open; column < close; column++) {
    let columnTotalData = document.createElement('td');
    finalRow.appendChild(columnTotalData);
    let columnVal = columnTotal[column];
    columnTotalData.textContent = columnVal;
    overallTotal += columnVal;
    if(columnVal > columnMax) {
      columnMax = columnVal;
    }
  }
  let totalData = document.createElement('td');
  finalRow.appendChild(totalData);
  if(isCookies) {
    totalData.textContent = overallTotal;
  } else {
    totalData.textContent = columnMax;
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
