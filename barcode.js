ipc = require('electron').ipcRenderer;
QRCode = require('qrcode');
path = require('path');

ipc.on('message', (event, message) => console.log(message));

const printBtn = document.getElementById('printLabel')

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