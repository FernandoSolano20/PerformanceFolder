var median = function (arr) {
    var mid = Math.floor(arr.length / 2);
    var nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

var urls = [];
var url = "http://sprint-api.newhomesource.com/api/V2/search/homes?aggregateoptions=True&algorithm=md5&alpharesults=1&client=NewHomeSource&includempc=1&maxlat=31.2022219544001&maxlng=-95.2709291640625&minlat=29.4001145657432&minlng=-100.544366664062&noboyl=1&page=1&pagesize=15&partnerid=1&sessiontoken=NewHomeSource&sortby=Random&state=TX";
var urlTransform = url.split("&");
var length = urlTransform.length;
for (var i = 0; i < length; i++) {
    for (var j = 0; j < 10; j++) {
        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange",
            function webPageTestResponseReady() {
                var data = null;
                if (this.readyState === this.DONE) {
                    data = JSON.parse(this.response);
                    var responseUrl = this.responseURL.split("&");
                    responseUrl[responseUrl.length - 1] = "";
                    var response = responseUrl.join("&");
                    response = response.substring(0, response.length - 1);
                    if (!urls[response]) {
                        urls[response] = [];
                    }
                    var time = data.Time.split(":");
                    var totalTime = 0;
                    time[0] !== "00" && (totalTime += (60 * Number(time[0])));
                    time[1] !== "00" && (totalTime += (60 * Number(time[1])));
                    totalTime += Number(Number(time[2]));
                    urls[response].push(totalTime);
                }
            });
        xhr.open("GET", url + "&Random=" + Math.floor(Math.random() * 100000), true);
        xhr.send();
    }
    urlTransform[urlTransform.length - 1] = "";
    url = urlTransform.join("&");
    url = url.substring(0, url.length - 1);
}

for (var url in urls) {
    console.log(`${url}: ${median(urls[url])}`);
}