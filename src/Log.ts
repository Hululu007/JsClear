const enum PRINT_MODE
{
    ERROR,
    DEBUG,
    LABEL
}

class Log
{ 
    public open: boolean;
    public isRecord: boolean;
    private history: string;

    constructor(open=true, isRecord=true)
    {
        this.open = open;
        this.isRecord = isRecord;

        this.history = "";
    }

    private print(content: string, mode: PRINT_MODE)
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
            case PRINT_MODE.ERROR:
                console.error(content)
                break;
            default:
                console.log(content);
                break;
        }
    }

    debug(message: string)
    {
        let content = `[debug] ${message}`;
        this.print(content, PRINT_MODE.DEBUG);
    }

    error(message: string)
    {
        let content = `[error] ${message}`;
        this.print(content, PRINT_MODE.ERROR);
    }
    
    label(label="label", message="")
    {
        let content = `[${label}] ${message}`;
        this.print(content, PRINT_MODE.LABEL);
    }

    getHistory()
    {
        return this.history;
    }
}

export {
    Log
}