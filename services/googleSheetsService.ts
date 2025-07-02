import { google } from 'googleapis';

const SHEET_ID = process.env.SHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

let sheetsClient: any = null;

function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  if (!GOOGLE_SERVICE_ACCOUNT_JSON) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');
  const creds = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

export async function appendToSheet(row: any[]): Promise<void> {
  if (!SHEET_ID) throw new Error('SHEET_ID not set');
  const sheets = getSheetsClient();
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1',
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });
    console.log('Appended to Google Sheet:', row);
  } catch (err) {
    console.error('Failed to append to Google Sheet:', err);
  }
}

// TODO: Implement Google Sheets API call
export const pushToSheet = async (row: any): Promise<boolean> => {
  // Call Google Sheets API here
  return true;
}; 