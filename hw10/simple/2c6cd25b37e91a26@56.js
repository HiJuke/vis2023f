function _1(md){return(
md`# Untitled`
)}

function _output(FileAttachment){return(
FileAttachment("output@10.json").json()
)}

function _drag(d3){return(
simulation => {
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended); 
}
)}

function _simple(d3,output,drag,invalidation)
{
   // 指定圖表的尺寸。
  const width = 500;
  const height = 500;


  // 計算圖形並啟動力模擬。
  const root = d3.hierarchy(output);
  const links = root.links();
  const nodes = root.descendants();
  
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  // 創建容器 SVG。
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;")
      .attr("stroke", "black") // 外框顏色根據節點深度
      .attr("stroke-width", 6)
      .attr("fill", "black");


  // 添加連結。
  const link = svg.append("g")
      .attr("stroke", "#00f")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line");
  
  const linkForce = d3.forceLink(links)
    .id(d => d.id)
    .distance(1000) // 增加連結的距離
    .strength(1); // 可選：設定連結的強度

  // 設定節點的顏色，根據階層關係選擇不同的顏色
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // 使用 D3 的顏色比例尺
  
  // 添加節點。
  const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`) // 定位節點
      .call(drag(simulation))
      .on("click", toggleNode) // 添加點擊事件處理程序
      .on("mouseenter", (event, d) => {
        if (d.data.leval === 2) {
          const enlargement = 3; // 放大倍數
          const newWidth = circleRadius * size_offset * enlargement;
          const newHeight = circleRadius * size_offset * enlargement;
      
          // 計算放大後的 x 和 y 偏移量，以保持置中效果
          const xOffset = -(newWidth - circleRadius * size_offset) / 2;
          const yOffset = -(newHeight - circleRadius * size_offset) / 2;
      
          d3.select(event.currentTarget)
            .select("circle")
            .attr("r", circleRadius * enlargement);
          d3.select(event.currentTarget)
            .select("image")
            .attr("width", newWidth)
            .attr("height", newHeight)
            .attr("x", xOffset)
            .attr("y", yOffset);
        }
      })
      .on("mouseleave", (event, d) => {
        d3.select(event.currentTarget)
          .select("circle")
          .attr("r", circleRadius);
        d3.select(event.currentTarget)
          .select("image")
          .attr("width", circleRadius * size_offset)
          .attr("height", circleRadius * size_offset)
          .attr("x", -(circleRadius * offset))
          .attr("y", -(circleRadius * offset));
      });

  // 添加節點外框
  const circleRadius = 30; // 調整圓圈半徑大小
  node.append("circle")
      .attr("r", circleRadius)
      .attr("fill", "black") // 內部填充顏色
      .attr("stroke", d => colorScale(d.depth)) // 外框顏色根據節點深度
      .attr("stroke-width", 6);

  //設定圖片大小
  const size_offset = 1.2;//控制內圖片大小
  
  // 計算偏移量
  const offset = size_offset / 2;//控制內圖片放置位置的偏移量
  
  // 添加內圖
  node.append("image")
    .attr("x", -(circleRadius * offset)) // 將圖片的左上角放在圓圈框的左上角
    .attr("y", -(circleRadius * offset)) // 將圖片的左上角放在圓圈框的左上角
    .attr("width", circleRadius * size_offset) // 設置圖片寬度為圓圈直徑的兩倍
    .attr("height", circleRadius * size_offset) // 設置圖片高度為圓圈直徑的兩倍
    .attr("href",d => d.data.image_url);

   //添加節點文字說明 
  node.append("title")
        .text(d => {
        if (d.data.leval == 1) { // 如果沒有子節點，顯示父節點的資訊
          return d.data.Name;
        } else if(d.data.leval == 2){ // 如果有子節點，顯示子節點的資訊
          return  "系所 : "+d.data.Department+
                  "\n學號 : "+d.data.Classnumber+
                  "\n姓名 : "+d.data.Name+
                
                  "\n個性 : "+d.data.personality+
                  "\n興趣 : "+d.data.interest+
                  "\n分工 : "+d.data.work+"";
        }
      }
  );//加入要顯示的資訊 

  
 // 設定節點初始位置在畫布的中間
  nodes.forEach(node => {
    node.y = 0; // 將y座標設定在畫布的中間
  });
  
  simulation.on("tick", () => {
    node.attr("transform", d => `translate(${d.x},${d.y})`); // 更新節點位置
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
  });
  //實現點擊收縮擴張功能
  function toggleNode(event, d) {
    if (d.data.leval == 1) {
      // 切換其他節點和連接的顯示
      var trans = true;
      nodes.forEach(node => {
        if (node.data.leval == 2) {
          node.collapsed = !node.collapsed;
          trans = node.collapsed;
        }else{
          node.collapsed = trans;
        }
      });
    }else if (d.data.leval == 2) {
      // 切換其他節點和連接的顯示
      var G = d.data.Group;
      nodes.forEach(node => {
        if (node.data.leval > 2 && node.data.Group == G) {
          node.collapsed = !node.collapsed;
        }
      });
    } 
    update();
  }
  
  function update() {
     node.attr("transform", d => `translate(${d.x},${d.y})`);
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    // 更新節點顯示
    node.style("display", d => d.collapsed ? "none" : null);
    link.style("display", d => d.target.collapsed ? "none" : null);
  }
  invalidation.then(() => simulation.stop());

  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["output@10.json", {url: new URL("./files/1ca5e17473690e3e699438ae7867fd1b803cb93d7aee44e28fdf892b42466f035516893235dffd270e922c33897abd17065bfd127d2dc09bbe8a308524b03a15.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("output")).define("output", ["FileAttachment"], _output);
  main.variable(observer("drag")).define("drag", ["d3"], _drag);
  main.variable(observer("simple")).define("simple", ["d3","output","drag","invalidation"], _simple);
  return main;
}
