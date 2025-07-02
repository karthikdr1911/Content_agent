import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the schema for ideation items
export interface IdeationItem {
  idea_id: string;
  title: string;
  desc: string;
  tags: string[];
  tone?: string;
  platform?: string;
  duration?: string;
  language?: string;
  persona?: string;
}

// Validate a single item
export function validateIdeationItem(item: any): { valid: boolean; errors: string[]; item: IdeationItem } {
  const errors: string[] = [];
  // Required fields
  if (!item.title || typeof item.title !== 'string') errors.push('Missing or invalid title');
  if (!item.desc || typeof item.desc !== 'string') errors.push('Missing or invalid desc');
  if (!item.tags || !Array.isArray(item.tags)) errors.push('Missing or invalid tags');

  // Assign UUID if missing or invalid
  let idea_id = item.idea_id;
  if (!idea_id || typeof idea_id !== 'string' || idea_id.length < 8) {
    idea_id = uuidv4();
  }

  // Optional fields: type checks only
  const optionalFields = ['tone', 'platform', 'duration', 'language', 'persona'];
  optionalFields.forEach(field => {
    if (item[field] && typeof item[field] !== 'string') {
      errors.push(`Invalid type for ${field}`);
    }
  });

  const valid = errors.length === 0;
  return {
    valid,
    errors,
    item: {
      idea_id,
      title: item.title,
      desc: item.desc,
      tags: item.tags,
      tone: item.tone,
      platform: item.platform,
      duration: item.duration,
      language: item.language,
      persona: item.persona,
    },
  };
}

// Validate the entire ideation.json file
export function validateIdeationFile(filePath: string): { valid: boolean; errors: string[]; items: IdeationItem[] } {
  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    return { valid: false, errors: ['File not found'], items: [] };
  }
  const raw = fs.readFileSync(absPath, 'utf-8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { valid: false, errors: ['Invalid JSON'], items: [] };
  }
  if (!Array.isArray(data)) {
    return { valid: false, errors: ['Root should be an array'], items: [] };
  }
  const errors: string[] = [];
  const items: IdeationItem[] = [];
  data.forEach((item, idx) => {
    const result = validateIdeationItem(item);
    if (!result.valid) {
      errors.push(`Item ${idx}: ${result.errors.join(', ')}`);
    }
    items.push(result.item);
  });
  return { valid: errors.length === 0, errors, items };
} 