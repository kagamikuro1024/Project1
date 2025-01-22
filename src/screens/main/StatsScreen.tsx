import React from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useAppContext } from '../../context/AppContext';

const groupDataByMonth = (data: { date: string; amount: string }[]) => {
  const grouped: { [key: number]: number } = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    if (!isNaN(date.getTime())) {
      const month = date.getMonth();
      const amount = parseFloat(item.amount);
      grouped[month] = (grouped[month] || 0) + (isNaN(amount) ? 0 : amount);
    }
  });

  return grouped;
};

const groupExpensesByCategory = (expenses: { category: string; amount: string }[]) => {
  const grouped: { [key: string]: number } = {};
  const categoryMapping: { [key: string]: string } = {
    'Ăn uống': 'Ăn uống',
    'Giải trí': 'Giải trí',
    'Du lịch': 'Du lịch',
    'Khác': 'Khác'
  };

  expenses.forEach((expense) => {
    const mappedCategory = categoryMapping[expense.category] || 'Khác';
    const amount = parseFloat(expense.amount);
    if (!isNaN(amount)) {
      grouped[mappedCategory] = (grouped[mappedCategory] || 0) + amount;
    }
  });

  return grouped;
};

const pieChartColors = {
  'Ăn uống': '#FF6384',
  'Giải trí': '#36A2EB',
  'Du lịch': '#FFCE56',
  'Khác': '#4BC0C0'
};

const StatsScreen = () => {

  const { state } = useAppContext();
  const screenWidth = Dimensions.get('window').width;
  //Định nghĩa màu cho biểu đồ cột
  const incomeColor = '#4BC0C0';  // Màu xanh cho thu nhập
  const expenseColor = '#FF6384'; // Màu hồng cho chi tiêu

  // Dữ liệu cho biểu đồ cột
  const groupedExpenses = groupDataByMonth(state.expenses);
  const groupedIncomes = groupDataByMonth(state.incomes);
  const formatToMillions = (value: number) => `${(value / 1000000).toFixed(1)}M`;
  // Tạo dữ liệu xen kẽ giữa thu nhập và chi tiêu
  const barData = [];
  const barLabels = [];


  for (let i = 0; i < 12; i++) {
    const income = groupedIncomes[i] || 0;
    const expense = groupedExpenses[i] || 0;
    barData.push(income);  // Thu nhập
    barData.push(expense); // Chi tiêu
    //barLabels.push('');    // Empty label for spacing
    barLabels.push(`T${i + 1}`); // Month label
  }

  const barChartData = {
    labels: barLabels,
    datasets: [{
      data: barData,
      backgroundColor: barData.map((_, index) =>
        index % 2 === 0 ? 'rgba(76, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)'
      ),
      borderColor: barData.map((_, index) =>
        index % 2 === 0 ? 'rgba(76, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
      ),
      borderWidth: 1
    }]
  };

  // Dữ liệu cho biểu đồ tròn
  const expensesByCategory = groupExpensesByCategory(state.expenses);
  const pieChartData = Object.entries(expensesByCategory).map(([category]) => ({
    name: category,
    amount: expensesByCategory[category],
    color: pieChartColors[category as keyof typeof pieChartColors],
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thống kê chi tiêu và thu nhập</Text>

      {/* Tổng thu chi */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <View style={[styles.dot, { backgroundColor: incomeColor }]} />
          <Text>Thu nhập: {state.totalIncome.toLocaleString()} đ</Text>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.dot, { backgroundColor: expenseColor }]} />
          <Text>Chi tiêu: {state.totalExpense.toLocaleString()} đ</Text>
        </View>
      </View>

      {/* Biểu đồ cột */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Thu chi theo tháng</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <BarChart
            data={barChartData}
            width={Math.max(screenWidth * 1.5, 800)}
            height={300}
            yAxisLabel=""
            yAxisSuffix=" đ"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
              strokeWidth: 2,
              propsForLabels: {
                fontSize: 10,
                fontWeight: 500,
              },
              barPercentage: 0.75,
              useShadowColorFromDataset: false,
              propsForBackgroundLines: {
                strokeDasharray: '5,5',
                strokeWidth: 1,
                strokeOpacity: 0.2,
              },
              formatTopBarValue: (value) => 
                value >= 1000 ? (value / 1000000).toFixed(2) + 'tr' : value.toString() + ' đ',
            }}
            style={styles.barChart}
            fromZero={true}
            showValuesOnTopOfBars={true}
          />
        </ScrollView>
      </View>
      {/* Biểu đồ tròn */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Tỉ trọng chi tiêu theo danh mục</Text>
        {pieChartData.length > 0 ? (
          <PieChart
            data={pieChartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        ) : (
          <Text style={styles.noDataText}>Chưa có dữ liệu chi tiêu</Text>
        )}
      </View>
      {/* Thống kê chi tiết */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Chi tiết theo danh mục:</Text>
        {Object.entries(expensesByCategory).map(([category, amount]) => (
          <View key={category} style={styles.statRow}>
            <Text style={styles.statCategory}>{category}:</Text>
            <Text style={styles.statAmount}>{amount.toLocaleString()} đ</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    paddingTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  chartContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  barChart: {
    borderRadius: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,              // Cho Android
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  statsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statCategory: {
    fontSize: 14,
    color: '#666',
  },
  statAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderRadius: 4,
  },
});


export default StatsScreen;