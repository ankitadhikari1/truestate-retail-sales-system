import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Normalizes field names from CSV to camelCase
 */
function normalizeFieldName(fieldName) {
  if (!fieldName) return fieldName;
  
  // Convert to camelCase
  return fieldName
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Converts a value to a number if possible, otherwise returns the original value
 */
function parseNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? value : parsed;
}

/**
 * Converts a date string to ISO date string
 */
function parseDate(value) {
  if (value === null || value === undefined || value === '') return null;
  
  // Try to parse as date
  const date = new Date(value);
  if (isNaN(date.getTime())) return value; // Return original if invalid
  
  return date.toISOString();
}

/**
 * Parses tags field - handles comma-separated strings or arrays
 */
function parseTags(value) {
  if (value === null || value === undefined || value === '') return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  return [];
}

/**
 * Loads and parses the sales CSV file
 * @returns {Promise<Array>} Array of normalized sales records
 */
export async function loadSalesData() {
  return new Promise((resolve, reject) => {
    const csvPath = path.join(__dirname, '../data/sales.csv');
    const results = [];

    if (!fs.existsSync(csvPath)) {
      console.warn(`CSV file not found at ${csvPath}. Using empty dataset.`);
      resolve([]);
      return;
    }

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        // Normalize field names and parse values
        const normalized = {};
        
        // Process all fields from the row
        for (const [key, value] of Object.entries(row)) {
          const normalizedKey = normalizeFieldName(key);
          let parsedValue = value;
          
          // Parse numeric fields
          if (['quantity', 'pricePerUnit', 'discountPercentage', 'totalAmount', 'finalAmount', 'age'].includes(normalizedKey)) {
            parsedValue = parseNumber(value);
          }
          // Parse date field
          else if (normalizedKey === 'date') {
            parsedValue = parseDate(value);
          }
          // Parse tags field
          else if (normalizedKey === 'tags') {
            parsedValue = parseTags(value);
          }
          // Keep other fields as strings (trimmed)
          else if (typeof value === 'string') {
            parsedValue = value.trim();
          }
          
          normalized[normalizedKey] = parsedValue;
        }
        
        results.push(normalized);
      })
      .on('end', () => {
        console.log(`Loaded ${results.length} sales records from CSV`);
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}


