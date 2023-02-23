import request from '../utils/request'
import axios from 'axios'

const baseURL = 'http://localhost:3001/api/'

export const post = (url, data) => {
    return axios.post(baseURL + url, data, {
        headers: {
            // 带上jwt token进行身份认证
            Authorization: window.localStorage.getItem('token')
        }
    })
    /*     return request({
            url: baseURL + url,
            method: method || 'get',
            params
        }); */
}

export const getFile = async fileName => {
    const response = await axios({
        method: 'get',
        url: baseURL + 'download/' + fileName,
        responseType: 'blob'
    }).then(res => {
        console.log('axios下载请求发送出去了')
        const url_1 = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url_1
        link.setAttribute('download', `${fileName}`)
        document.body.appendChild(link)
        link.click()
    })
}

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    })
}
