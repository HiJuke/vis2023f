import define1 from "./67d1b2c32f1883c4@669.js";
import define2 from "./1371b3b2446a73b4@308.js";

function _1(md){return(
md`# Summary Table
`
)}

function _2(md){return(
md`<p style="background: #fffced; box-sizing: border-box; padding: 10px 20px;">***Update Dec. 2022:*** *Improved summary charts are now available in the [Data Table Cell](https://observablehq.com/@observablehq/data-table-cell?collection=@observablehq/getting-data-in-and-out). This notebook will remain for history, but please look at what is possible with the [Data Table Cell](https://observablehq.com/@observablehq/data-table-cell?collection=@observablehq/getting-data-in-and-out).*</p>
`
)}

function _3(md){return(
md`Want a quick visual overview of a dataset? To get started, import the (experimental) \`SummaryTable\` function from this notebook:

~~~js
// Import the function into your notebook
import { SummaryTable } from "@observablehq/summary-table"
~~~
`
)}

function _4(md){return(
md`Then, pass your data into the \`SummaryTable\` function. As an example, here is a summary table of the Penguins dataset (described in detail [here](https://observablehq.com/@observablehq/plot-exploration-penguins)). You can also upload your own data using this button:`
)}

async function _data(dataInput,FileAttachment){return(
dataInput({
  initialValue: await FileAttachment("palmer-penguins.csv").csv({ typed: true })
})
)}

function _summary_data(SummaryTable,data){return(
SummaryTable(data, {label: "Penguins Data"})
)}

function _7(md){return(
md`The values calculated are exposed as a _view_ and can be used as you like:`
)}

function _8(summary_data){return(
summary_data
)}

function _9(md){return(
md`For example, you could then create a separate plot of the percentage of missingness of each column:`
)}

function _10(addTooltips,Plot,summary_data,d3){return(
addTooltips(
  Plot.barX(summary_data, {
    x: "missing",
    y: "column",
    fill: "lightblue",
    title: (d) =>
      `Percent Missing (${d.column}): ${d3.format(".1%")(d.missing)}`
  }).plot({
    x: {
      tickFormat: d3.format(".1%")
    },
    y: {
      domain: summary_data
        .sort((a, b) => b.missing - a.missing)
        .map((d) => d.column),
      label: ""
    },
    marginLeft: 80,
    caption: "Percent missing for each variable in the dataset"
  })
)
)}

function _11(md){return(
md`## Implementation
The \`SummaryTable\` is broken out into a few composable pieces.`
)}

function _12(md){return(
md`### SummaryCard`
)}

function _13(SummaryCard,data){return(
SummaryCard(data)
)}

function _SummaryCard(getType,addTooltips,Plot,colorMap,htl,d3){return(
(data, label = "Summary") => {  
  // Compute values
  const sample = data[0] || {};
  const cols = data.columns || Object.keys(sample);
  const col_data = cols.map(d => {
    return {
      label:d === "" ? "unlabeled" : d, 
      type:getType(data, d)
    }
  })
  const n_columns = col_data.length;
  const n_rows = data.length;
  
  // Create the header row as a plot
  const header_plot = addTooltips(
    Plot.cellX(col_data, 
      {fill:d => colorMap.get(d.type).color, title: d => `${d.label}\n(${d.type})`}
    ).plot({
       x:{axis:null}, 
       width:100, 
       height:10, 
       color:{
         domain:[...colorMap.values()].map(d => d.color)
       }, 
       style:{
         overflow:"visible"
       }
    }), 
    {stroke:"black", "stroke-width":"3px"}
  )
  
  // Create the columns as a plot
  const col_plot = Plot.cellX(col_data, {fill:d => colorMap.get(d.type).color, fillOpacity:.3}).plot({
    x:{axis:null}, 
    width:100, height:80, 
    color:{
       domain:[...colorMap.values()].map(d => d.color)
    }}
  )
  
  // Construct the element
  const arrow_styles = {display: "inline-block",
                        verticalAlign: "top",
                        transformOrigin: "0 0",
                        transform: "rotate(90deg)",
                        marginTop: "20px",
                        position:"absolute",
                        left: "114px",
                        top: "54px"}
  
  const ele = htl.html`<div style="font-family:sans-serif; font-size:13px; margin-right:10px;">
      <span style="font-size:1.3em">${label}</span>
      <div>${d3.format(",.0f")(n_columns)} ⟶</div>
      ${header_plot}
      <span style="display:inline-block">${col_plot}</span>
      <span style="display:inline-block; vertical-align:top;">${d3.format(",.0f")(n_rows)}<br/></span>
      <span style=${arrow_styles}>⟶</span>
    </div>`   
  
  ele.value = {n_rows, n_columns};
  return ele 
}
)}

