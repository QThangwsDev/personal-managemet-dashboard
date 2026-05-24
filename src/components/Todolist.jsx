import { useState , useEffect } from "react";
import { todoAPI } from "../database/fakeDB";



const TodoList = ()=> {

    const [tasks, setTask]= useState([]);
    const [textinput, setTextinput] = useState('');
    const [isLoading ,setLoading] = useState(true)
    const [selectindex, setSelectindex] = useState(null);
    const [error, setError] = useState(null)

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
            <div className="min-w-[500px] min-h-[400px] bg-gray-700 opacity-90 rounded-tl-lg rounded-tr-lg p-5 text-xl space-y-3 font-bold text-white">
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
                        <p className='text-blue-400'>4</p>
                        <p>Total</p>
                    </div>

                    <div className='w-[100px] h-[100px] bg-slate-800 rounded-2xl flex flex-col justify-center items-center'>
                        <p className='text-green-400'>2</p>
                        <p>Done</p>
                    </div>

                    <div className='w-[100px] h-[100px] bg-slate-800 rounded-2xl flex flex-col justify-center items-center'>
                        <p className='text-blue-400'>50%</p>
                        <p>Process</p>
                    </div>
                </div>
                {/*List*/}
                <div className='flex flex-col'>
                    <h2>Danh sach viec lam</h2>
                    <ul className="flex w-fulls flex-col justify-start items-start space-y-2">
                        {tasks.map((item) => (
                            <li className='w-full bg-gray-500 p-3 rounded-xl flex-1 decoration:' key={item.id}>{item.text}</li>
                        ))}
                    </ul>
                </div>

                {/* khu vuc thuc hien CRUD */}
                <div>
                    <div className='flex justify-between'>
                         <span className='text-sm'>TRANG THAI</span>
                        <span className='text-sm'>CHE DO:THEM MOi</span>
                    </div>
                   
                    <div className="flex mt-2">
                        <label className='text-sm'>Chon Muc tieu:</label>
                        <select className='w-full bg-amber-200'>
                            <option>alo</option>
                        </select>
                    </div>


                    <div className='w-full flex m-10'>
                        <input className=' bg-gray-600 ' type="text" name="textinput"  placeholder='Nhap thong tin vao' />
                    </div>
                    <div className='flex justify-evenly'>
                        <button className='bg-green-700 rounded-lg px-3'>Update</button>
                        <button className='bg-red-700 rounded-lg px-3'>Delete</button>
                    </div>
                </div>

            </div>
        </div>
    )


}
export default TodoList;