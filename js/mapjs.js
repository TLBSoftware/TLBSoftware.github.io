//Latitude Longitude
function initMap(){
	
    mymap = L.map('map').setView([38.2187494,-85.4745504], 14);
    overlayobj = {};
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, attribution: osmAttrib}).addTo(mymap);
    mymap.on('click', (e) => {console.log(e.latlng);});
    $.getJSON("../data/parsedstreamfile.json", (streams) =>{
        MakeClickLayer(streams)
        console.log(streams);
        
        $.getJSON("../data/parsednodefile.json", (nodes) =>{
          Streamer = new StreamNodeHierarchy();
            Streamer.LoadData(streams, nodes);  
        })
    });
}

function ColorStreamsStyle(f){
    switch(f.properties.FCode){
        case 42001: return {color: "#ff0000"};
        case 42002: return {color: "#ff0000"};
        case 46006: return {color: "#00ff00"};
        case 46003: return {color: "#00ff00"};
        case 55800: return {color: "#0000ff"};
    }
    return {color: "#ff0000"};

}

function FeatureOnClick(e){
    console.log(e);
    mymap.removeLayer(overlayobj.ColoredLayer);
    mymap.removeLayer(overlayobj.ClickLayer);
    var returnedgeojson = Streamer.DownstreamTrace(e.target.feature);
    L.geoJSON(returnedgeojson, 
        {
            style: ColorStreamsStyle, 
            onEachFeature: (f, l) => {
	    	l.on('click', (e) =>{
			console.log(e);	
		});
	    }
        }
    ).addTo(mymap);
}

function MakeClickLayer(data){
    overlayobj.ColoredLayer = L.geoJSON(data, {
        onEachFeature: (f, l) =>{
            l.on('click', FeatureOnClick);
        },
        style: ColorStreamsStyle
    }).addTo(mymap);
    let styleobj = {};
    overlayobj.ClickLayer = L.geoJSON(data, {
        onEachFeature: (f, l) =>{
            l.on('click', FeatureOnClick);
        },
        style: {color: "#ff0000", opacity: 0.0, weight: 11}
    }).addTo(mymap);
}