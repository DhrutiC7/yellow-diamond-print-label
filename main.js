const {app, BrowserWindow, Menu} = require('electron');
const ejs = require('ejs');
const doRequest = require('request');
let mainWindow

process.env.NODE_ENV = 'production';

function createWindow (productData) {
  debugger;
  let data = {productList: productData};
  let options = {root: __dirname};

  ejs.renderFile(`${__dirname}/templates/index.ejs`, data, options, function (err, str) {
            if (err) {
              console.log(err);
            }
            else {
                mainWindow = new BrowserWindow({
                  width: 800,
                  height: 600,
                  webPreferences: {
                    nodeIntegration: true
                  }
                })

                mainWindow.webContents.on('did-finish-load', () => {
                  mainWindow.webContents.send('configData', {'appRoot' : options.root})
                });

                mainWindow.on('close', () => {
                  mainWindow = null;
                });

                mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURI(str));
                mainWindow.show();
          }
  });

}


function getProductData (){
    var url = 'https://prataap-api.eronkan.com/component/warehouse-operations/form-data/83109b7b-a7fc-475a-aad5-6cb7e4665032/getProductList';
    doRequest.post({url:url,form:{}}, 
      function(err,httpResponse,body){ 
            if (err) {
                console.log(err);
            }
            else {
                try{
                  productData = JSON.parse(httpResponse.body);
                  if(!mainWindow)createWindow(productData);
                }
                catch(ex){
                  console.log(ex);
                  if(!mainWindow)createWindow([]);
                }
            }

      })
}

function initialiseApp(){

    if(process.env.NODE_ENV == 'production'){
        const mainMenu = Menu.buildFromTemplate([]);
        Menu.setApplicationMenu(mainMenu);
    }
     getProductData();
}


app.on('ready', initialiseApp)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) initialiseApp()
})

