import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Appbar, TextInput, Button, Card, Title, Paragraph, List, Divider } from 'react-native-paper';

const MainScreen = () => {
  const [income, setIncome] = useState<string>('');
  const [expense, setExpense] = useState<string>('');
  const [expenses, setExpenses] = useState<{ category: string; amount: string }[]>([]);
  const [incomes, setIncomes] = useState<{amount: string}[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0); 
  const [totalExpense, setTotalExpense] = useState<number>(0); 
  const categories = ['Ăn uống', 'Giải trí', 'Du lịch', 'Khác'];

   // Hàm thêm thu nhập
   const handleAddIncome = () => {
    const amount = parseFloat(income);
    if (!isNaN(amount) && amount > 0) {
      setIncomes((prev) => [...prev, { amount: amount.toString() }]);
      setTotalIncome((prev) => prev + amount);
      setIncome('');
    } else {
      alert('Vui lòng nhập một giá trị hợp lệ!!!');
    }
  };
  

  // Hàm thêm chi tiêu'
  const handleAddExpense = (category: string) => {
    const amount = parseFloat(expense);
    if (!isNaN(amount) && amount > 0) {
      setExpenses((prev) => [...prev, { category, amount: amount.toString() }]);
      setTotalExpense((prev) => prev + amount);
      setExpense('');
    } else{
      alert('Vui long nhập một giá trị hợp lệ!!!')
    }
  };
  
  const currentBalance = totalIncome - totalExpense;
  return (
    <>
      {/* Thanh tiêu đề */}
      <Appbar.Header style = {styles.header}>
        <Appbar.Content
        title="MoneyHS - Quản lý chi tiêu"
        style = {styles.title}
        titleStyle = {styles.titleText} 
        />
      </Appbar.Header>
      <Card style={styles.balanceCard}>
        <Card.Title title = "Tổng số dư:"/>
        <Divider />
        <Card.Content>
          <Text style ={[styles.balanceText, currentBalance < 0 ? styles.negative : styles.positive]}>
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
          <Button 
            mode="contained" 
            onPress={handleAddIncome} 
            style={styles.button}
          >
            Thêm thu nhập
          </Button>
        </Card.Content>
      </Card>

        {/* Nhập thông tin chi tiêu */}
        <Card style={styles.card}>
          <Card.Title title="Chi tiêuêu" />
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
        <Card style={styles.card}>
          <Card.Title title="Thông tin thu nhập" />
          <Card.Content>
            {expenses.map((item, index) => (
              <View key={index}>
                <List.Item
                  title={`Danh mục: ${item.category}`}
                  description={`Số tiền: -${item.amount} VNĐ`}
                  left={(props) => <List.Icon {...props} icon="cash" />}
                />
                <Divider />
              </View>
            ))}
          </Card.Content>
        </Card>
        {/* Hiển thị chi tiêu */}
        <Card style={styles.card}>
          <Card.Title title="Thông tin chi tiêu" />
          <Card.Content>
            {expenses.map((item, index) => (
              <View key={index}>
                <List.Item
                  title={`Danh mục: ${item.category}`}
                  description={`Số tiền: -${item.amount} VNĐ`}
                  left={(props) => <List.Icon {...props} icon="cash" />}
                />
                <Divider />
              </View>
            ))}
          </Card.Content>
        </Card>        
      </ScrollView>
    </>
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
    backgroundColor: "#e3f2fd",
  },
  balanceText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
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
    color: "green",
  },
  negative: {
    color: "red",
  },
});
