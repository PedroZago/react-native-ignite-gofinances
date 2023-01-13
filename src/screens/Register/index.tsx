import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ViewProps,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import uuid from 'react-native-uuid';
import * as yup from 'yup';

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { Header } from '../../components/Header';
import { transactionsKey } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { CategoryData } from '../../interfaces';
import { CategorySelect } from '../CategorySelect';
import { Container, Form, Fields, TransactionTypes } from './styles';

interface RegisterProps extends ViewProps {}

interface FormData {
  [value: string]: string;
}

const schema = yup
  .object({
    name: yup.string().required('Nome é obrigatório'),
    amount: yup
      .number()
      .typeError('Informe um valor numérico')
      .positive('O valor não pode ser negativo')
      .required('O valor é obrigatório'),
  })
  .required();

export const Register: React.FC<RegisterProps> = () => {
  const [transactionType, setTransactionType] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState<CategoryData>({
    key: 'category',
    name: 'Categoria',
  } as CategoryData);

  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigation = useNavigation();

  const handleTransactionTypeSelect = (type: 'income' | 'expense') => {
    setTransactionType(type);
  };

  const handleOpenSelectCategory = async () => {
    setTimeout(() => {
      setIsCategoryModalOpen(true);
    }, 1000);
  };

  const handleCloseSelectCategory = () => {
    setIsCategoryModalOpen(false);
  };

  const handleRegister = async (form: FormData) => {
    try {
      if (!transactionType)
        return Alert.alert('Selecione o tipo da transação.');

      if (category.key === 'category')
        return Alert.alert('Selecione a categoria');

      const newTransactionData = {
        id: String(uuid.v4()),
        name: form.name,
        amount: form.amount,
        type: transactionType,
        category: category.key,
        date: new Date(),
      };

      const userTransactionsKey = `${transactionsKey}_user:${user.id}`;

      const data = (await AsyncStorage.getItem(userTransactionsKey)) ?? '';
      const previousTransactionsData = data ? JSON.parse(data) : [];

      const updatedTransactionsData = [
        ...previousTransactionsData,
        newTransactionData,
      ];

      await AsyncStorage.setItem(
        userTransactionsKey,
        JSON.stringify(updatedTransactionsData)
      );

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      } as CategoryData);

      navigation.navigate('Listagem');
    } catch (error) {
      console.error(error);
      Alert.alert('Não foi possível salvar');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header title="Cadastro" />

        <Form>
          <Fields>
            <InputForm
              placeholder="Nome"
              name="name"
              error={errors.name && (errors.name?.message as unknown as string)}
              control={control}
              autoCapitalize="sentences"
              autoCorrect={false}
            />

            <InputForm
              placeholder="Preço"
              name="amount"
              error={
                errors.amount && (errors.amount?.message as unknown as string)
              }
              control={control}
              keyboardType="numeric"
            />

            <TransactionTypes>
              <TransactionTypeButton
                type="income"
                title="Entrada"
                onPress={() => handleTransactionTypeSelect('income')}
                isActive={transactionType === 'income'}
              />

              <TransactionTypeButton
                type="expense"
                title="Saída"
                onPress={() => handleTransactionTypeSelect('expense')}
                isActive={transactionType === 'expense'}
              />
            </TransactionTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategory}
              testID="modal-category-button"
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={isCategoryModalOpen} testID="modal-category">
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategory}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
};
