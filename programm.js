function leseXml (type,n){						//sendet Anfrage an Xml Datei
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      myFunction(this);
    }
  }
  xmlhttp.open("GET", type+".xml" , true);
  xmlhttp.send();

function myFunction(xml) {			//bekommt die Xmldatei		(daten wie Dateiname, kuenstler etc) speichert alles im ARrAy
  var i, xmlDoc;
  xmlDoc = xml.responseXML;
  x = xmlDoc.getElementsByTagName("bild")
	
	for ( z=0; z<x.length;z++){	
	var typ = new Bild (type,n);
    typ.dateiname =x[z].getElementsByTagName("datei")[0].childNodes[0].nodeValue;
    typ.kuenstler =x[z].getElementsByTagName("artist")[0].childNodes[0].nodeValue;
	typ.quelle = "geordnetBilder/"+typ.typ+"/"+typ.dateiname;"geordnetBilder/"+typ.typ+"/"+typ.dateiname;
	
	if (typ.typ=="kopf") {
	 xDown(typ,x,z);
	}
	else if (typ.typ=="bauch"){
	xUp(typ,x,z);
	xDown(typ,x,z);
	}
	else if (typ.typ =="fuss"){
	xUp(typ,x,z);
	}
	function xUp(typ,x,z) {				//schreibt die Werte der Verbindungspunkte in das Objekt
		typ.x.push((x[z].getElementsByTagName("x1Up")[0].childNodes[0].nodeValue)*1);
		typ.x.push((x[z].getElementsByTagName("x2Up")[0].childNodes[0].nodeValue)*1);	
	}	
	function xDown (typ,x,z){
		typ.x.push((x[z].getElementsByTagName("x1Down")[0].childNodes[0].nodeValue)*1);
		typ.x.push((x[z].getElementsByTagName("x2Down")[0].childNodes[0].nodeValue)*1);
}
	typ.Spanne(typ.x);

	Listen[n-1].push(typ);			//speichert im jeweiligen array entweder kopf/bauch/fuss
}}	}
	
function Bild (typ,n) {  //das objekt
	this.typ=typ;
	this.n=n;
	this.kuenstler;
	this.dateiname;
	this.quelle;
	this.x = [];	
	this.height;
	this.width;
	
	this.spiegel=false;

	this.spanne;		//spanne die entfertnung der verBindungspunkte in %% weite in px
	this.weite;
	this.spanne2;
	this.weite2;

	this.Spanne= function(x) {
		this.spanne=x[1]-x[0];
		if (x.length>2){
			this.spanne2=x[3]-x[2];
		}
	}

	this.Weite = function(x) {
		this.weite=this.spanne*this.width;
		if (x.length>2){
			this.weite2=this.spanne2*this.width;
		}
	}

}

var auswahl="alle";
var marg = [0,0];						//dient dazu die Abstände(höhe) auf dem Canvas zu erzeugen
var Listen = [kopf_liste=[],bauch_liste=[],fuss_liste=[]];		//speichert alle daten aus XML
var index = [];

leseXml('kopf',1);			//erhält die Daten aus dem XML-Dokument und füllt das array mit den objekten
leseXml('bauch',2);
leseXml('fuss',3);

	function zufall (arrey) {
	var zahl = Math.floor(Math.random() *(arrey.length));  
	return zahl;
	}
	function fuelleIndex(){			//zwischenspeicher
			index[0]=Listen[0][zufall(Listen[0])];
			index[1]=Listen[1][zufall(Listen[1])];
			index[2]=Listen[2][zufall(Listen[2])];
			LADEN(index);
		}	
function LADEN(index){
	clearCanvas();
	marg=[0,0];
	ladeTeil(index[0]);
	ladeTeil(index[1]);
	ladeTeil(index[2]);
//	canvasSize();
}
 
 function ladeTeil (typ) {				//läd die Bilder in das Canvas
        var bild = document.getElementById('BILD');
        var context = bild.getContext("2d");
		var knick = new Image(); 
		var n=typ.n-1;

		knick.onload = function() {
		typ.width=(knick.width/2);
		typ.height=(knick.height/2);
		typ.Weite(typ.x);
		marg.push(typ.height);
		var x = 0;
		var y = parseInt(marg[n])+parseInt(marg[n+1]);
		context.drawImage(knick, x, (y), (typ.width), (typ.height));
};
        knick.src = "./"+typ.quelle;
}

