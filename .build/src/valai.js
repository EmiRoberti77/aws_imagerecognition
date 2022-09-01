"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValAI = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
class ValAI {
    constructor(bucketName, imageName) {
        this.bucketName = bucketName;
        this.imageName = imageName;
    }
    openConnection() {
        aws_sdk_1.default.config.getCredentials((err) => {
            if (err) {
                console.log(err);
                return false;
            }
            else {
                aws_sdk_1.default.config.region = "eu-west-2";
                console.log(`updates region ${aws_sdk_1.default.config.region}`);
                return true;
            }
        });
    }
    async detectLabels(maxLabels = 10, minConfidence = 75) {
        const param = {
            Image: {
                S3Object: {
                    Bucket: this.bucketName,
                    Name: this.imageName
                }
            },
            "MaxLabels": maxLabels,
            "MinConfidence": minConfidence
        };
        const aiClient = new aws_sdk_1.default.Rekognition();
        return await aiClient.detectLabels(param).promise().then((data) => {
            return data.Labels;
        }).catch((err) => {
            return err;
        });
    }
    async detectText() {
        const param = {
            Image: {
                S3Object: {
                    Bucket: this.bucketName,
                    Name: this.imageName
                }
            }
        };
        const aiClient = new aws_sdk_1.default.Rekognition();
        return await aiClient.detectText(param).promise().then((data) => {
            return data.TextDetections;
        }).catch((err) => {
            return err;
        });
    }
    async detectFaces() {
        const param = {
            Image: {
                S3Object: {
                    Bucket: this.bucketName,
                    Name: this.imageName
                }
            }
        };
        const aiClient = new aws_sdk_1.default.Rekognition();
        return await aiClient.detectFaces(param).promise().then((data) => {
            return data.FaceDetails;
        }).catch((err) => {
            return err;
        });
    }
}
exports.ValAI = ValAI;
//# sourceMappingURL=valai.js.map