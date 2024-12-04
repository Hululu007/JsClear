class Log
{ 
    constructor(open=true, isRecord=true)
    {
        this.open = open;
        this.isRecord = isRecord;

        this.history = "";
    }

    /**
     * 控制打印
     * @param {string} content 
     * @param {string} mode 
     * @returns 
     */
    #print(content, mode)
    {
        if (this.open == false) return;
        if (this.isRecord) this.history += content;
        // 更清晰
        if (content.includes('\n'))
        {
            let i = 0;
            for (; i < content.length; ++i)
            {
                if (content[i] == ']') break;
            }
            content = content.substring(0, i + 1) + '\n' + content.substring(i + 2);
        }

        switch (mode) {
            case "error":
                console.error(content)
                break;
            default:
                console.log(content);
                break;
        }
    }

    /**
     * @param {*} message 
     */
    debug(message)
    {
        let content = `[debug] ${message}`;
        this.#print(content, "debug");
    }

    /**
     * @param {*} message 
     */
    error(message)
    {
        let content = `[error] ${message}`;
        this.#print(content, error);
    }
    
    
    /**
     * 自定义标签
     * @param {string} label 
     * @param {*} message 
     */
    label(label="label", message="")
    {
        let content = `[${label}] ${message}`;
        this.#print(content, "log");
    }
}

module.exports = {
    Log
}