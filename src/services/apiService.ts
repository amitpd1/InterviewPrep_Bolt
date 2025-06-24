import axios from 'axios';
import { InterviewConfig, AnalyticsData, InterviewResponse } from '../types';

// Check if we should use Python backend
const USE_PYTHON_BACKEND = import.meta.env.VITE_USE_PYTHON_BACKEND === 'true';
const PYTHON_API_BASE = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:3001';
const NODE_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const API_BASE_URL = USE_PYTHON_BACKEND ? PYTHON_API_BASE : NODE_API_BASE;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface QuestionGenerationRequest {
  config: InterviewConfig;
  previousQuestions?: string[];
  previousResponses?: InterviewResponse[];
  questionNumber?: number;
}

export interface FollowUpRequest {
  question: string;
  response: string;
  config: InterviewConfig;
}

export interface ResponseAnalysisRequest {
  question: string;
  response: string;
  config: InterviewConfig;
}

export interface AnalyticsRequest {
  responses: InterviewResponse[];
  config: InterviewConfig;
}

export class APIService {
  static async generateQuestion(request: QuestionGenerationRequest): Promise<string> {
    try {
      console.log(`Using ${USE_PYTHON_BACKEND ? 'Python' : 'Node.js'} backend for question generation`);
      
      // Convert camelCase to snake_case for Python backend
      const pythonRequest = USE_PYTHON_BACKEND ? {
        config: {
          ...request.config,
          experience_level: request.config.experienceLevel,
          company_name: request.config.companyName
        },
        previous_questions: request.previousQuestions,
        previous_responses: request.previousResponses?.map(r => ({
          question_id: r.questionId,
          question: r.question,
          response: r.response,
          timestamp: r.timestamp,
          duration: r.duration
        })),
        question_number: request.questionNumber
      } : request;
      
      const endpoint = USE_PYTHON_BACKEND ? '/api/generate-question' : '/generate-question';
      const response = await apiClient.post(endpoint, pythonRequest);
      return response.data.question;
    } catch (error) {
      console.error('Error generating question:', error);
      throw new Error('Failed to generate question. Please try again.');
    }
  }

  static async generateFollowUp(request: FollowUpRequest): Promise<string> {
    try {
      const pythonRequest = USE_PYTHON_BACKEND ? {
        question: request.question,
        response: request.response,
        config: {
          ...request.config,
          experience_level: request.config.experienceLevel,
          company_name: request.config.companyName
        }
      } : request;
      
      const endpoint = USE_PYTHON_BACKEND ? '/api/generate-followup' : '/generate-followup';
      const response = await apiClient.post(endpoint, pythonRequest);
      return response.data.followUp;
    } catch (error) {
      console.error('Error generating follow-up:', error);
      throw new Error('Failed to generate follow-up question.');
    }
  }

  static async analyzeResponse(request: ResponseAnalysisRequest): Promise<any> {
    try {
      const pythonRequest = USE_PYTHON_BACKEND ? {
        question: request.question,
        response: request.response,
        config: {
          ...request.config,
          experience_level: request.config.experienceLevel,
          company_name: request.config.companyName
        }
      } : request;
      
      const endpoint = USE_PYTHON_BACKEND ? '/api/analyze-response' : '/analyze-response';
      const response = await apiClient.post(endpoint, pythonRequest);
      return response.data.analysis;
    } catch (error) {
      console.error('Error analyzing response:', error);
      throw new Error('Failed to analyze response.');
    }
  }

  static async generateAnalytics(request: AnalyticsRequest): Promise<AnalyticsData> {
    try {
      console.log(`Using ${USE_PYTHON_BACKEND ? 'Python Pydantic AI' : 'Node.js'} backend for analytics generation`);
      
      const pythonRequest = USE_PYTHON_BACKEND ? {
        responses: request.responses.map(r => ({
          question_id: r.questionId,
          question: r.question,
          response: r.response,
          timestamp: r.timestamp,
          duration: r.duration
        })),
        config: {
          ...request.config,
          experience_level: request.config.experienceLevel,
          company_name: request.config.companyName
        }
      } : request;
      
      const endpoint = USE_PYTHON_BACKEND ? '/api/generate-analytics' : '/generate-analytics';
      const response = await apiClient.post(endpoint, pythonRequest);
      return response.data.analytics;
    } catch (error) {
      console.error('Error generating analytics:', error);
      throw new Error('Failed to generate analytics.');
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const endpoint = '/api/health';
      const response = await apiClient.get(endpoint);
      return response.data.status === 'OK';
    } catch (error) {
      return false;
    }
  }

  // Generic HTTP methods
  static async get(url: string): Promise<any> {
    try {
      return await apiClient.get(url);
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  }

  static async post(url: string, data?: any): Promise<any> {
    try {
      return await apiClient.post(url, data);
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  }

  static async put(url: string, data?: any): Promise<any> {
    try {
      return await apiClient.put(url, data);
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw error;
    }
  }

  static async delete(url: string): Promise<any> {
    try {
      return await apiClient.delete(url);
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  }
}