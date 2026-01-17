import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const { data,spreadsheetId } = await request.json();

    const serviceAccountPath = path.join(process.cwd(), 'google/service-account.json');
    const auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    
    const sheetName = 'Sheet1';

    // Step 1: Get existing rows
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetName,
    });

    const existingRows = existing.data.values || [];

    // Step 2: Extract headers
    const headers = existingRows[0] || Object.keys(data[0]);

    // Step 3: Index of unique field (e.g., 'id' or 'mobile')
    const idIndex = headers.indexOf('id'); // change this if your unique field is different
    if (idIndex === -1) {
      throw new Error('Missing "id" column in sheet headers');
    }

    // Step 4: Extract already existing IDs
    const existingIds = new Set(
      existingRows.slice(1).map(row => row[idIndex])
    );

    // Step 5: Filter new unique rows
    const newValues = data
      .filter(item => !existingIds.has(item.id)) // deduplication check
      .map(item => headers.map(key => item[key] ?? '')); // ensure order matches headers

    if (newValues.length === 0) {
      return NextResponse.json({ message: 'No new data to append.' });
    }

    // Step 6: Append only unique rows
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: newValues,
      },
    });

    return NextResponse.json({ success: true, added: newValues.length });
  } catch (error) {
    console.error('Google Sheets Error:', error);
    return NextResponse.json({ error: 'Failed to write to sheet' }, { status: 500 });
  }
}