"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabel = exports.detectLabels = exports.detectFaces = void 0;
const valai_1 = require("./valai");
const reportError = (err) => {
    return {
        statusCode: 502,
        body: JSON.stringify({
            statusCode: 502,
            message: err
        }, null, 2)
    };
};
const validateParams = (reqBody) => {
    if (!reqBody.bucketName)
        return reportError("missing bucketName");
    if (!reqBody.imageName)
        return reportError("missing imageName");
    if (!reqBody.id)
        return reportError("missing id");
    if (!reqBody.minConfidence)
        return reportError("missing min Confidence");
    if (!reqBody.saveToDb)
        return reportError("missing saveToDb");
    if (!reqBody.targetObjects)
        return reportError("missing targetObjects[] , if no target Objects requires send a [] list");
    return "no errors";
};
const detectFaces = async (event) => {
    if (!event.body)
        return reportError("missing body for this Lambda function");
    const reqBody = JSON.parse(event.body);
    const validation = validateParams(reqBody);
    const aiApi = new valai_1.ValAI(reqBody.bucketName, reqBody.imageName);
    aiApi.openConnection();
    return await aiApi.detectFaces().then((data) => {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: reqBody,
                apiVersion: 1.0,
                statusCode: 200,
                input: data
            }, null, 2)
        };
    });
};
exports.detectFaces = detectFaces;
const detectLabels = async (event) => {
    if (!event.body)
        return reportError("missing body for this Lambda function");
    const reqBody = JSON.parse(event.body);
    const validation = validateParams(reqBody);
    if ("no errors" !== validation)
        return validation;
    const aiApi = new valai_1.ValAI(reqBody.bucketName, reqBody.imageName);
    aiApi.openConnection();
    return await aiApi.detectLabels(reqBody.maxObjects, reqBody.minConfidence).then((data) => {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: reqBody,
                apiVersion: 1.0,
                statusCode: 200,
                input: data
            }, null, 2)
        };
    });
};
exports.detectLabels = detectLabels;
const getLabel = async (event) => {
    var _a;
    const labelName = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.name;
    return {
        statusCode: 200,
        body: JSON.stringify({
            statusCode: 200,
            message: `looking for = ${labelName}`,
            input: event.body
        }, null, 2)
    };
};
exports.getLabel = getLabel;
//# sourceMappingURL=handler.js.map