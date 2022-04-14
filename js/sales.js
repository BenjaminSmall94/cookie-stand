'use strict';

CookieShop.prototype.startRow = function(tableBody, rowName) {
  const tableRow = appendAndSet(tableBody, 'tr');
  const rowHeader = appendAndSet(tableRow, 'th', rowName);
  rowHeader.className = 'rowHeader';
  return tableRow;
};

CookieShop.prototype.render = function(earliestOpen, latestClose, isCookies) {
  const tableBody = getTableBody(isCookies);
  const tableRow = this.startRow(tableBody, this.myLoc);
  let maxCookies = 0;
  for(let currColumn = earliestOpen; currColumn < latestClose; currColumn++) {
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
printHTMLTable(widestOpenHours, 'Cookie Sales', 'Shop Total', true);
printHTMLTable(widestOpenHours, 'Staffing', 'Shop Max', false);
document.getElementById('New Store').addEventListener('submit', initNewShop);

function printHTMLTable(widestOpenHours, tableName, rightColumnHeader, isCookies) {
  const cookieTable = setUpTable(tableName);
  printFirstRow(cookieTable, widestOpenHours[0], widestOpenHours[1], isCookies, rightColumnHeader);
  printTableBody(cookieTable, widestOpenHours[0], widestOpenHours[1], isCookies);
  printFinalRow(cookieTable, widestOpenHours[0], widestOpenHours[1], isCookies);
}

function setUpTable(tableLabel) {
  appendAndSet(tableContainer, 'h2', 'Daily ' + tableLabel);
  return appendAndSet(tableContainer, 'table');
}

function printFirstRow(cookieTable, open, close, isCookies, lastHeader) {
  const tableHead = initializeHeader(cookieTable, isCookies);
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
  let tableBody = getTableBody(isCookies);
  initializeTableBody(cookieTable, tableBody, isCookies);
  for(let row = 0; row < allShops.length; row++) {
    allShops[row].render(earliestOpen, latestClose, isCookies);
  }
}

function printFinalRow(cookieTable, open, close, isCookies) {
  const tableFoot = initializeFooter(cookieTable, isCookies);
  const finalRow = appendAndSet(tableFoot, 'tr');
  const columnTotalHeader = appendAndSet(finalRow, 'th', 'Total');
  columnTotalHeader.className = 'rowHeader';
  let columnMax = 0;
  let overallTotal = 0;
  for(let currColumn = open; currColumn < close; currColumn++) {
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
    return document.getElementById('cookieTableBody');
  } else {
    return document.getElementById('workerTableBody');
  }
}

function initializeHeader(cookieTable, isCookies) {
  let tableHead;
  if(isCookies) {
    if(document.getElementById('cookie-table-head') !== null) {
      tableHead = document.getElementById('cookie-table-head');
      tableHead.innerHTML = '';
    } else {
      tableHead = appendAndSet(cookieTable, 'thead');
      tableHead.id = 'cookie-table-head';
    }
  } else {
    if(document.getElementById('worker-table-head') !== null) {
      tableHead = document.getElementById('worker-table-head');
      tableHead.innerHTML = '';
    } else {
      tableHead = appendAndSet(cookieTable, 'thead');
      tableHead.id = 'worker-table-head';
    }
  }
  return tableHead;
}

function initializeTableBody(cookieTable, tableBody, isCookies) {
  if(tableBody === null) {
    tableBody = appendAndSet(cookieTable, 'tbody');
    if(isCookies) {
      tableBody.id = 'cookieTableBody';
    } else {
      tableBody.id = 'workerTableBody';
    }
  } else {
    tableBody.innerHTML = '';
  }
}

function initializeFooter(cookieTable, isCookies) {
  let tableFoot;
  if(isCookies) {
    if(document.getElementById('cookie-table-footer') !== null) {
      tableFoot = document.getElementById('cookie-table-footer');
      tableFoot.innerHTML = '';
    } else {
      tableFoot = appendAndSet(cookieTable, 'tfoot');
      tableFoot.id = 'cookie-table-footer';
    }
  } else {
    if(document.getElementById('worker-table-footer') !== null) {
      tableFoot = document.getElementById('worker-table-footer');
      tableFoot.innerHTML = '';
    } else {
      tableFoot = appendAndSet(cookieTable, 'tfoot');
      tableFoot.id = 'worker-table-footer';
    }
  }
  return tableFoot;
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
    printHTMLTable(widestOpenHours, 'Cookie Sales', 'Shop Total', true);
    printHTMLTable(widestOpenHours, 'Staffing', 'Shop Max', false);
  } else {
    newStand.render(widestOpenHours[0], widestOpenHours[1], true);
    printFinalRow(null, widestOpenHours[0], widestOpenHours[1], true);
    newStand.render(widestOpenHours[0], widestOpenHours[1], false);
    printFinalRow(null, widestOpenHours[0], widestOpenHours[1], false);
  }
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
