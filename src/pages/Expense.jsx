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

const { Title, Text } = Typography;
const { Option } = Select;

// Mock một số ảnh filter retro làm dữ liệu mẫu nếu không chụp ảnh thật
const RETRO_MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=500&q=80", // Vibe hoài niệm
  "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&q=80",
  "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=500&q=80"
];

const Expenses=() =>{
  // State quản lý tài chính
  const [salary, setSalary] = useState(() => Number(localStorage.getItem('monthly_salary')) || 0);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('expenses_list')) || []);
  
  // State quản lý UI
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(!localStorage.getItem('monthly_salary'));
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' hoặc 'camera'
  const [tempSalary, setTempSalary] = useState(salary);
  
  const [form] = Form.useForm();
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  // Đồng bộ LocalStorage khi dữ liệu thay đổi
  useEffect(() => {
    localStorage.setItem('expenses_list', JSON.stringify(expenses));
  }, [expenses]);

  // Tính toán số liệu
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = salary - totalSpent;
  const spentPercentage = salary > 0 ? Math.min(Math.round((totalSpent / salary) * 100), 100) : 0;

  // Xử lý lưu lương ban đầu
  const handleSaveSalary = () => {
    if (tempSalary > 0) {
      localStorage.setItem('monthly_salary', tempSalary.toString());
      setSalary(tempSalary);
      setIsSalaryModalOpen(false);
    }
  };

  // Kích hoạt camera (Mô phỏng chụp ảnh kiểu Locket)
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
      // Nếu không có quyền camera/thiết bị, dùng ảnh locket ngẫu nhiên có sẵn filter hoài niệm
      const randomRetroPic = RETRO_MOCK_IMAGES[Math.floor(Math.random() * RETRO_MOCK_IMAGES.length)];
      setCapturedImage(randomRetroPic);
      setCameraActive(false);
    }
  };

  // Chụp ảnh từ dòng video
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      // Tắt stream
      const stream = videoRef.current.srcObject;
      if (stream) stream.getTracks().forEach(track => track.stop());
      
      setCapturedImage(canvas.toDataURL('image/jpeg'));
      setCameraActive(false);
    }
  };

  // Đóng modal chi tiêu và dọn dẹp camera
  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
    setCapturedImage(null);
    form.resetFields();
  };

  // Submit chi tiêu mới
  const onFinishExpense = (values) => {
    const newExpense = {
      id: Date.now(),
      amount: values.amount,
      category: values.category,
      note: values.note || '',
      feeling: values.feeling || '',
      rating: values.rating || 3,
      image: capturedImage || null,
      date: dayjs().format('YYYY-MM-DD HH:mm')
    };

    setExpenses([newExpense, ...expenses]);
    handleCloseExpenseModal();
  };

  // Đánh giá cuối tháng & Cảnh báo (Dựa trên ngày hiện tại và phần trăm chi tiêu)
  const renderEndMonthReport = () => {
    const isEndMonth = dayjs().date() >= 25; // Tính từ ngày 25 trở đi là cuối tháng
    
    let alertType = "success";
    let messageTitle = "Tình hình chi tiêu rất ổn định!";
    let description = "Bạn đang kiểm soát dòng tiền rất tốt. Phát huy nhé!";

    if (spentPercentage >= 90) {
      alertType = "error";
      messageTitle = "CẢNH BÁO: Ngân sách đã chạm đáy!";
      description = `Bạn đã tiêu hết ${spentPercentage}% lương. Hãy thắt lưng buộc bụng ngay lập tức!`;
    } else if (spentPercentage >= 70) {
      alertType = "warning";
      messageTitle = "Chú ý: Chi tiêu đang tăng cao";
      description = `Bạn đã tiêu ${spentPercentage}% quỹ lương. Cân nhắc giảm các khoản không cần thiết.`;
    }

    return (
      <Card title={
        <Space>
          <Calendar size={18} className="text-amber-600" />
          <span>Góc Đánh Giá & Cảnh Báo {isEndMonth ? "Cuối Tháng" : "Chặng Đường"}</span>
        </Space>
      } className="mb-6 shadow-sm border-amber-100">
        <Alert
          message={messageTitle}
          description={description}
          type={alertType}
          showIcon
          icon={alertType === 'error' ? <AlertTriangle /> : <CheckCircle />}
        />
        <div className="mt-4 text-center">
          <Text type="secondary">Tháng này bạn đánh giá mức độ hài lòng về chi tiêu cá nhân thế nào?</Text>
          <div className="mt-1">
            <Rate defaultValue={remainingBudget > 0 ? 4 : 2} character={<Smile size={20} />} />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="w-full mx-auto pb-30 bg-slate-50 pb-12 shadow-lg font-sans">
      
      {/* Header ví tiền */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-600 text-white p-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Wallet size={24} />
            <Title level={4} style={{ color: 'white', margin: 0 }}>Nhật ký Chi tiêu</Title>
          </Space>
          <Button type="text" className="text-white hover:bg-emerald-500" onClick={() => setIsSalaryModalOpen(true)}>
            Sửa Lương
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Text className="text-teal-100 text-xs block uppercase tracking-wider">Thu nhập tháng này</Text>
            <span className="text-xl font-bold">{salary.toLocaleString('vi-VN')} đ</span>
          </div>
          <div>
            <Text className="text-teal-100 text-xs block uppercase tracking-wider">Đã tiêu trong tháng</Text>
            <span className="text-xl font-bold text-amber-200">{totalSpent.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-teal-100 mb-1">
            <span>Hạn mức đã dùng</span>
            <span>{spentPercentage}%</span>
          </div>
          <Progress percent={spentPercentage} showInfo={false} strokeColor="#fcd34d" trailColor="rgba(255,255,255,0.2)" />
        </div>
      </div>

      <div className="p-4">
        {/* Khu vực Đánh giá & Cảnh báo */}
        {renderEndMonthReport()}

        {/* Khối chức năng Thêm nhanh / Chụp ảnh */}
        <div className="flex gap-3 mb-6">
          <Button 
            type="primary" 
            icon={<Plus size={18} />} 
            className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium"
            onClick={() => { setModalType('add'); setIsExpenseModalOpen(true); }}
          >
            Thêm chi tiêu
          </Button>
          <Button 
            icon={<Camera size={18} />} 
            className="flex-1 h-12 border-emerald-600 text-emerald-700 hover:text-emerald-500 rounded-xl font-medium flex items-center justify-center gap-1"
            onClick={startCamera}
          >
            Chụp Locket
          </Button>
        </div>

        {/* Danh sách các khoản chi tiêu phong cách nhật ký ảnh */}
        <Title level={5} className="mb-3 text-slate-700">Dòng thời gian chi tiêu</Title>
        <List
          itemLayout="vertical"
          dataSource={expenses}
          locale={{ emptyText: 'Chưa có khoản chi tiêu nào. Hãy chụp ảnh hoặc thêm mới!' }}
          renderItem={(item) => (
            <Card className="mb-4 rounded-2xl shadow-sm border-slate-100 overflow-hidden bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold mr-2">
                    {item.category}
                  </span>
                  <Text type="secondary" className="text-xs">{item.date}</Text>
                </div>
                <Text className="text-base font-bold text-rose-600">-{item.amount.toLocaleString('vi-VN')} đ</Text>
              </div>

              {/* Nếu có ảnh thì hiển thị dạng Khung Locket Retro Polaroid */}
              {item.image && (
                <div className="my-3 bg-stone-100 p-2.5 rounded-lg border border-stone-200 shadow-inner">
                  <div className="relative aspect-square overflow-hidden rounded bg-black flex items-center justify-center">
                    <img 
                      src={item.image} 
                      alt="Locket expense" 
                      className="w-full h-full object-cover filter sepia-[15%] contrast-[105%]" 
                    />
                  </div>
                  {item.note && (
                    <div className="mt-2 text-center font-serif text-sm italic text-stone-700 tracking-wide">
                      “ {item.note} ”
                    </div>
                  )}
                </div>
              )}

              {!item.image && item.note && (
                <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg my-2 border-l-4 border-emerald-500">
                  {item.note}
                </p>
              )}

              <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Smile size={14} className="text-amber-500" />
                  Cảm nhận: <span className="font-medium text-slate-700">{item.feeling || 'Bình thường'}</span>
                </span>
                <Rate disabled defaultValue={item.rating} className="text-xs" style={{ fontSize: 12 }} />
              </div>
            </Card>
          )}
        />
      </div>

      {/* MODAL 1: Yêu cầu nhập lương khi vừa vào (hoặc sửa lương) */}
      <Modal
        title={
          <Space>
            <Landmark className="text-emerald-600" />
            <span>Thiết lập Ngân sách Tháng</span>
          </Space>
        }
        open={isSalaryModalOpen}
        onOk={handleSaveSalary}
        closable={salary > 0}
        maskClosable={salary > 0}
        cancelButtonProps={{ style: { display: salary > 0 ? 'inline-block' : 'none' } }}
        onCancel={() => setIsSalaryModalOpen(false)}
        okText="Lưu ngân sách"
      >
        <div className="py-4">
          <p className="text-slate-500 mb-2">Vui lòng nhập số tiền lương hoặc số dư hiện tại của bạn để hệ thống tính toán hạn mức chi tiêu:</p>
          <InputNumber
            className="w-full"
            size="large"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            value={tempSalary}
            onChange={(val) => setTempSalary(val || 0)}
            placeholder="Ví dụ: 15,000,000"
            addonAfter="VNĐ"
          />
        </div>
      </Modal>

      {/* MODAL 2: Thêm chi tiêu / Chụp ảnh Locket */}
      <Modal
        title={modalType === 'camera' ? 'Chụp khoảnh khắc chi tiêu (Locket)' : 'Thêm khoản chi tiêu mới'}
        open={isExpenseModalOpen}
        onCancel={handleCloseExpenseModal}
        footer={null}
        destroyOnClose
      >
        {/* Phần Camera (Mô phỏng hoặc Real stream nếu có thiết bị) */}
        {modalType === 'camera' && (
          <div className="flex flex-col items-center my-4 bg-slate-950 p-4 rounded-2xl">
            {cameraActive ? (
              <div className="relative w-64 h-64 bg-stone-900 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]"></video>
                <Button 
                  type="primary" 
                  shape="circle" 
                  icon={<Camera size={20} />} 
                  size="large"
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-rose-500 border-none scale-110"
                  onClick={capturePhoto}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {capturedImage ? (
                  <div className="w-64 p-3 bg-white border border-stone-200 shadow-xl rounded-sm text-center">
                    <img src={capturedImage} alt="Captured" className="w-full aspect-square object-cover rounded mb-2 filter sepia-[10%]" />
                    <span className="font-serif italic text-xs text-stone-400">Retro Cam Filter v1.0</span>
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-stone-800 flex items-center justify-center text-white rounded-full">
                    <ImageIcon size={40} />
                  </div>
                )}
                <Button type="dashed" ghost className="mt-4 border-white text-white hover:text-emerald-400" onClick={startCamera}>
                  Chụp lại ảnh khác
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Form điền thông tin chung */}
        <Form form={form} layout="vertical" onFinish={onFinishExpense} className="mt-4" initialValues={{ category: 'Ăn uống', rating: 3 }}>
          <Form.Item name="amount" label="Số tiền chi tiêu" rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}>
            <InputNumber
              className="w-full"
              size="large"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              addonAfter="đ"
            />
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
              <Button onClick={handleCloseExpenseModal}>Hủy bỏ</Button>
              <Button type="primary" htmlType="submit" className="bg-emerald-600 hover:bg-emerald-500">
                Ghi sổ ngay
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
}

export default Expenses;