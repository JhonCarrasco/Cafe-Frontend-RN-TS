import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// const URL_BASE = 'https://cafe-rn-back.herokuapp.com/api'
const URL_BASE = 'http://192.168.1.93:8080/api'

const cafeApi = axios.create({baseURL: URL_BASE})

cafeApi.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('token')
  if (token) {
    config.headers['x-token'] = token
  }

  return config
})

export default cafeApi