function _15(md){return(
md`### SummarizeColumn`
)}

function _col_summary(SummarizeColumn,data){return(
SummarizeColumn(data, "sex")
)}

function _SummarizeColumn(d3,getType,htl,icon_fns,SmallStack,pct_format,Histogram,html){return(
(data, col) => {
  
  let content, value, format, finiteFormat, el, chart, missing_label, pct_missing, min, max, median, mean, sd;
  const notFiniteFormat = d3.format(",.0f");

  // Construct content based on type  
  const type = getType(data, col)
  
  const col1 = htl.html`<td style="white-space: nowrap;vertical-align:middle;padding-right:5px;padding-left:3px;">${icon_fns[type]()}<strong style="vertical-align:middle;">${col === "" ? "unlabeled" : col}</strong></td>`
  
  switch(type) {
      // Categorical columns
    case 'ordinal': 
      format = d3.format(",.0f") 
      
      // Calculate category percent and count
      const categories = d3.rollups(
          data, 
          v => ({count:v.length, pct:v.length / data.length || 1}), 
          d => d[col]
        ).sort((a, b) => b[1].count - a[1].count)
        .map(d => {
          let obj = {}
          obj[col] = (d[0] === null || d[0] === "") ? "(missing)" : d[0]
          obj.count = d[1].count
          obj.pct = d[1].pct
          return obj
      })
      
      // Calculate pct. missing        
      pct_missing = data.filter(d => (d[col] === null || d[col] === "")).length / data.length
      
      // Create the chart
      const stack_chart = SmallStack(categories, col)          
      
      // element to return
      el = htl.html`<tr style="font-family:sans-serif;font-size:13px;">
        ${col1}          
        <td><div style="position:relative;">${stack_chart}</div></td>
        <td>${pct_format(pct_missing)}</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>`;
      
      value = {column: col, type, min:null, max: null, mean: null, median: null,
               sd: null, missing:pct_missing, n_categories:categories.length}
      break;
      
      // Date columns
    case "date": 
      // Calculate and format start / end      
      const start = d3.min(data, d => +d[col])
      const end = d3.max(data, d => +d[col])               
      mean = d3.mean(data, d => +d[col]);
      median = d3.median(data, d => +d[col]);
      sd = d3.deviation(data, d => +d[col]);
      
      // Calculate pct. missing         
      pct_missing = data.filter(d => d[col] === null || d[col] === "").length / data.length      
      chart = Histogram(data, col, type)
      
      // Element to return
      el = htl.html`<tr style="font-family:sans-serif;font-size:13px;">
          ${col1}
          <td><div style="position:relative;">${chart}</div></td>
          <td>${pct_format(pct_missing)}</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>` 
      value = {column: col, type, min:start, max: end, mean: null, median: null, 
               sd: null, missing:pct_missing, n_categories:null}
      break;
      
      // Continuous columns
    default: 
      // Compute values 
      min = d3.min(data, d => +d[col])
      max = d3.max(data, d => +d[col])
      mean = d3.mean(data, d => +d[col])
      median = d3.median(data, d => +d[col])
      sd = d3.deviation(data, d => +d[col])
      if(Number.isFinite(sd)) {
        finiteFormat = d3.format(",." + d3.precisionFixed(sd / 10) + "f");
        format = x => Number.isFinite(x) ? finiteFormat(x) : notFiniteFormat(x);
      }
      else {
        format = notFiniteFormat;
      }
      pct_missing = data.filter(d => d[col] === null || isNaN(d[col])).length / data.length
      
      chart = Histogram(data, col, type)
      // Element to return
      el = htl.html`<tr style="font-family:sans-serif;font-size:13px;">
          ${col1}
          <td><div style="position:relative;top:3px;">${chart}</div></td>
          <td>${pct_format(pct_missing)}</td>
          <td>${format(mean)}</td>
          <td>${format(median)}</td>
          <td>${format(sd)}</td>
        </tr>` 
      
      value = {column: col, type, min, max, mean, median, sd, missing:pct_missing, n_categories:null}
      break;
  }  
  el.value = value;
  el.appendChild(html`<style>td {vertical-align:middle;} </style>`)
  return el
}
)}

