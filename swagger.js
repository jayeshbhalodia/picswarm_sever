const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PicSwarm API Documentation',
            version: '1.0.0',
            description: `
## Welcome to PicSwarm API

PicSwarm is a powerful image sharing and management platform. This API provides all the necessary endpoints to integrate PicSwarm into your applications.

### Key Features
- User Authentication & Management
- Profile Management
- Password Reset Functionality
- Session Management

### Authentication
Most endpoints require authentication using session cookies. After logging in, your session token will be automatically included in subsequent requests.

### Rate Limiting
To ensure service stability:
- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute

### Error Handling
All endpoints follow a consistent error response format:
\`\`\`json
{
    "errors": [
        {
            "msg": "Error message",
            "param": "field_name",
            "location": "body"
        }
    ]
}
\`\`\`
`,
            contact: {
                name: 'API Support',
                email: 'support@picswarm.com',
                url: 'https://picswarm.com/support'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            },
            termsOfService: 'https://picswarm.com/terms'
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            },
            {
                url: 'https://api.picswarm.com',
                description: 'Production server'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['id', 'firstName', 'lastName', 'email'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique user identifier',
                            example: '507f1f77bcf86cd799439011'
                        },
                        firstName: {
                            type: 'string',
                            description: 'User first name',
                            example: 'John'
                        },
                        lastName: {
                            type: 'string',
                            description: 'User last name',
                            example: 'Doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                            example: 'john.doe@example.com'
                        },
                        profilePicture: {
                            type: 'string',
                            description: 'URL to profile picture',
                            example: 'https://picswarm.com/profiles/default.jpg'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Account creation timestamp',
                            example: '2024-03-15T14:30:00Z'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    required: ['msg'],
                    properties: {
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    msg: {
                                        type: 'string',
                                        description: 'Error message',
                                        example: 'Invalid credentials'
                                    },
                                    param: {
                                        type: 'string',
                                        description: 'Parameter that caused the error',
                                        example: 'email'
                                    },
                                    location: {
                                        type: 'string',
                                        description: 'Location of the error (body, query, params)',
                                        example: 'body'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'connect.sid',
                    description: 'Session cookie for authentication'
                }
            },
            parameters: {
                skipParam: {
                    name: 'skip',
                    in: 'query',
                    description: 'Number of records to skip for pagination',
                    schema: {
                        type: 'integer',
                        default: 0,
                        minimum: 0
                    }
                },
                limitParam: {
                    name: 'limit',
                    in: 'query',
                    description: 'Maximum number of records to return',
                    schema: {
                        type: 'integer',
                        default: 10,
                        minimum: 1,
                        maximum: 100
                    }
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Authentication failed',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                errors: [{ msg: 'Not authenticated' }]
                            }
                        }
                    }
                },
                ServerError: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                errors: [{ msg: 'Server error occurred' }]
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                cookieAuth: []
            }
        ],
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and session management endpoints'
            },
            {
                name: 'Users',
                description: 'User profile management endpoints'
            },
            {
                name: 'Images',
                description: 'Image upload and management endpoints'
            }
        ]
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs; 