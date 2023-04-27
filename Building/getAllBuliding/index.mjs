import AWS from 'aws-sdk'

const dynamoClient = new AWS.DynamoDB.DocumentClient()
export const handler = async (event, context) => {

    try {
        let params = {
            TableName: 'Building'
        }

        const result = await dynamoClient.scan(params).promise()

        let responseData = {
            message: "Successfully",
            data: result.Items
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
}