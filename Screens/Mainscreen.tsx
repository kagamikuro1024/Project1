//MainScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Alert } from 'react-native';
import { Appbar, TextInput, Button, Card, List, Divider, IconButton, Modal, Portal, Provider } from 'react-native-paper';
import { format, parseISO } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../context/AppContext';


const STORAGE_KEY = 'moneyhs_data';
const MainScreen = () => {
  // Context state
  const { state, dispatch } = useAppContext();
  // Local state chỉ cho UI
  const [income, setIncome] = useState(''); // Input field thu nhập
  const [expense, setExpense] = useState(''); // Input field chi tiêu
  const [categories] = useState(['Ăn uống', 'Giải trí', 'Du lịch', 'Khác']);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  // Load data từ AsyncStorage khi component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData) {
          dispatch({ type: 'SET_DATA', payload: JSON.parse(savedData) });
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại sau.');
      }
    };
    loadData();
  }, []);
  // Lưu data vào AsyncStorage khi state thay đổi
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể lưu dữ liệu. Vui lòng thử lại sau.');
      }
    };
    saveData();
  }, [state]);
  
  // Xử lý thêm thu nhập
  const handleAddIncome = () => {
    const amount = parseFloat(income);
    if (!isNaN(amount) && amount > 0) {
      dispatch({
        type: 'ADD_INCOME',
        payload: {
          amount: amount.toString(),
          date: new Date().toISOString(),
          description: 'Chi tiêu'
        }
      });
      setIncome(''); // Clear input field
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập một số tiền hợp lệ');
    }
  };
  // Xử lý thêm chi tiêu
  const handleAddExpense = (category: string) => {
    const amount = parseFloat(expense);
    if (!isNaN(amount) && amount > 0) {
      dispatch({
        type: 'ADD_EXPENSE',
        payload: {
          category,
          amount: amount.toString(),
          date: new Date().toISOString(),
          description: 'Chi tiêu'
        }
      });
      setExpense(''); // Clear input field
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập một số tiền hợp lệ');
    }
  };
  // Xử lý xóa thu nhập
  const handleDeleteIncome = (index: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa thu nhập này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: () => dispatch({ type: 'DELETE_INCOME', index })
        }
      ]
    );
  };
  // Xử lý xóa chi tiêu
  const handleDeleteExpense = (index: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa chi tiêu này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: () => dispatch({ type: 'DELETE_EXPENSE', index })
        }
      ]
    );
  };
  // Xử lý sửa thu nhập
  const handleEditIncome = (index: number) => {
    setEditValue(state.incomes[index].amount);
    setEditIndex(index);
    setIsEditingIncome(true);
    setEditModalVisible(true);
  };
  // Xử lý sửa chi tiêu 
  const handleEditExpense = (index: number) => {
    setEditValue(state.expenses[index].amount);
    setEditIndex(index);
    setIsEditingIncome(false);
    setEditModalVisible(true);
  };
  // Xử lý lưu chỉnh sửa
  const handleSaveEdit = () => {
    const newAmount = parseFloat(editValue);
    if (!isNaN(newAmount) && newAmount > 0 && editIndex !== null) {
      if (isEditingIncome) {
        dispatch({
          type: 'EDIT_INCOME',
          index: editIndex,
          newAmount: newAmount.toString()
        });
      } else {
        dispatch({
          type: 'EDIT_EXPENSE',
          index: editIndex,
          newAmount: newAmount.toString()
        });
      }
      setEditModalVisible(false);
      setEditValue('');
      setEditIndex(null);
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập một số tiền hợp lệ');
    }
  };
  // Nhóm chi tiêu theo ngày
  const groupExpenses = () => {
    const grouped: Record<string, typeof state.expenses> = {};
    state.expenses.forEach((expense) => {
      const date = parseISO(expense.date);
      const groupKey = format(date, 'dd-MM-yyyy');
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(expense);
    });
    return grouped;
  };
  // Nhóm thu nhập theo ngày
  const groupIncomes = () => {
    const grouped: Record<string, typeof state.incomes> = {};
    state.incomes.forEach((income) => {
      const date = parseISO(income.date);
      const groupKey = format(date, 'dd-MM-yyyy');
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(income);
    });
    return grouped;
  };
  const currentBalance = state.totalIncome - state.totalExpense;
  return (
    
    <Provider>
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
          <Text style={[styles.balanceText, currentBalance < 0 ? styles.negative : styles.positive]}>
            {currentBalance.toLocaleString()} đ
          </Text>
        </Card.Content>
      </Card>
      <ScrollView style={styles.container}>
        {/* Thu nhập */}
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
        {/* Danh sách thu nhập */}
        <Card style={styles.card}>
          <Card.Title title="Thông tin thu nhập" />
          <Card.Content>
            {Object.entries(groupIncomes()).map(([date, incomes]) => (
              <View key={date} style={styles.group}>
                <Text style={styles.groupTitle}>{date}</Text>
                {incomes.map((income, index) => (
                  <View key={index} style={styles.listItem}>
                    <List.Item
                      title={`Số tiền: ${parseFloat(income.amount).toLocaleString()} VNĐ`}
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
        {/* Danh sách chi tiêu */}
        <Card style={styles.card}>
          <Card.Title title="Thông tin chi tiêu" />
          <Card.Content>
            {Object.entries(groupExpenses()).map(([date, expenses]) => (
              <View key={date} style={styles.group}>
                <Text style={styles.groupTitle}>{date}</Text>
                {expenses.map((expense, index) => (
                  <View key={index} style={styles.listItem}>
                    <List.Item
                      title={`Danh mục: ${expense.category}`}
                      description={`Số tiền: -${parseFloat(expense.amount).toLocaleString()} VNĐ`}
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
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>
            {isEditingIncome ? 'Sửa Thu Nhập' : 'Sửa Chi Tiêu'}
          </Text>
          <TextInput
            label="Số tiền mới"
            value={editValue}
            onChangeText={setEditValue}
            keyboardType="numeric"
            mode="outlined"
            style={styles.modalInput}
          />
          <Button mode="contained" onPress={handleSaveEdit} style={styles.modalButton}>
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
const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
  },
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
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalInput: {
    marginBottom: 10,
  },
  modalButton: {
    marginVertical: 5,
  },
});
export default MainScreen;