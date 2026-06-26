export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface ModelDetails {
    parent_model: string; // Accepts empty string as per the data
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
}

export interface ModelItem {
    model: string;
    modified_at: string; // ISO timestamp string
    digest: string;
    size: number;
    details: ModelDetails;
}

export interface ModelsMetaData {
    models: ModelItem[];
}