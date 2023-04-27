import AWS from "aws-sdk";

const dynamoClient = new AWS.DynamoDB.DocumentClient();
export const handler = async (event, context) => {
  try {
    const status = event.pathParameters.status
    let isFix = false
    if(status == "true"){
        isFix = true
    }

    let params = {
      TableName: "Report",
      FilterExpression: '#isFix = :isFix',
      ExpressionAttributeNames: {
        '#isFix': 'isFix',
      },
      ExpressionAttributeValues: {
        ':isFix': isFix,
      }
    };

    const result = await dynamoClient.scan(params).promise();
    
    const responseData = {
        message: 'Successfully',
        data: result.Items,
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify(responseData),
      }
  } catch (e) {
    console.log(e);
    let responseData = {
      message: "Failed",
      data: e,
    };
    return {
      statusCode: 500,
      body: JSON.stringify(responseData),
    };
  }
};