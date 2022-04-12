'use strict';

const seattleShop = new CookieShop('Seattle', 23, 65, 6.3, 8, 20);
const tokyoShop = new CookieShop('Tokyo', 3, 24, 1.2, 8, 20);
const dubaiShop = new CookieShop('Dubai', 11, 38, 3.7, 8, 20);
const parisShop = new CookieShop('Paris', 20, 38, 3.7, 8, 20);
const limaShop = new CookieShop('Lima', 2, 16, 4.6, 8, 20);

printHTMLCookies(seattleShop.dailyCookies[0], seattleShop.dailyCookies[1], seattleShop.myLoc);
printHTMLCookies(tokyoShop.dailyCookies[0], tokyoShop.dailyCookies[1], tokyoShop.myLoc);
printHTMLCookies(dubaiShop.dailyCookies[0], dubaiShop.dailyCookies[1], dubaiShop.myLoc);
printHTMLCookies(parisShop.dailyCookies[0], parisShop.dailyCookies[1], parisShop.myLoc);
printHTMLCookies(limaShop.dailyCookies[0], limaShop.dailyCookies[1], limaShop.myLoc);

function printHTMLCookies(dailyCookiesArr, totalCookies, loc) {
  let allListContainer = document.getElementById('cookieShopHourlyValues');
  let listAndHeaderContainer = document.createElement('div');
  let listHeader = document.createElement('h3');
  let shopList = document.createElement('ul');
  listHeader.textContent = loc;
  listAndHeaderContainer.className = 'listContainer';
  allListContainer.appendChild(listAndHeaderContainer);
  listAndHeaderContainer.appendChild(listHeader);
  listAndHeaderContainer.appendChild(shopList);
  for(let i = 0; i < dailyCookiesArr.length; i++) {
    let cookieInfo = document.createElement('li');
    if (dailyCookiesArr[i][0] === 0) {
      cookieInfo.textContent = `12am: ${dailyCookiesArr[i][1]} cookies`;
    } else if(dailyCookiesArr[i][0] > 0 && dailyCookiesArr[i][0] < 12) {
      cookieInfo.textContent = `${dailyCookiesArr[i][0]}am: ${dailyCookiesArr[i][1]} cookies`;
    } else if (dailyCookiesArr[i][0] === 12) {
      cookieInfo.textContent = `${dailyCookiesArr[i][0]}pm: ${dailyCookiesArr[i][1]} cookies`;
    } else if (dailyCookiesArr[i][0] > 12 && dailyCookiesArr[i][0] < 24) {
      cookieInfo.textContent = `${dailyCookiesArr[i][0] - 12}pm: ${dailyCookiesArr[i][1]} cookies`;
    } else {
      cookieInfo.textContent = `Invalid Time (${dailyCookiesArr[i][0]}:00 ${dailyCookiesArr[i][1]} cookies`;
    }
    shopList.appendChild(cookieInfo);
  }
  let totalCookieElement = document.createElement('li');
  totalCookieElement.textContent = `Total: ${totalCookies} cookies`;
  shopList.appendChild(totalCookieElement);
}

function CookieShop(loc, min, max, avgCookies, open, close) {
  this.myLoc = loc;
  this.minCust = min;
  this.maxCust = max;
  this.cookiesPerCust = avgCookies;
  this.openTime = open;
  this.closeTime = close;
  this.dailyCookies = [];
  this.setDailyCookies = function() {
    let dailyCookiesArr = [];
    let totalCookies = 0;
    for(let i = 0; i < this.closeTime - this.openTime; i++) {
      let hourlyCust = Math.random() * (this.maxCust - this.minCust + 1) + this.minCust;
      let hourlyCookies = Math.ceil(hourlyCust * this.cookiesPerCust);
      totalCookies += hourlyCookies;
      dailyCookiesArr[i] = [i + this.openTime, hourlyCookies];
    }
    this.dailyCookies = [dailyCookiesArr, totalCookies];
  };
  this.setDailyCookies();
}
