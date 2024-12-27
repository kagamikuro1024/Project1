import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Alert } from 'react-native';
import { Appbar, TextInput, Button, Card, List, Divider, IconButton, Modal, Portal, Provider } from 'react-native-paper';
import { format, parseISO } from 'date-fns';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Tab = createBottomTabNavigator();
type Income = {
  amount: string;
  date: string;
};

type Expense = {
  category: string;
  amount: string;
  date: string;
};

type AppData = {
  incomes: Income[];
  expenses: Expense[];
  totalIncome: number;
  totalExpense: number;
};
const STORAGE_KEY = 'moneyhs_data';

// Helper function to save all app data
export const saveAppData = async (data: AppData): Promise<void> => {
  try {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonData);
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
    throw new Error('Failed to save app data');
  }
};

// Helper function to load all app data
export const loadAppData = async (): Promise<AppData | null> => {
  try {
    const jsonData = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonData) {
      return JSON.parse(jsonData) as AppData;
    }
    return null;
  } catch (error) {
    console.error('Error loading data:', error);
    throw new Error('Failed to load app data');
  }
};

// Helper function to clear all app data
export const clearAppData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('Data cleared successfully');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw new Error('Failed to clear app data');
  }
};
const MainScreen = () => {
  const [income, setIncome] = useState<string>('');
  const [expense, setExpense] = useState<string>('');
  const [expenses, setExpenses] = useState<{ category: string; amount: string; date: string }[]>([]);
  const [incomes, setIncomes] = useState<{ amount: string; date: string }[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [categories] = useState(['Ăn uống', 'Giải trí', 'Du lịch', 'Khác']);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [groupBy, setGroupBy] = useState<'day' | 'month'>('month');
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await loadAppData();
        if (savedData) {
          setIncomes(savedData.incomes);
          setExpenses(savedData.expenses);
          setTotalIncome(savedData.totalIncome);
          setTotalExpense(savedData.totalExpense);
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại sau.');
      }
    };
    loadData();
  }, []);

  // Save data whenever relevant state changes
  React.useEffect(() => {
    const saveData = async () => {
      try {
        await saveAppData({
          incomes,
          expenses,
          totalIncome,
          totalExpense,
        });
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể lưu dữ liệu. Vui lòng thử lại sau.');
      }
    };
    saveData();
  }, [incomes, expenses, totalIncome, totalExpense]);
  const handleAddIncome = () => {
    const amount = parseFloat(income);
    const currentDate = new Date().toISOString();
    if (!isNaN(amount) && amount > 0) {
      setIncomes((prev) => [...prev, { amount: amount.toString(), date: currentDate }]);
      setTotalIncome((prev) => prev + amount);
      setIncome('');
    } else {
      alert('Vui lòng nhập một giá trị hợp lệ!!!');
    }
  };

  const handleAddExpense = (category: string) => {
    const amount = parseFloat(expense);
    const currentDate = new Date().toISOString();
    if (!isNaN(amount) && amount > 0) {
      setExpenses((prev) => [...prev, { category, amount: amount.toString(), date: currentDate }]);
      setTotalExpense((prev) => prev + amount);
      setExpense('');
    } else {
      alert('Vui lòng nhập một giá trị hợp lệ!!!');
    }
  };


  // Xóa thu nhập
  const handleDeleteIncome = (index: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa thu nhập này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: () => {
            const deletedAmount = parseFloat(incomes[index].amount);
            setIncomes((prev) => prev.filter((_, i) => i !== index));
            setTotalIncome((prev) => prev - deletedAmount);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Xóa chi tiêu
  const handleDeleteExpense = (index: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa chi tiêu này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: () => {
            const deletedAmount = parseFloat(expenses[index].amount);
            setExpenses((prev) => prev.filter((_, i) => i !== index));
            setTotalExpense((prev) => prev - deletedAmount);
          },
        },
      ],
      { cancelable: true }
    );
  };
  const handleEditIncome = (index: number) => {
    setEditValue(incomes[index].amount);
    setEditIndex(index);
    setIsEditingIncome(true); // Đang sửa thu nhập
    setEditModalVisible(true);
  };

  const handleEditExpense = (index: number) => {
    setEditValue(expenses[index].amount);
    setEditIndex(index);
    setIsEditingIncome(false); // Đang sửa chi tiêu
    setEditModalVisible(true);
  };
  const handleSaveEdit = () => {
    const newAmount = parseFloat(editValue);
    if (!isNaN(newAmount) && newAmount > 0 && editIndex !== null) {
      if (isEditingIncome) {
        const updatedIncomes = [...incomes];
        const oldAmount = parseFloat(updatedIncomes[editIndex].amount);
        updatedIncomes[editIndex].amount = newAmount.toString();
        setIncomes(updatedIncomes);
        setTotalIncome((prev) => prev - oldAmount + newAmount);
      } else {
        const updatedExpenses = [...expenses];
        const oldAmount = parseFloat(updatedExpenses[editIndex].amount);
        updatedExpenses[editIndex].amount = newAmount.toString();
        setExpenses(updatedExpenses);
        setTotalExpense((prev) => prev - oldAmount + newAmount);
      }
      setEditModalVisible(false);
      setEditValue('');
      setEditIndex(null);
    } else {
      alert('Vui lòng nhập một giá trị hợp lệ!');
    }
  };


  const groupExpenses = (groupBy: 'day' | 'month') => {
    const grouped: Record<string, { category: string; amount: string; date: string }[]> = {};
    expenses.forEach((expense) => {
      const date = parseISO(expense.date);
      const groupKey =
        groupBy === 'day' ? format(date, 'dd-MM-yyyy') : format(date, 'dd-MM-yyyy'); 
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(expense);
    });
    return grouped;
  };

  const groupIncomes = (groupBy: 'day' | 'month') => {
    const grouped: Record<string, { amount: string; date: string }[]> = {};
    incomes.forEach((income) => {
      const date = parseISO(income.date);
      const groupKey =
        groupBy === 'day' ? format(date, 'dd-MM-yyyy') : format(date, 'dd-MM-yyyy'); 
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(income);
    });
    return grouped;
  };

  const currentBalance = totalIncome - totalExpense;

  return (
    <Provider>
      {/* Thanh tiêu đề */}
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title="MoneyHS - Quản lý chi tiêu"
          style={styles.title}
          titleStyle={styles.titleText}
        />
      </Appbar.Header>
      <Card style={styles.balanceCard}>
        <Card.Title title="Tổng số dư:" />
        <Divider />
        <Card.Content>
          <Text
            style={[
              styles.balanceText,
              currentBalance < 0 ? styles.negative : styles.positive,
            ]}
          >
            {currentBalance} đ
          </Text>
        </Card.Content>
      </Card>

      <ScrollView style={styles.container}>
        {/* Nhập thông tin thu nhập */}
        <Card style={styles.card}>
          <Card.Title title="Thu nhập" />
          <Divider />
          <Card.Content>
            <TextInput
              label="Nhập số tiền thu nhập"
              value={income}
              onChangeText={setIncome}
              keyboardType="numeric"
              mode="outlined"
            />
            <Button mode="contained" onPress={handleAddIncome} style={styles.button}>
              Thêm thu nhập
            </Button>
          </Card.Content>
        </Card>

        {/* Hiển thị thông tin thu nhập */}
        <Card style={styles.card}>
          <Card.Title title="Thông tin thu nhập" />
          <Card.Content>
            {Object.entries(groupIncomes(groupBy)).map(([groupKey, groupedIncomes]) => (
              <View key={groupKey} style={styles.group}>
                <Text style={styles.groupTitle}>{groupKey}</Text>
                {groupedIncomes.map((income, index) => (
                  <View key={index} style={styles.listItem}>
                    <List.Item
                      title={`Số tiền: ${income.amount} VNĐ`}
                      left={(props) => <List.Icon {...props} icon="cash" />}
                    />
                    <IconButton icon="delete" iconColor="grey" onPress={() => handleDeleteIncome(index)} />
                    <IconButton icon="pencil" iconColor="grey" onPress={() => handleEditIncome(index)} />
                  </View>
                ))}
              </View>
            ))}
          </Card.Content>
        </Card>


        {/* Chi tiêu */}
        <Card style={styles.card}>
          <Card.Title title="Chi tiêu" />
          <Card.Content>
            <TextInput
              label="Nhập số tiền chi tiêu"
              value={expense}
              onChangeText={setExpense}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            {categories.map((category) => (
              <Button
                key={category}
                mode="contained"
                onPress={() => handleAddExpense(category)}
                style={styles.button}
              >
                {category}
              </Button>
            ))}
          </Card.Content>
        </Card>

        {/* Hiển thị thông tin chi tiêu */}
        <Card style={styles.card}>
          <Card.Title title="Thông tin chi tiêu" />
          <Card.Content>
            {Object.entries(groupExpenses(groupBy)).map(([groupKey, groupedExpenses]) => (
              <View key={groupKey} style={styles.group}>
                <Text style={styles.groupTitle}>{groupKey}</Text>
                {groupedExpenses.map((expense, index) => (
                  <View key={index} style={styles.listItem}>
                    <List.Item
                      title={`Danh mục: ${expense.category}`}
                      description={`Số tiền: -${expense.amount} VNĐ`}
                      left={(props) => <List.Icon {...props} icon="cash" />}
                    />
                    <IconButton icon="delete" iconColor="grey" onPress={() => handleDeleteExpense(index)} />
                    <IconButton icon="pencil" iconColor="grey" onPress={() => handleEditExpense(index)} />
                  </View>
                ))}
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
      {/* Modal chỉnh sửa */}
      <Portal>
        
        <Modal
          visible={isEditModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            {isEditingIncome ? 'Sửa Thu Nhập' : 'Sửa Chi Tiêu'}
          </Text>
          <TextInput
            label="Số tiền mới"
            value={editValue}
            onChangeText={setEditValue}
            keyboardType="numeric"
            mode="outlined"
            style={{ marginBottom: 10 }}
          />
          <Button mode="contained" onPress={handleSaveEdit} style={{ marginVertical: 5 }}>
            Lưu
          </Button>
          <Button mode="outlined" onPress={() => setEditModalVisible(false)}>
            Hủy
          </Button>
        </Modal>
      </Portal>

    </Provider>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  header: {
    justifyContent: 'center',
  },
  balanceCard: {
    marginBottom: 16,
    backgroundColor: '#e3f2fd',
  },
  balanceText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  card: {
    marginVertical: 10,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginVertical: 5,
    backgroundColor: '#4CAF50',
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  group: {
    marginVertical: 10,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
