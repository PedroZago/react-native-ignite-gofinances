import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export const Profile = () => {
  return (
    <View>
      <Text testID="text-title">Perfil</Text>

      <TextInput
        placeholder="Nome"
        autoCorrect={false}
        testID="input-name"
        value="Pedro"
      />

      <TextInput placeholder="Sobrenome" testID="input-surname" value="Zago" />

      <Button title="Salvar" onPress={() => {}} />
    </View>
  );
};
