import define1 from "./253d3c1b5eb8410c@1948.js";

function _1(__query,FileAttachment,invalidation){return(
__query.sql(FileAttachment("data.csv"),invalidation)`SELECT * FROM "data"`
)}

function _2(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Histogram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Table_2_CSV

Using the [bin transform](/plot/transforms/bin) and [rect mark](/plot/marks/rect).`
)}

function _3(__query,FileAttachment,invalidation){return(
__query(FileAttachment("data.csv"),{from:{table:"data"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _library(require){return(
require("d3")
)}

async function _data(d3,FileAttachment){return(
d3.csvParse(
  await FileAttachment("data.csv").text()
)
)}

function _summary_data(SummaryTable,data){return(
SummaryTable(data, {label: "Example Data"})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.csv", {url: new URL("./files/5825194f2d6e770042b9334a9b5631de01b675ce630f5f9c079aa7bb3b75e83b06dd186f78dc2dcc05bbd6e1764d27d347eea3d141f8444d972aac1cb48a216e.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["__query","FileAttachment","invalidation"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["__query","FileAttachment","invalidation"], _3);
  const child1 = runtime.module(define1);
  main.import("SummaryTable", child1);
  main.variable(observer("library")).define("library", ["require"], _library);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], _data);
  main.variable(observer("viewof summary_data")).define("viewof summary_data", ["SummaryTable","data"], _summary_data);
  main.variable(observer("summary_data")).define("summary_data", ["Generators", "viewof summary_data"], (G, _) => G.input(_));
  return main;
}
