import { PlusIcon, Pencil, Trash } from "lucide-react";
import {useCallback, useState} from 'react'
import { Checkbox,} from "antd";



const Tasks = () => {


    // state qua ly du lieu truyen vao nay kia
    const [tasks, setTasks] = useState([
        { id: 1, nametask: "Review Q2 marketing brief", kind: "Work", iscompleted: true , level: "Medium" },
        { id: 2, nametask: "Finalize Milo Creative proposal", kind: "Work", iscompleted: false, level: "High" },
        { id: 3, nametask: "Send invoice to Westfield Co.", kind: "Work", iscompleted: true, level: "Medium" },
        { id: 4, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false , level: "Low" },
    ]);

    const [filterTab, setFilterTab] = useState('ALL');
    const [isadding, setIsadding] = useState(false);
    const done = tasks.filter((task) => task.iscompleted).length;


    const displayedTask = tasks.filter(task =>{
        if (filterTab === 'ALL') return true;
        return task.kind === filterTab ;
    }
    );

    const togglecomp = useCallback((id) => {
        setTasks(prevtask =>  prevtask.map(task =>
            task.id === id ? { ...task, iscompleted: !task.iscompleted } : task
            )
        )
    }, []);

    const levelColors = {
        Low: "bg-blue-950/40 text-blue-400 border border-blue-900/50",
        Medium: "bg-yellow-950/40 text-yellow-500 border border-yellow-900/50",
        High: "bg-pink-950/40 text-pink-500 border border-pink-900/50"
    };
/// Khu logic them task moi vao

    const[newTodoName, setNewTodoName] = useState('');
    const[newKind, setNewKind] = useState('Work');
    const [newLevel, setNewLevel]= useState('Low');

    const handleAddTask = () => {
        if(!newTodoName.trim()) return;

        const newTask ={
            id: Date.now(),
            nametask: newTodoName.trim(),
            kind: newKind,
            iscompleted: false,
            level: newLevel
        };

        setTasks(prevtask => [...prevtask, newTask]);


        setNewTodoName('');
        setNewKind('Work');
        setNewLevel('Low');
    } 

    const handleDeleteTask = useCallback((id) => {
        setTasks(prevTasks => 
            prevTasks.filter(task => task.id !=id)
        );
    },[]);




    return (
        <div className='flex flex-col p-3'>
            <span className='flex w-full h-12 justify-between overflow-hidden'>
                <div className='text-[#ffffff]'>
                   <h2 className='text-xl font-serif'>To-Do List</h2> 
                   <p className='text-sm text-[#9e9690]'> {done} of 4 done</p>
                </div>
                <button
                    onClick={() => {setIsadding(prev => !prev)}} 
                    className='flex justify-around items-center px-5 rounded-3xl m-1   bg-[#a5693e] hover:bg-[#655549]'><PlusIcon className='w-5 h-5'/> <p>New task</p></button>
            </span>

            {/* Thanh filter loai tasks la cua cong viec hay ca nhan */}

            <div className='flex bg-[#2d2220] p-2 rounded-2xl justify-around mt-2 '>
                {['ALL','Work','Personal'].map((tab) => (
                    <button key={tab} className={`flex-1 py-2 text-sm font-medium rounded-xl hover:bg-[#7d593f] transition-all ${
                        filterTab === tab ? 'bg-[#613b20] text-white':'text-slate-300 hover:text-white'
                    }`}  onClick={() =>{setFilterTab(tab)}}>{tab}</button>
                ))}
            </div>


            {/* O them task nay kia vao */}
            <div className={`${isadding?'box':'hidden'} w-[95%] h-50 bg-[#5b4c44] rounded-2xl m-4 p-3 flex flex-col`}>
                <input 
                    type="text" 
                    value={newTodoName}
                    onChange={(e) => setNewTodoName(e.target.value)}
                    className="border p-2 m-2 rounded-2xl border-[#ae7858]
                        focus:outline-none
                        focus:border-[#ae7858]
                        focus:shadow-[0_0_5px_lightgreen]
                        transition-all duration-300 " 
                    placeholder='What needs to be done?'/>
                {/* tuy chinh nhu do kho va thuoc kieu cong viec */}
                <div className='flex justify-around mt-2 mx-2 space-x-2'>
                    <select className='text-sm flex-1 border border-amber-500/40 rounded-2xl px-2 py-2'
                            value={newKind}
                            onChange={(e) => setNewKind(e.target.value)}>
                        <option value='Personal' className='bg-amber-900/60 hover:bg-amber-400 '> Personal</option>
                        <option value='Work' className='bg-amber-900/60'>Work</option>
                    </select>

                    <select className='text-sm flex-1 border  border-amber-500/40 rounded-2xl px-2 py-2'
                            value={newLevel}
                            onChange={(e) => setNewLevel(e.target.value)}>
                        <option value='High' className='bg-amber-900/60'>High</option>
                        <option value='Medium' className='bg-amber-900/60'>Medium</option>
                        <option value='Low' className='bg-amber-900/60'>Low</option>
                    </select>
                </div>

                <button className='w- p-2 bg-amber-600/60 rounded-2xl m-3 cursor-pointer ' onClick={handleAddTask}>Add Task</button>
            </div>


            {/* component List task chung va phan loai */}
            <div className="w-full min-h-screen m-2 flex flex-col space-y-2 items-center" >
                {displayedTask.map((item) => (
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
                        className={`w-[95%] ${item.iscompleted ? 'line-through bg-[#342111] text-gray-100 opacity-75' : 'bg-[#4b3f35]'} h-20  shadow-2   flex justify-between px-3 py-3 rounded-2xl`}
                    >
                        <div className='flex'> 
                            <Checkbox 
                                checked={item.iscompleted}
                               className='custom-round-checkbox'
                            />
                            <div className='ml-2 '>
                                <h2 className='text-lg'>{item.nametask}</h2>
                                <span className="flex space-x-2 mt-1">
                                    <p className={` ${item.kind === 'Work'?'bg-blue-500/80 text-blue-100 px-2 py-0.5 rounded-2xl border border-blue-950': 'bg-pink-500/50 px-2 py-0.5 rounded-2xl border border-pink-700'} text-xs  font-medium`}>{item.kind}</p>
                                    <p className={`text-xs px-2 py-0.5 rounded-md font-medium ${levelColors[item.level]}`}>{item.level}</p>
                                </span>
                            </div>
                        </div>
                        

                        {/* cho hien 1 icon chinh sua va xoa */}
                        <div className="flex items-center space-x-2">
                            <button className='w-7 h-7 hover:bg-amber-600 rounded-xl flex items-center justify-center'> <Pencil className='w-4 h-4 text-[#f3bc8c]' /></button>
                            <button className='w-7 h-7 hover:bg-amber-600 rounded-xl flex items-center justify-center'
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        handleDeleteTask(item.id);
                                    }}><Trash className='w-4 h-4 text-[#f3bc8c]'></Trash></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tasks;