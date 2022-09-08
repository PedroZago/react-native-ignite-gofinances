import React from 'react';
import { FlatList, ViewProps } from 'react-native';

import { Button } from '../../components/Form/Button';
import { Header } from '../../components/Header';
import { CategoryData } from '../../interfaces';
import { categories } from '../../utils/categories';
import { Container, Category, Icon, Name, Separator, Footer } from './styles';

interface CategorySelectProps extends ViewProps {
  category: CategoryData;
  setCategory: (category: CategoryData) => void;
  closeSelectCategory: () => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  category,
  closeSelectCategory,
  setCategory,
  ...rest
}) => {
  const handleCategorySelect = (item: CategoryData) => {
    setCategory(item);
  };

  return (
    <Container {...rest}>
      <Header title="Cadastro" />

      <FlatList
        data={categories}
        style={{ flex: 1, width: '100%' }}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />

            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />

      <Footer>
        <Button title="Selecionar" onPress={() => closeSelectCategory()} />
      </Footer>
    </Container>
  );
};