function canvasSize () {
	var h =index[0].height+index[1].height+index[2].height;
	var w =index[1].width;
	w=400;
	h=screen.height-100;
		document.getElementById("BILD").style.width=w+"px";
		document.getElementById("BILD").style.height=h+"px";
}

function clearCanvas() {
	var bild = document.getElementById('BILD');
    var context = bild.getContext("2d");
	context.clearRect(0, 0, bild.width, bild.height);
}

function Auswahl() {
	var radios = document.getElementsByName('typ');

for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
        auswahl=(radios[i].value);
        break;
    }
}}
	
function neuesTeil (auswahl) {
if (auswahl=="alle"){
	fuelleIndex();
	LADEN(index);
}
else {
	var i = Number(auswahl);
	index[i]=Listen[i][zufall(Listen[i])];
	LADEN(index);}
}

function skal (typ1,typ2,typ3) {			//soll die Bilder automatisch skalieren
	
	var zs="";			//zs ist die neue weite
	var zs1="";
	
	var x1=0;			//position damit der hals auf dem kopf sitzt
	var x=0;
	var x3=0;
	var bool = false;
		if (typ1.weite != typ2.weite){	
		zs = (typ2.weite/typ1.spanne);	
		typ1.height=typ1.height/(typ1.width/zs);
		marg[2]=typ1.height;
		if (typ1.width > zs){
			bool=true;
		}
		//var po = Math.abs((typ2.x1Up*typ2.width)-(zs*typ1.x1Down));	//po ist der x wert damit der hals passt
		// alert(po + "  +  "+ (typ1.x1Down*zs)+ " = " + (po+(typ1.x1Down*zs))+ "bauch==  "+(typ2.x1Up*typ2.width));

		typ1.width = zs;
		naHopp(typ1, typ2.x[0]);
		x1=x;
		bool=false;
		}
		zs1 = (typ2.weite2/typ3.spanne);
		typ3.height=typ3.height/(typ2.width/zs1);
			if (typ3.width > zs1){
			bool=true;
		}
		typ3.width = zs1;
		naHopp(typ3,typ2.x[2]);
		x3=x;
		bool=false;
		naKomm();
		
	function naHopp (typ,bauchX) {
		if (bool == true) {
			
			x=Math.abs((bauchX*typ2.width)-(typ.width*typ.x[0]));
		
		}
		else if ( bool==false) {
			
			x=-Math.abs((typ.width*typ.x[0])-(bauchX*typ2.width));
		}
				console.log("x=" + x);
		console.log("kopf  "+((typ.width*typ.x[0])+x));
		console.log("bauch  "+typ2.width*typ2.x[2]);
			

	

	}
	function naKomm () {
	clearCanvas();
	ladeTeilNeu(index[0],0,x1);
	ladeTeilNeu(index[1],1,0);
	ladeTeilNeu(index[2],2,x3);
//	canvasSize();
}}
 function ladeTeilNeu (typ,n,x) {
        var bild = document.getElementById('BILD');
        var context = bild.getContext("2d");
        var knick = new Image();
		
	knick.onload = function() {
		var y = parseInt(marg[n])+parseInt(marg[n+1]);
		context.drawImage(knick, x, y, typ.width, typ.height);
};
			
        knick.src = "./"+typ.quelle;
		
}


    
function tone () {
    var x=0;
    var y=0;
    var bild= document.getElementById("BILD");
    var context = bild.getContext("2d");
        // Get the CanvasPixelArray from the given coordinates and dimensions.
var imgd = context.getImageData(x, y, bild.width, bild.height);
var pix = imgd.data;
console.log(bild.width +"    "+ bild.height);
console.log(pix.length +"    "+y);

// Loop over each pixel and invert the color.
var z = Math.floor(Math.random() * 40)+1;


for (var i = 0, n = pix.length; i < n; i += 4) {
	pix[i  ] = 255- pix[i  ]; // red
	pix[i+1] = 255-pix[i+1]; // green
	pix[i+2] = 255-pix[i+2]; // blue
	// i+3 is alpha (the fourth element)
}
// Draw the ImageData at the given (x,y) coordinates.
context.putImageData(imgd, x, y);
    }
