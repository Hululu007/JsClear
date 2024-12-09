const fs = require('fs');
const path = require('path');

function readFile(filePath, encode='utf8')
{
    const data = fs.readFileSync(filePath, encode);
    return data;
}

function writeFile(filePath, data)
{
    let dirPath = path.dirname(filePath);
    !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);

    fs.writeFileSync(filePath, data);
}

function deleteFile(filePath)
{
    fs.unlinkSync(filePath);
}

// 连续创建文件
class WriteDir
{
    constructor(dir, defaulfName="", type=".txt")
    {
        if (typeof dir != "string") throw new Error("传入类型有误！");

        this.dir = dir;
        this.defaulfName = defaulfName;
        this.type = type;
        this.writeCount = 0;
    }

    writeFile(filePath, data)
    {
        let dirPath = path.dirname(filePath);
        !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);
    
        fs.writeFileSync(filePath, data);
    }

    write(data, name)
    {
        if (name == undefined) 
        {
            this.writeCount++;
            name = this.defaulfName + this.writeCount;
        }
        else
        {
            this.defaulfName = name;
            this.writeCount = 0;
        }

        let filePath = path.join(this.dir, name) + this.type;
        this.writeFile(filePath, data);
    }
}

module.exports = {
    WriteDir,
    writeFile,
    readFile,
    deleteFile
}
