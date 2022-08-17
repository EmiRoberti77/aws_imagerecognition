import AWS from "aws-sdk"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ValAI } from "./valai";

const reportError = (err:string) => {
  return {
    statusCode: 502,
    body: JSON.stringify({
      statusCode: 502,
      message: err
    },null,2)
  };
}

const validateParams = (reqBody:any):any => {
  
  if(!reqBody.bucketName)
    return reportError("missing bucketName");

  if(!reqBody.imageName)
    return reportError("missing imageName")

  if(!reqBody.id)
    return reportError("missing id")

  if(!reqBody.minConfidence)
    return reportError("missing min Confidence")

  if(!reqBody.saveToDb)
    return reportError("missing saveToDb")

  if(!reqBody.targetObjects)
    return reportError("missing targetObjects[] , if no target Objects requires send a [] list")

  return "no errors";
}

export const detectLabels = async (event:APIGatewayProxyEvent) => {
  
  if(!event.body)
    return reportError("missing body for this Lambda function");

  const reqBody = JSON.parse(event.body as string);
  const validation = validateParams(reqBody);

  if("no errors" !== validation)
    return validation;


  const aiApi = new ValAI(reqBody.bucketName, reqBody.imageName)
  aiApi.openConnection();
  return await aiApi.detectLabels(reqBody.maxObjects, reqBody.minConfidence).then((data)=>{
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: reqBody,
          apiVersion: 1.0,
          statusCode: 200,
          input: data }, null, 2 ) };
  })
};

export const getLabel= async(event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
  
  const labelName = event.pathParameters?.name as string;

  return {
    statusCode: 200,
    body: JSON.stringify({
      statusCode: 200,
      message: `looking for = ${labelName}`,
      input: event.body
    }, null, 2)
  };
};
