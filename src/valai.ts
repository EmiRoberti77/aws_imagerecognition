import AWS from "aws-sdk";
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";

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
                //log(err);
                return false;
            } else {
                AWS.config.region = "eu-west-2";
                //console.log(`updates region ${AWS.config.region}`);
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

    async detectText():Promise<AWS.Rekognition.TextDetection[]> {
        const param = {
            Image: {
                S3Object: {
                    Bucket: this.bucketName,
                    Name: this.imageName
                }
            }
        }

        const aiClient = new AWS.Rekognition();
        return await aiClient.detectText(param).promise().then((data)=>{
            return data.TextDetections
        }).catch((err:any)=>{
            return err;
        })
    }

    async detectFaces():Promise<AWS.Rekognition.FaceDetail[]> {
        const param = {
            Image: {
                S3Object: {
                    Bucket: this.bucketName,
                    Name: this.imageName
                }
            }
        }

        const aiClient = new AWS.Rekognition();
        return await aiClient.detectFaces(param).promise().then((data)=>{
            return data.FaceDetails;
        }).catch((err:any)=>{
            return err;
        })
    }

    async detectPPE():Promise<any> {
        const param = {
            Image: {
                S3Object: {
                    Bucket: this.bucketName,
                    Name: this.imageName
                }
            }
        }
    
        const aiClient = new AWS.Rekognition();
        return await aiClient.detectProtectiveEquipment(param).promise().then((data)=>{
            return data;
        }).catch((err:any)=>{
            return err;
        })
    }
}