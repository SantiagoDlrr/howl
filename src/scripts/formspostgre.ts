import { query } from '../lib/database.ts'; // Add the .ts extension
import { google } from 'googleapis';
import type { sheets_v4 } from 'googleapis'; // Use `import type` for type-only imports
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Sheets API Setup
const KEY_PATH = path.join(__dirname, '/ninth-territory-456217-q1-a4e39a5e80ad.json');
const SPREADSHEET_ID = '1t-OEMm-oeQWwCaqHOyZ4-hcntQbi89JSChLLGpqB_dQ';
const RANGE = 'Sheet1!A1:F100';

async function importDataFromSheets(): Promise<void> {
  try {
    // Authenticate with Google Sheets
    const auth = new google.auth.JWT({
      keyFile: KEY_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    await auth.authorize();
    console.log('✅ Google Sheets authenticated.');

    const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });

    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in the specified range.');
      return;
    }

    console.log(`📊 Extracted ${rows.length} rows from Google Sheets.`);

    const dataRows = rows.slice(1); // Skip header row
    // Insert each row into PostgreSQL
    for (const [index, row] of dataRows.entries()) {
      const [
        timestamp,
        agent_email,
        consultant_satisfaction,
        consultant_feedback,
        call_satisfaction,
        email,
      ] = row as [string, string, string, string, string, string]; // Explicitly type the row

      try {
        await query(
          `INSERT INTO client_feedback 
           (timestamp, consultant_satisfaction, consultant_feedback, call_satisfaction, agent_id, client_id)
           VALUES (
             $1, $2, $3, $4,
             (SELECT id FROM consultant WHERE LOWER(email) = LOWER($5)),
             (SELECT id FROM client WHERE LOWER(email) = LOWER($6))
           )
           ON CONFLICT (client_id, timestamp) DO NOTHING
           RETURNING id`,
          [
            timestamp, 
            consultant_satisfaction, 
            consultant_feedback, 
            call_satisfaction,
            agent_email,
            email
          ]
        );
        console.log(`✅ Row ${index} inserted successfully.`);
      } catch (error) {
        // Safely assert the error type to 'Error'
        if (error instanceof Error) {
          console.error(`❌ Failed to insert row ${index}:`, error.message);
        } else {
          console.error(`❌ Failed to insert row ${index}: Unexpected error`, error);
        }
      }
    }

    console.log('✅ Data import completed!');
  } catch (error) {
    // Safely assert the error type to 'Error'
    if (error instanceof Error) {
      console.error('❌ Error in importDataFromSheets:', error.stack);
    } else {
      console.error('❌ Error in importDataFromSheets: Unexpected error', error);
    }
  }
}

// Run the script
(async (): Promise<void> => {
  try {
    await importDataFromSheets(); // Await the promise to handle it properly
  } catch (error) {
    // Safely assert the error type to 'Error'
    if (error instanceof Error) {
      console.error('❌ Unhandled error:', error.stack);
    } else {
      console.error('❌ Unhandled error:', error);
    }
  }
})().catch((error) => {
  // Explicitly handle any unhandled promise rejections
  if (error instanceof Error) {
    console.error('❌ Script execution failed:', error.stack);
  } else {
    console.error('❌ Script execution failed: Unexpected error', error);
  }
});