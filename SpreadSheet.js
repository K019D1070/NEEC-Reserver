class SpreadSheet{
  //1日ごとのデータ({日付: Date,予約者: [member,...], 予約上限: Number})をrecord,日付データをdatesと呼ぶ
  constructor(sheetName, pareName, displayName, quotaName){
    this.ss = SpreadsheetApp.getActive();
    performanceMonitor.post("Activesheet got");
    this.sheet = this.ss.getSheetByName(sheetName);
    this.pare = this.ss.getSheetByName(pareName);
    this.display = this.ss.getSheetByName(displayName);
    this.quota = this.ss.getSheetByName(quotaName);
    this.lc = this.sheet.getLastColumn();
    this.lr = this.sheet.getLastRow();
    this.config = {
      capacity: 4,
      startrow: 4,
      startcol: 1,
      datecol: 1,
      capacitycol: 2,
      commentcol: 3,
      quotacol: 4,
      membercol: 5
    };
    this.status = {
      configured: false
    };
    performanceMonitor.post("Spreadsheet ready");
  }
  autoConfig(){
    const caption = this.getValues(this.config.startrow- 1, this.config.startcol, 1, this.lc)[0];
    let colmuns = 1;
    caption.forEach(title=>{
      switch(title){
        case "日付":
          this.config.datecol = colmuns;
        case "予約上限人数":
          this.config.capacitycol = colmuns;
        case "出席ノルマ":
          this.config.quotacol = colmuns;
        case "備考":
          this.config.commentcol = colmuns;
        case "予約者":
          this.config.membercol = colmuns;
      }
      colmuns++;
    });
  }
  configure(){
    if(!this.status.configured)this.autoConfig();
  }
  setConfig(key, value){
    this.config[key] = value;
  }
  getValue(r, c, sheet = this.sheet){
    return sheet.getRange(r, c).getValue();
  }
  setValue(r, c, v, sheet = this.sheet){
    return sheet.getRange(r, c).setValue(v);
  }
  getValues(r, c, rr, cr, sheet = this.sheet){
    return sheet.getRange(r, c, rr, cr).getValues();
  }
  /**
   * 対応表からメールアドレスと名前がペアになったオブジェクト・2次元配列を取得
   * [[email, name],...]
   * @arg Number mode - 0: Object, 1: Array
   * @returns {String[][]} - [[email, name],...]
   */
  getMembers(mode = 0){
    this.configure();
    let lr = this.pare.getLastRow();
    let vals = {};
    if(lr- this.config.startrow+ 1 > 0){
      let range = [this.config.startrow, 1, lr- this.config.startrow+ 1, 2, this.pare];
      let values = this.getValues(...range);
      if(mode)return values;
      values.forEach(member=>{
        if(member[0] != ""){
          vals[member[0]] = member[1];
        }
      })
    }
    return vals;
  }
  /**
  * get record
  * @param {number} num Number of record
  * @param {number} range getting range
  * @returns {array} - Array of value.
  */
  getRecord(num){
    this.configure();
    const recordRange = [this.config.startrow+ num- 1, this.config.startcol, 1, this.lc- this.config.startcol+ 1];
    const row = this.getValues(...recordRange)[0];
    const capacity = Number(String(row[this.config.capacitycol- 1]) || this.config.capacity);
    const members = row.slice(this.config.membercol- 1, this.config.membercol- 1+ Number(String(row[this.config.capacitycol- 1]) || this.config.capacity));
    return {
      date: row[this.config.datecol- 1],
      num: num,
      capacity: capacity,
      comment: row[this.config.commentcol- 1],
      quota: row[this.config.quotacol- 1] || null,
      members: members
    };
  }
  /**
   * get records
   * @param {number} mode return format(1 = [recordRows,...], 2 = [{date: Date, members: [member,...]}])
   */
  getRecords(){
    this.configure();
    const recordRange = [this.config.startrow, this.config.startcol, this.lr- this.config.startrow+ 1, this.lc- this.config.startcol+ 1];
    const val = this.getValues(...recordRange);
    const values = [];
    let i = 1;
    val.forEach(row=>{
      const capacity = Number(String(row[this.config.capacitycol- 1]) || this.config.capacity);
      const members = row.slice(this.config.membercol- 1, this.config.membercol- 1+ Number(String(row[this.config.capacitycol- 1]) || this.config.capacity));
      values.push({
        date: row[this.config.datecol- 1],
        num: i++,
        capacity: capacity,
        comment: row[this.config.commentcol- 1],
        quota: row[this.config.quotacol- 1] || null,
        members: members
      });
    });
    return values;
  }
  pushRecord(num, cell, value){
    this.configure();
    this.setValue(this.config.startrow+ num- 1, this.config.membercol+ cell, value);
  }
  /**
   * レコードから値を削除
   * @param {number}num - レコード番号(1から始まる)
   * @param {number}cell - 値番号(1から始まる)
   */
  clearValueFromRecord(num, cell){
    this.configure();
    this.sheet.getRange(this.config.startrow+ num- 1, this.config.membercol+ cell).clearContent();
  }
}