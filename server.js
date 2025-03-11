const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { config } = require('./config/config');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

// Create Express app
const app = express();

// JSON parsing error handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            errors: [{
                msg: 'Invalid JSON format in request body',
                details: err.message,
                location: 'body'
            }]
        });
    }
    next(err);
});

// Middleware
app.use(express.json({
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            res.status(400).json({
                errors: [{
                    msg: 'Invalid JSON format in request body',
                    details: e.message,
                    location: 'body'
                }]
            });
            throw new Error('Invalid JSON');
        }
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/picswarm'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// API Documentation
const swaggerOptions = {
    customCss: `
        /* Base Styles */
        .swagger-ui {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            --primary-color: #4990e2;
            --success-color: #28a745;
            --danger-color: #dc3545;
            --text-color: #2c3e50;
            --border-color: #e9ecef;
            --bg-color: #f8f9fa;
        }
        
        /* Header & Navigation */
        .swagger-ui .topbar { display: none }
        .swagger-ui .info { 
            margin: 30px 0;
            background: var(--bg-color);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .swagger-ui .info .title { 
            font-size: 42px;
            color: var(--text-color);
            font-weight: 700;
            margin-bottom: 20px;
            border-bottom: 3px solid var(--primary-color);
            padding-bottom: 10px;
        }
        .swagger-ui .info .description { 
            font-size: 16px;
            line-height: 1.8;
            color: var(--text-color);
        }
        
        /* Schema Styling */
        .swagger-ui .model-box {
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            margin: 15px 0;
            transition: all 0.3s ease;
        }
        .swagger-ui .model-box:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-color: var(--primary-color);
        }
        .swagger-ui .model {
            padding: 20px;
        }
        .swagger-ui .model-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        .swagger-ui .model-title:before {
            content: '⚡';
            margin-right: 8px;
            color: var(--primary-color);
        }
        .swagger-ui .property {
            margin: 12px 0;
            padding: 12px;
            border-bottom: 1px solid var(--border-color);
            transition: background-color 0.2s ease;
        }
        .swagger-ui .property:hover {
            background-color: var(--bg-color);
        }
        .swagger-ui .property-name {
            font-weight: 600;
            color: var(--text-color);
            font-size: 15px;
        }
        .swagger-ui .property-type {
            color: var(--primary-color);
            font-family: 'Fira Code', monospace;
            font-size: 14px;
            padding: 2px 6px;
            background: rgba(73, 144, 226, 0.1);
            border-radius: 4px;
        }
        
        /* Endpoint Sections */
        .swagger-ui .opblock {
            margin: 0 0 20px 0;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
        }
        .swagger-ui .opblock:hover {
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }
        .swagger-ui .opblock .opblock-summary {
            padding: 20px;
            border-radius: 12px 12px 0 0;
        }
        .swagger-ui .opblock .opblock-summary-method {
            font-size: 14px;
            font-weight: 600;
            min-width: 80px;
            text-align: center;
            border-radius: 6px;
        }
        .swagger-ui .opblock-tag {
            font-size: 28px;
            font-weight: 700;
            margin: 30px 0 15px 0;
            padding: 15px 0;
            border-bottom: 3px solid var(--primary-color);
            color: var(--text-color);
        }
        
        /* Request/Response Sections */
        .swagger-ui .parameters-col_description {
            width: 75%;
            font-size: 14px;
            line-height: 1.6;
        }
        .swagger-ui .parameter__name {
            font-weight: 600;
            color: var(--text-color);
            font-size: 15px;
        }
        .swagger-ui .parameter__type {
            color: var(--primary-color);
            font-family: 'Fira Code', monospace;
            background: rgba(73, 144, 226, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
        }
        
        /* Code Examples */
        .swagger-ui .highlight-code {
            background: #1a202c;
            border-radius: 8px;
            margin: 15px 0;
            position: relative;
        }
        .swagger-ui .highlight-code:before {
            content: 'Example';
            position: absolute;
            top: -10px;
            left: 10px;
            background: var(--primary-color);
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
        .swagger-ui .highlight-code pre {
            padding: 20px;
            margin: 0;
            font-family: 'Fira Code', monospace;
            font-size: 14px;
        }
        
        /* Try It Out Section */
        .swagger-ui .try-out {
            margin: 15px 0;
            padding: 15px;
            background: var(--bg-color);
            border-radius: 8px;
        }
        .swagger-ui .try-out__btn {
            background-color: var(--primary-color);
            border: none;
            color: white;
            border-radius: 6px;
            padding: 10px 20px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        .swagger-ui .try-out__btn:hover {
            background-color: #357abd;
            transform: translateY(-1px);
        }
        
        /* Response Section */
        .swagger-ui .responses-wrapper {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            margin: 15px 0;
        }
        .swagger-ui .response-col_status {
            font-size: 14px;
            font-weight: 600;
        }
        .swagger-ui .response-col_description {
            font-size: 14px;
            line-height: 1.6;
        }
        .swagger-ui .response__title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color);
            margin: 10px 0;
        }
        
        /* Tables */
        .swagger-ui table {
            border-collapse: separate;
            border-spacing: 0;
            width: 100%;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            margin: 15px 0;
            overflow: hidden;
        }
        .swagger-ui table thead tr th {
            background: var(--bg-color);
            padding: 15px;
            border-bottom: 2px solid var(--border-color);
            font-weight: 600;
            color: var(--text-color);
            font-size: 14px;
        }
        .swagger-ui table tbody tr td {
            padding: 15px;
            border-bottom: 1px solid var(--border-color);
            font-size: 14px;
            line-height: 1.6;
        }
        .swagger-ui table tbody tr:hover td {
            background-color: var(--bg-color);
        }
        
        /* Authorization Section */
        .swagger-ui .auth-wrapper {
            padding: 20px;
            background: var(--bg-color);
            border-radius: 8px;
            margin: 15px 0;
            border: 1px solid var(--border-color);
        }
        .swagger-ui .auth-wrapper .auth-btn-wrapper {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        .swagger-ui .auth-btn-wrapper button {
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
            transition: all 0.2s;
        }
        
        /* Buttons */
        .swagger-ui .btn {
            border-radius: 6px;
            padding: 10px 20px;
            font-weight: 500;
            transition: all 0.2s;
            border: none;
            cursor: pointer;
        }
        .swagger-ui .execute {
            background-color: var(--success-color);
            color: white;
        }
        .swagger-ui .execute:hover {
            background-color: #218838;
            transform: translateY(-1px);
        }
        .swagger-ui .btn-clear {
            background-color: var(--danger-color);
            color: white;
        }
        .swagger-ui .btn-clear:hover {
            background-color: #c82333;
            transform: translateY(-1px);
        }
        
        /* Schema Toggles */
        .swagger-ui .model-toggle {
            font-size: 20px;
            color: var(--primary-color);
            transition: transform 0.3s ease;
        }
        .swagger-ui .model-toggle.collapsed {
            transform: rotate(-90deg);
        }
        
        /* Markdown Content */
        .swagger-ui .markdown p, 
        .swagger-ui .markdown li {
            font-size: 15px;
            line-height: 1.8;
            color: var(--text-color);
            margin: 10px 0;
        }
        .swagger-ui .markdown h1, 
        .swagger-ui .markdown h2, 
        .swagger-ui .markdown h3 {
            color: var(--text-color);
            margin: 20px 0 10px 0;
            font-weight: 600;
        }
        .swagger-ui .markdown code {
            background: var(--bg-color);
            padding: 3px 8px;
            border-radius: 4px;
            color: #e83e8c;
            font-family: 'Fira Code', monospace;
            font-size: 14px;
        }
        .swagger-ui .markdown pre {
            background: #1a202c;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
        }
        
        /* Loading States */
        .swagger-ui .loading-container {
            padding: 20px;
            text-align: center;
        }
        .swagger-ui .loading-container .loading:after {
            content: '';
            animation: dots 1.5s infinite;
        }
        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60% { content: '...'; }
            80%, 100% { content: ''; }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .swagger-ui .info .title {
                font-size: 32px;
            }
            .swagger-ui .opblock-tag {
                font-size: 24px;
            }
            .swagger-ui .parameters-col_description {
                width: 100%;
            }
            .swagger-ui table {
                display: block;
                overflow-x: auto;
            }
        }
    `,
    customSiteTitle: "PicSwarm API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
        persistAuthorization: true,
        displayOperationId: false,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        displayRequestDuration: true,
        docExpansion: "list",
        deepLinking: true,
        syntaxHighlight: {
            activate: true,
            theme: "monokai"
        },
        defaultModelsExpandDepth: 3,
        defaultModelExpandDepth: 3,
        defaultModelRendering: 'model',
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true,
        maxDisplayedTags: null,
        showCommonExtensions: true,
        showExtensions: true,
        supportedSubmitMethods: [
            'get',
            'put',
            'post',
            'delete',
            'options',
            'head',
            'patch',
            'trace'
        ]
    }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerOptions));

// API Home
app.get('/api', (req, res) => {
    res.json({
        name: 'PicSwarm API',
        version: '1.0.0',
        documentation: '/api-docs',
        status: 'operational'
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/picswarm')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// General error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        errors: [{
            msg: err.message || 'Something went wrong!',
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }]
    });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 