import axios from 'axios'

/* base url for api calls */
const LOCAL_URL = "http://127.0.0.1:8000/"
const PROD_URL = "http://44.201.195.87/"

const API_URL = PROD_URL + "api/v1"

class BaseballService {

    /**
     * Uses the GET franchises API endpoint to get a 
     * list of all the active franchises
     * 
     * @returns response from get franchises call
     */
    getFranchises() {
        return axios.get(API_URL + "/franchises")
    }

    /**
     * Uses GET teambatting API endpoint to get a team
     * batting data for a range of years
     * 
     * @param teamID id of team to get data for
     * @param startYear start year for data
     * @param endYear end year for data
     * @returns response from get teambatting call
     */
    getTeamBatting(teamID, startYear, endYear) {
        let url = API_URL + "/teambatting/" + teamID
        if (startYear !== undefined && endYear !== undefined) {
            url +=  "?start_year=" + startYear + "&end_year=" + endYear
        } else if (startYear !== undefined) {
            url += "?start_year=" + startYear
        } else if (endYear !== undefined) {
            url += "?end_year=" + endYear
        }
        return axios.get(url)
    }

    /**
     * Uses GET teampitching API endpoint to get a team
     * pitching data for a range of years
     * 
     * @param teamID id of team to get data for
     * @param startYear start year for data
     * @param endYear end year for data
     * @returns response from get teampitching call
     */
    getTeamPitching(teamID, startYear, endYear) {
        let url = API_URL + "/teampitching/" + teamID
        if (startYear !== undefined && endYear !== undefined) {
            url +=  "?start_year=" + startYear + "&end_year=" + endYear
        } else if (startYear !== undefined) {
            url += "?start_year=" + startYear
        } else if (endYear !== undefined) {
            url += "?end_year=" + endYear
        }
        return axios.get(url)
    }

    /**
     * Uses GET playername API endpoint to return the name of the
     * player with the given player id
     * 
     * @param playerID id of player
     * @returns name of player
     */
    getPlayerName(playerID) {
        return axios.get(API_URL + "/playername/" + playerID)
    }

    /**
     * Uses GET playerid API endpoint to return the id of the
     * player by their name
     * 
     * @param playerName name of player
     * @returns id of player
     */
    getPlayerID(playerName) {
        return axios.get(API_URL + "/playerid/" + playerName)
    }

    /**
     * Uses GET playerbatting API endpoint to get player batting
     * info for player with player id
     * 
     * @param playerID id of player
     * @returns response from playerbatting call
     */
    getPlayerBatting(playerID) {
        return axios.get(API_URL + "/playerbatting/" + playerID)
    }

    /**
     * Uses GET playerpitching API endpoint to get player pitching
     * info for player with player id
     * 
     * @param playerID id of player
     * @returns response from playerpitching call
     */
    getPlayerPitching(playerID) {
        return axios.get(API_URL + "/playerpitching/" + playerID)
    }

}

export default new BaseballService;