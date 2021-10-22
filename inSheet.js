function getUrl(){
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}
function loadDisplay(){
  const records = ss.getRecords();
  let display = [];
  const convert = new Convert();
  records.sort((a, b)=>{
    return a.date.getTime()- b.date.getTime();
  });
  records.forEach(record=>{
    display.push([`${record.date.toLocaleString("ja-JP", {weekday:"short", day:"numeric", month:"numeric", year:"numeric"})}`].concat(convert.mailToNames(record.members)));
  });
  return display;
}
function loadQuota(){
  const records = ss.getRecords();
  reserve.loadDate();
  const quota = new Quota();
  records.forEach(record=>{
    quota.registerMembers(record.members);
    quota.setDay(record.date);
    if(record.quota != null){
      quota.setQuota(record.quota);
    }
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