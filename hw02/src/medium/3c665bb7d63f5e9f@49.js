function _1(md){return(
md`# HW2 Medium baseline`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _yCounts(){return(
[]
)}

function _years(data){return(
data.map(item => item.Year)
)}

function _5(yCounts,years,data)
{
  yCounts.length = 0; //將yCounts清空
  var minYear = Math.min(...years); //最早出生年
  var maxYear = Math.max(...years); //最晚出生年
  for (var y=minYear; y<=maxYear; y++) { 
    yCounts.push({year:y, gender:"male", count:0});
    yCounts.push({year:y, gender:"female", count:0}); 
  }
  data.forEach (x=> {
    var i = (x.Year-minYear)*2 + (x.Gender== "男" ? 0 : 1); 
    yCounts[i].count++;
  })
  return yCounts
}


function _6(Plot,yCounts){return(
Plot.plot({
  
  grid: true,
  y: {label: "count"},

  marks: [
    Plot.ruleY([0]),
    Plot.barY(yCounts, {x: "year", y: "count"}),
  ]
})
)}

function _plot1(Inputs){return(
Inputs.form({
	mt:  Inputs.range([0, 100], {label: "marginTop", step: 1}),
	mr:  Inputs.range([0, 100], {label: "marginRight", step: 1}),
	mb:  Inputs.range([0, 100], {label: "marginBottom", step: 1}),
	ml:  Inputs.range([0, 100], {label: "marginLeft", step: 1}),
  tip: Inputs.checkbox({label: "Show Tooltip"}),
})
)}

function _8(Plot,plot1,yCounts){return(
Plot.plot({
  marginTop: plot1.mt,
  marginRight: plot1.mr,
  marginBottom: plot1.mb,
  marginLeft: plot1.ml,
  
  grid: true,
  y: {label: "count"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(yCounts, {x: "year", y: "count", tip: true , fill:"gender"}),
  ]
})
)}

function _plot2(Inputs){return(
Inputs.form({
	mt:  Inputs.range([0, 100], {label: "marginTop", step: 1}),
	mr:  Inputs.range([0, 100], {label: "marginRight", step: 1}),
	mb:  Inputs.range([0, 100], {label: "marginBottom", step: 1}),
	ml:  Inputs.range([0, 100], {label: "marginLeft", step: 1}),
  fillColor: Inputs.color({label: "Fill Color"}),
	tip: Inputs.checkbox({label: "Show Tooltip"})
})
)}

function _10(Plot,plot2,yCounts){return(
Plot.plot({
  marginTop: plot2.mt,
  marginRight: plot2.mr,
  marginBottom: plot2.mb,
  marginLeft: plot2.ml,
  
  grid: true,
  y: {label: "count"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(yCounts, {x: "year", y: "count", tip: plot2.tip , fill: plot2.fillColor}),
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
  main.variable(observer("years")).define("years", ["data"], _years);
  main.variable(observer()).define(["yCounts","years","data"], _5);
  main.variable(observer()).define(["Plot","yCounts"], _6);
  main.variable(observer("viewof plot1")).define("viewof plot1", ["Inputs"], _plot1);
  main.variable(observer("plot1")).define("plot1", ["Generators", "viewof plot1"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","plot1","yCounts"], _8);
  main.variable(observer("viewof plot2")).define("viewof plot2", ["Inputs"], _plot2);
  main.variable(observer("plot2")).define("plot2", ["Generators", "viewof plot2"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","plot2","yCounts"], _10);
  return main;
}
