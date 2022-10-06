import axios from 'axios'

const API_URL = "http://127.0.0.1:8000/api/v1"

class BaseballService {

    getFranchises(year) {
        return axios.get(API_URL + "/franchises")
    }

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

    getPlayerName(playerID) {
        return axios.get(API_URL + "/playername/" + playerID)
    }

    getPlayerBatting(playerID) {
        return axios.get(API_URL + "/playerbatting/" + playerID)
    }

    getPlayerPitching(playerID) {
        return axios.get(API_URL + "/playerpitching/" + playerID)
    }

}

export default new BaseballService;