function _18(md){return(
md`### Summary Table`
)}

function _SummaryTable(SummaryCard,htl,width,SummarizeColumn){return(
(dataObj, {label="Summary"} = {}) => {
  const data = typeof dataObj.numRows === "function" ? dataObj.objects() : 
    typeof dataObj.toArray === "function" ? dataObj.toArray().map((r) => Object.fromEntries(r)) :
    dataObj
  const sample = data[0] || {};
  const cols = data.columns || Object.keys(sample);
  let value = []

  // Create the summary card and track data shape
  const summaryCard = SummaryCard(data, label)
  value.n_rows = summaryCard.value.n_rows
  value.n_columns = summaryCard.value.n_columns
  value.columns = cols

  // Compose the element
  const element = htl.html`<div style="display:inline-block; vertical-align:top;">${summaryCard}</div>
      <div style="display:inline-block; max-width:${width < 500 ? width : width - 160}px">
        <table style="vertical-align:middle; display:block;overflow-x:auto; max-width:${width}px;">
          <thead style="z-index:-999;">
          <th>Column</th>
          <th style="min-width:250px">Snapshot</th>
          <th>Missing</th>
          <th>Mean</th>
          <th>Median</th>
          <th>SD</th>
        </thead>
      ${cols.map(d => {
        const ele = SummarizeColumn(data, d)       
        value.push(ele.value) // get the value from the element
        return ele
      })}
    </table>
  </div>`  
  element.value = value;
  return element
}
)}

function _20(md){return(
md`## Helper functions`
)}

function _SmallStack(d3,addTooltips,Plot,pct_format){return(
(categoryData, col, maxCategories = 100) => {
  // Get a horizontal stacked bar
  const label = categoryData.length === 1 ? " category" : " categories";
  let chartData = categoryData;
  let categories = 0;
  if (chartData.length > maxCategories) {
    chartData = categoryData.filter((d, i) => i < maxCategories);
    const total = d3.sum(categoryData, (d) => d.count);
    const otherCount = total - d3.sum(chartData, (d) => d.count);
    let other = {};
    other[col] = "Other categories...";
    other.count = otherCount;
    other.pct = other.count / total;
    chartData.push(other);
  }

  return addTooltips(
    Plot.barX(chartData, {
      x: "count",
      fill: col,
      y: 0,
      title: (d) => d[col] + "\n" + pct_format(d.pct)
    }).plot({
      color: { scheme: "blues" },
      marks: [
        Plot.text([0, 0], {
          x: 0,
          frameAnchor: "bottom",
          dy: 10,
          text: (d) => d3.format(",.0f")(categoryData.length) + `${label}`
        })
      ],
      style: {
        paddingTop: "0px",
        paddingBottom: "15px",
        textAnchor: "start",
        overflow: "visible"
      },
      x: { axis: null },
      color: {
        domain: chartData.map((d) => d[col]),
        scheme: "blues",
        reverse: true
      },
      height: 30,
      width: 205,
      y: {
        axis: null,
        range: [30, 3]
      }
    }),
    { fill: "darkblue" }
  );
}
)}

