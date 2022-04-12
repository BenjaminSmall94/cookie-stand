'use strict';

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

const seattleShop = {
  myLoc: 'Seattle',
  minCust: 23,
  maxCust: 65,
  cookiesPerCust: 6.3,
  openTime: 6,
  closeTime: 20,
  dailyCookies: [],

  hourlyCust: function(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  getDailyCookies: function() {
    let dailyCookiesArr = [];
    let totalCookies = 0;
    for(let i = 0; i < this.closeTime - this.openTime; i++) {
      let hourlyCookies = Math.ceil(this.hourlyCust(this.maxCust, this.minCust) * this.cookiesPerCust);
      totalCookies += hourlyCookies;
      dailyCookiesArr[i] = [i + this.openTime, hourlyCookies];
    }
    return [dailyCookiesArr, totalCookies];
  },
};

const tokyoShop = {
  myLoc: 'Tokyo',
  minCust: 3,
  maxCust: 24,
  cookiesPerCust: 1.2,
  openTime: 6,
  closeTime: 20,
  dailyCookies: [],

  hourlyCust: function(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  getDailyCookies: function() {
    let dailyCookiesArr = [];
    let totalCookies = 0;
    for(let i = 0; i < this.closeTime - this.openTime; i++) {
      let hourlyCookies = Math.ceil(this.hourlyCust(this.maxCust, this.minCust) * this.cookiesPerCust);
      totalCookies += hourlyCookies;
      dailyCookiesArr[i] = [i + this.openTime, hourlyCookies];
    }
    return [dailyCookiesArr, totalCookies];
  },
};

const dubaiShop = {
  myLoc: 'Dubai',
  minCust: 11,
  maxCust: 38,
  cookiesPerCust: 3.7,
  openTime: 6,
  closeTime: 20,
  dailyCookies: [],

  hourlyCust: function(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  getDailyCookies: function() {
    let dailyCookiesArr = [];
    let totalCookies = 0;
    for(let i = 0; i < this.closeTime - this.openTime; i++) {
      let hourlyCookies = Math.ceil(this.hourlyCust(this.maxCust, this.minCust) * this.cookiesPerCust);
      totalCookies += hourlyCookies;
      dailyCookiesArr[i] = [i + this.openTime, hourlyCookies];
    }
    return [dailyCookiesArr, totalCookies];
  },
};

const parisShop = {
  myLoc: 'Paris',
  minCust: 20,
  maxCust: 38,
  cookiesPerCust: 2.3,
  openTime: 6,
  closeTime: 20,
  dailyCookies: [],

  hourlyCust: function(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  getDailyCookies: function() {
    let dailyCookiesArr = [];
    let totalCookies = 0;
    for(let i = 0; i < this.closeTime - this.openTime; i++) {
      let hourlyCookies = Math.ceil(this.hourlyCust(this.maxCust, this.minCust) * this.cookiesPerCust);
      totalCookies += hourlyCookies;
      dailyCookiesArr[i] = [i + this.openTime, hourlyCookies];
    }
    return [dailyCookiesArr, totalCookies];
  },
};

const limaShop = {
  myLoc: 'Lima',
  minCust: 2,
  maxCust: 16,
  cookiesPerCust: 4.6,
  openTime: 6,
  closeTime: 20,
  dailyCookies: [],

  hourlyCust: function(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  getDailyCookies: function() {
    let dailyCookiesArr = [];
    let totalCookies = 0;
    for(let i = 0; i < this.closeTime - this.openTime; i++) {
      let hourlyCookies = Math.ceil(this.hourlyCust(this.maxCust, this.minCust) * this.cookiesPerCust);
      totalCookies += hourlyCookies;
      dailyCookiesArr[i] = [i + this.openTime, hourlyCookies];
    }
    return [dailyCookiesArr, totalCookies];
  },
};

seattleShop.dailyCookies = seattleShop.getDailyCookies();
tokyoShop.dailyCookies = tokyoShop.getDailyCookies();
dubaiShop.dailyCookies = dubaiShop.getDailyCookies();
parisShop.dailyCookies = parisShop.getDailyCookies();
limaShop.dailyCookies = limaShop.getDailyCookies();

printHTMLCookies(seattleShop.dailyCookies[0], seattleShop.dailyCookies[1], seattleShop.myLoc);
printHTMLCookies(tokyoShop.dailyCookies[0], tokyoShop.dailyCookies[1], tokyoShop.myLoc);
printHTMLCookies(dubaiShop.dailyCookies[0], dubaiShop.dailyCookies[1], dubaiShop.myLoc);
printHTMLCookies(parisShop.dailyCookies[0], parisShop.dailyCookies[1], parisShop.myLoc);
printHTMLCookies(limaShop.dailyCookies[0], limaShop.dailyCookies[1], limaShop.myLoc);
