QRCode = require('qrcode');
path = require('path');


const printBtn = document.getElementById('print-button-id')
var printBarcode = function(){
    printBtn.style.display = "none";         
    printBtn.removeEventListener('click', printBarcode);
    window.print(); 
}
printBtn.addEventListener('click', printBarcode);

var renderCharts = function(currentData) {
  currentData.data.forEach((carton) => {
    QRCode.toCanvas(document.getElementById(`barcode-${carton.id}`), carton.id, function(err) {
      if(err) console.error(err);
    });
  });
};
var generate = function() {
  renderCharts(<%- JSON.stringify(currentData) %>);
};