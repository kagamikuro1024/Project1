import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../hooks/themes';

type Expense = { category: string; amount: string; date: string; description: string };
type Income = { amount: string; date: string; description: string };

type AppState = {
  incomes: Income[];
  expenses: Expense[];
  totalIncome: number;
  totalExpense: number;
  theme: typeof lightTheme;
  language: string;
  hasPassword: boolean;
  password: string | null;
  dailyNotificationTime: string | null;
};

type Action =
  | { type: 'RESET_DATA' }
  | { type: 'ADD_INCOME'; payload: Income }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_INCOME'; index: number }
  | { type: 'DELETE_EXPENSE'; index: number }
  | { type: 'EDIT_INCOME'; index: number; newAmount: string }
  | { type: 'EDIT_EXPENSE'; index: number; newAmount: string }
  | { type: 'SET_DATA'; payload: AppState }
  | { type: 'SET_THEME'; theme: string }
  | { type: 'SET_LANGUAGE'; language: string }
  | { type: 'SET_PASSWORD'; password: string | null }
  | { type: 'INIT_STATE'; state: Partial<AppState> }
  | { type: 'SET_DAILY_NOTIFICATION_TIME'; time: string | null }

const initialState: AppState = {
  incomes: [],
  expenses: [],
  totalIncome: 0,
  totalExpense: 0,
  theme: lightTheme,
  language: 'vi',
  hasPassword: false,
  password: null,
  dailyNotificationTime: null,
  
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'RESET_DATA':
      return {
        ...initialState,
        theme: state.theme,
        language: state.language,
      };
    case 'ADD_INCOME':
      return {
        ...state,
        incomes: [...state.incomes, action.payload],
        totalIncome: state.totalIncome + parseFloat(action.payload.amount),
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
        totalExpense: state.totalExpense + parseFloat(action.payload.amount),
      };
    case 'DELETE_INCOME':
      const updatedIncomes = state.incomes.filter((_, index) => index !== action.index);
      return {
        ...state,
        incomes: updatedIncomes,
        totalIncome: updatedIncomes.reduce((sum, income) => sum + parseFloat(income.amount), 0),
      };
    case 'DELETE_EXPENSE':
      const updatedExpenses = state.expenses.filter((_, index) => index !== action.index);
      return {
        ...state,
        expenses: updatedExpenses,
        totalExpense: updatedExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0),
      };
    case 'EDIT_INCOME':
      const editedIncomes = state.incomes.map((income, index) =>
        index === action.index ? { ...income, amount: action.newAmount } : income
      );
      return {
        ...state,
        incomes: editedIncomes,
        totalIncome: editedIncomes.reduce((sum, income) => sum + parseFloat(income.amount), 0),
      };
    case 'EDIT_EXPENSE':
      const editedExpenses = state.expenses.map((expense, index) =>
        index === action.index ? { ...expense, amount: action.newAmount } : expense
      );
      return {
        ...state,
        expenses: editedExpenses,
        totalExpense: editedExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0),
      };
    case 'SET_DATA':
      return {
        ...action.payload,
        theme: state.theme,
        language: state.language,
      };
    case 'SET_THEME':
      const newTheme = action.theme === 'dark' ? darkTheme : 
                      action.theme === 'light' ? lightTheme :
                      window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme;
      AsyncStorage.setItem('theme', action.theme);
      return {
        ...state,
        theme: newTheme,
      };
    case 'SET_LANGUAGE':
      AsyncStorage.setItem('language', action.language);
      return {
        ...state,
        language: action.language,
      };
      case 'SET_PASSWORD':
        return {
          ...state,
          hasPassword: !!action.password,
          password: action.password,
        };
      case 'INIT_STATE':
        return {
          ...state,
          ...action.state,
          hasPassword: !!action.state.password,
        };  
      case 'SET_DAILY_NOTIFICATION_TIME':
        return {
          ...state,
          dailyNotificationTime: action.time,
        };  
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [theme, language] = await Promise.all([
          AsyncStorage.getItem('theme'),
          AsyncStorage.getItem('language'),
        ]);

        if (theme) {
          dispatch({ type: 'SET_THEME', theme });
        }
        if (language) {
          dispatch({ type: 'SET_LANGUAGE', language });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);