// routes/admin.js
import express from 'express';
import { google } from 'googleapis';
import WordStack from '../models/WordStack.js';

const router = express.Router();
const SPREADSHEET_ID = '1JATesQORWo4K6IQfk6nAH_LLhGE1nybrtNt8DBtp060';
const RANGE = 'Lexicon_Source_Birds!A2:X';

const isTruthy = (val) => {
  if (!val) return false;
  const clean = val.toString().trim().toUpperCase();
  return clean === 'Y' || clean === 'TRUE' || clean === '1';
};

// POST route triggered from your Admin control panel
router.post('/admin/sync-dictionary', async (req, res) => {
  // Hard security wall: Ensure the person syncing is logged in and has a Google token
  if (!req.user || !req.user.accessToken) {
    return res.status(401).send("Unauthorized: Admin Google Session Token Required.");
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: req.user.accessToken });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    
    console.log('📡 Fetching data via admin credentials...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(200).json({ success: true, message: "Sync complete, but sheet was empty." });
    }

    const bulkOperations = rows.map((row) => {
      const rawWord     = row[0]?.toString().trim().toUpperCase(); // Column A: word
      const letterCount = parseInt(row[1], 10);                    // Column B: letters
      const audioLoc    = row[3]?.toString().trim() || '';         // Column D: audio_locale
      
      const flagWs      = isTruthy(row[14]);                       // Column O: ws
      const flagSb      = isTruthy(row[15]);                       // Column P: sb
      const flagCq      = isTruthy(row[16]);                       // Column Q: cq
      const flagLl      = isTruthy(row[17]);                       // Column R: ll

      if (!rawWord || isNaN(letterCount)) return null;
      if (flagWs && rawWord.length !== 5) return null; // Safety filter for Word Stack

      return {
        updateOne: {
          filter: { word: rawWord },
          update: {
            $set: {
              word: rawWord,
              length: letterCount,
              audioLocale: audioLoc,
              flags: { ws: flagWs, sb: flagSb, cq: flagCq, ll: flagLl },
              categories: {
                isRaptor: isTruthy(row[4]),     // Column E
                isFlightless: isTruthy(row[5]), // Column F
                isSeaBird: isTruthy(row[6]),    // Column G
                isExtinct: isTruthy(row[13])    // Column N
              },
              pos: {
                isNoun: isTruthy(row[18]),      // Column S
                isAdj: isTruthy(row[19])        // Column T
              },
              updatedAt: new Date()
            }
          },
          upsert: true
        }
      };
    }).filter(op => op !== null);

    if (bulkOperations.length > 0) {
      const result = await WordStack.bulkWrite(bulkOperations);
      return res.status(200).json({
        success: true,
        message: `Dictionary cached to MongoDB! Total updated/inserted entries: ${result.upsertedCount + result.modifiedCount}`
      });
    }

    res.status(200).json({ success: true, message: "No rows matched validation criteria." });

  } catch (error) {
    console.error('❌ Dictionary ingestion crash:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;