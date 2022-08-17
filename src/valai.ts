import AWS from "aws-sdk";

export class ValAI {
    private bucketName: string;
    private imageName: string;

    constructor(bucketName: string, imageName:string){
        this.bucketName = bucketName;
        this.imageName = imageName;
    }

    openConnection(){         
        AWS.config.getCredentials((err)=>{
            if(err){
                console.log(err);
                return false;
            } else {
                AWS.config.region = "eu-west-2";
                console.log(`updates region ${AWS.config.region}`);
                return true;
            }
        })
    }

    async detectLabels(maxLabels:number=10, minConfidence:number=75 ):Promise<AWS.Rekognition.Label[]> {

        const param = {
            Image: {
                S3Object: {
                    Bucket: this.bucketName,
                    Name: this.imageName
                }
            },
            "MaxLabels": maxLabels,
            "MinConfidence": minConfidence
        }

        const aiClient = new AWS.Rekognition();    
        return await aiClient.detectLabels(param).promise().then((data)=>{
           return data.Labels;
            }).catch((err: any)=>{
            return err;
        })
    }
}