const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// @route   GET api/docs
// @desc    Get API documentation
// @access  Public
router.get('/', async (req, res) => {
    try {
        const docPath = path.join(__dirname, '..', 'API_DOCUMENTATION.md');
        const documentation = await fs.readFile(docPath, 'utf8');
        res.json({
            title: "PicSwarm API Documentation",
            version: "1.0.0",
            documentation: documentation,
            endpoints: {
                authentication: {
                    register: {
                        method: "POST",
                        path: "/api/auth/register",
                        description: "Register a new user"
                    },
                    login: {
                        method: "POST",
                        path: "/api/auth/login",
                        description: "Login to existing account"
                    },
                    logout: {
                        method: "POST",
                        path: "/api/auth/logout",
                        description: "Logout from current session"
                    },
                    checkAuth: {
                        method: "GET",
                        path: "/api/auth/check",
                        description: "Check authentication status"
                    },
                    forgotPassword: {
                        method: "POST",
                        path: "/api/auth/forgot-password",
                        description: "Request password reset"
                    },
                    resetPassword: {
                        method: "POST",
                        path: "/api/auth/reset-password/:token",
                        description: "Reset password with token"
                    }
                },
                users: {
                    getProfile: {
                        method: "GET",
                        path: "/api/users/me",
                        description: "Get user profile"
                    },
                    updateProfile: {
                        method: "PUT",
                        path: "/api/users/profile",
                        description: "Update user profile"
                    },
                    changePassword: {
                        method: "PUT",
                        path: "/api/users/password",
                        description: "Change user password"
                    },
                    updateProfilePicture: {
                        method: "PUT",
                        path: "/api/users/profile-picture",
                        description: "Update profile picture"
                    }
                }
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/docs/endpoints
// @desc    Get list of all endpoints
// @access  Public
router.get('/endpoints', (req, res) => {
    const endpoints = [
        {
            group: "Authentication",
            endpoints: [
                {
                    method: "POST",
                    path: "/api/auth/register",
                    description: "Register a new user",
                    requiresAuth: false,
                    body: {
                        firstName: "string",
                        lastName: "string",
                        email: "string",
                        password: "string"
                    }
                },
                {
                    method: "POST",
                    path: "/api/auth/login",
                    description: "Login to existing account",
                    requiresAuth: false,
                    body: {
                        email: "string",
                        password: "string"
                    }
                },
                {
                    method: "POST",
                    path: "/api/auth/logout",
                    description: "Logout from current session",
                    requiresAuth: true
                },
                {
                    method: "GET",
                    path: "/api/auth/check",
                    description: "Check authentication status",
                    requiresAuth: false
                },
                {
                    method: "POST",
                    path: "/api/auth/forgot-password",
                    description: "Request password reset",
                    requiresAuth: false,
                    body: {
                        email: "string"
                    }
                },
                {
                    method: "POST",
                    path: "/api/auth/reset-password/:token",
                    description: "Reset password with token",
                    requiresAuth: false,
                    params: {
                        token: "string"
                    },
                    body: {
                        password: "string"
                    }
                }
            ]
        },
        {
            group: "User Profile",
            endpoints: [
                {
                    method: "GET",
                    path: "/api/users/me",
                    description: "Get user profile",
                    requiresAuth: true
                },
                {
                    method: "PUT",
                    path: "/api/users/profile",
                    description: "Update user profile",
                    requiresAuth: true,
                    body: {
                        firstName: "string",
                        lastName: "string",
                        email: "string"
                    }
                },
                {
                    method: "PUT",
                    path: "/api/users/password",
                    description: "Change user password",
                    requiresAuth: true,
                    body: {
                        currentPassword: "string",
                        newPassword: "string"
                    }
                },
                {
                    method: "PUT",
                    path: "/api/users/profile-picture",
                    description: "Update profile picture",
                    requiresAuth: true,
                    body: {
                        profilePicture: "string"
                    }
                }
            ]
        }
    ];

    res.json(endpoints);
});

// @route   GET api/docs/endpoint/:path
// @desc    Get detailed documentation for specific endpoint
// @access  Public
router.get('/endpoint/:path(*)', (req, res) => {
    const { path } = req.params;
    const endpointDocs = {
        "/api/auth/register": {
            method: "POST",
            description: "Register a new user account",
            requiresAuth: false,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                type: "object",
                properties: {
                    firstName: {
                        type: "string",
                        required: true,
                        description: "User's first name"
                    },
                    lastName: {
                        type: "string",
                        required: true,
                        description: "User's last name"
                    },
                    email: {
                        type: "string",
                        required: true,
                        description: "User's email address"
                    },
                    password: {
                        type: "string",
                        required: true,
                        description: "Password (min 6 characters)"
                    }
                }
            },
            responses: {
                200: {
                    description: "Success",
                    content: {
                        user: {
                            id: "string",
                            firstName: "string",
                            lastName: "string",
                            email: "string"
                        }
                    }
                },
                400: {
                    description: "Bad Request",
                    content: {
                        msg: "Error message"
                    }
                },
                500: {
                    description: "Server Error",
                    content: {
                        msg: "Server error"
                    }
                }
            }
        }
        // Add more endpoint documentation as needed
    };

    const docs = endpointDocs[`/api/${path}`];
    if (!docs) {
        return res.status(404).json({ msg: "Documentation not found for this endpoint" });
    }

    res.json(docs);
});

module.exports = router; 