import { Calendar, Card, ConfigProvider, Form, InputNumber, DatePicker, Button, Modal, message } from 'antd';
import { ArrowLeft, ArrowRight, Settings, Heart } from "lucide-react";
import dayjs from "dayjs";
import { useState, useMemo, useCallback } from "react";
import "dayjs/locale/vi";
dayjs.locale('vi');

// Cấu hình mã màu bằng chính các Class Utilities của Tailwind CSS
const STATUS_MAP = {
    period: { 
        label: 'Ngày hành kinh 🩸', 
        dotColor: '#ef4444', 
        tailwindBg: 'bg-red-500/20', 
        tailwindBorder: 'border-red-500/30', 
        tailwindText: 'text-red-400', 
        advice: "Hãy chuẩn bị băng vệ sinh, giữ ấm bụng và hạn chế nước đá nhé!" 
    },
    ovulation: { 
        label: 'Ngày rụng trứng 🥚', 
        dotColor: '#a855f7', 
        tailwindBg: 'bg-purple-500/20', 
        tailwindBorder: 'border-purple-500/30', 
        tailwindText: 'text-purple-400', 
        advice: "Trứng rụng hôm nay. Khả năng thụ thai ở mức đạt đỉnh cực đại!" 
    },
    fertile: { 
        label: 'Cửa sổ thụ thai (Dễ dính bầu) 💗', 
        dotColor: '#ec4899', 
        tailwindBg: 'bg-pink-500/20', 
        tailwindBorder: 'border-pink-500/30', 
        tailwindText: 'text-pink-400', 
        advice: "Nằm trong khoảng thời gian dễ thụ thai. Hãy chú ý biện pháp bảo vệ nếu chưa muốn có em bé." 
    },
    safe: { 
        label: 'Ngày an toàn ✅', 
        dotColor: '#10b981', 
        tailwindBg: 'bg-emerald-500/15', 
        tailwindBorder: 'border-emerald-500/20', 
        tailwindText: 'text-emerald-400', 
        advice: "Thời gian an toàn tương đối của chu kỳ. Cơ thể thoải mái và ổn định." 
    }
};

