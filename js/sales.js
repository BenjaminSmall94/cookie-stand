'use strict';

CookieShop.prototype.startRow = function(tableBody, rowName) {
  const tableRow = appendAndSet(tableBody, 'tr');
  const rowHeader = appendAndSet(tableRow, 'th', rowName);
  rowHeader.className = 'rowHeader';
  return tableRow;
};

CookieShop.prototype.render = function(shop, tableBody, earliestOpen, latestClose, isCookies) {
  const tableRow = this.startRow(tableBody, shop.myLoc);
  let maxCookies = 0;
  for(let currColumn = earliestOpen; currColumn < latestClose; currColumn++) {
    if(shop.dailyCookies[currColumn] !== undefined) {
      let currNum = shop.dailyCookies[currColumn];
      if(currNum > maxCookies) {
        maxCookies = currNum;
      }
      if(isCookies) {
        appendAndSet(tableRow, 'td', currNum);
      } else {
        if(currNum < 40) {
          appendAndSet(tableRow, 'td', 2);
        } else {
          appendAndSet(tableRow, 'td', Math.ceil(currNum / 20));
        }
      }
    } else {
      appendAndSet(tableRow, 'td');
    }
  }
  if(isCookies) {
    appendAndSet(tableRow, 'td', shop.totalCookies);
  } else {
    if(maxCookies < 40) {
      appendAndSet(tableRow, 'td', 2);
    } else {
      appendAndSet(tableRow, 'td', Math.ceil(maxCookies / 20));
    }
  }
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

let allShops = [
  new CookieShop('Seattle', 23, 65, 6.3, 6, 21),
  new CookieShop('Tokyo', 3, 24, 1.2, 6, 20),
  new CookieShop('Dubai', 11, 38, 3.7, 6, 20),
  new CookieShop('Paris', 20, 38, 3.7, 6, 20),
  new CookieShop('Lima', 2, 16, 4.6, 6, 20),
];

let widestOpenHours = findRange();
const tableContainer = document.getElementById('cookieShopHourlyValues');
printHTMLTable(tableContainer, widestOpenHours, 'Cookie Sales', 'Shop Total', true);
printHTMLTable(tableContainer, widestOpenHours, 'Staffing', 'Shop Max', false);

function printHTMLTable(tableContainer, widestOpenHours, tableName, rightColumnHeader, isCookies) {
  const cookieTable = setUpTable(tableContainer, tableName);
  printFirstRow(cookieTable, widestOpenHours[0], widestOpenHours[1], rightColumnHeader);
  printTableBody(cookieTable, widestOpenHours[0], widestOpenHours[1], isCookies);
  printFinalRow(cookieTable, widestOpenHours[0], widestOpenHours[1], isCookies);
}

function setUpTable(tableContainer, tableLabel) {
  appendAndSet(tableContainer, 'h2', 'Daily ' + tableLabel);
  return appendAndSet(tableContainer, 'table');
}

function printFirstRow(cookieTable, open, close, lastHeader) {
  const tableHead = appendAndSet(cookieTable, 'thead');
  const firstRow = appendAndSet(tableHead, 'tr');
  const firstEl = appendAndSet(firstRow, 'th');
  firstEl.id = 'firstEl';
  for(let i = open; i < close; i++) {
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
  appendAndSet(firstRow, 'th', lastHeader);
}

function printTableBody(cookieTable, earliestOpen, latestClose, isCookies) {
  const tableBody = appendAndSet(cookieTable, 'tbody');
  for(let row = 0; row < allShops.length; row++) {
    allShops[row].render(allShops[row], tableBody, earliestOpen, latestClose, isCookies);
  }
}

function printFinalRow(cookieTable, open, close, isCookies) {
  const tableFoot = getOrInitFooter(cookieTable, isCookies);
  const finalRow = appendAndSet(tableFoot, 'tr');
  const columnTotalHeader = appendAndSet(finalRow, 'th', 'Total');
  columnTotalHeader.className = 'rowHeader';
  let columnMax = 0;
  let overallTotal = 0;
  for(let currColumn = open; currColumn < close; currColumn++) {
    let columnVal = findColumnVal(currColumn);
    appendAndSet(finalRow, 'td', columnVal);
    overallTotal += columnVal;
    if(columnVal > columnMax) {
      columnMax = columnVal;
    }
  }
  if(isCookies) {
    appendAndSet(finalRow, 'td', overallTotal);
  } else {
    appendAndSet(finalRow, 'td', columnMax);
  }
}

function getOrInitFooter(cookieTable, isCookies) {
  let tableFoot;
  if(isCookies) {
    if(document.getElementById('cookie-table-footer') !== null) { // switch to strictly equals if able
      tableFoot = document.getElementById('cookie-table-footer').innerHTML = '';
    } else {
      tableFoot = appendAndSet(cookieTable, 'tfoot');
      tableFoot.id = 'cookie-table-footer';
    }
  } else {
    if(document.getElementById('worker-table-footer') !== null) { // switch to strictly equals if able
      tableFoot = document.getElementById('worker-table-footer').innerHTML = '';
    } else {
      tableFoot = appendAndSet(cookieTable, 'tfoot');
      tableFoot.id = 'worker-table-footer';
    }
  }
  return tableFoot;
}

function appendAndSet(parent, elemType, value) {
  const child = document.createElement(elemType);
  child.textContent = value;
  parent.appendChild(child);
  return child;
}

function findColumnVal(column) {
  let sum = 0;
  for(let i = 0; i < allShops.length; i++) {
    let val = allShops[i].dailyCookies[column];
    if(val !== undefined) {
      sum += val;
    }
  }
  return sum;
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
