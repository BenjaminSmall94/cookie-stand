'use strict';

CookieShop.prototype.startRow = function(tableBody, rowName) {
  const tableRow = appendAndSet(tableBody, 'tr');
  const rowHeader = appendAndSet(tableRow, 'th', rowName);
  rowHeader.className = 'rowHeader';
  return tableRow;
};

CookieShop.prototype.render = function(isCookies) {
  const tableRow = this.startRow(getTableBody(isCookies), this.myLoc);
  let maxCookies = 0;
  for(let currColumn = widestOpenHours[0]; currColumn < widestOpenHours[1]; currColumn++) {
    if(this.dailyCookies[currColumn] !== undefined) {
      let currNum = this.dailyCookies[currColumn];
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
    appendAndSet(tableRow, 'td', this.totalCookies);
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
    let hourlyCust = Math.floor(Math.random() * (this.maxCust - this.minCust + 1)) + this.minCust;
    let hourlyCookies = Math.ceil(hourlyCust * this.cookiesPerCust * cookieProportion[i]);
    dailyCookiesArr[i] = hourlyCookies;
    this.totalCookies += dailyCookiesArr[i];
  }
  this.dailyCookies = dailyCookiesArr;
};

let allShops = [
  new CookieShop('Seattle', 23, 65, 6.3, 6, 20),
  new CookieShop('Tokyo', 3, 24, 1.2, 6, 20),
  new CookieShop('Dubai', 11, 38, 3.7, 6, 20),
  new CookieShop('Paris', 20, 38, 3.7, 6, 20),
  new CookieShop('Lima', 2, 16, 4.6, 6, 20),
];

let widestOpenHours = findRange();
const tableContainer = document.getElementById('cookieShopHourlyValues');
let tables = [];
let tableHead = [];
let tableBody = [];
let tableFoot = [];
printHTMLTable('Cookie Sales', 'Shop Total', true);
printHTMLTable('Staffing', 'Shop Max', false);
document.getElementById('New Store').addEventListener('submit', initNewShop);

function printHTMLTable(tableName, rightColumnHeader, isCookies) {
  if (isCookies) {
    tables[0] = setUpTable(tableName);
  } else {
    tables[1] = setUpTable(tableName);
  }
  printFirstRow(isCookies, rightColumnHeader);
  printTableBody(isCookies);
  printFinalRow(isCookies);
}

function setUpTable(tableLabel) {
  appendAndSet(tableContainer, 'h2', 'Daily ' + tableLabel);
  return appendAndSet(tableContainer, 'table');
}

function printFirstRow(isCookies, lastHeader) {
  let currTable = initializeSection(isCookies, tableHead, 'thead');
  const firstRow = appendAndSet(currTable, 'tr');
  const firstEl = appendAndSet(firstRow, 'th');
  firstEl.id = 'firstEl';
  for(let i = widestOpenHours[0]; i < widestOpenHours[1]; i++) {
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

function printTableBody(isCookies) {
  initializeSection(isCookies, tableBody, 'tbody');
  for(let row = 0; row < allShops.length; row++) {
    allShops[row].render(isCookies);
  }
}

function printFinalRow(isCookies) {
  const currSection = initializeSection(isCookies, tableFoot, 'tfoot');
  const finalRow = appendAndSet(currSection, 'tr');
  const columnTotalHeader = appendAndSet(finalRow, 'th', 'Total');
  columnTotalHeader.className = 'rowHeader';
  let columnMax = 0;
  let overallTotal = 0;
  for(let currColumn = widestOpenHours[0]; currColumn < widestOpenHours[1]; currColumn++) {
    let columnVal = findColumnVal(currColumn, isCookies);
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

function appendAndSet(parent, elemType, value) {
  const child = document.createElement(elemType);
  child.textContent = value;
  parent.appendChild(child);
  return child;
}

function findColumnVal(column, isCookies) {
  let sum = 0;
  for(let i = 0; i < allShops.length; i++) {
    let hourlyCookies = allShops[i].dailyCookies[column];
    if(hourlyCookies !== undefined) {
      if(isCookies) {
        sum += hourlyCookies;
      } else {
        if(hourlyCookies > 40) {
          sum += Math.ceil(hourlyCookies / 20);
        } else {
          sum += 2;
        }
      }
    }
  }
  return sum;
}

function getTableBody(isCookies) {
  if(isCookies) {
    return tableBody[0];
  } else {
    return tableBody[1];
  }
}

function initializeSection(isCookies, currSection, elType) {
  if(isCookies) {
    if(currSection[0] !== undefined) {
      currSection[0].innerHTML = '';
    } else {
      currSection[0] = appendAndSet(tables[0], elType);
    }
    return currSection[0];
  } else {
    if(currSection[1] !== undefined) {
      currSection[1].innerHTML = '';
    } else {
      currSection[1] = appendAndSet(tables[1], elType);
    }
    return currSection[1];
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

function initNewShop(event) {
  event.preventDefault();
  let loc = event.target.loc.value;
  let min = parseInt(event.target.min.value);
  let max = parseInt(event.target.max.value);
  let avg = parseFloat(event.target.avg.value);
  let open = parseInt(event.target.open.value);
  let close = parseInt(event.target.close.value);
  let newStand = new CookieShop(loc, min, max, avg, open, close);
  allShops.push(newStand);
  let expandedHours = false;
  if(newStand.openTime < widestOpenHours[0]) {
    widestOpenHours[0] = newStand.openTime;
    expandedHours = true;
  }
  if(newStand.closeTime > widestOpenHours[1]) {
    widestOpenHours[1] = newStand.closeTime;
    expandedHours = true;
  }
  if(expandedHours) {
    printHTMLTable('Cookie Sales', 'Shop Total', true);
    printHTMLTable('Staffing', 'Shop Max', false);
  } else {
    updateTable(newStand, true);
    updateTable(newStand, false);
  }
}

function updateTable(newStand, isCookies) {
  newStand.render(isCookies);
  printFinalRow(isCookies);
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
