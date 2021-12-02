function getUrl(){
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}
function loadDisplay(){
  let display = [];
  reserve.loadDate();
  reserve.dates.list.forEach(record=>{
    display.push([`${record.date.toLocaleString("ja-JP", {weekday:"short", day:"numeric", month:"numeric", year:"numeric"})}`].concat(record.members));
  });
  return display;
}
function loadQuota(){
  const quota = new Quota();
  reserve.loadDate();
  reserve.dates.list.forEach(record=>{
    if(record.quota != null){
      quota.setQuota(record.quota);
    }
    quota.registerMembers(record.members);
    quota.setDay(record.date);
  });
  const result = [[
    "Start",
    "End",
    "Members"
  ]];
  quota.calc().forEach(quota => {
    let quotaArray = [];
    quotaArray.push(quota.start);
    quotaArray.push(quota.until);
    quotaArray = quotaArray.concat(quota.notEnoughList);
    result.push(quotaArray);
  });
  return result;
}
function trig(){
  ss.setValue(2, 1, `=TRANSPOSE(loadDisplay(${Date.now()}))`, ss.display);
  ss.setValue(2, 1, `=TRANSPOSE(loadQuota(${Date.now()}))`, ss.quota);
}