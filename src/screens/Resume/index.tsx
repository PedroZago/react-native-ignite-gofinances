import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { VictoryPie } from 'victory-native';

import { Header } from '../../components/Header';
import { HistoryCard } from '../../components/HistoryCard';
import { transactionsKey } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { TransactionData } from '../../interfaces';
import { categories, getCategoryData } from '../../utils/categories';
import { moneyFormatter } from '../../utils/formatters';
import {
  Container,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadingContainer,
} from './styles';

interface ResumeProps {}

interface CategoryData {
  name: string;
  totalFormatted: string;
  total: number;
  color: string;
  key: string;
  percent: string;
}

export const Resume: React.FC<ResumeProps> = () => {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );
  const [selectedData, setSelectedData] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const { user } = useAuth();

  const handleChangeData = (action: 'next' | 'prev') => {
    if (action === 'next') {
      setSelectedData(addMonths(selectedData, 1));
    } else {
      setSelectedData(subMonths(selectedData, 1));
    }
  };

  const loadTransactions = async () => {
    setIsLoading(true);
    const userTransactionsKey = `${transactionsKey}_user:${user.id}`;

    const data = await AsyncStorage.getItem(userTransactionsKey);
    const transactions = data ? (JSON.parse(data) as TransactionData[]) : [];

    const transactionsExpense = transactions.filter(
      transaction =>
        transaction.type === 'expense' &&
        new Date(transaction.date).getMonth() === selectedData.getMonth() &&
        new Date(transaction.date).getFullYear() === selectedData.getFullYear()
    );

    const expensesTotal = transactionsExpense.reduce(
      (sumAmount, transaction) => sumAmount + Number(transaction.amount),
      0
    );

    const totalByCategory = transactionsExpense.reduce(
      (sumAmount, transaction) => {
        categories.forEach(category => {
          if (category.key === transaction.category)
            sumAmount[category.key] += Number(transaction.amount);
        });

        return sumAmount;
      },
      {
        purchases: 0,
        food: 0,
        salary: 0,
        car: 0,
        leisure: 0,
        studies: 0,
      }
    );

    const totalByCategoryFormatted: CategoryData[] = Object.entries(
      totalByCategory
    )
      .filter(category => category[1] !== 0)
      .map(category => {
        const total = category[1];
        const percent = `${((category[1] / expensesTotal) * 100).toFixed(0)}%`;

        const categoryData = getCategoryData(category[0]);

        return {
          ...categoryData,
          totalFormatted: moneyFormatter(total),
          total,
          percent,
        };
      });

    setTotalByCategories(totalByCategoryFormatted);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [selectedData])
  );

  return (
    <Container>
      <Header title="Resumo por categoria" />
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <Content
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
          showsVerticalScrollIndicator={false}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeData('prev')}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedData, 'MMMM, yyyy', { locale: ptBR })}
            </Month>

            <MonthSelectButton onPress={() => handleChangeData('next')}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              x="percent"
              y="total"
              colorScale={totalByCategories.map(category => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={50}
            />
          </ChartContainer>

          {totalByCategories.map(category => (
            <HistoryCard
              key={category.key}
              title={category.name}
              amount={category.totalFormatted}
              color={category.color}
            />
          ))}
        </Content>
      )}
    </Container>
  );
};
