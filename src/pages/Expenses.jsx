import  { useState, useEffect, useRef } from 'react';
import { 
  Card, Button, Modal, Form, InputNumber, Input, 
  Select, Rate, List, Progress, Alert, Typography, Space,
} from 'antd';
import { 
  Wallet, Plus, Camera, Landmark, Smile, 
  Calendar, AlertTriangle, CheckCircle, Image as ImageIcon 
} from 'lucide-react';
import dayjs from 'dayjs';
import { space } from 'postcss/lib/list';

const { Title, Text } = Typography;
const { Option } = Select;

// Mock một số ảnh filter retro làm dữ liệu mẫu nếu không chụp ảnh thật
const RETRO_MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=500&q=80", // Vibe hoài niệm
  "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&q=80",
  "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=500&q=80"
];

const Expenses =() => {
  // 2 state quan trong cua 1 trang quan ly chi tieu la tien hien co va so tien da tieu
  const [salary,setSalary]=useState(()=>{
    const localSalary = localStorage.getItem('month_salary');
    return localSalary ? Number(localSalary) : 0;
  });
  const [expenses, setExpenses] = useState(() => {
    const localExpenses = localStorage.getItem('expenses_list');
    return localExpenses ? JSON.parse(localExpenses) : [];
  });

  const[tempSalary, setTempSalary] = useState(salary);

  // DOng bo local khi co thay doi || dong thoi cung se la noi lay du lieu tu db va day thong tin ve db khi co thay doi
  useEffect(() => {
      // fecth nay kia de lay thong tin ve
      localStorage.setItem('expenses_list',JSON.stringify(expenses));
  },[expenses]);


  //cac bien dung tinh toan
  const totalExpense = expenses.reduce((sum,item) => sum+ item.amount ,0);
  const reamaingBudget = salary - totalExpense;
  const expensesPercent = salary >0 ? Math.min(Math.round(totalExpense/salary *100),100): 0 ;


  // Ham su ly khi luu salary
  const handleSaveSalary = () => {
    if(salary >0) {
      localStorage.setItem('month-salary',tempSalary.toString());
      setSalary(tempSalary);
    }
  };

  // ham xu ly camera
  const startCamera = async () =>{

  }

  // submit chi tieu
  const onfishExpense =(value) => {
    const newExpense ={
      id: crypto.randomUUID(),
      //iduser de tim bill theo tai khoanr
      amount: value.mount,
      category: value.category,
      note: value.note || '',
      feeling: value.rating || '',
      rating: value.reating || 3,
      dayjs: dayjs().format('YYYY-MM-DD HH:mm') 
    };

    setExpenses(newExpense);
  }

  // danh gia muc do tieu tien roi canh bao|| tach ra component
  const renderENdMonthReport = () =>{
    const isEndMonth = dayjs().date() >25;
    const today = dayjs().format('YYYY-MM-DD');
    const midMonth = dayjs().date(15);
    

    let alerttype = "Success";
    let messageTitle = "Tinh hinh chi tieu on dinh";
    let description = "Dong tien dang rat tot";

    if(today < midMonth && expensesPercent > 70)
    {
      alerttype:"warning";
      messageTitle: "CANH BAO: CHUA GIUA THANG";
      description:` Ban da tieu ${expensesPercent}% luong. TIET KIEM LAI! `;
    } else if(expensesPercent > 90 )
      {
        alerttype:"erro";
        messageTitle: "CANH BAO: Ngan sach cham day";
        description:` Ban da tieu ${expensesPercent}% luong. TiET KIEM CO QUA THANG! `;
      } else if (expensesPercent >60)
      {
        alerttype:"warning";
        messageTitle: "Chu Y: Chi tieu dang tang cao";
        description:` Ban da tieu ${expensesPercent}% luong. TIET KIEM DI! `;
      }

    return (
      <Card title={
        <Space>
          <Calendar size={18} className='text bg-amber-600' />
          <span>Goc Danh Gia & Canh Bao {isEndMonth ? 'Cuoi Thang':'Trong Thang'}</span>
        </Space>
      } className="mb-6 shadow-sm border-amber-600">
        <Alert messageTitle={messageTitle}
              type={alerttype}
              description={description}
              showIcon
              icon={alerttype === 'error' ? <AlertTriangle /> : <CheckCircle />}>

                <div className='mt-4 text-center'>
                  <Text type={'secondary'}> Tháng này bạn đánh giá mức độ hài lòng về chi tiêu cá nhân thế nào? </Text>
                  <div>
                    <Rate defaultValue={reamaingBudget>0 ? 4 :2} character={<Smile size={20}/>} ></Rate>
                  </div>
                </div>
              </Alert>

      </Card>
    )
  }


}