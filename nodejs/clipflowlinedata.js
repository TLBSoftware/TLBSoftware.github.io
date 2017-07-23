//clip TotalFlowLineData
const fs = require('fs');
console.log("start");
const StreamName = process.argv[2];
//debugger runs from the root folder
let filename = 'data/TotalFlowLinesFromNHD.json';
let d = fs.readFileSync(StreamName, 'utf-8');
let northeast = [-85.38960456848146, 38.28023506734758];
let southwest = [-85.63911437988283, 38.0694467480777];
let returnfeaturearray = [];
let geojson = JSON.parse(d);
let streamer = require('../js/StreamNodeClass.js')
let sobj = new streamer();
geojson = sobj.ConvertStreams(geojson);
let lengthofdata = geojson.features.length;
let testarray = [];
for(var i=0; i<geojson.features.length;i++){
    let stream = geojson.features[i];
    let flag = false;
    let collofcoord = stream.geometry.coordinates;
    for(var x=0; x<collofcoord.length;x++){
        let point = collofcoord[x];
        let counter = 4;
        testarray.push(point[0]);
        if(point[0] <= northeast[0]){
            counter--;
        }
        if(point[0] >= southwest[0]){
            counter--;
        }        
        if(point[1] <= northeast[1]){
            counter--;
        } 
        if(point[1] >= southwest[1]){
            counter--;
        }
        if(counter === 0) flag = true;
    }
    if(flag){
        returnfeaturearray.push(stream);
    }
}
geojson.features = returnfeaturearray;
let returnjson = {type: "FeatureCollection", features: []}

for(var i=0;i<returnfeaturearray.length;i++){
    returnjson.features.push(returnfeaturearray[i]);
}
console.log(returnfeaturearray.length, lengthofdata);
console.log('bye')
if(returnfeaturearray.length > 0){
    let data = JSON.stringify(returnjson);
    fs.writeFileSync("clippedflowlines.json", data);
    console.log("data written");
}else{
    
}

function con(num){return parseFloat(num.toFixed(3));}