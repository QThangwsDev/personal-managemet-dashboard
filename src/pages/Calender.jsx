import { Calendar, Card, ConfigProvider, Form, Input, Button, message, Select } from 'antd';
import { mockEventsFromDB } from "../database/mockEventsFromDb";
import { Plus, X, Trash2, ArrowLeft, ArrowRight,Dot } from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";
dayjs.locale('vi');

const CalendarPage= () => {

    //Ham bien doi thong tin tho tanh obj dang ('YYYY-MM-DD')
    const groupEventByDate =(value) => {
        return value.reduce((acc,currentEvent) => {
            //acc la 1 mang rong, currentEvent la cac gia tri duoc duyet de dua vao acc
            const dateKey = currentEvent.event_date;
            if(!acc[dateKey]) acc[dateKey] = [];

            acc[dateKey].push({
                id: currentEvent.id,
                title: currentEvent.title,
                color: currentEvent.color
            });
            return acc;
        },{});
    };

    //Khai bao cac bien can thiet
    const [events , setEvents] = useState(() => groupEventByDate(mockEventsFromDB));
    const [selectedDateStr,setSelectedDateStr] = useState(dayjs().format("YYYY-MM-DD"));
    const [showForm, setShowform] = useState(false);
    const [form] = Form.useForm();

    // khu de set mau the hien tam quan trong cua su kien
    
    const PALETE = [
        "#ef4444", // 1. Rất quan trọng / Nguy cấp (Đỏ đậm nổi bật)
        "#f97316", // 2. Quan trọng (Cam ấm)
        "#eab308", // 3. Trung bình (Vàng cát / Vàng mustard)
        "#3b82f6", // 4. Thấp (Xanh dương dịu)
        "#9ca3af"  // 5. Nhắc nhở / Sơ cua (Xám trung tính)
    ];

    //Ham render header
    const renderHeader = ({value, onChange}) => {
        const currentYear = value.year();
        const currentMonth = value.month();

        const MONTHS =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        // 2 ham chuyen trang
        const prevMonth = () => {
            onChange(value.subtract(1,'month'));
        }
        const nextMonth = () => {
            onChange(value.add(1,'month'));
        }

        return (
            <div className='flex justify-between text-[#4d433e]'>
                <span>
                    <h2>{MONTHS[currentMonth]} {currentYear}</h2>
                </span>

                <div className='flex justify-around space-x-1'>
                    <button onClick={prevMonth} className='hover:bg-amber-700/70 p-2 rounded-full'><ArrowLeft size={12} /></button>
                     <button onClick={nextMonth} className='hover:bg-amber-700/70 p-2 rounded-full'><ArrowRight size={12} /></button>
                </div>
            </div>
        );
    };

    // xu ly noi dung cua o ngay
    const dateCellRender = (values) => {
        // bien ngay lay gia tri ngay value tra ve
        const dateStr = values.format("YYYY_MM_DD");
        // bien de load event cua ngay
        const dayEvs = events[dateStr] || [];
        const isSelected = dateStr === selectedDateStr ;
        const today = dateStr === dayjs.format("YYYY-MM-DD");

        // Cho 1 bien de dung de chinh mau  nen nay kia cho cellDate
        let cellClass ='absolute inset-0 w-full h-full flex flex-col justify-between p-2 border transition-all hover:brightness-110 min-h-16';

        if(isSelected){
            // neu duoc chon
            cellClass += "bg-[#6B5138] text-white scale-105 shadow-xl z-10 font-bold";
        } else if (today){
            // O o ngay hien tai
            cellClass += "bg-[#c9a050]/20 border border-[#c9a050] text-white";
        } else {
            // ngay binh thuong khi duoc hover
            cellClass += "hover:bg-zinc-700/40 text-[#c2a6a0]";
        }

        return (
            <div className={cellClass}>
                {/* So ngay hien thi do da an so ngay mac dinh cua calendar */}
                <div className='text-right text-xs font-semibold select-none pr-0.5 pt-0.5'>
                    {values.date()}
                </div>
                {/* danh sach cham tron bieu hine co cac su kien */}
                <div className='flex justify-center items-center gap-1 mt-auto flex-wrap max-w-full'>
                    {dayEvs.map((ev) => (
                       <Dot 
                            key={ev.id}
                            color={ev.color}
                            size={10}/>
                    ))}
                </div>
            </div>
        );
    };

    const cellRender = ({current,info}) => {
        if (info.type === 'date') return dateCellRender(current);
        return info.originNode;
    };

    const handleSelectDate = ( value) => {
        setSelectedDateStr(value.format("YYYY-MM-DD"));
    }

    const addEvent = (values) => {
        const newEvent = {
            id:crypto.randomUUID(),
            title:values.title.trim(),
            color:values.color
        }
        setEvents((prev) => ({
            ...prev,
            [selectedDateStr]: [...(prev[selectedDateStr] || []),newEvent]
        }));
        form.resetFields();
        setShowform(false);
        message.success("Add event success");
    };

    const deleteEvent = (id) => {
        setEvents((prev) => ({
            ...prev,
            [selectedDateStr] : prev[selectedDateStr].filter((ev) => ev.id === id)
        }));
        message.info("Da xoa su kien");
    };


    return (
        <div className='w-full h-1000 bg-amber-800/30 flex flex-col items-center justify-start p-4 md:p-8 gap-6 select-none'>
            <ConfigProvider
                theme= {{
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
                        }
                    }
                }}
            >
               <Card
                    bordered={false}
                    className="w-full max-w-1xl md:max-w-4xl shadow-2xl bg-[#403323]"
               >
                    <Calendar fullscreen={true} headerRender={renderHeader} cellRender={cellRender} />

                    {/* thanh xem va them event tren desktop */}
                    <Card border={false} className="w-full max-w-xl md:max-w-4xl shadow-2xl bg-[#403323]">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-[#c5a880]">Event: {dayjs(selectedDateStr).format("YYYY-MM-DD")}</p>

                            <button 
                                onClick={() => setShowform(!showForm)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                                showForm ? "bg-zinc-700 text-white" : "bg-[#c8849a] text-white shadow-lg"
                            }`}>{showForm ? <X size={14}/>:<Plus size={14}/>} {showForm?'Cancel':'Add Event'}</button>
                        </div>

                        {showForm && (
                            <div className="p-4 mb-4 rounded-xl border border-[rgba(237,229,219,0.1)] bg-[#2b2216]">
                                <Form form={form} layout="inline" className="w-full flex flex-wrap gap-3" >
                                    <Form.Item 
                                        name="color"
                                        className='min-w-25'
                                    >
                                        <Select></Select>
                                    </Form.Item>
                                    <Form.Item 
                                        name="title"
                                        rules={[{required:true , message:'vui long nhap ten su kien'}]}
                                        className="flex-1 min-w-[200px]"
                                    >
                                        <Input placeholder={'type name event'} className="rounded-xl bg-transparent text-white border-zinc-600" autoFocus ></Input>
                                    </Form.Item>
                                </Form>
                            </div>
                        )}
                    </Card>
               </Card>

            </ConfigProvider>
        </div>
    )


}

export default CalendarPage;