import { useState, useEffect, useRef } from 'react';
import { 
  Card, Button, Modal, Form, InputNumber, Input, 
  Select, Rate, List, Progress, Alert, Typography, Space,
  ConfigProvider,
} from 'antd';
import { 
  Wallet, Plus, Camera, Landmark, Smile, 
  Calendar, AlertTriangle, CheckCircle, Image as ImageIcon 
} from 'lucide-react';
import dayjs from 'dayjs';


const { Title, Text } = Typography;
const { Option } = Select;

// Mock một số ảnh filter retro làm dữ liệu mẫu nếu không chụp ảnh thật
const RETRO_MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=500&q=80", 
  "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&q=80",
  "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=500&q=80"
];

const Expenses = () => {
  // 2 state quan trong cua 1 trang quan ly chi tieu la tien hien co va so tien da tieu
  const [salary, setSalary] = useState(() => {
    const localSalary = localStorage.getItem('month_salary');
    return localSalary ? Number(localSalary) : 0;
  });
  const [expenses, setExpenses] = useState(() => {
    const localExpenses = localStorage.getItem('expenses_list');
    return localExpenses ? JSON.parse(localExpenses) : [];
  });

  // cac bien UI
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(!localStorage.getItem('month_salary'));
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' hoặc 'camera'
  const [tempSalary, setTempSalary] = useState(salary);

  const [form] = Form.useForm();
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  // Dong bo luong va chi tieu vao localStorage
  useEffect(() => {
    localStorage.setItem('expenses_list', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('month_salary', salary.toString());
  }, [salary]);

  // cac bien dung tinh toan
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = salary - totalExpense;
  const expensesPercent = salary > 0 ? Math.min(Math.round((totalExpense / salary) * 100), 100) : 0;

  // Ham xu ly khi luu salary
  const handleSaveSalary = () => {
    if (tempSalary > 0) {
      setSalary(tempSalary);
      setIsSalaryModalOpen(false);
    }
  };

  // ham xu ly camera
  const startCamera = async () => {
    setModalType('camera');
    setIsExpenseModalOpen(true);
    setCameraActive(true);
    setCapturedImage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      const randomRetroPic = RETRO_MOCK_IMAGES[Math.floor(Math.random() * RETRO_MOCK_IMAGES.length)];
      setCameraActive(false);
      setCapturedImage(randomRetroPic);
      console.log('Loi chup hinh roi', err);
    }
  };

  // Chup anh neu goi duoc camera len
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
    
      // tat cam
      const stream = videoRef.current.srcObject;
      if (stream) stream.getTracks().forEach(track => track.stop());

      setCapturedImage(canvas.toDataURL('image/jpeg'));
      setCameraActive(false);
    }
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
    setCapturedImage(null);
    form.resetFields();
  };
  
  // submit chi tieu
  const onFinishExpense = (value) => {
    const newExpense = {
      id: crypto.randomUUID(),
      amount: value.amount,
      category: value.category,
      note: value.note || '',
      feeling: value.feeling || '',
      rating: value.rating || 3,
      image: capturedImage, // Luu lai anh da chup hoac anh mock retro
      date: dayjs().format('YYYY-MM-DD HH:mm') 
    };

    setExpenses(prev => [newExpense, ...prev]);
    handleCloseExpenseModal();
  };

  // danh gia muc do tieu tien roi canh bao
  const renderEndMonthReport = () => {
    const isEndMonth = dayjs().date() > 25;
    const today = dayjs().format('YYYY-MM-DD');
    const midMonth = dayjs().date(15).format('YYYY-MM-DD');
    
    let alerttype = "success";
    let messageTitle = "Tinh hinh chi tieu on dinh";
    let description = "Dong tien dang rat tot";

    if (today < midMonth && expensesPercent > 70) {
      alerttype = "warning";
      messageTitle = "CANH BAO: CHUA GIUA THANG";
      description = `Ban da tieu ${expensesPercent}% luong. TIET KIEM LAI!`;
    } else if (expensesPercent > 90) {
      alerttype = "error";
      messageTitle = "CANH BAO: Ngan sach cham day";
      description = `Ban da tieu ${expensesPercent}% luong. TIET KIEM CO QUA THANG!`;
    } else if (expensesPercent > 60) {
      alerttype = "warning";
      messageTitle = "Chu Y: Chi tieu dang tang cao";
      description = `Ban da tieu ${expensesPercent}% luong. TIET KIEM DI!`;
    }

    return (
      <Card title={
        <Space>
          <Calendar size={18} className='text-white ' />
          <span className='text-white'>Goc Danh Gia & Canh Bao {isEndMonth ? 'Cuoi Thang' : 'Trong Thang'}</span>
        </Space>
      } className="shadow-sm !bg-linear-to-br from-[#e8a978] via-[#694c38] to-[#99573f] "
        
      >
        <Alert
          className='h-20 '
          message={messageTitle}
          type={alerttype}
          description={description}
          showIcon
          icon={alerttype === 'error' ? <AlertTriangle /> : <CheckCircle />}
        />
        <div className='mt-4 text-center'>
          <Text type={'secondary'} className='!text-white'> Bạn đánh giá mức độ hài lòng về chi tiêu cá nhân thế nào? </Text>
          <div className="mt-2">
            <Rate defaultValue={remainingBudget > 0 ? 4 : 2} character={<Smile size={20}/>} />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <ConfigProvider theme={{ 
      token: { colorText: '#908F8E' },
     
      }}>
      <div className='w-full mb-30 font-sans mx-auto px-4 max-w-2xl md:max-w-none pt-6'>
        {/* header vi tien */}
        <div className='bg-linear-to-br from-[#7a6657] via-[#694c38] to-[#7d3e1b] p-6 rounded-3xl text-white shadow-md'>
          <div className='flex justify-between items-center mb-4'>
            <Space>
              <Wallet size={24}/>
              <Title level={4} style={{ color: 'white', margin: 0 }} >Quan ly chi tieu</Title>
            </Space>
            <Button type='text' onClick={() => setIsSalaryModalOpen(true)}>Sua luong</Button>
          </div>

          <div className='grid grid-cols-2 gap-4 mt-2'>
            <div>
              <Text className='text-white/70 text-xs block uppercase tracking-wider'>So tien</Text>
              <span className='text-xl font-bold'>{salary.toLocaleString('vi-VN')} D</span>
            </div>
            <div>
              <Text className='text-white/70 text-xs block uppercase tracking-wider'>Da tieu</Text>
              <span className='text-xl font-bold'>{totalExpense.toLocaleString('vi-VN')} D</span>
            </div>
          </div>

          <div className='mt-4'>
            <div className='flex justify-between text-sm mb-1'>
              <span>Han muc da dung</span>
              <span>{expensesPercent}%</span>
            </div>
            <Progress percent={expensesPercent} showInfo={false} strokeColor='#fcd34d' trailColor='rgba(255,255,255,0.2)' />
          </div>
        </div>

         {/* Khoi chuc nang them Nhanh/ chup hinh */}
          <div className='flex gap-3 mb-6 mt-3'>
            <Button
              type='primary'
              icon={<Plus size={18} />}
              className='flex-1 h-12 !bg-amber-700/60 hover:!bg-[#897669] rounded-2xl font-medium border-none'
              onClick={() => { setModalType('add'); setIsExpenseModalOpen(true); }}
            >
              Them chi tieu
            </Button>
            <Button
              icon={<Camera size={18}/>}
              className='flex-1 h-12 !bg-[#ffffff] hover:!bg-amber-500/80 rounded-2xl font-medium !border-stone-300 !text-stone-700'
              onClick={startCamera}
            >
              Chup hinh
            </Button>
          </div>
        <div className='py-4'>
          {/* khu vuc danh gia va Canh bao */}
          {renderEndMonthReport()}
          {/* Danh sach khoan chi tieu */}
          <Title level={5} className='mb-3 font-serif !text-white'>Lịch sử chi tiêu</Title>
          <List
            itemLayout='vertical'
            dataSource={expenses}
            locale={{ emptyText: 'Chưa có bất kỳ khoản chi tiêu nào' }}
            renderItem={(item) => (
              <Card className='!mb-4 rounded-2xl shadow-sm border-slate-200 overflow-hidden bg-white hover:shadow-md transition-shadow' bodyStyle={{ padding: '16px' }}>
                <div className='flex justify-between items-start mb-2 '>
                  <div>
                    <span className='inline-block px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold mr-2 text-slate-600'>
                      {item.category}
                    </span>
                    <Text type='secondary' className='text-xs'>{item.date}</Text>
                  </div>
                  <Text className='text-base font-bold text-rose-600'>-{item.amount.toLocaleString('vi-VN')} D</Text>
                </div>

                {/* noi dung bill */}
                <div className=' bg-amber-600/10 p-2  md:flex md:justify-start md:space-x-2 '>
                    {/* Neu co anh thi hien thi khung */}
                    {item.image && (
                      <div className='my-3 bg-stone-50 p-2 w-45 mx-auto md:mx-0 rounded-lg border border-stone-200 shadow-inner'>
                        <div className='relative w-30 h-30 aspect-square mx-auto overflow-hidden rounded bg-black flex items-center justify-center'>
                          <img
                            src={item.image}
                            alt='locket expense'
                            className='w-full h-full object-cover'
                          />
                        </div>
                        {item.note && (
                          <div className='mt-2 text-center font-serif text-sm italic tracking-wide text-stone-600'>
                            "{item.note}"
                          </div>
                        )}
                      </div>
                    )}

                    
                    {!item.image && item.note && (
                      <p className='text-sm bg-slate-50 p-2 rounded-lg my-2 border-l-4 border-emerald-400 text-slate-700'>
                        {item.note}
                      </p>
                    )}

                    <div className='flex justify-between items-center mt-2 pt-2 border-t border-dashed border-slate-200 text-xs md:flex-col md:justify-center md:mr-2'>
                      <span className='flex items-center gap-1'>
                        <Smile size={14} className='text-amber-600'/>
                        Cam nhan: <span className='font-medium text-slate-800'>{item.feeling || 'Binh Thuong'}</span>
                      </span>
                      <Rate disabled defaultValue={item.rating} className='text-xs' />
                    </div>
                </div>
                
              </Card>
            )}
          />
        </div>

        {/* Modal 1: Yeu cau nhap Luong */}
        <Modal
          title={
            <Space>
              <Landmark className='text-emerald-600' />
              <span>Thiết lập Tiền Lương</span>
            </Space>
          }
          open={isSalaryModalOpen}
          onOk={handleSaveSalary}
          closable={salary > 0}
          cancelButtonProps={{ style: { display: salary > 0 ? 'inline-block' : 'none' } }}
          onCancel={() => setIsSalaryModalOpen(false)}
          okText='Lưu lại'
        > 
          <div className=' flex flex-col py-4'>
            <p className='mb-2 text-stone-600'>Vui lòng nhập số lương hoặc số dư hiện tại của bạn để hệ thống tính toán hạn mức:</p>
            <InputNumber
              className='w-full flex-1'
              size='medium'
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              value={tempSalary}
              onChange={(val) => setTempSalary(val || 0)}
              placeholder='Vi du 15,000,000'
              addonAfter='VND'
            />
          </div>
        </Modal>

        {/* Modal 2: Them chi tieu va chup anh */}
        <Modal 
          title={modalType === 'camera' ? 'Chụp khoảnh khắc chi tiêu' : 'Thêm chi tiêu mới'}
          open={isExpenseModalOpen}
          onCancel={handleCloseExpenseModal}
          footer={null}
          destroyOnClose
        > 
          {modalType === 'camera' && (
            <div className='flex flex-col items-center my-4 bg-stone-50 p-4 rounded-2xl border border-stone-200'>
              {cameraActive ? (
                <div className='relative w-64 h-64 bg-stone-400 rounded-full overflow-hidden border-4 border-white shadow-lg'>
                  <video ref={videoRef} autoPlay playsInline className='w-full h-full object-cover scale-x-[-1]'></video>
                  <Button
                    type='primary'
                    shape='circle'
                    icon={<Camera size={20}/>}
                    size='large'
                    className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-rose-500 border-none scale-110'
                    onClick={capturePhoto}
                  />
                </div>
              ) : (
                <div className='flex flex-col items-center'>
                  {capturedImage ? (
                    <div className='w-64 p-3 bg-white border border-stone-200 shadow-xl rounded-sm text-center'>
                      <img src={capturedImage} alt='Captured' className='w-full aspect-square object-cover rounded mb-2'/>
                      <span className='font-serif italic text-xs text-stone-500'>Retro Cam filter</span>
                    </div>
                  ) : (
                    <div className='w-24 h-24 bg-amber-100 flex items-center justify-center rounded-full text-amber-600'>
                      <ImageIcon size={40} />
                    </div>
                  )}
                  <Button type='dashed' className='mt-4 border-stone-400 hover:!text-[#ed5700] !bg-[#e4e1e0]' onClick={startCamera}>
                    Chụp lại ảnh khác
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Form dien thong tin chung */}
          <Form form={form} layout="vertical" onFinish={onFinishExpense} className="mt-4" initialValues={{ category: 'Ăn uống', rating: 3 }}>
            <Form.Item name="amount" label="Số tiền chi tiêu" rules={[{ required: true , message: 'Vui lòng nhập số tiền!' }, {type:'number',min:1000, message:'So tien khong hop le'}]}>
              <div className='w-full flex '>
                 <InputNumber
                  className="!w-full flex-1 "
                  size="large"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  addonAfter="đ"
                />
              </div>
            </Form.Item>
  
            <Form.Item name="category" label="Danh mục chi">
              <Select size="large">
                <Option value="Ăn uống">🍳 Ăn uống</Option>
                <Option value="Di chuyển">🚗 Di chuyển</Option>
                <Option value="Mua sắm">🛍️ Mua sắm</Option>
                <Option value="Giải trí">🎬 Giải trí</Option>
                <Option value="Học tập">📚 Học tập / Công việc</Option>
              </Select>
            </Form.Item>
  
            <Form.Item name="note" label={modalType === 'camera' ? "Ghi chú/Chú thích cho bức ảnh" : "Ghi chú chi tiết"}>
              <Input.TextArea placeholder="Mua cái này thấy thế nào? Ghi lại đôi dòng..." rows={2} />
            </Form.Item>
  
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="feeling" label="Cảm nhận hiện tại">
                <Select placeholder="Tâm trạng khi xuống tiền">
                  <Option value="Vui vẻ">🥰 Vui vẻ / Xứng đáng</Option>
                  <Option value="Bình thường">😐 Bình thường / Cần thiết</Option>
                  <Option value="Hơi tiếc">😢 Hơi tiếc / Bị hớ</Option>
                  <Option value="Nuối tiếc">😡 Vung tay quá trán</Option>
                </Select>
              </Form.Item>
  
              <Form.Item name="rating" label="Đánh giá mức độ cần thiết">
                <Rate character={<Smile size={16} />} className="pt-2" />
              </Form.Item>
            </div>
  
            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={handleCloseExpenseModal} className='!bg-red-500/80 hover:!bg-rose-300/80 !border-none !text-white'>Hủy bỏ</Button>
                <Button type="primary" htmlType="submit" className="!bg-emerald-600 hover:!bg-emerald-500/50 !border-none">
                  Ghi sổ ngay
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Expenses;