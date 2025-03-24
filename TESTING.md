# MicroBlog Testing Strategy

This document outlines the testing strategy for the MicroBlog application, covering both backend and frontend tests.

## Testing Architecture

The testing strategy uses a multi-layered approach:

1. **Unit Tests**: Test individual components and functions in isolation
2. **Integration Tests**: Test interactions between components
3. **End-to-End Tests**: Test complete user flows

## Backend Testing (Node.js/Express)

### Technology Stack
- Jest: Testing framework
- Supertest: HTTP assertion library
- Jest-mock-extended: Advanced mocking capabilities

### Backend Test Types

#### Unit Tests
- **Controller Tests**: Test individual controller functions with mocked dependencies
- **Middleware Tests**: Test middleware functions in isolation

#### Integration Tests
- **API Route Tests**: Test complete API endpoints with HTTP requests
- **Database Tests**: Test database interactions with a test database

### Backend Test Cases

#### Authentication Controller
- ✅ Should return error if email is not provided for login
- ✅ Should return error if user is not found
- ✅ Should return user data and JWT token on successful login
- ✅ Should handle database errors during login
- ✅ Should return error if user is not authenticated for profile access
- ✅ Should return error if user is not found for profile
- ✅ Should return user profile data if authenticated
- ✅ Should handle database errors during profile fetch

#### Authentication Middleware
- ✅ Should return 401 if no token is provided
- ✅ Should proceed and set user data if token is valid
- ✅ Should return 403 if token is invalid

#### Posts Controller
- ✅ Should return all posts
- ✅ Should handle errors when fetching posts
- ✅ Should return error if content is not provided for creation
- ✅ Should create a new post
- ✅ Should handle errors when creating posts
- ✅ Should return error if post is not found for deletion
- ✅ Should return error if user is not the author
- ✅ Should successfully delete a post
- ✅ Should handle errors when deleting posts

#### API Route Integration Tests
- ✅ POST `/api/auth/login` - Login endpoint
- ✅ GET `/api/auth/profile` - Profile endpoint
- ✅ GET `/api/posts` - Get all posts
- ✅ POST `/api/posts` - Create post
- ✅ DELETE `/api/posts/:id` - Delete post

## Frontend Testing (React/Next.js)

### Technology Stack
- Jest: Testing framework
- React Testing Library: Component testing
- Mock Service Worker (MSW): API mocking

### Frontend Test Types

#### Unit Tests
- **Component Tests**: Test individual React components in isolation
- **Hook Tests**: Test custom hooks
- **Utility Tests**: Test utility functions

#### Integration Tests
- **Page Tests**: Test complete pages
- **Context Tests**: Test context providers and consumers

### Frontend Test Cases

#### Component Tests

##### Button Component
- Should render correctly with default props
- Should apply different variants (primary, secondary, danger, ghost)
- Should apply different sizes (sm, md, lg)
- Should show loading spinner when isLoading is true
- Should be disabled when disabled prop is true
- Should handle onClick events

##### Layout Components
- Header should display login button when user is not authenticated
- Header should display user name and logout button when authenticated
- Layout should render children correctly
- Footer should display current year

##### Post Components
- PostItem should render post content, author name, and date
- PostItem should show delete button for user's own posts
- PostItem should not show delete button for other users' posts
- CreatePostForm should validate post length (max 280 characters)
- PostsList should display loading state
- PostsList should display error state
- PostsList should display empty state
- PostsList should render a list of posts

#### Context Tests

##### AuthContext
- Should provide authentication state
- Should handle login process
- Should handle logout process
- Should fetch user profile on initial load

##### PostsContext
- Should provide posts data
- Should handle post creation
- Should handle post deletion
- Should refresh posts

##### SocketContext
- Should establish socket connection
- Should handle connection/disconnection events
- Should receive realtime updates

#### Page Tests
- Homepage should render post feed and create form if authenticated
- Login page should validate input and handle form submission
- Login page should redirect authenticated users

## End-to-End Testing

For comprehensive end-to-end testing, the following user flows should be tested:

1. User login flow
2. Creating a new post
3. Viewing all posts
4. Deleting own posts
5. Attempting to delete others' posts (should fail)
6. Socket-based real-time updates

## Test Coverage Targets

- Backend: 80% line coverage
- Frontend: 70% line coverage

## Running Tests

### Backend Tests
```bash
cd microblog-backend
npm test
```

### Frontend Tests
```bash
cd microblog-front
npm test
```

### Coverage Reports
```bash
# Backend
cd microblog-backend
npm run test:coverage

# Frontend
cd microblog-front
npm run test:coverage
```

## Continuous Integration

Tests are automatically run in the CI pipeline for:
- Pull request validation
- Pre-deployment verification

## Test Data Management

- Test database is reset before each test suite run
- Fixtures are used for consistent test data
- Test users: `alice@example.com`, `bob@example.com`
