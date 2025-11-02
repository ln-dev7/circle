/**
 * AI Integration Test File
 *
 * This file contains tests to verify AI service integration.
 * Note: These tests require a valid OpenAI API key to run successfully.
 */

import { generateContent, summarizeContent, translateContent, generateIdeas } from './openai';

// Test functions for AI services
export async function testAIGeneration() {
   try {
      console.log('Testing AI Content Generation...');
      const result = await generateContent({
         prompt: 'Write a short social media post about healthy eating',
         type: 'social',
         tone: 'casual',
         length: 'short',
      });
      console.log('Generation Result:', result);
      return result;
   } catch (error) {
      console.error('Generation test failed:', error);
      return null;
   }
}

export async function testAISummarization() {
   try {
      console.log('Testing AI Content Summarization...');
      const result = await summarizeContent({
         content:
            'This is a long article about artificial intelligence and its applications in modern business. AI has revolutionized many industries including healthcare, finance, and marketing. Machine learning algorithms can now predict customer behavior, automate customer service, and create personalized content. The future of AI looks promising with advancements in natural language processing and computer vision.',
         length: 'brief',
      });
      console.log('Summarization Result:', result);
      return result;
   } catch (error) {
      console.error('Summarization test failed:', error);
      return null;
   }
}

export async function testAITranslation() {
   try {
      console.log('Testing AI Content Translation...');
      const result = await translateContent({
         content: 'Hello, how are you today?',
         targetLanguage: 'Spanish',
         sourceLanguage: 'English',
      });
      console.log('Translation Result:', result);
      return result;
   } catch (error) {
      console.error('Translation test failed:', error);
      return null;
   }
}

export async function testAIdeation() {
   try {
      console.log('Testing AI Idea Generation...');
      const result = await generateIdeas({
         topic: 'social media marketing',
         count: 3,
         type: 'general',
      });
      console.log('Ideation Result:', result);
      return result;
   } catch (error) {
      console.error('Ideation test failed:', error);
      return null;
   }
}

// Main test runner
export async function runAITests() {
   console.log('Starting AI Integration Tests...\n');

   const results = {
      generation: await testAIGeneration(),
      summarization: await testAISummarization(),
      translation: await testAITranslation(),
      ideation: await testAIdeation(),
   };

   console.log('\nAI Integration Test Results:');
   console.log('Generation:', results.generation ? 'PASS' : 'FAIL');
   console.log('Summarization:', results.summarization ? 'PASS' : 'FAIL');
   console.log('Translation:', results.translation ? 'PASS' : 'FAIL');
   console.log('Ideation:', results.ideation ? 'PASS' : 'FAIL');

   return results;
}
