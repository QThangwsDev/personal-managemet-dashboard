import { useState , useEffect } from "react";
import { todoAPI } from "../database/fakeDB";



const TodoList = ()=> {

    const [tasks, setTask]= useState([]);
    const [textinput, setTextinput] = useState('');
    const [isLoading ,setLoading] = useState(true)
    const [selectindex, setSelectindex] = useState(null);
    const [error, setError] = useState(null);

    const taskcomp = tasks.filter(item => item.isCompleted).length;
    const process = tasks.length > 0 ? Math.round((taskcomp/tasks.length) * 100 ) : 0 ;

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await todoAPI.getAll();
                setTask(data);
            } catch (err) {
                setError("Loi tai du lieu")
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    },[]);


    

  

    return (
        <div className='w-full flex justify-center items-center '>
            <div className="max-w-[500px] min-h-[400px] bg-gray-700 opacity-90 rounded-tl-lg rounded-tr-lg p-5 text-xl space-y-3 font-bold text-white">
                {/*title*/}
                <div className='flex space-x-3'>
                    <div className='w-15 h-15 rounded-2xl  bg-blue-400'/>
                    <div className='flex flex-col justify-start'>
                        <h1 className='text-3xl font-bold'>Todolist</h1>
                        <p className='text-sm  font-serif'>Stay Productive</p>
                    </div>
                </div>

                {/* total task*/}
                <div className=' flex justify-around space-x-3'>
                    {/* item stat */}
                    <div className='w-[100px] h-[100px] bg-slate-800 rounded-2xl flex flex-col justify-center items-center'>
                        <p className='text-blue-400'>{tasks.length}</p>
                        <p>Total</p>
                    </div>

                    <div className='w-[100px] h-[100px] bg-slate-800 rounded-2xl flex flex-col justify-center items-center'>
                        <p className='text-green-400'>{taskcomp}</p>
                        <p>Done</p>
                    </div>

                    <div className='w-[100px] h-[100px] bg-slate-800 rounded-2xl flex flex-col justify-center items-center'>
                        <p className='text-blue-400'>{process}%</p>
                        <p>Process</p>
                    </div>
                </div>
                {/*List*/}
                <div className='flex flex-col'>
                    <h2>Danh sach viec lam</h2>
                    <ul className="flex w-fulls flex-col justify-start items-start space-y-2">
                        {tasks.map((item,index) => (
                            <li className={`w-full bg-gray-500 p-3 rounded-xl flex-1 ${item.isCompleted ? `line-through text-gray-100 opacity-75`:''}`} key={item.id}>{index + 1}. {item.text.length >25 ? item.text.substring(0,25)+'...': item.text}</li>
                        ))}
                    </ul>
                </div>

                {/* khu vuc thuc hien CRUD */}
                <div className="w-full">
                    <div className='flex justify-between'>
                         <span className='text-sm'>TRANG THAI</span>
                        <span className={`text-sm ${ selectindex !== null ? `text-yellow-300`:'text-green-500' }`}>{selectindex !== null ? "CHỈNH SỮA" :"THÊM MỚI"}</span>
                    </div>
                   
                    <div className="flex mt-2">
                        <label className='text-sm'>Chon Muc tieu:</label>
                        <select className='w-full bg-slate-600 text-white' 
                                value={selectindex ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if( val ==='') {
                                        setTextinput('');
                                        setSelectindex(null)
                                    } else {
                                        const idx = parseInt(val);
                                        setSelectindex(idx);
                                        setTextinput(tasks[idx].text)
                                    }
                                }}>
                                <option value=''>Chọn để chỉnh sửa or xóa</option>    
                            {tasks.map((item,index) => (
                                <option className='text-white' value={index} key={item.id}>{item.text}</option>
                            ))}
                        </select>
                    </div>


                    <div className='w-full flex flex-col space-y-1'>
                        <label className='text-sm font-medium text-gray-300'>Nội dung công việc:</label>
                        <input 
                            className='w-full bg-gray-600 border border-gray-500 rounded p-2 text-base outline-none font-normal' 
                            type="text" 
                            name="textinput"  
                            placeholder={selectindex !== null ? 'Nhập nội dung thay đổi...' : 'Nhập công việc mới vào...'} 
                            value={textinput}
                            onChange={(e) => setTextinput(e.target.value)}
                        />
                    </div>
                    


                    <div className='flex justify-evenly'>
                        <button className='bg-green-700 rounded-lg px-3'>Update/Add</button>
                        <button className='bg-red-700 rounded-lg px-3'>Delete</button>
                    </div>
                </div>

            </div>
        </div>
    )


}
export default TodoList;