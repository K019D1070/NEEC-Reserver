class Performance{
  constructor(enabled = true){
    this.enabled = enabled;
    this.initTime = Date.now();
    this.lastPost = this.initTime;
    this.statics = {};
  }
  post(name){
    if(this.enabled){
      const now = Date.now();
      Logger.log(`
      ${name}:\n
      elapse time(since initialize): ${now- this.initTime}ms\n
      elapse time(since last post): ${now- this.lastPost}ms\n
      `);
      this.lastPost = now;
    }
  }
  start(){
    if(this.enabled){
      this.started = Date.now();
    }
  }
  push(name){
    if(this.enabled){
      if(this.statics[name] == undefined)this.statics[name] = [];
      this.statics[name].push(Date.now()- this.started);
    }
  }
  process(name){
    if(this.enabled){
      if(this.statics[name] != undefined){
        const sum = this.statics[name].reduce((sum, value)=>sum+value);
        Logger.log(`
        ${name}:\n
        running times: ${this.statics[name].length}times\n
        run time: ${sum}ms\n
        average time: ${sum/ this.statics[name].length}ms\n
        max time: ${Math.max(...this.statics[name])}ms\n
        min time: ${Math.min(...this.statics[name])}ms
        `);
      }
    }
  }

}