import { Calendar, Card, ConfigProvider, Form, Input, Button, message, Select, Badge } from 'antd';
import { mockEventsFromDB } from "../database/mockEventsFromDb";
import { Plus, X, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";
dayjs.locale('vi');

const Schedule = () => {

    // 1. Hàm nhóm event chuẩn hóa theo định dạng YYYY-MM-DD
    const groupEventByDate = (value) => {
        return value.reduce((acc, currentEvent) => {
            // Ép định dạng ngày từ DB về YYYY-MM-DD để tránh lệch chuỗi ISO
            const dateKey = dayjs(currentEvent.event_date).format("YYYY-MM-DD"); 
            if (!acc[dateKey]) acc[dateKey] = [];

            acc[dateKey].push({
                id: currentEvent.id,
                title: currentEvent.title,
                color: currentEvent.color
            });
            return acc;
        }, {});
    };

    // Khai báo State
    const [events, setEvents] = useState(() => groupEventByDate(mockEventsFromDB));
    const [selectedDateStr, setSelectedDateStr] = useState(dayjs().format("YYYY-MM-DD"));
    
    // Quản lý trạng thái đóng/mở Card sự kiện trên Mobile
    const [showMobilePanel, setShowMobilePanel] = useState(false);
    const [showForm, setShowForm] = useState(false); 
    const [form] = Form.useForm();

    const PALETE = [
        { color: "#ef4444", label: "Rất quan trọng" },
        { color: "#f97316", label: "Quan trọng" },
        { color: "#eab308", label: "Trung bình" },
        { color: "#3b82f6", label: "Thấp" },
        { color: "#9ca3af", label: "Nhắc nhở" }
    ];

    // Render Header tùy chỉnh
    const renderHeader = ({ value, onChange }) => {
        const currentYear = value.year();
        const currentMonth = value.month();
        const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        return (
            <div className='flex justify-between items-center p-3 text-[#c2a6a0]'>
                <h2 className="font-bold text-base md:text-lg">{MONTHS[currentMonth]} {currentYear}</h2>
                <div className='flex space-x-1'>
                    <button onClick={() => onChange(value.subtract(1, 'month'))} className='hover:bg-amber-700/70 p-2 rounded-full text-white'><ArrowLeft size={16} /></button>
                    <button onClick={() => onChange(value.add(1, 'month'))} className='hover:bg-amber-700/70 p-2 rounded-full text-white'><ArrowRight size={16} /></button>
                </div>
            </div>
        );
    };

    
    const dateCellRender = (values) => {
        const dateStr = values.format("YYYY-MM-DD"); 
        const dayEvs = events[dateStr] || [];
        const isSelected = dateStr === selectedDateStr;
        const today = dateStr === dayjs().format("YYYY-MM-DD");

        // Layout container đảm bảo co giãn tốt và không bị che khuất bởi overflow mặc định
        let cellClass = 'w-full h-full absolute inset-0 max-h-[40px] md:max-h-[60px] p-1 flex flex-col justify-start items-center transition-all shrink-0';
        if (isSelected) {
            cellClass += "bg-[#6B5138] text-white font-bold rounded-lg shadow-inner";
        } else if (today) {
            cellClass += "bg-[#c9a050]/20 border border-[#FF9E0B] text-amber-400 rounded-lg";
        } else {
            cellClass += "hover:bg-zinc-700/40 text-[#c2a6a0]";
        }

        return (
            <div className={cellClass}>
                {/* Số ngày nằm trên cùng */}
                <div className='text-center text-xs select-none tetx-white'>
                    {values.date()}
                </div>
              
                {/* Danh sách Badge chấm tròn nằm ở đáy ô lịch */}
                <div className='flex gap-1 items-center '> 
                    {dayEvs.slice(0, 3).map((ev) => (
                        <Badge 
                            key={ev.id} 
                            color={ev.color} 
                            title={ev.title}
                            className="scale-90 md:scale-100" 
                        />
                    ))}
                </div>
                
            </div>
        );
    };

    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        return info.originNode;
    };

    // 3. Xử lý khi BẤM VÀO CELL ngày
    const handleSelectDate = (value) => {
        setSelectedDateStr(value.format("YYYY-MM-DD"));
        setShowMobilePanel(true);
    };

    // Hàm thêm sự kiện
    const addEvent = (values) => {
        const newEvent = {
            id: crypto.randomUUID(),
            title: values.title.trim(),
            color: values.color || PALETE[2].color
        };
        setEvents((prev) => ({
            ...prev,
            [selectedDateStr]: [...(prev[selectedDateStr] || []), newEvent]
        }));
        form.resetFields();
        setShowForm(false);
        message.success("Thêm sự kiện thành công!");
    };

    // Hàm xóa sự kiện
    const deleteEvent = (id) => {
        setEvents((prev) => {
            const list = prev[selectedDateStr] || [];
            return {
                ...prev,
                [selectedDateStr]: list.filter((ev) => ev.id !== id)
            };
        });
        message.info("Đã xóa sự kiện");
    };

    const currentDayEvents = events[selectedDateStr] || [];

    return (
        <div className='w-full min-h-screen bg-[#2b2216] flex flex-col items-center justify-start p-2 md:p-8 gap-4 select-none '>
            <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: '#403323',
                        colorText: '#c2a6a0',
                        colorTextDescription: '#c5a880',
                        borderRadius: 16
                    },
                    components: {
                        Calendar: {
                            fullPanelBg: '#403323',
                            itemActiveBg: 'rgba(237, 229, 219, 0.15)',
                        },
                        Select: {
                            optionSelectedBg: '#6B5138',     
                            optionActiveBg: 'rgba(201, 160, 80, 0.2)', 
                            colorBgElevated: '#2b2216',      
                        }
                    }
                }}
            >
                {/* Lịch chính */}
                <Card bordered={false} className="w-full max-w-xl md:max-w-4xl shadow-2xl bg-[#403323]">
                    <div className='block'>
                         <Calendar 
                        fullscreen={true} 
                        headerRender={renderHeader} 
                        cellRender={cellRender} 
                        onSelect={handleSelectDate}
                        />
                    </div>
                   
                </Card>

                {/* CARD SỰ KIỆN */}
                <div className={`w-full max-w-4xl transition-all duration-300 ${showMobilePanel ? 'block' : 'hidden md:block'}`}>
                    <Card bordered={false} className="w-full bg-[#403323] relative">
                        
                        <button 
                            onClick={() => setShowMobilePanel(false)}
                            className="absolute top-3 right-3 md:hidden text-zinc-400 hover:text-white p-1"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pr-6 md:pr-0">
                            <div>
                                <h3 className="text-base md:text-lg font-semibold text-white">Event:</h3>
                                <p className="text-xs md:text-sm font-medium text-[#c5a880]">{dayjs(selectedDateStr).format("DD/MM/YYYY")}</p>
                            </div>

                            <button
                                onClick={() => setShowForm(!showForm)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all active:scale-95 ${
                                    showForm ? "bg-zinc-700 text-white" : "bg-[#c9a050] text-black shadow-lg"
                                }`}
                            >
                                {showForm ? <X size={14} /> : <Plus size={14} />} 
                                {showForm ? 'Cancel' : 'Add'}
                            </button>
                        </div>

                        {showForm && (
                            <div className="p-4 mb-4 rounded-xl border border-[rgba(237,229,219,0.1)] bg-[#2b2216]">
                                <Form form={form} onFinish={addEvent} layout="vertical" className="w-full flex flex-col md:flex-row gap-3 items-end">
                                    <Form.Item
                                        name="color"
                                        label={<span className="text-xs text-[#c5a880]">Mức độ</span>}
                                        className='w-full md:w-1/4 mb-0'
                                        initialValue={PALETE[2].color}
                                    >
                                        <Select className="w-full h-10 custom-select" dropdownStyle={{ backgroundColor: '#2b2216' }}>
                                            {PALETE.map((item) => (
                                                <Select.Option key={item.color} value={item.color}>
                                                    <div className="flex items-center gap-2">
                                                        <Badge color={item.color} />
                                                        <span className="text-zinc-200 text-sm">{item.label}</span>
                                                    </div>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="title"
                                        label={<span className="text-xs text-[#c5a880]">Tên sự kiện</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                                        className="flex-1 w-full mb-0"
                                    >
                                        <Input 
                                            placeholder='Nhập nội dung công việc...' 
                                            className="h-10 rounded-xl bg-[#2b2216] text-white border-zinc-700" 
                                            autoFocus 
                                        />
                                    </Form.Item>

                                    <Button type="primary" htmlType="submit" className="h-10 rounded-xl bg-[#c9a050] border-none text-black font-semibold w-full md:w-auto">
                                        Lưu
                                    </Button>
                                </Form>
                            </div>
                        )}

                        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                            {currentDayEvents.length === 0 ? (
                                <p className="text-xs text-zinc-500 italic text-center py-4">Trống. Bấm "Thêm Sự Kiện" để tạo mới.</p>
                            ) : (
                                currentDayEvents.map((ev) => (
                                    <div key={ev.id} className="flex items-center justify-between p-3 rounded-xl bg-[#33291c] border border-zinc-800/20">
                                        <div className="flex items-center gap-3">
                                            <Badge color={ev.color} />
                                            <span className="text-sm text-zinc-200">{ev.title}</span>
                                        </div>
                                        <button onClick={() => deleteEvent(ev.id)} className="text-zinc-500 hover:text-red-400 p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </ConfigProvider>
        </div>
    );
};

export default Schedule;