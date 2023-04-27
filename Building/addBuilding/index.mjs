
import AWS from 'aws-sdk'
const dynamoClient = new AWS.DynamoDB.DocumentClient();
export const handler = async (event, context) => {
    try {
        const parsedBody = JSON.parse(event.body)
        let item = {
            building_id: new Date().toISOString() + "-building-id",
            building_name: parsedBody.building_name,
            number_of_floors: parsedBody.number_of_floors
        }
        let paramsCheck ={
            TableName: "Building",
            FilterExpression: '#building_name = :building_name',
            ExpressionAttributeNames: {
                '#building_name': 'building_name',
            },
            ExpressionAttributeValues: {
                ':building_name': parsedBody.building_name,
            }
        }
        const result = await dynamoClient.scan(paramsCheck).promise()
        if(result.Items.length === 0){
            let params = {
            TableName: "Building",
            Item: item
        }
        await dynamoClient.put(params).promise();
        let responseData = {
            message: "Add building Successfully",
            data: item
        }
        return {
            statusCode: 200,
            body: JSON.stringify(responseData)
        }
        }
        else{
            let responseData = {
                message: "This building name has already existed",
                data: item
            }
            return {
                statusCode: 200,
                body: JSON.stringify(responseData)
            }
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