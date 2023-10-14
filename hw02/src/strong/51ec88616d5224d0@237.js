function _1(md){return(
md`# HW2 Strong baseline`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _yCounts(){return(
[]
)}

function _constellation(data){return(
data.map(item => item.Constellation)
)}

function _5(yCounts,constellation,data)
{
  yCounts.length = 0; //將yCounts清空
  var minC = Math.min(...constellation); 
  var maxC = Math.max(...constellation); 
  for (var y=minC; y<=maxC; y++) { 
    yCounts.push({constellation:y, gender:"male", count:0});
    yCounts.push({constellation:y, gender:"female", count:0}); 
  }
  data.forEach (x=> {
    var i = (x.Constellation-minC)*2 + (x.Gender== "男" ? 0 : 1); 
    yCounts[i].count++;
  })
  return yCounts
}


function _constellationNames(){return(
["牡羊", "金牛", "雙子", "巨蟹", "獅子", "處女", "天秤", "天蠍", "射手", "魔羯", "水瓶", "雙魚"]
)}

function _7(yCounts)
{
  yCounts[0].constellation = "牡羊";
  yCounts[1].constellation = "牡羊";
  yCounts[2].constellation = "金牛";
  yCounts[3].constellation = "金牛";
  yCounts[4].constellation = "雙子"
  yCounts[5].constellation = "雙子"
  yCounts[6].constellation = "巨蟹"
  yCounts[7].constellation = "巨蟹"
  yCounts[8].constellation = "獅子"
  yCounts[9].constellation = "獅子"
  yCounts[10].constellation = "處女"
  yCounts[11].constellation = "處女"
  yCounts[12].constellation = "天秤"
  yCounts[13].constellation = "天秤"
  yCounts[14].constellation = "天蠍"
  yCounts[15].constellation = "天蠍"
  yCounts[16].constellation = "射手"
  yCounts[17].constellation = "射手"
  yCounts[18].constellation = "魔羯"
  yCounts[19].constellation = "魔羯"
  yCounts[20].constellation = "水瓶"
  yCounts[21].constellation = "水瓶"
  yCounts[22].constellation = "雙魚"
  yCounts[23].constellation = "雙魚"
    
  return yCounts;
}


function _plot1(Inputs){return(
Inputs.form({
	mt:  Inputs.range([0, 100], {label: "marginTop", step: 1}),
	mr:  Inputs.range([0, 100], {label: "marginRight", step: 1}),
	mb:  Inputs.range([0, 100], {label: "marginBottom", step: 1}),
	ml:  Inputs.range([0, 100], {label: "marginLeft", step: 1}),
  tip: Inputs.checkbox({label: "Show Tooltip"}),
})
)}

function _10(Plot,plot1,yCounts){return(
Plot.plot({
  marginTop: plot1.mt,
  marginRight: plot1.mr,
  marginBottom: plot1.mb,
  marginLeft: plot1.ml,
  
  grid: true,
  y: {label: "count"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(yCounts, {x: "constellation", y: "count", tip: true ,fill:"gender"}),
  ]
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("./files/01d24d9aeda19b7590d996fac1553c965097547ebd857a93a21c0f86efc088993c6168f092b2353e6ec91202e5a6dead5ad66b688c1038a20deb6ec8d35e570d.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("yCounts")).define("yCounts", _yCounts);
  main.variable(observer("constellation")).define("constellation", ["data"], _constellation);
  main.variable(observer()).define(["yCounts","constellation","data"], _5);
  main.variable(observer("constellationNames")).define("constellationNames", _constellationNames);
  main.variable(observer()).define(["yCounts"], _7);
  main.variable(observer("viewof plot1")).define("viewof plot1", ["Inputs"], _plot1);
  main.variable(observer("plot1")).define("plot1", ["Generators", "viewof plot1"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","plot1","yCounts"], _10);
  return main;
}
