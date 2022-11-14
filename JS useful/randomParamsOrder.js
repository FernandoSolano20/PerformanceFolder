var urls = []

Array.prototype.shuffle = function shuffle() {
  let currentIndex = this.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [this[currentIndex], this[randomIndex]] = [
      this[randomIndex], this[currentIndex]];
  }

  return this;
}


function getNewUrl(url) {
    var params = url.split('?');
    var domain = params.shift();
    params = params[0];
    params = params.split('&');
    params.shuffle();
    var newUrl = `${domain}?${params.join('&')}`
    if (!urls.includes(newUrl)) {
        urls.push(newUrl);
    }
    return newUrl;
}

for (let index = 0; index < 2000; index++) {
    getNewUrl("http://sprint-api.newhomesource.com/api/V2/search/communities?algorithm=md5&alpharesults=1&client=NewHomeSource&includempc=1&marketid=269&noboyl=1&pagesize=20&partnerid=1&sessiontoken=NHSSessionToken&sortby=Random&state=TX");
    getNewUrl("http://sprint-api.newhomesource.com/api/V2/search/communities?algorithm=md5&alpharesults=1&client=NewHomeSource&customresults=1&excludebasiclistings=1&excludecountsandfacets=1&excluderegularcomms=1&includempc=0&marketid=269&mfr=1&noboyl=1&page=1&pagesize=20&partnerid=1&sessiontoken=NHSSessionToken&sortby=Distance&sortorder=1&sortsecondby=None&state=TX");
    getNewUrl("http://sprint-api.newhomesource.com/api/V2/search/brands?algorithm=md5&client=NewHomeSource&custom=1&customresults=1&includempc=1&marketid=269&mfr=1&pagesize=10000&partnerid=1&sessiontoken=NHSSessionToken&sortby=Brand&sortsecondby=None");
}

urls.forEach(x => {
    return console.log(x + ";")
});