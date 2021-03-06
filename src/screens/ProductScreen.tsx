import React, { useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { ProductsStackParams } from '../navigator/ProductsNavigator'
import { useCategories } from '../hooks/useCategories'
import { useForm } from '../hooks/useForm'
import { ProductsContext } from '../context/ProductsContext'

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> { }

const ProductScreen = ({ navigation, route }: Props) => {
  const { id = '', name = '' } = route.params
  const [tempUri, setTempUri] = useState<string>()

  const { categories, isLoading } = useCategories()
  const { loadProductById, addProduct, updateProduct, uploadImage } = useContext(ProductsContext)

  const { _id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
    _id: id,
    categoriaId: '',
    nombre: name,
    img: ''
  })


  useEffect(() => {
    navigation.setOptions({
      title: nombre ? nombre : 'Nombre del producto',
    })
  }, [nombre])

  useEffect(() => {
    loadProduct()
  }, [])

  const loadProduct = async () => {
    if (id.length === 0) return

    const producto = await loadProductById(id!)
    setFormValue({
      _id: id,
      categoriaId: producto.categoria._id,
      nombre,
      img: producto.img || '',
    })
  }

  const saveOrUpdate = async () => {
    if (id.length > 0) {
      updateProduct(categoriaId, nombre, _id)
    } else {
      const tempCategoryId = categoriaId || categories[0]._id
      const newProduct = addProduct(categoriaId, nombre)
      onChange((await newProduct)._id, '_id')
    }
  }

  const takePhoto = () => {
    launchCamera({
      mediaType: 'photo',
      quality: 0.5
    }, (resp) => {
      if (resp.didCancel) return
      if (!resp.assets![0].uri) return

      setTempUri(resp.assets![0].uri)
      uploadImage(resp, _id)
    })
  };

  const takePhotoFromGallery = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5
    }, (resp) => {
      if (resp.didCancel) return
      if (!resp.assets![0].uri) return

      setTempUri(resp.assets![0].uri)
      uploadImage(resp, _id)
    })
  };
  



  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del producto:</Text>
        <TextInput
          placeholder='Producto'
          style={styles.textInput}
          value={nombre}
          onChangeText={value => onChange(value, 'nombre')}
        />

        {/* Picker / Selector */}
        <Text style={styles.label}>Categor??a:</Text>
        <Picker
          selectedValue={categoriaId}
          onValueChange={(itemValue, itemIndex) =>
            onChange(itemValue, 'categoriaId')
          }>
          {
            categories.map(({ _id, nombre }) => <Picker.Item label={nombre} value={_id} key={_id} />)
          }
        </Picker>

        <Button
          title={(id.length > 0) ? 'Actualizar' : 'Guardar'}
          onPress={saveOrUpdate}
          color='#5856D6'
        />

        {
          (_id.length > 0 && !tempUri) && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <Button
                title='C??mara'
                onPress={takePhoto}
                color='#5856D6'
              />

              <View style={{ width: 10 }} />

              <Button
                title='Galer??a'
                onPress={takePhotoFromGallery}
                color='#5856D6'
              />
            </View>
          )
        }

        {
          (img.length > 0 && !tempUri) && (
            <Image
              source={{ uri: img }}
              style={{
                marginTop: 20,
                width: '100%',
                height: 300,
              }}
            />
          )
        }

        {/*Mostrar imagen temporal del producto */}
        {
          (tempUri) && (
            <Image
              source={{ uri: tempUri }}
              style={{
                marginTop: 20,
                width: '100%',
                height: 300,
              }}
            />
          )
        }

      </ScrollView>

    </View>
  )
}

export default ProductScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
    marginTop: 5,
    marginBottom: 15,
  }
})
