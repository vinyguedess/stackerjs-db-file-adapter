import { Config } from "stackerjs-utils";
import { FileAdapter } from "./FileAdapter";


export class Connection
{

    static query(query)
    {
        if (!this.isConnected()) this.connect();

        return this.pool.execute(query)
            .then(result => 
            {
                return result;
            });
    }

    static connect()
    {
        this.pool = new FileAdapter(this.parameters.host, this.parameters.name);
    }

    static isConnected()
    {
        return this.pool instanceof FileAdapter;
    }

    static disconnect()
    {
        this.pool = null;
    }

}
Connection.parameters = {
    host: Config.get("db.host"),
    name: Config.get("db.name")
};
Connection.pool;