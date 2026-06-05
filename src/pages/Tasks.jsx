import { PlusIcon, Pencil, Trash, ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";
import { useCallback, useState, useRef, useEffect } from 'react'; // 🚀 Thêm useRef và useEffect
import { Checkbox } from "antd";

const Tasks = () => {
    // state qua ly du lieu truyen vao nay kia
    const [tasks, setTasks] = useState([
        { id: 1, nametask: "Review Q2 marketing brief", kind: "Work", iscompleted: true , level: "Medium" },
        { id: 2, nametask: "Finalize Milo Creative proposal", kind: "Work", iscompleted: false, level: "High" },
        { id: 3, nametask: "Send invoice to Westfield Co.", kind: "Work", iscompleted: true, level: "Medium" },
        { id: 4, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false , level: "Low" },
        { id: 5, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false , level: "Low" },
        { id: 6, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false , level: "Medium" },
        { id: 7, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false , level: "High" },
        { id: 8, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false , level: "Low" },
        { id: 9, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false , level: "Low" },
        { id: 10, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false , level: "Low" },
        { id: 11, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false , level: "Low" },
        { id: 12, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false , level: "Low" },
        { id: 13, nametask: "vat thu 13", kind: "Personal", iscompleted: false , level: "Low" },
    ]);

    const [filterTab, setFilterTab] = useState('ALL');
    const [isadding, setIsadding] = useState(false);
    const [isedit, setIsedit] = useState(null);
    const [textedit, setTextedit] = useState('');
    const done = tasks.filter((task) => task.iscompleted).length;

    // 🎯 TẠO USEREF ĐỂ ĐIỀU KHIỂN Ô INPUT EDIT
    const inputEditRef = useRef(null);

    // Logic Phan trang
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const lastIndexTask = currentPage * pageSize;
    const firstIndexTask = lastIndexTask - pageSize;
    const filterTask = tasks.filter(task => {
        if (filterTab === 'ALL') return true;
        return task.kind === filterTab;
    });

    const totalpage = Math.ceil(filterTask.length / pageSize);
    const displayTasks = filterTask.slice(firstIndexTask, lastIndexTask);

    const handleChangeTab = (tab) => {
        setCurrentPage(1);
        setFilterTab(tab);
    };

    // 🔒 SỬA LOGIC: Ngăn chặn hoàn thành khi đang mở ô Edit
    const togglecomp = useCallback((id) => {
        // Nếu task này đang ở trạng thái sửa đổi, khóa không cho tích hoàn thành!
        if (isedit === id) return; 

        setTasks(prevtask => prevtask.map(task =>
            task.id === id ? { ...task, iscompleted: !task.iscompleted } : task
        ));
    }, [isedit]); // 🚀 Nhớ truyền thêm dependency isedit vào đây

    const levelColors = {
        Low: "bg-blue-950/40 text-blue-400 border border-blue-900/50",
        Medium: "bg-yellow-950/40 text-yellow-500 border border-yellow-900/50",
        High: "bg-pink-950/40 text-pink-500 border border-pink-900/50"
    };

    const [newTodoName, setNewTodoName] = useState('');
    const [newKind, setNewKind] = useState('Work');
    const [newLevel, setNewLevel] = useState('Low');

    const handleAddTask = () => {
        if (!newTodoName.trim()) return;

        const newTask = {
            id: Date.now(),
            nametask: newTodoName.trim(),
            kind: newKind,
            iscompleted: false,
            level: newLevel
        };

        setTasks(prevtask => [newTask, ...prevtask]);
        setNewTodoName('');
        setNewKind('Work');
        setNewLevel('Low');
    };

    const handleDeleteTask = useCallback((id) => {
        setTasks(prevTasks => {
            const updatetask = prevTasks.filter(t => t.id !== id);
            const remainingTask = updatetask.filter(t => {
                return filterTab === 'ALL' || t.kind === filterTab;
            });
            const maxpage = Math.ceil(remainingTask.length / pageSize);
            if (maxpage > 0 && currentPage > maxpage) {
                setCurrentPage(maxpage);
            }
            return updatetask;
        });
    }, [filterTab, currentPage]);

    const handledit = (item, e) => {
        e.stopPropagation();
        if (isedit === item.id) {
            setIsedit(null);
        } else {
            setIsedit(item.id);
            setTextedit(item.nametask);
        }
    };

    // 🚀 TUYỆT CHIÊU: Đợi ô input hiển thị xong là tự động nhảy vào cuối chữ
    useEffect(() => {
        if (isedit && inputEditRef.current) {
            inputEditRef.current.focus();
            // Mẹo đỉnh cao: Đặt lại giá trị value bằng chính nó giúp con trỏ chuột nhảy xuống cuối dòng thay vì đứng ở đầu dòng
            const length = inputEditRef.current.value.length;
            inputEditRef.current.setSelectionRange(length, length);
        }
    }, [isedit]); // Chạy mảng này mỗi khi trạng thái mở ô edit thay đổi

    const handleSave = (id) => {
        if (!textedit.trim()) return;
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, nametask: textedit.trim() } : task
        ));
        setIsedit(null);
    };

    return (
        <div className='flex flex-col p-3'>
            <span className='flex w-full h-12 justify-between overflow-hidden'>
                <div className='text-[#ffffff]'>
                   <h2 className='text-xl font-serif'>To-Do List</h2> 
                   <p className='text-sm text-[#9e9690]'> {done} of {tasks.length} done</p>
                </div>
                <button
                    onClick={() => { setIsadding(prev => !prev) }} 
                    className='flex justify-around items-center px-5 rounded-3xl m-1 bg-[#a5693e] hover:bg-[#655549]'><PlusIcon className='w-5 h-5'/> <p>New task</p></button>
            </span>

            <div className='flex bg-[#2d2220] p-2 rounded-2xl justify-around mt-2 '>
                {['ALL', 'Work', 'Personal'].map((tab) => (
                    <button key={tab} className={`flex-1 py-2 text-sm font-medium rounded-xl hover:bg-[#7d593f] transition-all ${
                        filterTab === tab ? 'bg-[#613b20] text-white' : 'text-slate-300 hover:text-white'
                    }`} onClick={() => { handleChangeTab(tab) }}>{tab}</button>
                ))}
            </div>

            <div className={`${isadding ? 'box' : 'hidden'} w-[95%] h-50 bg-[#5b4c44] rounded-2xl m-4 p-3 flex flex-col`}>
                <input 
                    type="text" 
                    value={newTodoName}
                    onChange={(e) => setNewTodoName(e.target.value)}
                    className="border p-2 m-2 rounded-2xl border-[#ae7858] focus:outline-none focus:border-[#ae7858] focus:shadow-[0_0_5px_lightgreen] transition-all duration-300 " 
                    placeholder='What needs to be done?'/>
                <div className='flex justify-around mt-2 mx-2 space-x-2'>
                    <select className='text-sm flex-1 border border-amber-500/40 rounded-2xl px-2 py-2'
                            value={newKind}
                            onChange={(e) => setNewKind(e.target.value)}>
                        <option value='Personal' className='bg-amber-900/60'> Personal</option>
                        <option value='Work' className='bg-amber-900/60'>Work</option>
                    </select>

                    <select className='text-sm flex-1 border border-amber-500/40 rounded-2xl px-2 py-2'
                            value={newLevel}
                            onChange={(e) => setNewLevel(e.target.value)}>
                        <option value='High' className='bg-amber-900/60'>High</option>
                        <option value='Medium' className='bg-amber-900/60'>Medium</option>
                        <option value='Low' className='bg-amber-900/60'>Low</option>
                    </select>
                </div>
                <button className='w- p-2 bg-amber-600/60 rounded-2xl m-3 cursor-pointer' onClick={handleAddTask}>Add Task</button>
            </div>

            <div className="w-full min-h-screen m-2 flex flex-col space-y-2 items-center" >
                {displayTasks.map((item) => (
                    <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => togglecomp(item.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                togglecomp(item.id);
                            }
                        }}
                        className={`w-[95%] ${item.iscompleted ? 'line-through bg-[#342111] text-gray-100 opacity-75' : 'bg-[#4b3f35]'} h-20 flex justify-between px-3 py-3 rounded-2xl`}
                    >
                        <div className='flex w-full'> 
                            <Checkbox 
                                checked={item.iscompleted}
                                disabled={isedit === item.id} // Vô hiệu hóa checkbox luôn khi đang sửa
                                className='custom-round-checkbox'
                            />
                            <div className='ml-2 w-full'>
                                <h2 className={`text-lg ${isedit === item.id ? 'hidden' : ''} w-full`}>{item.nametask}</h2>
                                <input 
                                    ref={isedit === item.id ? inputEditRef : null} // 🎯 GẮN REF VÀO ĐÂY
                                    type="text" 
                                    className={`${isedit === item.id ? '' : "hidden"} px-2 py-0.5 rounded-md text-black focus:outline-none bg-white w-[90%]`} 
                                    value={textedit} 
                                    onChange={(e) => setTextedit(e.target.value)}
                                    onClick={(e) => e.stopPropagation()} // Chống lan truyền sự kiện ra ngoài
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSave(item.id);
                                        if (e.key === 'Escape') setIsedit(null);
                                    }} 
                                />

                                <span className="flex space-x-2 mt-1">
                                    <p className={` ${item.kind === 'Work' ? 'bg-blue-500/80 text-blue-100 px-2 py-0.5 rounded-2xl border border-blue-950' : 'bg-pink-500/50 px-2 py-0.5 rounded-2xl border border-pink-700'} text-xs font-medium`}>{item.kind}</p>
                                    <p className={`text-xs px-2 py-0.5 rounded-md font-medium ${levelColors[item.level]}`}>{item.level}</p>
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <button className='w-7 h-7 hover:bg-amber-600 rounded-xl flex items-center justify-center' onClick={(e) => handledit(item, e)}> <Pencil className='w-4 h-4 text-[#f3bc8c]' /></button>
                            <button className='w-7 h-7 hover:bg-amber-600 rounded-xl flex items-center justify-center'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTask(item.id);
                                    }}><Trash className='w-4 h-4 text-[#f3bc8c]'></Trash></button>
                        </div>
                    </div>
                ))}
                
                {/* Thanh phân trang bên dưới giữ nguyên */}
                <div className="flex justify-around space-x-2 items-center">
                    <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}><ArrowBigLeftDash /></button>
                    {Array.from({ length: totalpage }, (_, index) => {
                        const pageNum = index + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 rounded-xl text-sm font-medium transition-all ${
                                    currentPage === pageNum 
                                        ? 'bg-[#a5693e] text-white font-bold scale-105' 
                                        : 'bg-[#2d2220] text-gray-400 hover:bg-[#7d593f] hover:text-white'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalpage}><ArrowBigRightDash /></button>
                </div>
            </div>
        </div>
    );
};

export default Tasks;