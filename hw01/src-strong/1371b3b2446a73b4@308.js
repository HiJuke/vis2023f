function _intro(md){return(
md`# Data Input

A file input for data files that tries to guess the data format with an initialValue. Supports csv, json and jsonArray

\`\`\`js
import {dataInput} from "@john-guerra/data-input"
\`\`\`
 
## Changelog:

* Now you define the initial value with value, to support *Inputs.bind* 
* By default it will return empty array until some data is loaded if not value is provided
`
)}

function _data(dataInput){return(
dataInput({
  value: [{ name: "Your Initial Data" }],
  delimiter: ',', // Optional
  format: "auto" // Optional, one of MongoExport, JSON, CSV, CSVNoAutoType
})
)}

function _3(data){return(
data
)}

function _dataInput(loadJSON,loadMongoExport,loadCSVAutoType,loadCSV,html,Files,Event){return(
function dataInput({
  value = [],
  initialValue = undefined,
  accept = "",
  delimiter = ",",
  format = "auto"
} = {}) {
  if (initialValue !== undefined && value.length === 0) {
    value = initialValue;
  }

  const processFile = (data) => {
    if (format === "auto") {
      try {
        return loadJSON(data, delimiter);
      } catch {
        console.log("Failed with json");
      }
      try {
        return loadMongoExport(data);
      } catch {
        console.log("Failed with MongoExport");
      }
      try {
        return loadCSVAutoType(data, delimiter);
      } catch {
        console.log("Failed with CSV AutoType");
      }
      try {
        return loadCSV(data);
      } catch {
        console.log("Failed with CSV");
      }
      return value;
    } else {
      switch (format.toUpperCase()) {
        case "JSON":
          try {
            return loadJSON(data, delimiter);
          } catch {
            console.log("Failed with json");
            return initialValue;
          }
        case "MONGOEXPORT":
          try {
            return loadMongoExport(data);
          } catch {
            console.log("Failed with MongoExport");
            return value;
          }
        case "CSV":
          try {
            return loadCSVAutoType(data, delimiter);
          } catch {
            console.log("Failed with CSV AutoType");
            return value;
          }
        case "CSVNOAUTO":
          try {
            return loadCSV(data);
          } catch {
            console.log("Failed with CSV");
            return value;
          }
      }
    }
  };

  const form = html`<form><input name=i type="file" accept="${accept}">`;
  form.i.onchange = async () => {
    form.value = await Files.text(
      form.i.multiple ? form.i.files : form.i.files[0]
    ).then(processFile);
    form.dispatchEvent(new Event("input"), { bubbles: true });
  };
  form.value = value;
  return form;
}
)}

function _loadMongoExport(){return(
(data) => {
  console.log("Trying Mongo export");
  const res = [];
  for (let row of data.split("\n")){
    if(row === "") { continue; } 
    try{
      row = JSON.parse(row);
      res.push(row);
    } catch(e3){
      break;
    }        
  }      
  if (res.length>0) {
    return res; 
  } else {
    throw "Error parsing MongoExport";
  }
}
)}

function _loadJSON(){return(
(data) => {
  console.log("Trying JSON");
  return JSON.parse(data);        
}
)}

function _loadCSVAutoType(d3){return(
(data, delimiter) => { 
  console.log("Trying CSV autotype");
  return d3.dsvFormat(delimiter).parse(data, d3.autoType);
}
)}

function _loadCSV(d3){return(
(data, delimiter) => {     
  console.log("Trying CSV");  
  return d3.dsvFormat(delimiter).parse(data);
}
)}

function _d3(require){return(
require("d3")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("intro")).define("intro", ["md"], _intro);
  main.variable(observer("viewof data")).define("viewof data", ["dataInput"], _data);
  main.variable(observer("data")).define("data", ["Generators", "viewof data"], (G, _) => G.input(_));
  main.variable(observer()).define(["data"], _3);
  main.variable(observer("dataInput")).define("dataInput", ["loadJSON","loadMongoExport","loadCSVAutoType","loadCSV","html","Files","Event"], _dataInput);
  main.variable(observer("loadMongoExport")).define("loadMongoExport", _loadMongoExport);
  main.variable(observer("loadJSON")).define("loadJSON", _loadJSON);
  main.variable(observer("loadCSVAutoType")).define("loadCSVAutoType", ["d3"], _loadCSVAutoType);
  main.variable(observer("loadCSV")).define("loadCSV", ["d3"], _loadCSV);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
