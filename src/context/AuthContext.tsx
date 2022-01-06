import React, {createContext, useEffect, useReducer} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import cafeApi from '../apis/cafeAPI'
import {
  LoginData,
  LoginResponse,
  RegisterData,
  Usuario,
} from '../interfaces/appInterfaces'
import {authReducer, AuthState} from './authReducer'
import {getErrorsMsg, lineBreakStatements} from '../utils/utils'

type AuthContextProps = {
  errorMessage: string | null
  token: string | null
  user: Usuario | null
  status: 'checking' | 'authenticated' | 'not-authenticated'
  signUp: (registerData: RegisterData) => void
  signIn: (loginData: LoginData) => void
  logOut: () => void
  removeError: () => void
}

const authInitialState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMessage: null,
}

export const AuthContext = createContext({} as AuthContextProps)

export const AuthProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState)

  useEffect(() => {
    checkToken()
  }, [])

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token')
    // No token, no autenticado
    if (!token) {
      return dispatch({type: 'notAuthenticated'})
    }

    // Hay token
    const {data, status} = await cafeApi.get('/auth')
    if (status !== 200) {
      return dispatch({type: 'notAuthenticated'})
    }

    await AsyncStorage.setItem('token', data.token)
    dispatch({
      type: 'signUp',
      payload: {user: data.usuario, token: data.token},
    })
  }

  const signIn = async ({correo, password}: LoginData) => {
    try {
      const {data} = await cafeApi.post<LoginResponse>('/auth/login', {
        correo,
        password,
      })
      dispatch({
        type: 'signUp',
        payload: {user: data.usuario, token: data.token},
      })

      await AsyncStorage.setItem('token', data.token)
    } catch (error: any) {
      const {
        data: {msg, errors},
      } = error.response
      const msgs = getErrorsMsg(errors)
      const formatStatements = lineBreakStatements(msgs)
      dispatch({type: 'addError', payload: msg || formatStatements})
    }
  }
  const signUp = async ({nombre, correo, password}: RegisterData) => {
    try {
      const {data} = await cafeApi.post<LoginResponse>('/usuarios', {
        nombre,
        correo,
        password,
      })
      dispatch({
        type: 'signUp',
        payload: {user: data.usuario, token: data.token},
      })
      await AsyncStorage.setItem('token', data.token)
    } catch (error: any) {
      const {
        data: {errors},
      } = error.response
      const msgs = getErrorsMsg(errors)
      const formatStatements = lineBreakStatements(msgs)
      dispatch({type: 'addError', payload: formatStatements})
    }
  }

  const logOut = async () => {
    await AsyncStorage.removeItem('token')
    dispatch({type: 'logout'})
  }
  const removeError = () => {
    dispatch({type: 'removeError'})
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        logOut,
        removeError,
      }}>
      {children}
    </AuthContext.Provider>
  )
}
