import request from '../utils/request'
import axios from 'axios'

const baseURL = 'http://localhost:3001/api/'

export const post = (url, data) => {
    return axios.post(baseURL + url, data)
    /*     return request({
            url: baseURL + url,
            method: method || 'get',
            params
        }); */
}

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    })
}
