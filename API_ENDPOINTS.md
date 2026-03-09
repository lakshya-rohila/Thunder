# API Endpoints Documentation

## Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user information

## Chat
- `GET /api/chat/list` - List all chats
- `POST /api/chat/create` - Create new chat
- `GET /api/chat/[id]` - Get specific chat

## Community
- `GET /api/community/feed` - Get community feed
- `POST /api/community/post` - Create new post
- `GET /api/community/[id]` - Get specific post
- `POST /api/community/comment` - Add comment to post
- `GET /api/community/comment/[id]` - Get specific comment
- `POST /api/community/like` - Like a post

## AI Tools
- `POST /api/ai/[tool]` - Dynamic AI tool endpoint
- `POST /api/analyze-image` - Image analysis
- `POST /api/code` - Code generation/analysis
- `POST /api/generate` - Text generation
- `POST /api/image` - Image generation
- `POST /api/research` - Research tool

## Profile
- `GET /api/profile/[username]` - Get user profile
- `PUT /api/profile/update` - Update user profile

## Analytics
- `POST /api/analytics/event` - Track analytics events

## Credits
- `GET /api/credits` - Get user credits information

## Session
- `POST /api/session/validate` - Validate user session

## Deployment
- `POST /api/deploy` - Deployment endpoint
