### FastAPI Imports
from fastapi import FastAPI, Path, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

### Base Python Library Imports
from datetime import datetime
from json import loads

### Baseball Data
from pybaseball import (
    team_batting_bref, 
    team_pitching_bref, 
    lahman, 
    playerid_reverse_lookup,
    playerid_lookup,
    teams_franchises
)

### Utils
from utils import (
    batting_int_cols,
    batting_float_cols,
    pitching_int_cols,
    pitching_float_cols,
    get_player_id,
    get_team_bref_id,
    add_franchID,
    fix_ip
)

### Create FastAPI app
app = FastAPI()

### CORS Policy
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

### Base API URL
api_url = "/api/v1/"

@app.get(api_url + "franchises")
def franchises():
    """
    Gets the active MLB franchises

    @return active mlb franchises in json format
    """
    baseball_franchises = teams_franchises()
    baseball_franchises = baseball_franchises[baseball_franchises["active"] == "Y"]

    df_json = baseball_franchises.to_json(orient="records")
    parsed_json = loads(df_json)
    return parsed_json

@app.get(api_url + "teambatting/{team_id}")
def team_batting(team_id: str = Path(None, description = "team ids can be found using /franchises endpoint"), 
            start_year: Optional[int] = datetime.now().year,
            end_year: Optional[int] = None):
    """
    Gets a team's batting information given the team id and years to return

    @param team_id team to retreive batting data for
    @param start_year start year for data
    @param end_year end year for data

    @return HTTP 404 if there is no data, or data in json format
    """
    ### Convert the franchise id to the baseball reference team id
    bref_id = get_team_bref_id(team_id, start_year)

    ### If there is no data for the team and years given, raise a 404 Not Found
    try:
        team_batting = team_batting_bref(team = bref_id, start_season=start_year, end_season=end_year)
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No data for given year")


    ### remove columns with all empty data, remove rows with any missing data
    team_batting.replace("", float("NaN"), inplace = True)
    team_batting.dropna(axis = 1, how = "all", inplace = True)
    team_batting.dropna(axis = 0, how = "any", inplace = True)

    ### give columns the correct type compared to the statistic
    ### specified in the utils file
    for col in team_batting.columns:
        if col in batting_int_cols:
            team_batting[col] = team_batting[col].apply(int)
        elif col in batting_float_cols:
            team_batting[col] = team_batting[col].apply(float)

    ### Add the player id to the data to create link to player page
    ### team_batting["playerID"] = team_batting.apply(lambda row: get_player_id(row["Name"]), axis = 1)

    ### return json
    df_json = team_batting.to_json(orient="records")
    parsed_json = loads(df_json)
    return parsed_json 

@app.get(api_url + "teampitching/{team_id}")
def team_pitching(team_id: str = Path(None, description = "team ids can be found using /franchises endpoint"), 
            start_year: Optional[int] = datetime.now().year,
            end_year: Optional[int] = None):
    """
    Gets a team's pitching information given the team id and years to return

    @param team_id team to retreive batting data for
    @param start_year start year for data
    @param end_year end year for data

    @return HTTP 404 if there is no data, or data in json format
    """
    ### Convert the franchise id to the baseball reference team id
    bref_id = get_team_bref_id(team_id, start_year)

    ### If there is no data for the team and years given, raise a 404 Not Found
    try:
        team_pitching = team_pitching_bref(team = bref_id, start_season=start_year, end_season=end_year)
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No data for given year")

    ### remove columns with all empty data, remove rows with any missing data
    team_pitching.replace("", float("NaN"), inplace = True)
    team_pitching.dropna(axis = 1, how = "all", inplace = True)
    team_pitching.dropna(axis = 0, how = "any", inplace = True)

    ### give columns the correct type compared to the statistic
    ### specified in the utils file
    for col in team_pitching.columns:
        if col in pitching_int_cols:
            team_pitching[col] = team_pitching[col].apply(int)
        elif col in pitching_float_cols:
            team_pitching[col] = team_pitching[col].apply(float)

    ### Add the player id to the data to create link to player page
    ### team_pitching["playerID"] = team_pitching.apply(lambda row: get_player_id(row["Name"]), axis = 1)

    ### return json
    df_json = team_pitching.to_json(orient="records")
    parsed_json = loads(df_json)
    return parsed_json 

@app.get(api_url + "playername/{player_id}")
def player_name(player_id: str = Path(None, description = "player id")):
    """
    Gets the player name given their player id

    @param player_id id of player

    @return json object with player name
    """
    player_df = playerid_reverse_lookup(player_ids = [player_id], key_type = "bbref")
    full_name = player_df["name_first"][0].title() + " " + player_df["name_last"][0].title()

    return {"name": full_name}

@app.get(api_url + "playerbatting/{player_id}")
def player_batting(player_id: str = Path(None, description = "player id")):
    """
    Gets a player's batting information given their player id

    @param player_id id of player

    @return HTTP 404 if there is no data, or data in json format
    """
    ### Get all the player batting data and filter to only have this player
    all_batting = lahman.batting()
    player_batting = all_batting[all_batting["playerID"] == player_id]

    ### If there is no data, raise a 404 Not Found 
    if player_batting.size == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No data for given player")
    
    ### Rename columns to be more human readable and remove unneeded columns
    player_batting.rename(columns = {"yearID": "Year", "teamID": "Team", "lgID": "LG"}, inplace = True)
    player_batting.drop(columns = ["playerID", "stint"], inplace = True)

    ### Add franchise id to link to team page
    player_batting["franchID"] = player_batting.apply(lambda row: add_franchID(row["Team"], row["Year"]), axis = 1)

    ### Return json
    df_json = player_batting.to_json(orient="records")
    parsed_json = loads(df_json)
    return parsed_json

@app.get(api_url + "playerpitching/{player_id}")
def player_pitching(player_id: str = Path(None, description = "player id")):
    """
    Gets a player's pitching information given their player id

    @param player_id id of player

    @return HTTP 404 if there is no data, or data in json format
    """
    ### Get all the player pitching data and filter to only have this player
    all_pitching = lahman.pitching()
    player_pitching = all_pitching[all_pitching["playerID"] == player_id]

    ### If there is no data, raise a 404 Not Found 
    if player_pitching.size == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No data for given player")
    
    ### Rename columns to be more human readable and remove unneeded columns
    player_pitching.rename(columns = {"yearID": "Year", "teamID": "Team", "lgID": "LG", "IPouts": "IP"}, inplace = True)
    player_pitching.drop(columns = ["playerID", "stint"], inplace = True)

    ### Change the IP column to show actual IPs, not number of outs recorded
    player_pitching["IP"]  = player_pitching.apply(lambda row: fix_ip(row["IP"]), axis = 1)

    ### Add franchise id to link to team page
    player_pitching["franchID"] = player_pitching.apply(lambda row: add_franchID(row["Team"], row["Year"]), axis = 1)

    ### Return json
    df_json = player_pitching.to_json(orient="records")
    parsed_json = loads(df_json)
    return parsed_json
