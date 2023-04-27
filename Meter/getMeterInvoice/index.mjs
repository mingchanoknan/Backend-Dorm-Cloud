import AWS from 'aws-sdk'

const dynamoClient = new AWS.DynamoDB.DocumentClient()
export const handler = async (event, context) => {

    try {
        const type = event.pathParameters.type
        const monthYear = event.pathParameters.monthYear
        const roomNo = event.pathParameters.room_number
        let params = {
            TableName: "Meter",
            FilterExpression: '#utilities_type = :utilities_type and #room_number = :room_number and #monthAndYear = :monthAndYear',
            ExpressionAttributeNames: {
                '#utilities_type': 'utilities_type',
                '#room_number': 'room_number',
                '#monthAndYear': 'monthAndYear'
            },
            ExpressionAttributeValues: {
                ':utilities_type': type,
                ':monthAndYear': monthYear,
                ':room_number': roomNo
            }
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