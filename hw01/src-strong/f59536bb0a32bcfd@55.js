function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Histogram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Table_2_CSV

Using the [bin transform](/plot/transforms/bin) and [rect mark](/plot/marks/rect).`
)}

function _2(__query,FileAttachment,invalidation){return(
__query(FileAttachment("data.csv"),{select:{columns:null},from:{table:"data"},filter:[],sort:[],slice:{from:null,to:null}},invalidation)
)}

function _Data(FileAttachment){return(
FileAttachment("data.csv").csv()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.csv", {url: new URL("./files/5825194f2d6e770042b9334a9b5631de01b675ce630f5f9c079aa7bb3b75e83b06dd186f78dc2dcc05bbd6e1764d27d347eea3d141f8444d972aac1cb48a216e.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["__query","FileAttachment","invalidation"], _2);
  main.variable(observer("Data")).define("Data", ["FileAttachment"], _Data);
  return main;
}
