// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  // Tabellen für Spielerstatistiken
  db.run(`CREATE TABLE IF NOT EXISTS players_regular_totals (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    player_id TEXT, name TEXT, games INTEGER, minutes REAL, points REAL, rebounds REAL, assists REAL, steals REAL, blocks REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS players_regular_averages (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    player_id TEXT, name TEXT, points_per_game REAL, rebounds_per_game REAL, assists_per_game REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS players_regular_shooting (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    player_id TEXT, name TEXT, field_goal_percentage REAL, three_point_percentage REAL, free_throw_percentage REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS players_regular_advanced1 (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    player_id TEXT, name TEXT, usage_rate REAL, offensive_rating REAL, defensive_rating REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS players_regular_advanced2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    player_id TEXT, name TEXT, player_efficiency_rating REAL, true_shooting_percentage REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS players_regular_four_factors (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    player_id TEXT, name TEXT, effective_field_goal_percentage REAL, turnover_percentage REAL, offensive_rebound_percentage REAL, defensive_rebound_percentage REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS players_playoffs_totals (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    player_id TEXT, name TEXT, games INTEGER, minutes REAL, points REAL, rebounds REAL, assists REAL, steals REAL, blocks REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS players_playoffs_averages (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    player_id TEXT, name TEXT, points_per_game REAL, rebounds_per_game REAL, assists_per_game REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS players_playoffs_shooting (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    player_id TEXT, name TEXT, field_goal_percentage REAL, three_point_percentage REAL, free_throw_percentage REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS players_playoffs_advanced1 (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    player_id TEXT, name TEXT, usage_rate REAL, offensive_rating REAL, defensive_rating REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS players_playoffs_advanced2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    player_id TEXT, name TEXT, player_efficiency_rating REAL, true_shooting_percentage REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS players_playoffs_four_factors (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    player_id TEXT, name TEXT, effective_field_goal_percentage REAL, turnover_percentage REAL, offensive_rebound_percentage REAL, defensive_rebound_percentage REAL
  )`);

  // Tabellen für Teamstatistiken
  db.run(`CREATE TABLE IF NOT EXISTS teams_regular_totals (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    team_id TEXT, team_name TEXT, games INTEGER, points REAL, rebounds REAL, assists REAL, steals REAL, blocks REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams_regular_averages (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    team_id TEXT, team_name TEXT, points_per_game REAL, rebounds_per_game REAL, assists_per_game REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams_regular_shooting (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    team_id TEXT, team_name TEXT, field_goal_percentage REAL, three_point_percentage REAL, free_throw_percentage REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams_regular_advanced1 (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    team_id TEXT, team_name TEXT, usage_rate REAL, offensive_rating REAL, defensive_rating REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams_regular_advanced2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    team_id TEXT, team_name TEXT, team_efficiency_rating REAL, true_shooting_percentage REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams_regular_four_factors (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    team_id TEXT, team_name TEXT, effective_field_goal_percentage REAL, turnover_percentage REAL, offensive_rebound_percentage REAL, defensive_rebound_percentage REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams_playoffs_totals (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    team_id TEXT, team_name TEXT, games INTEGER, points REAL, rebounds REAL, assists REAL, steals REAL, blocks REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams_playoffs_averages (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    team_id TEXT, team_name TEXT, points_per_game REAL, rebounds_per_game REAL, assists_per_game REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams_playoffs_shooting (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    team_id TEXT, team_name TEXT, field_goal_percentage REAL, three_point_percentage REAL, free_throw_percentage REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams_playoffs_advanced1 (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    team_id TEXT, team_name TEXT, usage_rate REAL, offensive_rating REAL, defensive_rating REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams_playoffs_advanced2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    team_id TEXT, team_name TEXT, team_efficiency_rating REAL, true_shooting_percentage REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams_playoffs_four_factors (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    team_id TEXT, team_name TEXT, effective_field_goal_percentage REAL, turnover_percentage REAL, offensive_rebound_percentage REAL, defensive_rebound_percentage REAL
  )`);
});

module.exports = db;
