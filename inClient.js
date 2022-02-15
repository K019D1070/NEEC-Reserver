//予約画面で使う
function getReserve(){
  reserve.accountCheck();
  performanceMonitor.post("Account checked");
  reserve.loadDate();
  return JSON.stringify(reserve.copyThis());
}
function opeReserve(num){
  reserve.accountCheck();
  const record = ss.getRecord(num);
  ss.log([reserve.user.email, ...reserve.convert(reserve.user.email), `+${record.date.getFullYear()}/${record.date.getMonth()+ 1}/${record.date.getDate()}`], true);
  const members = record.members;
  const numVal = members.indexOf("");
  const reserved = members.indexOf(reserve.user.email) != -1;
  let result = {result: true};
  if(( -1 == numVal) && !reserved){
    result.result = false;
    result.reason = "満員のため予約に失敗しました。";
  }else if(record.date.getTime() < Date.now()){
    result.result = false;
    result.reason = "時を戻せませんでした。(過去の日付は操作できません。)";
  }else if(!reserved){
    ss.pushRecord(num, numVal, reserve.user.email);
    trig();
  }
  return result;
}
function opeCancel(num){
  reserve.accountCheck();
  const record = ss.getRecord(num);
  ss.log([reserve.user.email, ...reserve.convert(reserve.user.email), `-${record.date.getFullYear()}/${record.date.getMonth()+ 1}/${record.date.getDate()}`], true);
  const members = record.members;
  const numVal = members.indexOf(reserve.user.email);
  if(members.indexOf(reserve.user.email) != -1){
    ss.clearValueFromRecord(num ,numVal);
    trig();
  }
  return {result: true};
}