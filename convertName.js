class Convert{
  constructor(){
    this.pare = ss.getMembers();
    this.index = {};
  }
  mailToNames(members){
    const pare = this.pare;
    const index = this.index;
    const replacedMembers = [];
    members.forEach(member=>{
      if(index[member] == undefined){
        let onData = Object.keys(pare).find(key=>{
          if(String(member).search(new RegExp(key, "i")) == 0){
            return true;
          }else{
            return false;
          }
        });
        if(onData != undefined){
          index[member] = pare[onData];
        }else{
          index[member] = member;
        }
      }
      replacedMembers.push(index[member]);
    });
    return replacedMembers;
  }
}
