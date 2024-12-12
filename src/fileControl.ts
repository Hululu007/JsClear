import fs from 'fs';
import path from 'path';

function readFile(filePath: string, encoding: BufferEncoding = 'utf8')
{
    const data: string = fs.readFileSync(filePath, encoding);
    return data;
}

function writeFile(filePath: string, data: string)
{
    let dirPath = path.dirname(filePath);
    !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);

    fs.writeFileSync(filePath, data);
}

function deleteFile(filePath: string)
{
    fs.unlinkSync(filePath);
}

// 连续创建文件
class WriteDir
{
    private dir: string;
    private defaulfName: string;
    private type: string;
    private writeCount: number;

    constructor(dir: string, defaulfName="", type=".txt")
    {
        if (typeof dir != "string") throw new Error("传入类型有误！");

        this.dir = dir;
        this.defaulfName = defaulfName;
        this.type = type;
        this.writeCount = 0;
    }

    writeFile(filePath: string, data: string)
    {
        let dirPath = path.dirname(filePath);
        !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);
    
        fs.writeFileSync(filePath, data);
    }

    write(data: string, name: string)
    {
        if (name == undefined) 
        {
            this.writeCount++;
            name = this.defaulfName + "_" + this.writeCount;
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

export {
    WriteDir,
    writeFile,
    readFile,
    deleteFile
}
