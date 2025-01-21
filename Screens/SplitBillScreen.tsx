import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, List, Text, IconButton, Portal, Modal, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Person {
    id: string;
    name: string;
    expenses: number;
}
interface Bill {
    id: string;
    date: string;
    people: Person[];
    totalAmount: number;
    isCompleted?: boolean;
    description?: string;
}
const STORAGE_KEY = 'split_bill_data';
const SplitBillScreen = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [currentBill, setCurrentBill] = useState<Bill>({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        people: [],
        totalAmount: 0,
        description: ''
    });
    const [newPersonName, setNewPersonName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
    const [billDescription, setBillDescription] = useState('');
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const savedData = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setBills(parsedData);

                // Restore last incomplete bill if exists
                const lastBill = parsedData[parsedData.length - 1];
                if (lastBill && !lastBill.isCompleted) {
                    setCurrentBill(lastBill);
                    setBillDescription(lastBill.description || '');
                }
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại sau.');
        }
    };
    const saveData = async (newBills: Bill[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBills));
            setBills(newBills);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lưu dữ liệu. Vui lòng thử lại sau.');
        }
    };
    const handleAddPerson = () => {
        if (!newPersonName.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên người tham gia');
            return;
        }
        // Check for duplicate names
        if (currentBill.people.some(p => p.name.toLowerCase() === newPersonName.trim().toLowerCase())) {
            Alert.alert('Lỗi', 'Tên người này đã tồn tại trong nhóm');
            return;
        }
        const newPerson: Person = {
            id: Date.now().toString(),
            name: newPersonName.trim(),
            expenses: 0
        };
        setCurrentBill(prev => ({
            ...prev,
            people: [...prev.people, newPerson]
        }));
        setNewPersonName('');
    };
    const handleAddExpense = (person: Person) => {
        setSelectedPerson(person);
        setExpenseAmount('');
        setExpenseDescription('');
        setIsModalVisible(true);
    };
    const handleSaveExpense = () => {
        if (!selectedPerson || !expenseAmount || isNaN(parseFloat(expenseAmount))) {
            Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
            return;
        }
        const amount = parseFloat(expenseAmount);
        if (amount <= 0) {
            Alert.alert('Lỗi', 'Số tiền phải lớn hơn 0');
            return;
        }
        setCurrentBill(prev => ({
            ...prev,
            people: prev.people.map(p =>
                p.id === selectedPerson.id
                    ? { ...p, expenses: p.expenses + amount }
                    : p
            ),
            totalAmount: prev.totalAmount + amount
        }));
        setExpenseAmount('');
        setExpenseDescription('');
        setIsModalVisible(false);
        setSelectedPerson(null);
    };
    const handleSaveBill = () => {
        if (currentBill.people.length < 2) {
            Alert.alert('Lỗi', 'Cần ít nhất 2 người để chia bill');
            return;
        }
        if (!billDescription.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mô tả cho bill');
            return;
        }
        const completedBill = {
            ...currentBill,
            isCompleted: true,
            description: billDescription.trim()
        };
        const newBills = [...bills, completedBill];
        saveData(newBills);

        // Reset current bill
        setCurrentBill({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            people: [],
            totalAmount: 0,
            description: ''
        });
        setBillDescription('');

        Alert.alert('Thành công', 'Đã lưu thông tin chia tiền');
    };
    const handleResetData = () => {
        if (currentBill.people.length === 0) {
            Alert.alert('Thông báo', 'Không có dữ liệu để reset');
            return;
        }
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc muốn tạo bill mới? Dữ liệu hiện tại sẽ được lưu vào lịch sử.',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Đồng ý',
                    onPress: async () => {
                        if (currentBill.people.length > 0) {
                            const completedBill = {
                                ...currentBill,
                                isCompleted: true,
                                description: billDescription.trim() || `Bill ${new Date().toLocaleDateString()}`
                            };
                            await saveData([...bills, completedBill]);
                        }

                        setCurrentBill({
                            id: Date.now().toString(),
                            date: new Date().toISOString(),
                            people: [],
                            totalAmount: 0,
                            description: ''
                        });
                        setBillDescription('');
                    }
                }
            ]
        );
    };
    const handleRemovePerson = (personId: string) => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc muốn xóa người này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    onPress: () => {
                        const person = currentBill.people.find(p => p.id === personId);
                        if (!person) return;
                        setCurrentBill(prev => ({
                            ...prev,
                            people: prev.people.filter(p => p.id !== personId),
                            totalAmount: prev.totalAmount - person.expenses
                        }));
                    }
                }
            ]
        );
    };
    const calculateSplitAmount = (): (Person & { toPay: number })[] => {
        const totalExpenses = currentBill.totalAmount;
        const numberOfPeople = currentBill.people.length;
        if (numberOfPeople === 0) return [];

        const averageShare = totalExpenses / numberOfPeople;

        return currentBill.people.map(person => ({
            ...person,
            toPay: averageShare - person.expenses
        }));
    
    };
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    
    };
    const calculateSplitAmountForBill = (bill: Bill): (Person & { toPay: number })[] => {
        const totalExpenses = bill.totalAmount;
        const numberOfPeople = bill.people.length;
        if (numberOfPeople === 0) return [];

        const averageShare = totalExpenses / numberOfPeople;

            return bill.people.map(person => ({
                ...person,
                toPay: averageShare - person.expenses
            }));
        };
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Chia tiền nhóm</Text>
            {/* Bill Description */}
            <Card style={styles.card}>
                <Card.Content>
                    <TextInput
                        label="Mô tả bill (VD: Ăn trưa ngày 20/01)"
                        value={billDescription}
                        onChangeText={setBillDescription}
                        mode="outlined"
                        style={styles.input}
                    />
                </Card.Content>
            </Card>
            {/* Add new person */}
            <Card style={styles.card}>
                <Card.Title title="Thêm người tham gia" />
                <Card.Content>
                    <TextInput
                        label="Tên người tham gia"
                        value={newPersonName}
                        onChangeText={setNewPersonName}
                        mode="outlined"
                        style={styles.input}
                    />
                    <Button
                        mode="contained"
                        onPress={handleAddPerson}
                        style={styles.button}
                    >
                        Thêm người
                    </Button>
                </Card.Content>
            </Card>
            {/* People list and expenses */}
            <Card style={styles.card}>
                <Card.Title title="Danh sách chi tiêu" />
                <Card.Content>
                    {currentBill.people.length === 0 ? (
                        <Text style={styles.emptyText}>Chưa có người tham gia</Text>
                    ) : (
                        currentBill.people.map(person => (
                            <List.Item
                                key={person.id}
                                title={person.name}
                                description={`Đã chi: ${person.expenses.toLocaleString()} đ`}
                                right={props => (
                                    <View style={styles.actionButtons}>
                                        <IconButton
                                            icon="plus-circle"
                                            onPress={() => handleAddExpense(person)}
                                        />
                                        <IconButton
                                            icon="delete"
                                            onPress={() => handleRemovePerson(person.id)}
                                        />
                                    </View>
                                )}
                                style={styles.listItem}
                            />
                        ))
                    )}
                </Card.Content>
            </Card>
            {/* Split statistics */}
            {currentBill.people.length > 0 && (
                <Card style={styles.card}>
                    <Card.Title title="Thống kê chia tiền" />
                    <Card.Content>
                        <Text style={styles.totalAmount}>
                            Tổng chi tiêu: {currentBill.totalAmount.toLocaleString()} đ
                        </Text>
                        <Divider style={styles.divider} />
                        {calculateSplitAmount().map((person) => (
                            <List.Item
                                key={person.id}
                                title={person.name}
                                description={
                                    person.toPay > 0
                                        ? `Cần thanh toán thêm: ${person.toPay.toLocaleString()} đ`
                                        : `Cần nhận lại: ${Math.abs(person.toPay).toLocaleString()} đ`
                                }
                                style={styles.listItem}
                            />
                        ))}
                    </Card.Content>
                </Card>
            )}
            {/* Action buttons */}
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleSaveBill}
                    style={[styles.button, styles.saveButton]}
                >
                    Lưu thông tin
                </Button>
                <Button
                    mode="outlined"
                    onPress={handleResetData}
                    style={[styles.button, styles.resetButton]}
                >
                    Tạo bill mới
                </Button>
                <Button
                    mode="text"
                    onPress={() => setIsHistoryModalVisible(true)}
                    style={styles.button}
                >
                    Xem lịch sử
                </Button>
            </View>
            {/* Add expense modal */}
            <Portal>
                <Modal
                    visible={isModalVisible}
                    onDismiss={() => setIsModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Text style={styles.modalTitle}>
                        Thêm chi tiêu cho {selectedPerson?.name}
                    </Text>
                    <TextInput
                        label="Số tiền"
                        value={expenseAmount}
                        onChangeText={setExpenseAmount}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.modalInput}
                    />
                    <TextInput
                        label="Mô tả (không bắt buộc)"
                        value={expenseDescription}
                        onChangeText={setExpenseDescription}
                        mode="outlined"
                        style={styles.modalInput}
                    />
                    <View style={styles.modalButtons}>
                        <Button
                            mode="text"
                            onPress={() => setIsModalVisible(false)}
                            style={styles.modalButton}
                        >
                            Hủy
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSaveExpense}
                            style={styles.modalButton}
                        >
                            Thêm
                        </Button>
                    </View>
                </Modal>
            </Portal>
            {/* History modal */}
            <Portal>
                <Modal
                    visible={isHistoryModalVisible}
                    onDismiss={() => setIsHistoryModalVisible(false)}
                    contentContainerStyle={[styles.modalContainer, styles.historyModal]}
                >
                    <Text style={styles.modalTitle}>Lịch sử chia tiền</Text>
                    <ScrollView style={styles.historyList}>
                        {bills.filter(bill => bill.isCompleted).map((bill) => (
                            <Card key={bill.id} style={styles.historyCard}>
                                <Card.Content>
                                    <Text style={styles.historyTitle}>{bill.description || 'Không có mô tả'}</Text>
                                    <Text style={styles.historyDate}>Ngày: {formatDate(bill.date)}</Text>
                                    <Text style={styles.historyTotal}>Tổng tiền: {bill.totalAmount.toLocaleString()} đ</Text>
                                    
                                    <View style={styles.expenseSection}>
                                        <Text style={styles.sectionTitle}>Chi tiết chi tiêu:</Text>
                                        {bill.people.map(person => (
                                            <View key={person.id} style={styles.personExpense}>
                                                <Text style={styles.personName}>{person.name}</Text>
                                                <Text style={styles.expenseAmount}>
                                                    Đã chi: {person.expenses.toLocaleString()} đ
                                                </Text>
                                            </View>
                                        ))}
                                    </View>

                                    <View style={styles.settlementSection}>
                                        <Text style={styles.sectionTitle}>Cần thanh toán:</Text>
                                        {calculateSplitAmountForBill(bill).map(person => (
                                            <View key={person.id} style={styles.settlementRow}>
                                                <Text style={styles.personName}>{person.name}:</Text>
                                                <Text style={[
                                                    styles.settlementAmount,
                                                    person.toPay > 0 ? styles.textRed : styles.textGreen
                                                ]}>
                                                    {person.toPay > 0
                                                        ? `Cần trả thêm ${person.toPay.toLocaleString()} đ`
                                                        : `Nhận lại ${Math.abs(person.toPay).toLocaleString()} đ`}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>

                                    <Divider style={styles.divider} />
                                </Card.Content>
                            </Card>
                        ))}
                        {bills.filter(bill => bill.isCompleted).length === 0 && (
                            <Text style={styles.emptyText}>Chưa có lịch sử chia tiền</Text>
                        )}
                    </ScrollView>
                    <Button
                        mode="contained"
                        onPress={() => setIsHistoryModalVisible(false)}
                        style={styles.modalButton}
                    >
                        Đóng
                    </Button>
                </Modal>
            </Portal>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
    },
    title: {
        paddingTop: 16,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    input: {
        marginBottom: 8,
    },
    button: {
        marginTop: 8,
    },
    emptyText: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#666',
        padding: 16,
    },
    listItem: {
        paddingVertical: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    divider: {
        marginVertical: 8,
    },
    buttonContainer: {
        marginBottom: 32,
    },
    saveButton: {
        marginBottom: 8,
    },
    resetButton: {
        marginBottom: 8,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 8,
    },
    historyModal: {
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalInput: {
        marginBottom: 12,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    modalButton: {
        marginLeft: 8,
    },
    historyList: {
        maxHeight: '80%',
    },
    historyCard: {
        marginBottom: 8,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    historyDate: {
        color: '#666',
        marginBottom: 4,
    },
    historyTotal: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    expenseSection: {
        marginVertical: 8,
    },
    settlementSection: {
        marginVertical: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    personExpense: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    settlementRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    personName: {
        flex: 1,
        fontSize: 14,
    },
    expenseAmount: {
        fontSize: 14,
        color: '#666',
    },
    settlementAmount: {
        flex: 2,
        fontSize: 14,
        textAlign: 'right',
    },
    textRed: {
        color: '#d32f2f',
    },
    textGreen: {
        color: '#2e7d32',
    },
});

export default SplitBillScreen;