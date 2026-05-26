import { useReducer , useEffect } from "react";
import { todoAPI } from "../database/fakeDB";

const initialstate = {
    tasks:[],
    selectindex :null,
    textInput: '',
    isLoading: false,
    error: null
};




function reducer(state,action) {
    switch(action.type){
        case 'START_FETCH':
            return{
                ...state,
                isLoading:true,
                error: null,
            };
        
        case 'SUCCESS_FETCH':
            return{
                ...state,
                tasks: action.payload,
                isLoading: false,
            };
        case 'ERROR_FETCH':
            return{
                ...state,
                isLoading: false,
                error: true,
            };
        case 'CHANGE_INPUT':
            return{
                ...state,
                textInput: action.payload,
            };
        case 'CHANGE_SELECT':{
            const idx = action.payload;
            return{
                ...state,
                selectindex: idx,
                textInput: idx === null ?'': state.tasks[idx].text,
            };}
        case 'TOGGLE_TASK':
            return {
                ...state,
                tasks: state.tasks.map(task => 
            task.id === action.payload ? { ...task, isCompleted: !task.isCompleted } : task
        )
            }
        case 'UPDATE':{
            if(!state.textInput.trim()) return state;

            const updatetask =[...state.tasks];
            const nextid = state.tasks.length > 0 ? Math.max(...state.tasks.map( t => t.id)) + 1 : 1;
            if(state.selectindex === null){
                // add new task
                updatetask.push({
                    id : nextid,
                    text: state.textInput,
                    isCompleted: false,
                });
            } else {
                // update existing task
                const idx = state.selectindex;
                if(updatetask[idx]){
                    updatetask[idx] = {
                        ...updatetask[idx],
                        text: state.textInput,
                    };
                }
            }
            // cap nhat task da chinh or sua len luon va chinh lai ca thu khac ve trang thai mac dih
            return {
                ...state,
                tasks: updatetask,
                textInput: '',
                selectindex: null,
            };
        }
        case 'DELETE': {
            if(state.selectindex === null) return state;

            const Deleted = state.tasks.filter((_,index) => index !== state.selectindex)
            return{
                ...state,
                tasks: Deleted,
                selectindex: null,
                textInput:''
            }
        }
        default: return state;
    }
}



function List () {

    const [state,dispatch] = useReducer(reducer,initialstate);


    // goi cac bien trong state ra cho de su dung
    const {tasks,textInput, selectindex,isLoading,error} = state;

    useEffect(() => {
        const fetchTask = async () => {
            // goi len hanh dong de biet bat dau lay du lieu de render skeleton
            dispatch({type:'START_FETCH'})
            try {
                const data = await todoAPI.getAll();
                dispatch( {type:'SUCCESS_FETCH',payload: data});
                } catch (err) {
                    console.log(err)
                    dispatch({type:'ERROR_FETCH'});
                }
            }
        fetchTask();
        },[]);

        const done =tasks.filter(task => task.isCompleted).length;
        const process = tasks.length > 0 ? Math.round(done/tasks.length * 100): 0;
        const remaining = tasks.length - done;

    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;


    const togleTask = (id) => {
        
        dispatch({type:'TOGGLE_TASK', payload :id});
    }
    
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
                        <p className='text-green-400'>{done}</p>
                        <p>Done</p>
                    </div>

                    <div className='w-[100px] h-[100px] bg-slate-800 rounded-2xl flex flex-col justify-center items-center'>
                        <p className='text-blue-400'>{remaining}</p>
                        <p>Remaining</p>
                    </div>

                    <div className='w-[100px] h-[100px] bg-slate-800 rounded-2xl flex flex-col justify-center items-center'>
                        <p className='text-blue-400'>{process}%</p>
                        <p>Process</p>
                    </div>
                </div>
                {/*List*/}
                <div className='flex flex-col'>
                    <h2>Danh sach viec lam</h2>
                    <ul className="flex w-full flex-col justify-start items-start space-y-2">
                        {isLoading ? (
                            /* --- TRẠNG THÁI ĐANG TẢI: Hiển thị 3 hàng Skeleton giả lập --- */
                            <>
                                <li className="w-full bg-gray-600/50 p-3 rounded-xl h-[52px] animate-pulse" />
                                <li className="w-full bg-gray-600/50 p-3 rounded-xl h-[52px] animate-pulse" />
                                <li className="w-full bg-gray-600/50 p-3 rounded-xl h-[52px] animate-pulse" />
                                <li className="w-full bg-gray-600/50 p-3 rounded-xl h-[52px] animate-pulse" />
                            </>
                        ) : (
                            /* --- TRẠNG THÁI ĐÃ TẢI XONG: Hiển thị danh sách thực tế --- */
                            tasks.map((item, index) => (
                                <button 
                                    className={`w-full bg-gray-500 p-3 rounded-xl flex-1 cursor-pointer transition-all text-left ${
                                        item.isCompleted ? 'line-through text-gray-100 opacity-75' : ''
                                    } focus:outline-none focus:ring-2 focus:ring-blue-300`} 
                                    key={item.id}
                                    aria-pressed={item.isCompleted}
                                    onClick={() => togleTask(item.id)}
                                >
                                    {index + 1}. {item.text.length > 25 ? item.text.substring(0, 25) + '...' : item.text}
                                </button>
                            ))
                        )}
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
                                        dispatch({type:'CHANGE_SELECT' , payload: null})
                                    } else {
                                        dispatch({type:'CHANGE_SELECT', payload: parseInt(val) })
                                    }
                                }}>
                                <option value=''>Chọn để chỉnh sửa or xóa</option>    
                            {tasks.map((item,index) => (
                                <option className={`${!item.isCompleted ?'text-white ':`cursor-not-allowed opacity-80 text-slate-300 line-through`}`} value={index} key={item.id}>{item.text}</option>
                            ))}
                        </select>
                    </div>


                    <div className='w-full flex flex-col space-y-1'>
                        <label htmlFor="todo-input" className='text-sm font-medium text-gray-300'>Nội dung công việc:</label>
                        <input 
                            id="todo-input"
                            className='w-full bg-gray-600 border border-gray-500 rounded p-2 text-base outline-none font-normal' 
                            type="text" 
                            name="textinput"  
                            placeholder={selectindex === null ? 'Nhập công việc mới vào...' : 'Nhập nội dung thay đổi...'} 
                            value={textInput}
                            onChange={(e) =>{
                                dispatch({type: 'CHANGE_INPUT',  payload: e.target.value})
                            }}
                        />
                    </div>
                    


                    <div className='flex justify-evenly my-2'>
                        <button className='bg-green-700 rounded-lg px-3' onClick={()=> dispatch({type: 'UPDATE'})}>{selectindex !== null ?"Update":"Add"}</button>
                        <button className={`bg-red-700 rounded-lg px-3 ${selectindex === null ?`opacity-50 cursor-not-allowed`:''}`} onClick={() => dispatch({type:'DELETE'})} disabled={selectindex === null}>Delete</button>
                    </div>
                </div>

            </div>
        </div>
    )


}
export default List;