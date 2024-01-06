const fs = require('fs');

// 文件路径：Windows 也可以使用 `/` 不需要使用 `\\` fs一样能处理，
const filePath = '/Users/Kyle/Library/Rime/test.dict.yaml';

fs.readFile(filePath, { encoding: 'utf-8' }, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    mainWindow.webContents.send('showFileContent', filePath, res);
  }
});
