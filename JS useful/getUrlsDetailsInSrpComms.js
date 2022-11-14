var container = document.getElementById("nhs_ResultList");
var allUrls = [];
function setSrpUrls () {
  const anchors = document.querySelectorAll('.result .info a[id^="nhs_CommResultsItemLink"]');
  anchors.forEach(element => allUrls.push(`${element.href}`))
}

function paintResults() {
    allUrls.forEach(url => console.log(`${url};`))
}

function clickNextPage() {
    const nextPage = document.querySelector('.nhs_Next');
    if (nextPage.classList.contains('nhs_Disabled')) {
        const homesTab = document.querySelector('#nhs_homeResultsSecondaryTab');
        if (!homesTab.classList.contains('selected')) {
            homesTab.click();
            return;
        }
        else {
            paintResults();
        }
    }
    nextPage.click();
}

const config = { attributes: false, childList: true, subtree: true };
const observer = new MutationObserver(function (mutationsList, observer) {
  for (len = 0; mutationsList.length > len; len++) {
    var record = mutationsList[len]
    if (!record.addedNodes) {
      return
    }
    for (var index = 0; index < record.addedNodes.length; index++) {
      var elem = record.addedNodes[index]
      if (
        typeof elem.getAttribute === 'function' &&
        elem.getAttribute('id') === 'nhs_Results'
      ) {
        setSrpUrls()
        clickNextPage();
        return
      }
    }
  }
})
observer.observe(container, config);
setSrpUrls()
clickNextPage();