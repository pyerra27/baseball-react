from pybaseball import teams, playerid_lookup

### Dictionary of Franchise Abbreviations for Team Pages
abbreviations = {
    "ARI": "Arizona Diamondbacks",
    "ATL": "Atlanta Braves",
    "BAL": "Baltimore Orioles",
    "BOS": "Boston Red Sox",
    "CHC": "Chicago Cubs",
    "CHW": "Chicago White Sox",
    "CIN": "Cincinnati Reds", 
    "CLE": "Cleveland Guardians",
    "DET": "Detroit Tigers",
    "HOU": "Houston Astros",
    "KCR": "Kansas City Royals",
    "ANA": "Los Angeles Angels",
    "LAD": "Los Angeles Dodgers",
    "FLA": "Miami Marlins",
    "MIL": "Milwaukee Brewers",
    "MIN": "Minnesota Twins",
    "NYM": "New York Mets",
    "NYY": "New York Yankees",
    "OAK": "Oakland Athletics",
    "PHI": "Philadelphia Phillies",
    "PIT": "Pittsburgh Pirates",
    "SDP": "San Diego Padres",
    "SEA": "Seattle Mariners",
    "SFG": "San Francisco Giants",
    "STL": "St Louis Cardinals",
    "TBD": "Tampa Bay Rays",
    "TEX": "Texas Rangers",
    "TOR": "Toronto Blue Jays",
    "WSN": "Washington Nationals",
}

### Types for Columns in Batting Table
batting_int_cols = ['Year', 'Age', 'G', 'PA', 'AB', 'R', 'H', '2B', '3B', 'HR', 'RBI', 'SB', 'CS', 'BB', 'SO', 'OPS+', 'TB', 'GDP', 'HBP', 'SH', 'SF', 'IBB']
batting_float_cols = ['BA', 'OBP', 'SLG', 'OPS']

### Types for Columns in Pitching Table
pitching_int_cols = ['Year', 'Age', 'W', 'L', 'G', 'GS', 'GF', 'CG', 'SHO', 'SV', 'H', 'R', 'ER', 'HR', 'BB', 'IBB', 'SO', 'HBP', 'BK',
       'WP', 'BF', 'ERA+']
pitching_float_cols = ['IP', 'FIP', 'WHIP', 'H9', 'HR9', 'BB9', 'SO9', 'SO/W']

def fix_position(pos):
    """
    Replaces empty position in pitching table with 'P'
    for pitcher

    @param pos string to check

    @return position string
    """
    if pos == "":
        pos = "P"
    
    return pos

def win_loss(wins, losses):
    """
    Fixes the win percentage column for the pitching table

    @param wins number of wins (numerator)
    @param losses number of losses (denominator)

    @return win percentage rounded to three decimals
    """
    win_p = 0.0
    if wins + losses != 0:
        win_p = wins / (wins + losses)

    return round(win_p, 3)

def add_team_name(teamID, yearID):
    """
    Adds the team name for the player tables

    @param teamID team id from row
    @param year year from row

    @return team name for team id
    """
    teams_df = teams()
    return teams_df[(teams_df["teamID"] == teamID) & (teams_df["yearID"] == yearID)]["name"].values[0]

def get_team_bref_id(franchiseID, year):
    """
    Return the baseball reference team id given the the franchise id
    and the year

    @param franchiseID franchise id
    @param year year of team

    @return baseball reference team id or blank if it doesn't exist
    """
    teams_df = teams()
    filtered_teams = teams_df[(teams_df["franchID"] == franchiseID) & (teams_df["yearID"] == year)]

    if filtered_teams.size > 0:
        return filtered_teams["teamIDBR"].values[0]
    else:
        filtered_teams = teams_df[(teams_df["franchID"] == franchiseID) & (teams_df["yearID"] == year - 1)]

        if filtered_teams.size > 0:
            return filtered_teams["teamIDBR"].values[0]
        else: 
            return ""

def get_team_name(franchiseID, year):
    """
    Return the current team name given the the franchise id
    and the year

    @param franchiseID franchise id
    @param year year of team

    @return current team name or blank if it doesn't exist
    """
    teams_df = teams()
    filtered_teams = teams_df[(teams_df["franchID"] == franchiseID) & (teams_df["yearID"] == year)]

    if filtered_teams.size > 0:
        return filtered_teams["name"].values[0]
    else:
        filtered_teams = teams_df[(teams_df["franchID"] == franchiseID) & (teams_df["yearID"] == year - 1)]

        if filtered_teams.size > 0:
            return filtered_teams["name"].values[0]
        else: 
            return ""

def get_player_id(name):
    name_list = name.split(" ")
    return playerid_lookup(last = name_list[1], first = name_list[0], fuzzy = True).iloc[0]["key_bbref"]

def add_franchID(teamID, yearID):
    """
    Adds the franchise id for the player tables

    @param teamID team id from row
    @param year year from row
    @param team from teams table

    @return franchise id for team id and year
    """
    teams_df = teams()
    return teams_df[(teams_df["teamID"] == teamID) & (teams_df["yearID"] == yearID)]["franchID"].values[0]

def fix_ip(outs):
    """
    change the IPOuts columns to be IP

    @param outs number of outs recorded by pitcher
    @return number of innings pitched
    """
    ip = outs // 3
    ip += (outs % 3) / 10

    return ip
