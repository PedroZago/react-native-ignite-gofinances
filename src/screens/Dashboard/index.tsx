import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ViewProps } from 'react-native';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard } from '../../components/TransactionCard';
import { transactionsKey } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { TransactionData, TypeCard } from '../../interfaces';
import { dateFormatter, moneyFormatter } from '../../utils/formatters';
import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadingContainer,
} from './styles';

interface DashboardProps extends ViewProps {}

interface HighlightData {
  expense: string;
  income: string;
  total: string;
  lastTransactionIncome: string;
  lastTransactionExpense: string;
  transactionDateRange: string;
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );
  const [isLoading, setIsLoading] = useState(true);

  const { signOut, user } = useAuth();

  const theme = useTheme();

  const getLastTransactionDate = (
    collection: TransactionData[],
    type: TypeCard
  ) => {
    const collectionFiltered = collection.filter(
      transaction => transaction.type === type
    );

    if (collectionFiltered.length === 0) return '';

    const transactionsIncome = collectionFiltered.map(transaction =>
      new Date(transaction.date).getTime()
    );

    const mostRecentTransactionsDate = new Date(
      Math.max(...transactionsIncome)
    );

    return `${mostRecentTransactionsDate.getDate()} de ${mostRecentTransactionsDate.toLocaleDateString(
      'pt-BR',
      { month: 'long' }
    )}`;
  };

  const loadTransactions = async () => {
    const userTransactionsKey = `${transactionsKey}_user:${user.id}`;

    const data = await AsyncStorage.getItem(userTransactionsKey);
    const transactions = data ? (JSON.parse(data) as TransactionData[]) : [];

    const resumeTransactions = transactions.reduce(
      (sumAmount, transaction) => {
        if (transaction.type === 'expense') {
          sumAmount['expense'] += Number(transaction.amount);
        } else if (transaction.type === 'income') {
          sumAmount['income'] += Number(transaction.amount);
        }

        return sumAmount;
      },
      { expense: 0, income: 0 }
    );

    const formattedTransactions: TransactionData[] = transactions.map(
      transaction => {
        const amount = moneyFormatter(Number(transaction.amount));
        const date = dateFormatter(new Date(transaction.date));

        return {
          ...transaction,
          amount,
          date,
        };
      }
    );

    setTransactions(formattedTransactions);

    const total = resumeTransactions.income - resumeTransactions.expense;

    const lastTransactionIncome = getLastTransactionDate(
      transactions,
      'income'
    );

    const lastTransactionExpense = getLastTransactionDate(
      transactions,
      'expense'
    );

    const transactionDateRange = lastTransactionExpense
      ? `01 à ${lastTransactionExpense}`
      : 'Não há transações de saída';

    const highlightDataUpdated: HighlightData = {
      total: moneyFormatter(total),
      expense: moneyFormatter(resumeTransactions.expense),
      income: moneyFormatter(resumeTransactions.income),
      lastTransactionExpense,
      lastTransactionIncome,
      transactionDateRange,
    };

    setHighlightData({ ...highlightDataUpdated });

    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />

                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={highlightData.income}
              lastTransaction={
                highlightData.lastTransactionIncome
                  ? `Última entrada dia ${highlightData.lastTransactionIncome}`
                  : 'Não há transações'
              }
              type="income"
            />

            <HighlightCard
              title="Saídas"
              amount={highlightData.expense}
              lastTransaction={
                highlightData.lastTransactionExpense
                  ? `Última saída dia ${highlightData.lastTransactionExpense}`
                  : 'Não há transações'
              }
              type="expense"
            />

            <HighlightCard
              title="Total"
              amount={highlightData.total}
              lastTransaction={highlightData.transactionDateRange}
              type="total"
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
};
