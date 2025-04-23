import { query } from '../lib/database.ts';
import { google } from 'googleapis';
import type { sheets_v4 } from 'googleapis';

const SPREADSHEET_ID = '1t-OEMm-oeQWwCaqHOyZ4-hcntQbi89JSChLLGpqB_dQ';
const RANGE = 'Sheet1!A1:F100';

export async function importDataFromSheets(): Promise<void> {
  try {

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      throw new Error('Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY in environment variables');
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    await auth.authorize();
    console.log('✅ Google Sheets authenticated.');

    const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('⚠️ No data found in the specified range.');
      return;
    }

    console.log(`📊 Extracted ${rows.length} rows from Google Sheets.`);

    const dataRows = rows.slice(1); // Skip header
    for (const [index, row] of dataRows.entries()) {
      const [
        timestamp,
        agent_email,
        consultant_satisfaction,
        consultant_feedback,
        call_satisfaction,
        email,
      ] = row as [string, string, string, string, string, string];

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
        if (error instanceof AggregateError) {
          console.error(`❌ Row ${index} → AggregateError:`);
          for (const subError of error.errors) {
            console.error('↪️', subError);
          }
        } else if (error instanceof Error) {
          console.error(`❌ Row ${index} insert failed: ${error.message}`);
        } else {
          console.error(`❌ Unknown error inserting row ${index}:`, error);
        }
      }
    }

    console.log('✅ Data import completed!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ importDataFromSheets failed:', error.stack);
    } else {
      console.error('❌ Unexpected error in importDataFromSheets:', error);
    }
  }
}