const Cycle = () => {

    const [cycleConfig, setCycleConfig] = useState(() => {
        const saved = localStorage.getItem('cycle_config');
        return saved ? JSON.parse(saved) : null; 
    });

    const [isModalOpen, setIsModalOpen] = useState(!cycleConfig);
    const [selectDateStr, setSelectDateStr] = useState(() => dayjs().format("YYYY-MM-DD"));
    const [initForm] = Form.useForm();

    const hasConfig = !!cycleConfig;


    const checkDayStatus = useCallback((targetDateStr) => {
        if (!cycleConfig) return null;

        const start = dayjs(cycleConfig.startDate).startOf('day');
        const length = Number(cycleConfig.cycleLength) || 28;
        const periodDays = Number(cycleConfig.periodLength) || 5;
        const ovulationIndex = length - 14; 

        const target = dayjs(targetDateStr).startOf('day');
        const diffDays = target.diff(start, 'day');
        
        const cycleIndex = ((diffDays % length) + length) % length;

        if (cycleIndex >= 0 && cycleIndex < periodDays) return STATUS_MAP.period;
        if (cycleIndex === ovulationIndex) return STATUS_MAP.ovulation;
        if (cycleIndex >= ovulationIndex - 5 && cycleIndex <= ovulationIndex + 1) return STATUS_MAP.fertile;
        return STATUS_MAP.safe;
    }, [cycleConfig]);

    const selectedDayStatus = useMemo(() => checkDayStatus(selectDateStr), [selectDateStr, checkDayStatus]);

    const handleSaveConfig = (values) => {
        const configData = {
            startDate: values.startDate.format('YYYY-MM-DD'),
            cycleLength: values.cycleLength,
            periodLength: values.periodLength || 5
        };
        localStorage.setItem('cycle_config', JSON.stringify(configData));
        setCycleConfig(configData);
        setIsModalOpen(false);
        message.success("Đã cập nhật cấu hình chu kỳ kinh nguyệt!");
    };

    const dateCellRender = useCallback((current) => {
        const dateStr = current.format('YYYY-MM-DD');
        const status = checkDayStatus(dateStr);

        if (!status) return null;

        return (
            <div 
                className={`absolute inset-0 w-full h-full flex flex-col justify-between p-2 border transition-all hover:brightness-110 ${status.tailwindBg} ${status.tailwindBorder}`}
                title={status.label}
            >
                <div className="flex justify-between items-center w-full">
                    <span className="text-xs md:text-sm font-semibold text-zinc-200">
                        {current.date()}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.dotColor }} />
                </div>
                
                <span className={`hidden md:block text-[10px] font-bold text-right truncate opacity-90 ${status.tailwindText}`}>
                    {status.label.split(' ')[1]}
                </span>
            </div>
        );
    }, [checkDayStatus]);

    const cellRender = useCallback((current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        return info.originNode;
    }, [dateCellRender]);

    const handleSelectDate = useCallback((value) => {
        setSelectDateStr(value.format("YYYY-MM-DD"));
    }, []);

    const headerRender = useCallback(({ value, onChange }) => {
        const currentYear = value.year();
        const currentMonth = value.month();
        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

        return (
            <div className='flex items-center justify-between mb-3 px-2 text-[#c5a880]'>
                <h2 className="text-lg font-bold">{months[currentMonth]} {currentYear}</h2>
                <div className="flex items-center space-x-1">
                    <button className='hover:bg-amber-800/30 rounded-full p-2 transition-colors' onClick={() => onChange(value.subtract(1, 'month'))}>
                        <ArrowLeft size={18} />
                    </button>
                    <button className='hover:bg-amber-800/30 rounded-full p-2 transition-colors' onClick={() => onChange(value.add(1, 'month'))}>
                        <ArrowRight size={18} />
                    </button>
                    <button className='hover:bg-amber-800/30 rounded-full p-2 transition-colors text-zinc-400 hover:text-white' onClick={() => setIsModalOpen(true)}>
                        <Settings size={18} />
                    </button>
                </div>
            </div>
        );
    }, []);

   return (
    /* ĐƯA CONFIGPROVIDER LÊN ĐẦU TIÊN ĐỂ QUẢN LÝ THEME CHO TOÀN BỘ COMPONENT (BAO GỒM CẢ MODAL VÀ LỊCH) */
    <ConfigProvider
        theme={{
            token: {
                colorBgContainer: '#403323', // Màu nền ô lịch, input
                colorText: '#c2a6a0',       // Màu chữ chính chung
                colorTextDescription: '#c5a880', 
                borderRadius: 16,            
                colorBorder: '#52525b',     // Màu viền của input (zinc-600)
            },
            components: {
                Calendar: {
                    fullPanelBg: '#403323',
                    itemActiveBg: 'rgba(237, 229, 219, 0.15)',
                },
                Modal: {
                    contentBg: '#2b2216',    // ĐỔI MÀU NỀN THÂN MODAL THÀNH NÂU TỐI KHÔNG BỊ TRẮNG
                    headerBg: '#2b2216',     // ĐỔI MÀU NỀN HEADER MODAL ĐỒNG BỘ
                    colorIcon: '#c2a6a0',    // Màu nút dấu X đóng modal
                    colorIconHover: '#ffffff'
                },
                DatePicker: {
                    cellActiveWithRangeBg: 'rgba(200, 132, 154, 0.2)',
                    cellHoverWithRangeBg: 'rgba(200, 132, 154, 0.1)',
                    cellSelectedBg: '#c8849a', // Màu ngày được chọn trong popup lịch
                    colorBgElevated: '#2b2216', // Màu nền hộp lịch popup bay ra
                    colorText: '#ffffff',
                },
                InputNumber: {
                    handleBg: '#382d1f',     // Màu nút tăng giảm số
                    handleActiveBg: '#52525b',
                    colorBgContainer: '#382d1f', // Nền ô nhập số sáng hơn nền modal để tạo khối depth
                    colorText: '#ffffff',
                }
            }
        }}
    >
        <div className="w-full min-h-screen bg-[#1b1814] flex flex-col items-center justify-start p-4 md:p-8 gap-6 select-none">
            
            {/* TIÊU ĐỀ */}
            <div className="text-center flex items-center gap-2 text-[#c5a880] font-bold text-xl md:text-2xl mt-2">
                <Heart className="text-red-400 fill-red-400 animate-bounce" size={24} />
                <span>Lịch Theo Dõi Chu Kỳ Phái Đẹp</span>
            </div>

            {/* CARD LỊCH CHÍNH */}
            <Card bordered={false} className="w-full max-w-xl md:max-w-4xl shadow-2xl bg-[#403323]">
                <div className="block md:hidden">
                    <Calendar headerRender={headerRender} fullscreen={true} onSelect={handleSelectDate} cellRender={cellRender} />
                </div>
                <div className="hidden md:block">
                    <Calendar fullscreen={true} onSelect={handleSelectDate} cellRender={cellRender} headerRender={headerRender} />
                </div>
            </Card>

            {/* CARD CHÚ THÍCH & DỰ BÁO NGÀY ĐANG CHỌN */}
            <Card bordered={false} className="w-full max-w-xl md:max-w-4xl shadow-2xl bg-[#403323]">
                <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-[#c5a880]">
                        Ngày đang chọn: <span className="text-white font-bold">{dayjs(selectDateStr).format("DD/MM/YYYY")}</span>
                    </p>
                    
                    {selectedDayStatus ? (
                        <div className={`p-4 rounded-xl flex items-center gap-4 transition-all border ${selectedDayStatus.tailwindBg} ${selectedDayStatus.tailwindBorder}`}>
                            <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: selectedDayStatus.dotColor }} />
                            <div>
                                <h4 className="text-md font-bold text-white mb-0.5">{selectedDayStatus.label}</h4>
                                <p className="text-xs text-zinc-300">{selectedDayStatus.advice}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-zinc-400 text-sm py-2">
                            Vui lòng cấu hình ngày bắt đầu chu kỳ để xem dự đoán.
                        </div>
                    )}

                    {/* BẢNG CHÚ THÍCH MÀU SẮC */}
                    <div className="mt-4 pt-4 border-t border-zinc-700/50 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {Object.entries(STATUS_MAP).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: value.dotColor }} /> 
                                <span className="text-zinc-300">{value.label.replace(/🩸|🥚|✅/g, '')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* MODAL CẤU HÌNH BAN ĐẦU - BÂY GIỜ ĐÃ NẰM TRONG CONFIGPROVIDER GỐC NÊN SẼ ĐỔI MÀU HOÀN TOÀN */}
            <Modal
                title={<span className="text-[#c5a880] text-lg font-bold">Cấu hình chu kỳ kinh nguyệt</span>}
                open={isModalOpen}
                closable={hasConfig}
                onCancel={() => hasConfig && setIsModalOpen(false)}
                footer={null}
                styles={{ content: { borderRadius: '16px' } }}
                destroyOnClose
            >
                <Form
                    form={initForm}
                    layout="vertical"
                    onFinish={handleSaveConfig}
                    initialValues={{
                        startDate: cycleConfig ? dayjs(cycleConfig.startDate) : dayjs(),
                        cycleLength: cycleConfig ? cycleConfig.cycleLength : 28,
                        periodLength: cycleConfig ? cycleConfig.periodLength : 5,
                    }}
                    className="mt-4"
                >
                    <Form.Item
                        label={<span className="text-zinc-300">Ngày bắt đầu kỳ kinh gần nhất</span>}
                        name="startDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                    >
                        <DatePicker 
                            className="w-full h-10 rounded-xl bg-[#382d1f] text-white border-zinc-600" 
                            format="DD/MM/YYYY" 
                            placeholder="Chọn ngày" 
                            popupClassName="custom-datepicker-popup"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-zinc-300">Độ dài chu kỳ trung bình (ngày)</span>}
                        name="cycleLength"
                        rules={[{ required: true, message: 'Nhập độ dài chu kỳ!' }]}
                    >
                        <InputNumber 
                            min={20} 
                            max={45} 
                            className="w-full h-10 rounded-xl flex items-center border-zinc-600" 
                            placeholder="Thường là 28 - 30 ngày" 
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-zinc-300">Số ngày hành kinh (ngày)</span>}
                        name="periodLength"
                    >
                        <InputNumber 
                            min={2} 
                            max={10} 
                            className="w-full h-10 rounded-xl flex items-center border-zinc-600" 
                            placeholder="Thường là 3 - 7 ngày (Mặc định: 5)" 
                        />
                    </Form.Item>

                    <Form.Item className="mb-0 text-right mt-6">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="h-10 rounded-xl bg-[#c8849a] border-none hover:!bg-[#b37388] text-white px-6 font-semibold transition-all active:scale-95"
                        >
                            Xác nhận và Tính toán
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    </ConfigProvider>
);
};

export default Cycle;