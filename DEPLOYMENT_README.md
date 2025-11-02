# Deployment and Monitoring Guide

## Containerization

### Docker

- Build: `docker build -t aim-platform .`
- Run: `docker run -p 3000:3000 aim-platform`

### Docker Compose (Development)

- Start: `docker-compose up`
- Stop: `docker-compose down`

## Deployment

### Vercel

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `OPENAI_API_KEY`
3. Deploy

### AWS Amplify

1. Connect repository to Amplify
2. Configure build settings (amplify.yml provided)
3. Set environment variables
4. Deploy

## Environment Variables

### Production (.env.production)

- Update with production values
- Use secure secrets for sensitive data

## Monitoring

### Health Check

- Endpoint: `/api/health`
- Returns status of services (database, OpenAI)
- Use for load balancer health checks

### Logs

- Application logs available in deployment platform
- Database logs via PostgreSQL

### Performance

- Next.js analytics in production
- Monitor API response times
