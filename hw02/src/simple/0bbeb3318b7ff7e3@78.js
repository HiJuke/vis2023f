function _1(md){return(
md`# HW2 Simple baseline`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _3(Plot,data){return(
Plot.plot({ 
	y: {grid: true, label: "count"}, 
	marks: [   
		Plot.rectY(data, Plot.binX({y:"count"}, { x:"Year", interval: 1 })), 
		Plot.gridY({ interval: 1, stroke:  "white", strokeOpacity: 0.5 })
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

function _5(Plot,plot1,data){return(
Plot.plot({  

	marginTop: plot1.mt, 
	marginRight: plot1.mr, 
	marginBottom: plot1.mb, 
	marginLeft: plot1.ml,   
	y: {grid: true, label: "count"},  
	marks: [    
		Plot.rectY(data, Plot.binX({y:"count"}, { x:"Year", interval:1, fill:"Gender", tip: plot1.tip })),    
		Plot.gridY({ interval: 1, stroke: "white", strokeOpacity: 0.5 })
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

function _7(Plot,plot2,data){return(
Plot.plot({  
	marginTop: plot2.mt, 
	marginRight: plot2.mr, 
	marginBottom: plot2.mb, 
	marginLeft: plot2.ml,   
	y: {grid: true, label: "count"},  
	marks: [    
		Plot.rectY(data, Plot.binX({y:"count"}, { x:"Year", interval:1, fill:plot2.fillColor, tip: plot2.tip })),     
		Plot.gridY({ interval: 1, stroke: "white", strokeOpacity: 0.5 })
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
  main.variable(observer()).define(["Plot","data"], _3);
  main.variable(observer("viewof plot1")).define("viewof plot1", ["Inputs"], _plot1);
  main.variable(observer("plot1")).define("plot1", ["Generators", "viewof plot1"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","plot1","data"], _5);
  main.variable(observer("viewof plot2")).define("viewof plot2", ["Inputs"], _plot2);
  main.variable(observer("plot2")).define("plot2", ["Generators", "viewof plot2"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","plot2","data"], _7);
  return main;
}