function _Histogram(colorMap,d3,getDateFormat,addTooltips,Plot){return(
(data, col, type = "continuous") => {
  // Compute color + mean
  const barColor = colorMap.get(type).brighter;
  const mean = d3.mean(data, (d) => d[col]);

  // Formatter for the mean
  const extent = d3.extent(data, (d) => d[col]);
  const format = type === "date" ? getDateFormat(extent) : 
    Math.floor(extent[0]) === Math.floor(extent[1]) ? d3.format(",.2f") : d3.format(",.0f");
  const rules = [{ label: "mean", value: mean }];
  return addTooltips(
    Plot.plot({
      height: 55,
      width: 240,
      style: {
        display: "inline-block"
      },
      x: {
        label: "",
        ticks: extent,
        tickFormat: format
      },
      y: {
        axis: null
      },
      marks: [
        Plot.rectY(
          data,
          Plot.binX(
            {
              y: "count",
              title: (elems) => {
                // compute range for the elements
                const [start, end] = d3.extent(elems, (d) => d[col]);
                let barFormat;
                if (type === "date") {
                  barFormat = getDateFormat([start, end]);
                } else {
                  barFormat = d3.format(
                    Math.floor(start) === Math.floor(end) ? ",.2f" : ",.0f"
                  );
                }
                return `${elems.length} rows\n[${barFormat(
                  start
                )} to ${barFormat(end)}]`;
              }
            },
            { x: col, fill: barColor }
          )
        ),
        Plot.ruleY([0]),
        Plot.ruleX(rules, {
          x: "value",
          strokeWidth: 2,
          title: (d) => `${d.label} ${col}: ${format(d.value)}`
        })
      ],
      style: {
        marginLeft: -17,
        background: "none",
        overflow: "visible"
      }
    }),
    { opacity: 1, fill: colorMap.get(type).color }
  );
}
)}

function _getDateFormat(d3){return(
(extent) => {
  const formatMillisecond = d3.utcFormat(".%L"),
      formatSecond = d3.utcFormat(":%S"),
      formatMinute = d3.utcFormat("%I:%M"),
      formatHour = d3.utcFormat("%I %p"),
      formatDay = d3.utcFormat("%a %d"),
      formatWeek = d3.utcFormat("%b %d"),
      formatMonth = d3.utcFormat("%B"),
      formatYear = d3.utcFormat("%Y");

  // Test on the difference between the extent, offset by 1
  
  return extent[1] > d3.utcYear.offset(extent[0], 1)? formatYear :
    extent[1] > d3.utcMonth.offset(extent[0], 1)? formatMonth :
    extent[1] > d3.utcWeek.offset(extent[0], 1) ? formatWeek :
    extent[1] > d3.utcDay.offset(extent[0], 1) ? formatDay :
    extent[1] > d3.utcHour.offset(extent[0], 1) ? formatHour :
    extent[1] > d3.utcMinute.offset(extent[0], 1) ? formatMinute :
    extent[1] > d3.utcSecond.offset(extent[0], 1) ? formatSecond :
    extent[1] > d3.utcMillisecond.offset(extent[0], 1) ? formatMillisecond :
    formatDay
}
)}

function _dateFormat(d3){return(
function dateFormat(date) {
    var formatMillisecond = d3.timeFormat(".%L"),
      formatSecond = d3.timeFormat(":%S"),
      formatMinute = d3.timeFormat("%I:%M"),
      formatHour = d3.timeFormat("%I %p"),
      formatDay = d3.timeFormat("%a %d"),
      formatWeek = d3.timeFormat("%b %d"),
      formatMonth = d3.timeFormat("%B"),
      formatYear = d3.timeFormat("%Y");
    
    return (d3.timeSecond(date) < date ? formatMillisecond
        : d3.timeMinute(date) < date ? formatSecond
        : d3.timeHour(date) < date ? formatMinute
        : d3.timeDay(date) < date ? formatHour
        : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
        : d3.timeYear(date) < date ? formatMonth
        : formatYear)(date);
  }
)}

function _icon_fns(html,colorMap){return(
{
  ordinal:() => html`<div style="display:inline-block; border-radius:100%; width: 16px; height: 16px; background-color: ${colorMap.get("ordinal").color}; transform: scale(1.3); vertical-align: middle; align-items: center;margin-right:8px;}">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="2" height="2" fill="white"/>
    <rect x="7" y="4" width="6" height="2" fill="white"/>
    <rect x="4" y="7" width="2" height="2" fill="white"/>
    <rect x="7" y="7" width="6" height="2" fill="white"/>
    <rect x="4" y="10" width="2" height="2" fill="white"/>
    <rect x="7" y="10" width="6" height="2" fill="white"/>
  </svg>
</div>`,
  date: () => html`<div style="display:inline-block; border-radius:100%; width: 16px; height: 16px; background-color: ${colorMap.get("date").color}; transform: scale(1.3); vertical-align: middle; align-items: center;margin-right:8px;}">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="5" width="8" height="1" fill="white"/>
    <rect x="5" y="4" width="2" height="1" fill="white"/>
    <rect x="9" y="4" width="2" height="1" fill="white"/>
    <rect x="4" y="7" width="8" height="5" fill="white"/>
  </svg>
</div>`,
  continuous:() => html`<div style="display:inline-block; border-radius:100%; width: 16px; height: 16px; background-color: ${colorMap.get("continuous").color}; transform: scale(1.3); vertical-align: middle; align-items: center;margin-right:8px;}">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="12" width="4" height="2" transform="rotate(-90 4 12)" fill="white"/>
    <rect x="7" y="12" width="6" height="2" transform="rotate(-90 7 12)" fill="white"/>
    <rect x="10" y="12" width="8" height="2" transform="rotate(-90 10 12)" fill="white"/>
  </svg>
</div>`
}
)}

