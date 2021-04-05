function calculate() {
  //get values from input box
  var q1 = document.getElementById("q1").value;
  var q2 = document.getElementById("q2").value;
  var q3 = document.getElementById("q3").value;
  var q4 = document.getElementById("q4").value;
  var cidr = document.getElementById("cidr").value;

  //validate input value
  if (
    q1 >= 0 &&
    q1 <= 255 &&
    q2 >= 0 &&
    q2 <= 255 &&
    q3 >= 0 &&
    q3 <= 255 &&
    q4 >= 0 &&
    q4 <= 255 &&
    cidr >= 0 &&
    cidr <= 32
  ) {
    //display IP address
    document.getElementById("resIP").innerHTML =
      q1 + "." + q2 + "." + q3 + "." + q4;

    //get IP Address binaries
    var ipBin = {};
    ipBin[1] = String("00000000" + parseInt(q1, 10).toString(2)).slice(-8);
    ipBin[2] = String("00000000" + parseInt(q2, 10).toString(2)).slice(-8);
    ipBin[3] = String("00000000" + parseInt(q3, 10).toString(2)).slice(-8);
    ipBin[4] = String("00000000" + parseInt(q4, 10).toString(2)).slice(-8);

    //decide standart class
    var standartClass = "";
    if (q1 <= 126) {
      standartClass = "A";
    } else if (q1 == 127) {
      standartClass = "loopback IP";
    } else if (q1 >= 128 && q1 <= 191) {
      standartClass = "B";
    } else if (q1 >= 192 && q1 <= 223) {
      standartClass = "C";
    } else if (q1 >= 224 && q1 <= 239) {
      standartClass = "D (Multicast Address)";
    } else if (q1 >= 240 && q1 <= 225) {
      standartClass = "E (Experimental)";
    } else {
      standartClass = "Out of range";
    }

    //netmask
    var mask = cidr;
    var importantBlock = Math.ceil(mask / 8);
    var importantBlockBinary = ipBin[importantBlock];
    var maskBinaryBlockCount = mask % 8;
    if (maskBinaryBlockCount == 0) importantBlock++;
    var maskBinaryBlock = "";
    var maskBlock = "";
    for (var i = 1; i <= 8; i++) {
      if (maskBinaryBlockCount >= i) {
        maskBinaryBlock += "1";
      } else {
        maskBinaryBlock += "0";
      }
    }
    //convert binary mask block to decimal
    maskBlock = parseInt(maskBinaryBlock, 2);

    //net & broadcast addr
    var netBlockBinary = "";
    var bcBlockBinary = "";
    for (var i = 1; i <= 8; i++) {
      if (maskBinaryBlock.substr(i - 1, 1) == "1") {
        netBlockBinary += importantBlockBinary.substr(i - 1, 1);
        bcBlockBinary += importantBlockBinary.substr(i - 1, 1);
      } else {
        netBlockBinary += "0";
        bcBlockBinary += "1";
      }
    }

    //put everything together, create a string container variables
    var mask = "";
    var maskBinary = "";
    var net = "";
    var bc = "";
    var netBinary = "";
    var bcBinary = "";
    var rangeA = "";
    var rangeB = "";
    //loop to put whole strings block together
    for (var i = 1; i <= 4; i++) {
      if (importantBlock > i) {
        //blocks before the important block.
        mask += "255";
        maskBinary += "11111111";
        netBinary += ipBin[i];
        bcBinary += ipBin[i];
        net += parseInt(ipBin[i], 2);
        bc += parseInt(ipBin[i], 2);
      } else if (importantBlock == i) {
        //the important block.
        mask += maskBlock;
        maskBinary += maskBinaryBlock;
        netBinary += netBlockBinary;
        bcBinary += bcBlockBinary;
        net += parseInt(netBlockBinary, 2);
        bc += parseInt(bcBlockBinary, 2);
      } else {
        //block after the important block.
        mask += 0;
        maskBinary += "00000000";
        netBinary += "00000000";
        bcBinary += "11111111";
        net += "0";
        bc += "255";
      }
      //add . separator except the last block
      if (i < 4) {
        mask += ".";
        maskBinary += ".";
        netBinary += ".";
        bcBinary += ".";
        net += ".";
        bc += ".";
      }
    }

    rangeA = sumarIP(net);
    rangeB = restarIP(bc);


    //Numero de bits para encontrar los hosts
    var numHost = 32 - cidr;
    var canDirecciones = Math.pow(2, numHost) - 2;
    //write the results to the page.
    document.getElementById("resMask").innerHTML = mask;
    document.getElementById("resBC").innerHTML = bc;
    document.getElementById("resRange").innerHTML = rangeA + " - " + rangeB;
    document.getElementById("resNet").innerHTML = net;
    document.getElementById("resNumBitsHost").innerHTML = numHost;
    document.getElementById("resNumBitsRed").innerHTML = cidr;
    document.getElementById("resNumDirecciones").innerHTML = canDirecciones;
    
    var ipAsignada=rangeA;
    lista = document.getElementById("lista");
      listado = document.createElement("LI");
      ip = document.createTextNode(ipAsignada);
      listado.appendChild(ip);
      lista.appendChild(listado);

    for(var i = canDirecciones; i>1;i--){
      lista = document.getElementById("lista");
      listado = document.createElement("LI");
      ipAsignada = sumarIP(ipAsignada);
      ip = document.createTextNode(ipAsignada);
      listado.appendChild(ip);
      lista.appendChild(listado);
    }
 
 
  } else {
    alert("invalid value");
  }
}

function sumarIP(ip){
  var bloques = ip.split(".");
  var ipNueva= "";
  var sumado=false
  for(var i = 4; i>1;i--){
    if(!sumado){
      var bloqueActual = parseInt(bloques[i], 10);
      if(bloqueActual<255){
        bloqueActual+=1;
        sumado = true;
      }else{
        bloqueActual = 0;
      }
      bloques[i] = bloqueActual;
    }
   
  }

  for(var i =0; i<bloques.length-1;i++){
    if(i==bloques.length-2){
      ipNueva += bloques[i] +"";
    }else{
      ipNueva += bloques[i] +".";
    }
  }

  return ipNueva;

}

function restarIP(ip){
  var bloques = ip.split(".");
  var ipNueva= "";
  var restado=false
  for(var i = 4; i>1;i--){
    if(!restado){
      var bloqueActual = parseInt(bloques[i], 10);
      if(bloqueActual>0){
        bloqueActual-=1;
        restado = true;
      }else{
        bloqueActual = 255;
      }
      bloques[i] = bloqueActual;
    }
   
  }

  for(var i =0; i<bloques.length-1;i++){
    if(i==bloques.length-2){
      ipNueva += bloques[i] +"";
    }else{
      ipNueva += bloques[i] +".";
    }
  }

  return ipNueva;

}
