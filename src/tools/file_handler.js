const fs = require('fs');

// 判断文件是否存在
function hasFile(filePath) 
{
    try 
    {
      return fs.existsSync(filePath);
    } 
    catch (err) 
    {
      console.error("Error had file:", err);
      return false;
    }
}

// 读取文件
function readFile(filePath) 
{
    if (hasFile(filePath)) 
    {
        try 
        {
            const data = fs.readFileSync(filePath, 'utf8');
            return data;
        } 
        catch (err) 
        {
            console.error('Error reading file:', err);
        }
    } 
    else 
    {
      console.log('File does not exist:', filePath);
    }
}

// 写入文件
function writeFile(filePath, content) 
{
    try 
    {
        fs.writeFileSync(filePath, content, 'utf8');
    } 
    catch (err) 
    {
        console.error('Error writing file:', err);
    }
}

module.exports = {
	readFile,
    writeFile,
};