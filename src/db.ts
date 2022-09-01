import AWS from "aws-sdk";
import { v4 } from "uuid"; 

const dbclient = new AWS.DynamoDB.DocumentClient(); 

export class ValDB {
    
    constructor(){}        

    async put(tableName:string, body:any ){
        console.log(`${tableName}, ${body}`);
        
        return await dbclient.put({
            TableName: tableName,
            Item: {
                ...body,
                productID: v4(),
            },        
        }).promise();
    }
}