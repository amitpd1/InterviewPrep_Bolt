import axios from 'axios';
import { InterviewConfig, AnalyticsData, InterviewResponse } from '../types';

// Check if we should use Python backend
const PYTHON_API_BASE = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:3001/api';

const API_BASE_URL = PYTHON_API_BASE 

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

// Export the function so it can be imported elsewhere
export function toPythonInterviewConfig(config: InterviewConfig) {
  // Only include allowed properties for Gemini backend
  // IMPORTANT: All keys must be in snake_case to match Python backend expectations

  // Validate required fields
  if (!config.topic) throw new Error('InterviewConfig: topic is required');
  if (!config.style) throw new Error('InterviewConfig: style is required');
  if (!config.experienceLevel) throw new Error('InterviewConfig: experienceLevel is required');
  if (!config.duration) throw new Error('InterviewConfig: duration is required');
  // Always send both position and language for backend compatibility

  // LiveKit Voice agents may require the fields to be at the root level, not inside config
  // So, return both a config object and also merge position/language at the root if needed

  return {
    topic: config.topic,
    // position: config.position || config.topic, // use config.position if available, else fallback to topic
    style: config.style,
    experience_level: config.experienceLevel,
    company_name: config.companyName,
    duration: config.duration,
    // language: config.language || 'english', // use config.language if available, else fallback to 'english'
    // Add other allowed properties here in snake_case if needed
  };
}

export class APIService {
  static async generateQuestion(request: QuestionGenerationRequest): Promise<string> {
    try {
      // Ensure previousQuestions and previousResponses are always arrays
      const pythonRequest = {
        ...request,
        previousQuestions: request.previousQuestions ?? [],
        previousResponses: request.previousResponses ?? [],
        config: toPythonInterviewConfig(request.config),
      };
      const response = await apiClient.post('/generate-question', pythonRequest);
      return response.data.question;
    } catch (error) {
      console.error('Error generating question:', error);
      throw new Error('Failed to generate question. Please try again.');
    }
  }

  static async generateFollowUp(request: FollowUpRequest): Promise<string> {
    try {
      const pythonRequest = {
        ...request,
        config: toPythonInterviewConfig(request.config),
      };
      const response = await apiClient.post('/generate-followup', pythonRequest);
      return response.data.followUp;
    } catch (error) {
      console.error('Error generating follow-up:', error);
      throw new Error('Failed to generate follow-up question.');
    }
  }

  static async analyzeResponse(request: ResponseAnalysisRequest): Promise<any> {
    try {
      const pythonRequest = {
        ...request,
        config: toPythonInterviewConfig(request.config),
      };
      const response = await apiClient.post('/analyze-response', pythonRequest);
      return response.data.analysis;
    } catch (error) {
      console.error('Error analyzing response:', error);
      throw new Error('Failed to analyze response.');
    }
  }

  static async generateAnalytics(request: AnalyticsRequest): Promise<AnalyticsData> {
    try {
      const pythonRequest = {
        ...request,
        config: toPythonInterviewConfig(request.config),
        responses: request.responses.map(r => ({
          ...r,
          question_id: r.questionId,
        })),
      };
      const response = await apiClient.post('/generate-analytics', pythonRequest);
      return response.data.analytics;
    } catch (error) {
      console.error('Error generating analytics:', error);
      throw new Error('Failed to generate analytics.');
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const endpoint = '/health';
      const response = await apiClient.get(endpoint);
      return response.data.status === 'OK';
    } catch (error) {
      return false;
    }
  }

  static async startVoiceInterview(data: { config: InterviewConfig; [key: string]: any }): Promise<any> {
    // Only include allowed fields and transform config to snake_case
    const {
      config,
      identity,
      room,
      agent_provider,
      enable_ai_agent,
      participant_name,
      // participantName, // remove camelCase fallback
      ...rest
    } = data;
    const pyConfig = toPythonInterviewConfig(config);

    // Use only snake_case participant_name
    // Debug: log incoming data for identity, room, and participant_name
    console.log('startVoiceInterview called with:', { identity, room, participant_name });

    // Validate participant_name, identity, and room for access token generation
    if (!participant_name) {
      console.error('Missing participant_name:', participant_name);
      throw new Error('participant_name must be provided to start a voice interview.');
    }
    if (!identity || !room) {
      console.error('Missing identity or room:', { identity, room });
      throw new Error('Both identity and room must be provided to start a voice interview.');
    }

    // Always ensure identity, room, and participant_name are present at the root level
    const payload = {
      ...rest,
      agent_provider,
      config: pyConfig,
      enable_ai_agent,
      participant_name,
      identity,
      room,
    };
    // Debug: log the payload to verify keys
    console.log('Payload for /voice-interview/start:', JSON.stringify(payload));
    console.log('Access Token Generation - identity:', identity, 'room:', room);
    try {
      const response = await apiClient.post('/voice-interview/start', payload);
      // Debug: log the full response for troubleshooting
      console.log('Backend response for /voice-interview/start:', response.data);

      // Check for participant_token in the response and handle errors accordingly
      // Also check for camelCase fallback (participantToken) for robustness
      if (
        !response.data.participant_token &&
        !response.data.participantToken
      ) {
        throw new Error('No participant token received from backend');
      }

      // Always return the backend response, but normalize to snake_case for frontend use
      return {
        ...response.data,
        participant_token: response.data.participant_token || response.data.participantToken
      };
    } catch (error) {
      console.error('POST /voice-interview/start failed:', error);
      throw error;
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