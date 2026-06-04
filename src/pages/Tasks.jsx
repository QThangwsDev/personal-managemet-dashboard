import { PlusIcon } from "lucide-react";
import {useState} from 'react'
import { Checkbox } from "antd";



const Tasks = () => {

    // state qua ly du lieu truyen vao nay kia
    const [tasks, setTasks] = useState([
        { id: 1, nametask: "Review Q2 marketing brief", kind: "Work", iscompleted: true , level: "Medium" },
        { id: 2, nametask: "Finalize Milo Creative proposal", kind: "Work", iscompleted: false, level: "Hight" },
        { id: 3, nametask: "Send invoice to Westfield Co.", kind: "Work", iscompleted: true, level: "Medium" },
        { id: 4, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false , level: "Easy" },
    ]);

    const [filterTab, setFilterTab] = useState('ALL');

    const displayedTask = tasks.filter(task =>{
        if (filterTab === 'ALL') return true;
        return task.kind === filterTab ;
    }
    );


    return (
        <div className='flex flex-col p-3'>
            <span className='flex w-full h-12 justify-between overflow-hidden'>
                <div className='text-[#ffffff]'>
                   <h2 className='text-xl font-serif'>To-Do List</h2> 
                   <p className='text-sm text-[#9e9690]'> 1 of 4 done</p>
                </div>
                <button className='flex justify-around items-center px-5 rounded-3xl m-1   bg-[#a5693e] hover:bg-[#655549]'><PlusIcon className='w-5 h-5'/> <p>New task</p></button>
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



            {/* component List task chung va phan loai */}
            <div className="w-full min-h-screen m-2 flex flex-col space-y-2 items-center">
                {displayedTask.map((item) => (
                    <div key={item} className='w-[95%] h-18 bg-[#4b3f35] shadow-2   flex p-5 rounded-2xl'>
                        <Checkbox 
                               className='
                                    rounded-fulL
                                    border-pink-500'
                            />
                        <div className='ml-2'>
                            <h2>{item.nametask}</h2>
                            <span className="flex space-x-2">
                                <p>{item.kind}</p>
                                <p>{item.level}</p>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tasks;