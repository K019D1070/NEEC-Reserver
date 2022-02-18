function reduce(array){
  const a = [];
  array.forEach(val=>{if(val != "")a.push(val)});
  return a;
}
class Quota{
  //(Server)
  constructor(){
    this.quota = {
      counter: -1,
      pointer: null,
      everyQuotas: []
    };
  }
  setQuota(q){
    this.quota.counter++;
    const everyQuota = {
      quota: q,
      membersList: [],
      notEnoughList: [],
      days: []
    };
    this.quota.pointer = everyQuota;
    this.quota.everyQuotas.push(everyQuota);
  }
  setDay(d){
    if(this.quota.pointer == null)return;
    this.quota.pointer.days.push(d);
  }
  registerMembers(m){
    if(this.quota.pointer == null)return;
    this.quota.pointer.membersList = this.quota.pointer.membersList.concat(m);
  }
  calc(){
    const members = ss.getMembers(1);
    let result = [];
    this.quota.everyQuotas.forEach(everyQuota=>{
      Logger.log(everyQuota);
      const notEnoughList = [];
      members.forEach(member=>{
        let found = 0;
        for(let i = 0; found < everyQuota.quota && i < everyQuota.membersList.length; i++){
          if(String(everyQuota.membersList[i]).search(new RegExp(member[1], "i")) >= 0){
            found++;
          }
        }
        if(found < everyQuota.quota){
          notEnoughList.push(member[1]);
        }
      });
      everyQuota.notEnoughList = notEnoughList;
      everyQuota.days.sort((a, b)=>{
        return a.getTime() - b.getTime();
      });
      result.push({
        start: everyQuota.days[0],
        until: everyQuota.days.splice(-1)[0],
        notEnoughList: notEnoughList
      });
    });
    return result;
  }
}
function datePadding(str){
  return String(str).padStart(2, "0");
}