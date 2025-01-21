import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const InitialDataLoader = () => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    // Reset lại toàn bộ dữ liệu
    dispatch({ type: 'RESET_DATA' });

    // Định nghĩa dữ liệu chi tiêu tháng 2
    const februaryData = [ 
      {
        date: "2024-02-01",
        amount: "4500000",
        description: "Lương tháng 2",
        category: "Thu nhập"
      },
      {
        date: "2024-02-05",
        amount: "200000",
        category: "Du lịch",
        description: "Du lịch đầu tháng"
      },
      {
        date: "2024-02-10",
        amount: "1500000",
        category: "Ăn uống",
        description: "Chi tiêu ăn uống"
      },
      {
        date: "2024-02-15",
        amount: "1000000",
        category: "Giải trí",
        description: "Chi tiêu giải trí"
      }
    ];

    // Thêm dữ liệu chi tiêu tháng 2
    februaryData.forEach(item => {
      if (item.category === "Thu nhập") {
        dispatch({ type: 'ADD_INCOME', payload: item });
      } else {
        dispatch({ type: 'ADD_EXPENSE', payload: item });
      }
    });
    // Định nghĩa dữ liệu chi tiêu tháng 1
    const januaryData = [
      {
        date: "2024-01-01",
        amount: "4000000",
        description: "Lương tháng 1",
        category: "Thu nhập"
      },
      {
        date: "2024-01-05",
        amount: "300000",
        category: "Du lịch",
        description: "Du lịch cuối năm"
      },
      {
        date: "2024-01-10",
        amount: "1000000",
        category: "Ăn uống",
        description: "Chi tiêu ăn uống"
      },
      {
        date: "2024-01-15",
        amount: "500000",
        category: "Giải trí",
        description: "Chi tiêu giải trí"
      },
      {
        date: "2024-01-20",
        amount: "200000",
        category: "Khác",
        description: "Chi tiêu khác"
      },
    ];  
    januaryData.forEach(item => {
      if (item.category === "Thu nhập") {
        dispatch({ type: 'ADD_INCOME', payload: item });
      } else {
        dispatch({ type: 'ADD_EXPENSE', payload: item });
      }
    });
  }, [dispatch]);  
  return null;
};


export default InitialDataLoader;