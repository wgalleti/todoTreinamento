import axios from 'axios'

const config = {
  baseURL: 'http://localhost:8000'
}

const http = axios.create(config)

export default http
