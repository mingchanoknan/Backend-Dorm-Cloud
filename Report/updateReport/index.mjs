import AWS from 'aws-sdk'
const dynamoClient = new AWS.DynamoDB.DocumentClient();
export const handler = async (event, context) => {
    try {
        const parsedBody = JSON.parse(event.body)
        let item = {
            report_id: parsedBody.report_id,
            room_number: parsedBody.room_number,
            name: parsedBody.name,
            content:parsedBody.content,
            date:parsedBody.date,
            topic: parsedBody.topic,
            isFix: parsedBody.isFix,
            comments:parsedBody.comments,
            image: parsedBody.image
        }

        let params = {
            TableName: "Report",
            Item: item
        }
        await dynamoClient.put(params).promise();

        let responseData = {
            message: "Successfully",
            data: item
        }
        return {
            statusCode: 200,
            body: JSON.stringify(responseData)
        }

    }
    catch(e) {
        console.log(e)
        let responseData = {
            message: "Failed",
            data: e
        }
        return {
            statusCode: 500,
            body: JSON.stringify(responseData)
        }
    }
};