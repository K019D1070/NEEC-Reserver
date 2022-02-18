class Reserve{
  constructor(){
    performanceMonitor.post("Reserver initializing");
    this.config = {
      "title": "",
      cancelable: 0
    };
    this.user = {};
    this.dates = {
      list: [],
      months: {}
    };
    this.today = new Date();
  }
  initConvert(){
    if(this.cvrt == undefined){
      this.cvrt = new Convert();
    }
  }
  convert(a){
    this.initConvert();
    return this.cvrt.mailToNames(a);
  }
  setConfig(key, value){
    this.config[key] = value;
  }
  accountCheck(){
    const usr = Session.getActiveUser();
    this.user.email = usr.getEmail();
    let numberMatched = this.user.email.search(new RegExp(this.config.domain));
    if(numberMatched === -1){
      this.accountError();
    }
  }
  accountError(){
    new Error(`@${this.config.domain}でログインしてアクセスしてください。`);
  }
  loadDate(){
    performanceMonitor.post("Date loading");
    this.ssHandler.getRecords().forEach((record)=>{
      let dateObj = new Date(record.date);
      if(dateObj == "Invalid Date"){
        return;
      }
      record.date = dateObj;
      performanceMonitor.start();
      record.members = reduce(record.members);
      record.members = this.convert(record.members);
      performanceMonitor.push("process of mail⇒name");
      this.dates.list.push(record);
    });
    performanceMonitor.process("process of mail⇒name");
    if(config[1][2]){
      performanceMonitor.post("Date sorting");
      this.dates.list.sort((a, b)=>{
        return a.date.getTime() - b.date.getTime();
      });
    }
    performanceMonitor.post("Date loaded");
  }
  copyThis(){
    reserve.accountCheck();
    return {
      user: {
        email: this.convert(this.user.email)[0]
      },
      dates: this.dates,
      config: {
        cancelable: this.config.cancelable,
        title: this.config.title
      },
      today: this.today
    };
  }
}