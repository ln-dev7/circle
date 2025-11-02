# AI Services Integration for AiM

This document describes the AI services integration implemented in the AiM (AI Marketing) platform.

## Overview

The AI integration provides the following services:

- **Content Generation**: Generate new content based on prompts
- **Content Summarization**: Summarize long-form content
- **Content Translation**: Translate content to different languages
- **Idea Generation**: Generate creative ideas for content topics

## Setup

### Environment Variables

Add the following to your `.env` file:

```env
# OpenAI
OPENAI_API_KEY="your-openai-api-key-here"
```

### Dependencies

The following packages are required:

- `openai`: OpenAI SDK for API integration

Install with:

```bash
pnpm add openai
```

## API Endpoints

### Content Generation

**POST** `/api/[orgId]/content/generate`

Generates new content using AI based on a prompt.

**Request Body:**

```json
{
   "prompt": "Write a social media post about summer fashion",
   "campaignId": "campaign-uuid"
}
```

**Response:**

```json
{
   "id": "content-uuid",
   "title": "AI Generated: Write a social media post about summer fashion...",
   "body": "Generated content here...",
   "campaignId": "campaign-uuid",
   "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Content Summarization

**POST** `/api/[orgId]/content/summarize`

Summarizes provided content.

**Request Body:**

```json
{
  "content": "Long text to summarize...",
  "length": "brief" | "detailed"
}
```

**Response:**

```json
{
   "summary": "Summarized content here..."
}
```

### Content Translation

**POST** `/api/[orgId]/content/translate`

Translates content to a target language.

**Request Body:**

```json
{
   "content": "Text to translate",
   "targetLanguage": "Spanish",
   "sourceLanguage": "English" // optional
}
```

**Response:**

```json
{
   "translatedContent": "Texto traducido"
}
```

### Idea Generation

**POST** `/api/[orgId]/content/ideas`

Generates creative ideas for content topics.

**Request Body:**

```json
{
  "topic": "social media marketing",
  "count": 5,
  "type": "general" | "titles" | "hashtags" | "campaigns"
}
```

**Response:**

```json
{
   "ideas": ["Idea 1", "Idea 2", "Idea 3"]
}
```

## UI Integration

### Creator Dashboard

The AI features are integrated into the Creator Dashboard with three main sections:

1. **AI Assistant Tab**: Contains forms for all AI services
2. **Content Studio**: AI-powered content creation dialog
3. **Idea Generation**: Generate content ideas based on topics

### Features

- **Real-time AI Generation**: Generate content instantly
- **Campaign Integration**: Associate generated content with campaigns
- **Multi-language Support**: Translate content to various languages
- **Idea Brainstorming**: Generate multiple ideas for content topics
- **Content Optimization**: Summarize and improve existing content

## Usage Examples

### Generating Content

```typescript
import { generateContent } from '@/lib/openai';

const content = await generateContent({
   prompt: 'Write a blog post about AI in marketing',
   type: 'blog',
   tone: 'professional',
   length: 'medium',
});
```

### Summarizing Content

```typescript
import { summarizeContent } from '@/lib/openai';

const summary = await summarizeContent({
   content: 'Long article text...',
   length: 'brief',
});
```

### Translating Content

```typescript
import { translateContent } from '@/lib/openai';

const translation = await translateContent({
   content: 'Hello world',
   targetLanguage: 'Spanish',
});
```

### Generating Ideas

```typescript
import { generateIdeas } from '@/lib/openai';

const ideas = await generateIdeas({
   topic: 'content marketing',
   count: 5,
   type: 'general',
});
```

## Error Handling

All AI functions include proper error handling:

- API key validation
- Network error handling
- Rate limiting considerations
- Fallback responses for failed requests

## Security

- API keys are stored as environment variables
- All endpoints require authentication
- RBAC permissions are enforced
- Input validation using Zod schemas

## Testing

Run the AI integration tests:

```typescript
import { runAITests } from '@/lib/ai-test';

// Run all tests
const results = await runAITests();
```

## Future Enhancements

- Support for additional AI models
- Batch processing for multiple content items
- Advanced content optimization features
- Integration with other AI services
- Custom AI model training

## Support

For issues or questions about the AI integration:

1. Check the API key is valid and has sufficient credits
2. Verify network connectivity
3. Review error logs in the console
4. Ensure proper permissions are set for the user
