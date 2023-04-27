import AWS from 'aws-sdk'

const dynamoClient = new AWS.DynamoDB.DocumentClient()

export const handler = async (event, context) => {
  try {
      
    const parsedBody = JSON.parse(event.body)
    const item = {
      meter_id: new Date().toISOString() + "-meter-id",
      room_number: parsedBody.room_number,
      utilities_type: parsedBody.utilities_type,
      monthAndYear: parsedBody.monthAndYear,
      consumption: parsedBody.consumption,
      sum: parsedBody.sum,
      used_unit: parsedBody.used_unit,
    }
    const paramsCheckMeter = {
      TableName: "Meter",
      FilterExpression: '#utilities_type = :utilities_type and #room_number = :room_number and #monthAndYear = :monthAndYear',
      ExpressionAttributeNames: {
        '#utilities_type': 'utilities_type',
        '#room_number': 'room_number',
        '#monthAndYear': 'monthAndYear'
      },
      ExpressionAttributeValues: {
        ':utilities_type': parsedBody.utilities_type,
        ':room_number': parsedBody.room_number,
        ':monthAndYear': parsedBody.monthAndYear
      }
    }

    const result = await dynamoClient.scan(paramsCheckMeter).promise()

    let responseData
    if (result.Items.length === 0) {
      const params = {
        TableName: "Meter",
        Item: item
      }
      await dynamoClient.put(params).promise()

      responseData = {
        message: "Add meter successfully",
        data: item
      }
    } else {
      responseData = {
        message: "This room number has already existed",
        data: item
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(responseData)
    }
  } catch (error) {
    console.log(error)

    const responseData = {
      message: "Can't add meter",
      data: error
    }

    return {
      statusCode: 500,
      body: JSON.stringify(responseData)
    }
  }
}