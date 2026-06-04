// AWS Lambda function for form processing
// Deploy to Lambda with API Gateway trigger

const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' }); // Change to your region

// Configuration - Set these as environment variables in Lambda
const TO_EMAIL = process.env.TO_EMAIL || 'your-email@example.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourdomain.com'; // Must be verified in SES
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || 'https://yourdomain.com';

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse form data
    const formData = JSON.parse(event.body);

    // Basic validation
    if (!formData.name || !formData.email || !formData.company) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address' })
      };
    }

    // Build email content
    const emailBody = `
New Assessment Request from Blackridge Website

Name: ${formData.name}
Company: ${formData.company}
Email: ${formData.email}
Role: ${formData.role || 'Not specified'}
Current AI Usage: ${formData.usage || 'Not specified'}
Monthly AI Spend: ${formData.spend || 'Not specified'}
Primary Concern: ${formData.concern || 'Not specified'}
Multiple Providers: ${formData.providers || 'Not specified'}

Additional Notes:
${formData.notes || 'None provided'}

---
Submitted: ${new Date().toISOString()}
IP Address: ${event.requestContext?.identity?.sourceIp || 'Unknown'}
`;

    const emailParams = {
      Destination: {
        ToAddresses: [TO_EMAIL]
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: emailBody
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `New Assessment Request from ${formData.name} (${formData.company})`
        }
      },
      Source: FROM_EMAIL,
      ReplyToAddresses: [formData.email]
    };

    // Send email via SES
    await ses.sendEmail(emailParams).promise();

    // Optional: Store in DynamoDB for tracking
    // const dynamodb = new AWS.DynamoDB.DocumentClient();
    // await dynamodb.put({
    //   TableName: 'blackridge-submissions',
    //   Item: {
    //     id: Date.now().toString(),
    //     timestamp: new Date().toISOString(),
    //     ...formData
    //   }
    // }).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Assessment request received. We will contact you within 2 business days.'
      })
    };

  } catch (error) {
    console.error('Error processing form:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process request. Please try again or email us directly.'
      })
    };
  }
};
