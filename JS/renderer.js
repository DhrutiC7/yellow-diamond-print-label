const {BrowserWindow, dialog} = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const doRequest = require('request');
const ejs = require('ejs');

var appRoot;

ipc.on('configData', (event, data) => {
   appRoot = data.appRoot;
});

const generateBtn = document.getElementById('generateLabel-id');
var barcodeData;

var validateInput = function(selectedProductId, cartonCount){

  let flg =true;
  let checkArr = [undefined , null , '' , 'none'];

    for(let idx = 0;idx < checkArr.length;idx++){
        let val = checkArr[idx];
        if(selectedProductId==val || cartonCount == val){
          dialog.showErrorBox("error","select product and enter number of labels");
          return false;
      }
    }

  return true;
}

generateBtn.addEventListener('click', (event) => {
        let selectedProductId = document.getElementById('select-product-id').value;
      let cartonCount = document.getElementById('carton-count-id').value;

      if(!validateInput(selectedProductId, cartonCount))return false;
      var url = 'https://stageapi.eronkan.com:443/component/warehouse-operations/form-data/83109b7b-a7fc-475a-aad5-6cb7e4665032/generateLabelData';
        var obj={
          'productId' : selectedProductId,
          'quantity' : cartonCount
        }

        generateBtn.disabled = true;

      doRequest.post({url:url,form:obj}, 
        function(err,httpResponse,body){ 
              barcodeData = JSON.parse(httpResponse.body);
              let data = {currentData: barcodeData};
              let options = {root: appRoot};
              ejs.renderFile(`${appRoot}/templates/barcode.ejs`, data, options, function (err, str) {
                      if (err) {
                         console.log(err);
                      }
                      else {
                          // Load the rendered HTML to the BrowserWindow.
                          let win = new BrowserWindow({width: 800, height: 600, webPreferences: {
                            nodeIntegration: true
                          }})

                          win.webContents.on('did-finish-load', () => {
                            win.show();
                          });

                            win.on('close', () => {
                              win = null;
                          });

                          win.loadURL('data:text/html;charset=utf-8,' + encodeURI(str));
                    }
                    generateBtn.disabled = false;
              });
        })
  })