function _colorMap(d3,_){return(
new Map([["ordinal","rgba(78, 121, 167, 1)"],
 ["continuous", "rgba(242, 142, 44, 1)"],
 ["date", "rgba(225,87,89, 1)"]
].map(d => {
  const col = d3.color(d[1])
  const color_copy = _.clone(col)
  color_copy.opacity = .6
  return [d[0], {color:col.formatRgb(), brighter:color_copy.formatRgb()}]
}))
)}

function _getType(){return(
(data, column) => {
  for (const d of data) {
    const value = d[column];
    if (value == null) continue;
    if (typeof value === "number") return "continuous";
    if (value instanceof Date) return "date";
    return "ordinal"
  }
  // if all are null, return ordinal
  return "ordinal"
}
)}

function _pct_format(d3){return(
d3.format(".1%")
)}

function _29(md){return(
md`## Appendix`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["palmer-penguins.csv", {url: new URL("./files/78466fd621db89a8708d6af36834c45c977f3f95c44f91a380bf7c985f03db2d03849aef300f8caa2bce9605f5229fe9813ed4f168c75f9b0abb4e960400faf0.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("viewof data")).define("viewof data", ["dataInput","FileAttachment"], _data);
  main.variable(observer("data")).define("data", ["Generators", "viewof data"], (G, _) => G.input(_));
  main.variable(observer("viewof summary_data")).define("viewof summary_data", ["SummaryTable","data"], _summary_data);
  main.variable(observer("summary_data")).define("summary_data", ["Generators", "viewof summary_data"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["summary_data"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["addTooltips","Plot","summary_data","d3"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["SummaryCard","data"], _13);
  main.variable(observer("SummaryCard")).define("SummaryCard", ["getType","addTooltips","Plot","colorMap","htl","d3"], _SummaryCard);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("viewof col_summary")).define("viewof col_summary", ["SummarizeColumn","data"], _col_summary);
  main.variable(observer("col_summary")).define("col_summary", ["Generators", "viewof col_summary"], (G, _) => G.input(_));
  main.variable(observer("SummarizeColumn")).define("SummarizeColumn", ["d3","getType","htl","icon_fns","SmallStack","pct_format","Histogram","html"], _SummarizeColumn);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("SummaryTable")).define("SummaryTable", ["SummaryCard","htl","width","SummarizeColumn"], _SummaryTable);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("SmallStack")).define("SmallStack", ["d3","addTooltips","Plot","pct_format"], _SmallStack);
  main.variable(observer("Histogram")).define("Histogram", ["colorMap","d3","getDateFormat","addTooltips","Plot"], _Histogram);
  main.variable(observer("getDateFormat")).define("getDateFormat", ["d3"], _getDateFormat);
  main.variable(observer("dateFormat")).define("dateFormat", ["d3"], _dateFormat);
  main.variable(observer("icon_fns")).define("icon_fns", ["html","colorMap"], _icon_fns);
  main.variable(observer("colorMap")).define("colorMap", ["d3","_"], _colorMap);
  main.variable(observer("getType")).define("getType", _getType);
  main.variable(observer("pct_format")).define("pct_format", ["d3"], _pct_format);
  main.variable(observer()).define(["md"], _29);
  const child1 = runtime.module(define1);
  main.import("addTooltips", child1);
  const child2 = runtime.module(define2);
  main.import("dataInput", child2);
  return main;
}
