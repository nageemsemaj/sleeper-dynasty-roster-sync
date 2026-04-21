function updateSleeperDynastyRosters() {
  // -------------------------------------------------------
  // CONFIGURATION: Replace this with your Sleeper league ID
  // Find it in your Sleeper league URL or league settings
  // Example: https://sleeper.com/leagues/YOUR_LEAGUE_ID_HERE
  // -------------------------------------------------------
  const leagueId = 'YOUR_LEAGUE_ID_HERE';

  // Fetch rosters & users from Sleeper API
  const rostersUrl = `https://api.sleeper.app/v1/league/${leagueId}/rosters`;
  const usersUrl = `https://api.sleeper.app/v1/league/${leagueId}/users`;
  
  const rosters = JSON.parse(UrlFetchApp.fetch(rostersUrl).getContentText());
  const users = JSON.parse(UrlFetchApp.fetch(usersUrl).getContentText());
  
  // Map owner_id -> display_name
  const userMap = {};
  users.forEach(user => {
    userMap[user.user_id] = user.display_name || user.metadata.team_name || `Team ${user.user_id}`;
  });
  
  // Get all player data once
  const playersUrl = `https://api.sleeper.app/v1/players/nfl`;
  const players = JSON.parse(UrlFetchApp.fetch(playersUrl).getContentText());
  
  // Loop through each roster
  rosters.forEach(roster => {
    const teamName = userMap[roster.owner_id] || `Unknown Team ${roster.owner_id}`;
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(teamName);
    
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(teamName);
    } else {
      sheet.clear();
    }
    
    // Header row
    sheet.appendRow(["Type", "Player", "Position", "Team"]);
    
    // --- Add Starters ---
    (roster.starters || []).forEach(pid => {
      const player = players[pid];
      if (player) {
        sheet.appendRow([
          "Starter",
          player.full_name || `${player.first_name} ${player.last_name}`,
          player.position,
          player.team
        ]);
      }
    });
    
    // --- Add Bench ---
    const startersSet = new Set(roster.starters || []);
    const bench = (roster.players || []).filter(pid => !startersSet.has(pid) &&
                                                       !(roster.taxi || []).includes(pid) &&
                                                       !(roster.reserve || []).includes(pid));
    bench.forEach(pid => {
      const player = players[pid];
      if (player) {
        sheet.appendRow([
          "Bench",
          player.full_name || `${player.first_name} ${player.last_name}`,
          player.position,
          player.team
        ]);
      }
    });
    
    // --- Add Taxi Squad ---
    (roster.taxi || []).forEach(pid => {
      const player = players[pid];
      if (player) {
        sheet.appendRow([
          "Taxi",
          player.full_name || `${player.first_name} ${player.last_name}`,
          player.position,
          player.team
        ]);
      }
    });
    
    // --- Add IR ---
    (roster.reserve || []).forEach(pid => {
      const player = players[pid];
      if (player) {
        sheet.appendRow([
          "IR",
          player.full_name || `${player.first_name} ${player.last_name}`,
          player.position,
          player.team
        ]);
      }
    });
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 4);
  });
}
