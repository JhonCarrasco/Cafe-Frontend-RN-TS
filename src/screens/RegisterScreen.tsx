import {StackScreenProps} from '@react-navigation/stack'
import React, {useContext, useEffect} from 'react'
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Background from '../components/Background'
import WhiteLogo from '../components/WhiteLogo'
import {AuthContext} from '../context/AuthContext'
import {useForm} from '../hooks/useForm'
import {loginStyle} from '../theme/loginTheme'

interface Props extends StackScreenProps<any, any> {}

interface Form {
  displayName: string
  email: string
  password: string
  confirmPassword: string
}

const RegisterScreen = ({navigation}: Props) => {
  const {errorMessage, removeError, signUp} = useContext(AuthContext)
  const {
    form: {displayName, email, password, confirmPassword},
    onChange,
  } = useForm<Form>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (errorMessage === null) {
      return
    }
    Alert.alert('Incorrect Register', errorMessage, [
      {
        text: 'OK',
        onPress: removeError,
      },
    ])
  }, [errorMessage])

  const onRegister = () => {
    if (password === '' || password !== confirmPassword) {
      return Alert.alert(
        'Incorrect Register',
        'Las contraseñas deben ser identicas y no vacías',
        [
          {
            text: 'OK',
          },
        ],
      )
    }
    signUp({nombre: displayName, correo: email, password})
    Keyboard.dismiss()
  }

  return (
    <>
      <Background />

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={loginStyle.formContainer}>
          <WhiteLogo />

          <Text style={loginStyle.title}>Registro</Text>
          <Text style={loginStyle.label}>Nombre:</Text>
          <TextInput
            placeholder="Ingrese su nombre"
            placeholderTextColor="rgba(255,255,255,0.4)"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={value => onChange(value, 'displayName')}
            value={displayName}
            keyboardAppearance="dark"
            underlineColorAndroid="white"
            style={[
              loginStyle.inputField,
              Platform.OS === 'ios' && loginStyle.inputFieldIOS,
              ,
            ]}
            selectionColor="white"
          />
          <Text style={loginStyle.label}>Email:</Text>
          <TextInput
            placeholder="Ingrese su email"
            placeholderTextColor="rgba(255,255,255,0.4)"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={value => onChange(value, 'email')}
            value={email}
            keyboardType="email-address"
            keyboardAppearance="dark"
            underlineColorAndroid="white"
            style={[
              loginStyle.inputField,
              Platform.OS === 'ios' && loginStyle.inputFieldIOS,
              ,
            ]}
            selectionColor="white"
          />
          <Text style={loginStyle.label}>Contraseña:</Text>
          <TextInput
            placeholder="******"
            placeholderTextColor="rgba(255,255,255,0.4)"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={value => onChange(value, 'password')}
            value={password}
            secureTextEntry
            keyboardType="numeric"
            keyboardAppearance="dark"
            underlineColorAndroid="white"
            style={[
              loginStyle.inputField,
              Platform.OS === 'ios' && loginStyle.inputFieldIOS,
              ,
            ]}
            selectionColor="white"
          />

          <Text style={loginStyle.label}>Confirmar contraseña:</Text>
          <TextInput
            placeholder="******"
            placeholderTextColor="rgba(255,255,255,0.4)"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={value => onChange(value, 'confirmPassword')}
            value={confirmPassword}
            secureTextEntry
            keyboardType="numeric"
            keyboardAppearance="dark"
            underlineColorAndroid="white"
            style={[
              loginStyle.inputField,
              Platform.OS === 'ios' && loginStyle.inputFieldIOS,
              ,
            ]}
            selectionColor="white"
          />

          <View style={loginStyle.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onRegister}
              style={loginStyle.button}>
              <Text style={loginStyle.buttonText}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.replace('LoginScreen')}
            style={loginStyle.buttonReturn}>
            <Text style={loginStyle.buttonText}>Ir a Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})
