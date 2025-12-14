
// API base - uses relative path which works with nginx reverse proxy
// When accessed via bigdataproject.tech, nginx proxies /api/* to the backend
const API_BASE = ((import.meta as any).env && (import.meta as any).env.VITE_API_BASE) || '/api';

// Types
export interface PredictRequest {
  machineId: string;
  temperature: number | string;
  humidity: number | string;
}

export interface PredictResponse {
  prediction: number;  // 0 or 1
  needs_maintenance: boolean;
  confidence: number;
  timestamp: string;
  model_version: string;
  kafka_sent: boolean;
}

export interface PredictionHistory {
  id: number;
  machine_id: string;
  features: { temperature?: number; humidity?: number };
  prediction: number;  // 0 or 1
  needs_maintenance: boolean;
  model_version: string;
  timestamp: string;
}

export interface StatsResponse {
  total_predictions: number;
  unique_machines: number;
  avg_prediction: number;
  latest_prediction: string | null;
}

export interface MachineInfo {
  machine_id: string;
  prediction_count: number;
  last_prediction: number | null;
  last_timestamp: string | null;
}

// API Functions
export async function postPredict(payload: PredictRequest): Promise<PredictResponse> {
  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      machineId: payload.machineId,
      temperature: Number(payload.temperature),
      humidity: Number(payload.humidity),
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export async function getHistory(): Promise<PredictionHistory[]> {
  const response = await fetch(`${API_BASE}/history`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }
  
  return response.json();
}

export async function getStats(): Promise<StatsResponse> {
  const response = await fetch(`${API_BASE}/stats`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  
  return response.json();
}

export async function getMachines(): Promise<MachineInfo[]> {
  const response = await fetch(`${API_BASE}/machines`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch machines');
  }
  
  return response.json();
}

export async function getMachinePredictions(machineId: string): Promise<PredictionHistory[]> {
  const response = await fetch(`${API_BASE}/machine/${encodeURIComponent(machineId)}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch machine predictions');
  }
  
  return response.json();
}

export async function getHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE}/health`);
  
  if (!response.ok) {
    throw new Error('Backend is not healthy');
  }
  
  return response.json();
}