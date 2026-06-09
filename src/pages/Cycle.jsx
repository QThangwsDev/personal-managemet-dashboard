import { Calendar, Card, ConfigProvider, Form, InputNumber, DatePicker, Button, Modal, message } from 'antd';
import { ArrowLeft, ArrowRight, Settings, Heart, CalendarDays } from "lucide-react";
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
        advice: "Hãy chuẩn bị băng vệ sinh, giữ ấm bụng và hạn chế uống nước đá nhé!" 
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
        label: 'Cửa sổ thụ thai 💗', 
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

    // Kiểm tra trạng thái của một ngày bất kỳ (Thuật toán đã sửa lỗi xem quá khứ/tương lai)
    const checkDayStatus = useCallback((targetDateStr) => {
        if (!cycleConfig) return null;

        const start = dayjs(cycleConfig.startDate).startOf('day');
        const length = Number(cycleConfig.cycleLength) || 28;
        const periodDays = Number(cycleConfig.periodLength) || 5;
        const ovulationIndex = length - 14; 

        // ngay can kiem tra va chuyen hoa du lieu
        const target = dayjs(targetDateStr).startOf('day');
        let diffDays = target.diff(start, 'day');//

        let cycleIndex = diffDays % length;
        if (cycleIndex < 0) {
            cycleIndex += length;
        }

        if (cycleIndex >= 0 && cycleIndex < periodDays) return STATUS_MAP.period;
        if (cycleIndex === ovulationIndex) return STATUS_MAP.ovulation;
        if (cycleIndex >= ovulationIndex - 5 && cycleIndex <= ovulationIndex + 1) return STATUS_MAP.fertile;
        return STATUS_MAP.safe;
    }, [cycleConfig]);

    const selectedDayStatus = useMemo(() => checkDayStatus(selectDateStr), [selectDateStr, checkDayStatus]);

    // Tính toán số ngày còn lại đến kỳ kinh kế tiếp kể từ ngày hôm nay
    const countdownInfo = useMemo(() => {
        if (!cycleConfig) return null;

        const today = dayjs().startOf('day');
        const start = dayjs(cycleConfig.startDate).startOf('day');
        const length = Number(cycleConfig.cycleLength) || 28;
        const periodDays = Number(cycleConfig.periodLength) || 5;

        let diffDays = today.diff(start, 'day');
        let currentCycleIndex = diffDays % length;
        if (currentCycleIndex < 0) {
            currentCycleIndex += length;
        }

        if (currentCycleIndex >= 0 && currentCycleIndex < periodDays) {
            return { status: 'active', daysLeft: 0, text: "Trong kỳ hành kinh 🩸", message:"Chú ý nghĩ ngơi" };
        }

        const daysLeft = length - currentCycleIndex;
        if (daysLeft === length || daysLeft === 0) {
            return { status: 'expected', daysLeft: 0, text: "Kỳ kinh dự kiến bắt đầu hôm nay!" };
        }

        return { status: 'countdown', daysLeft, text: `đến kỳ kinh tiếp theo`,message:`${daysLeft < 7 ? 'Chuẩn bị dần thôi':'Còn lâu nên cứ thu giản'}` };
    }, [cycleConfig]);

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

    // Render từng ô ngày trên Calendar
    const dateCellRender = useCallback((current) => {
        const dateStr = current.format('YYYY-MM-DD');
        const status = checkDayStatus(dateStr);
        const isToday = dateStr === dayjs().format('YYYY-MM-DD');

        if (!status) return null;

        return (
            <div 
                className={`w-full h-full shrink-0 flex flex-col justify-between p-1.5  border transition-all hover:brightness-110 ${status.tailwindBg} ${status.tailwindBorder}`}
                style={{
                    boxShadow: isToday ? 'inset 0 0 0 2px #fbbf24' : undefined 
                }}
                title={status.label}
            >
                <div className="flex flex-col justify-around space-y-3 items-center w-full">
                    <span className={`text-xs md:text-8 font-semibold ${isToday ? 'text-amber-400 font-bold' : 'text-zinc-200'}`}>
                        {current.date()}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: status.dotColor }} />
                </div>
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
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return (
            <div className='flex items-center justify-between mb-3 px-1 text-[#c5a880]'>
                <h2 className="text-md md:text-lg font-bold flex items-center gap-1.5">
                    <CalendarDays size={18} className="text-[#c5a880]"/>
                    {months[currentMonth]} {currentYear}
                </h2>
                <div className="flex items-center space-x-1">
                    <button className='hover:bg-amber-800/30 rounded-full p-2 transition-colors' onClick={() => onChange(value.subtract(1, 'month'))}>
                        <ArrowLeft size={16} />
                    </button>
                    <button className='hover:bg-amber-800/30 rounded-full p-2 transition-colors' onClick={() => onChange(value.add(1, 'month'))}>
                        <ArrowRight size={16} />
                    </button>
                    <button className='hover:bg-amber-800/30 rounded-full p-2 transition-colors text-zinc-400 hover:text-white' onClick={() => setIsModalOpen(true)}>
                        <Settings size={16} />
                    </button>
                </div>
            </div>
        );
    }, []);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgContainer: '#403323',
                    colorText: '#c2a6a0',       
                    colorTextDescription: '#c5a880', 
                    borderRadius: 16,            
                    colorBorder: '#52525b',     
                },
                components: {
                    Calendar: {
                        fullPanelBg: '#403323',
                        itemActiveBg: 'rgba(237, 229, 219, 0.15)',
                        miniContentHeight: 10,
                    },
                    Modal: {
                        contentBg: '#2b2216',    
                        headerBg: '#2b2216',     
                        colorIcon: '#c2a6a0',    
                        colorIconHover: '#ffffff'
                    },
                    DatePicker: {
                        cellActiveWithRangeBg: 'rgba(200, 132, 154, 0.2)',
                        cellHoverWithRangeBg: 'rgba(200, 132, 154, 0.1)',
                        cellSelectedBg: '#c8849a', 
                        colorBgElevated: '#2b2216', 
                        colorText: '#ffffff',
                    },
                    InputNumber: {
                        handleBg: '#382d1f',     
                        handleActiveBg: '#52525b',
                        colorBgContainer: '#382d1f', 
                        colorText: '#ffffff',
                    },
                    Button:{
                        colorBgContainer:'#d39dae'
                    }
                }
            }}
        >
            <div className="w-full bg-[#1b1814] flex flex-col items-center justify-start gap-4 select-none">
                
                {/* TIÊU ĐỀ */}
                <div className="text-center flex items-center gap-2 text-[#c5a880] font-bold text-xl md:text-2xl my-1">
                    <Heart className="text-red-400 fill-red-400 animate-bounce" size={22} />
                    <span>Lịch Theo Dõi Chu Kỳ Phái Đẹp</span>
                </div>

                {/* BỐ CỤC RESPONSIVE: ĐẢO KHỐI THÔNG TIN LÊN TRÊN Ở MOBILE, XẾP NGANG Ở DESKTOP */}
                <div className="w-full  mb-20  overflow-hidden flex flex-col-reverse justify-between md:flex-row md:w-full gap-4 p-4 mx-auto items-start">
                    
                    {/* BÊN TRÁI (MÁY TÍNH) / BÊN DƯỚI (ĐIỆN THOẠI): KHỐI LỊCH */}
                    <div className="w-full  md:w-4/5 md:min-w-90 lg:w-2/3">
                        <Card bordered={false} className="shadow-2xl bg-[#403323]  custom-calendar-square overflow-hidden p-1 ">
                            <div className="block md:hidden w-full">
                                <Calendar headerRender={headerRender} fullscreen={true} onSelect={handleSelectDate} cellRender={cellRender} />
                            </div>
                            <div className="hidden md:block w-full">
                                <Calendar fullscreen onSelect={handleSelectDate} cellRender={cellRender} headerRender={headerRender} />
                            </div>
                        </Card>
                    </div>

                    {/* BÊN PHẢI (MÁY TÍNH) / BÊN TRÊN (ĐIỆN THOẠI): KHỐI THÔNG TIN VÀ ĐẾM NGƯỢC */}
                    <div className="w-ful justify-center items-center md:flex-col md:w-2/6 lg:w-1/3 flex  gap-4">
                        
                        {/* 1. KHỐI ĐẾM NGƯỢC THỜI GIAN THỰC */}
                        {countdownInfo && (
                            <Card bordered={false} className="shadow-2xl bg-[#2e2419] w-full max-w-40 h-full md:max-w-none flex flex-col justify-center items-center text-center border shrink-0 border-[#52412c]">
                                <h3 className="text-xs font-semibold text-[#c5a880] uppercase tracking-wider whitespace-nowrap mb-3">ToDay</h3>
                                <div className="flex flex-col items-center justify-center">
                                    <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center mb-2 animate-pulse
                                        ${countdownInfo.status === 'active' ? 'border-red-500 bg-red-500/10' : 'border-pink-500/60 bg-pink-500/5'}`}>
                                        
                                        {countdownInfo.status === 'active' ? (
                                            <span className="text-xl font-bold text-red-400">🩸</span>
                                        ) : (
                                            <>
                                                <span className="text-2xl font-black text-white">{countdownInfo.daysLeft}</span>
                                                <span className="text-[10px] text-zinc-400 font-medium uppercase">Day left</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs md:text-sm font-bold text-zinc-100 whitespace-nowrap">{countdownInfo.text}</p>
                                    
                                </div>
                            </Card>
                        )}

                        {/* 2. CARD TRẠNG THÁI NGÀY ĐANG CHỌN */}
                        <Card bordered={false} className="shadow-2xl bg-[#403323] overflow-hidden border border-zinc-700/30">
                            <div className="flex flex-col gap-3">
                                <p className="text-xs md:text-sm font-medium text-[#c5a880] border-b border-zinc-700/50 pb-2">
                                    Selected Day: <span className="text-white font-bold bg-[#1b1814] px-2 py-0.5 rounded-md ml-1">{dayjs(selectDateStr).format("DD/MM/YYYY")}</span>
                                </p>
                                
                                {selectedDayStatus ? (
                                    <div className={`p-3.5 rounded-xl flex items-start gap-3 transition-all border ${selectedDayStatus.tailwindBg} ${selectedDayStatus.tailwindBorder}`}>
                                        <div className="w-3.5 h-3.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: selectedDayStatus.dotColor }} />
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-1">{selectedDayStatus.label}</h4>
                                            <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">{selectedDayStatus.advice}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-zinc-400 text-xs py-2">
                                        Vui lòng cấu hình ngày bắt đầu chu kỳ để xem dự đoán.
                                    </div>
                                )}

                                {/* BẢNG CHÚ THÍCH MÀU SẮC */}
                                <div className="mt-2 pt-3 border-t border-zinc-700/50 grid grid-cols-2 gap-2 text-[11px]">
                                    {Object.entries(STATUS_MAP).map(([key, value]) => (
                                        <div key={key} className="flex items-center gap-2 bg-[#1b1814]/40 p-1.5 rounded-lg border border-zinc-800">
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: value.dotColor }} /> 
                                            <span className="text-zinc-300 truncate">{value.label.replace(/🩸|🥚|✅|💗/g, '')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>
                
                {/* MODAL CẤU HÌNH BAN ĐẦU */}
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
                                className="h-10 rounded-xl  border-none hover:!bg-[#b37388] text-white px-6 font-semibold transition-all active:scale-95"
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