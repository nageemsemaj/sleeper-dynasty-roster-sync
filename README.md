# Sleeper Dynasty Roster Sync

A Google Apps Script that pulls live roster data from the Sleeper Fantasy Football API 
and writes it to a structured Google Sheet -- one tab per team, organized by player type.

## What It Does
- Connects to the Sleeper API using a league ID
- Fetches all 12 team rosters and maps them to display names
- Pulls full NFL player data (name, position, NFL team)
- Creates or refreshes a Google Sheet tab for each fantasy team
- Categorizes every player as: Starter, Bench, Taxi Squad, or IR

## Built For
12-team half-PPR dynasty league on Sleeper

## Setup
1. Open Google Sheets and go to Extensions > Apps Script
2. Paste the contents of RosterSync.gs
3. Replace the leagueId variable with your Sleeper league ID
4. Run updateSleeperDynastyRosters()
5. Authorize the script when prompted

## Tech Used
- Google Apps Script (JavaScript runtime)
- Sleeper Fantasy Football API (no auth required)
- Google Sheets API (via SpreadsheetApp)

## Notes
Sleeper's player endpoint returns the full NFL player database, so the first run 
may take 10-15 seconds. Subsequent runs clear and rewrite each sheet tab.
