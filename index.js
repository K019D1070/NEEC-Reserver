//GASでのファイル分割:特に何もする必要がないけどclassは関数と違って巻き上げがないのでファイルの順番(=読み込み順,上から順番)を考慮しなければいけない
//require("Reserve.gs");
const config_DOMAIN = "g.neec.ac.jp";
const config_STARTROW = 4;
const config_STARTCOL = 1;
const config_DATECOL = 1;
const config_CAPACITYCOL = 2;
const config_COMMENTCOL = 3;
const config_MEMBERCOL = 4;
const config_DBSHEETNAME = "予約データ";
const config_PARESHEETNAME = "対応データ";
const config_DISPLAYSHEETNAME = "予約一覧";
const config_QUOTASHEETNAME = "ノルマ未達";

const performanceMonitor = new Performance(false);
performanceMonitor.post("Spreadsheet initializing");
const ss = new SpreadSheet(config_DBSHEETNAME, config_PARESHEETNAME, config_DISPLAYSHEETNAME, config_QUOTASHEETNAME);
const config = ss.getValues(1, 2, 2, 5);
ss.setConfig("capacity", config[1][0]);
ss.setConfig("startrow", config_STARTROW);
ss.setConfig("startcol", config_STARTCOL);
ss.setConfig("commentcol", config_COMMENTCOL);
ss.setConfig("datecol", config_DATECOL);
ss.setConfig("capacitycol", config_CAPACITYCOL);
ss.setConfig("membercol", config_MEMBERCOL);
const reserve = new Reserve();
reserve.ssHandler = ss;
reserve.setConfig("domain", config_DOMAIN);
reserve.setConfig("title", config[0][0]);
reserve.setConfig("cancelable", config[1][4]);
performanceMonitor.post("All initialized");

function doGet(e){
  performanceMonitor.post("Generating HTML");
  const template = HtmlService.createTemplateFromFile("UI").evaluate();
  template.setTitle(`${reserve.config.title} - 出席予約システム`).addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return template;
}