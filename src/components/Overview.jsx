import { todoAPI } from "../database/fakeDB";
import { useState,useEffect } from "react";

function Overview() {
    const [tasks, setTask] = useState([]);
    const[ bganimate,setBganimate] = useState(0);
    const [cir1,setCir1] = useState(0);
    const [cir2,setCir2] = useState(0);

    // goi du lieu vao state
    useEffect(()=> {
        const fetchdata = async () => {
            try {
                const result =  await todoAPI.getAll();
                //binh thuong se them data.json() nhung do dang lam db gia nen khoi
                setTask(result);
            } catch (err) {
                console.log(err);
            }
        };

        fetchdata();
    },[]);

    //cac bien lien quan
    const total =tasks.length;
    const completed = tasks.filter(task => task.isCompleted).length;
    const remain =total-completed;
    const overoll = completed>0 ? Math.round(completed/total * 100) : 0 ;
    const worktasks = tasks.filter(task => task.category ==='work');
    const worktasksleght= worktasks.length;
    const workdone= worktasks.filter(work => work.isCompleted).length ;
    const personaltasks = tasks.filter(task => task.category ==='personal');
    const personaltasksleght = personaltasks.length;
    const personaldone= personaltasks.filter(personal => personal.isCompleted).length;

    // logic hinh tron
    const radius =80;
    const strokew =16;
    const circumference = 2* Math.PI * radius;
    // phan tram hoan thanh 
    const percentWork = worktasksleght > 0 ? Math.round((workdone/worktasksleght) *100) : 0;
    const percentPersonal = personaltasksleght > 0 ? Math.round(personaldone/personaltasksleght * 100) : 0 ;
    
    
    

    useEffect(() => {
        

        const bgtimer = setTimeout(() => {
            setBganimate(100);
        }, 100);

        const fulltimer= setTimeout(() => {
            setCir1(100);
            setCir2(100);
        }, 500);

        const settimer = setTimeout(() => {
            setCir1(percentWork);
            setCir2(percentPersonal);
        },900);

        return () => {
           
            clearTimeout(bgtimer);
            clearTimeout(fulltimer);
            clearTimeout(settimer);
        }
    },[tasks]);


    const bgdashoffset = circumference - (bganimate/100) * circumference;
    const cir1dashoffset = circumference - (cir1/100) * circumference;
    const cir2dashoffset = circumference - (cir2/100) * circumference;


    return (
        <div className='w-full flex flex-col justify text-2xl  font-bold text-white'>
            {/* thong tin task */}
            <div className='w-full h-[100px] flex justify-around items-center text-2xl font-bold text-white m-5'>
                <div className='w-50 h-25 rounded-2xl  bg-slate-400 flex flex-col p-2'>
                    <h2>TOTAL TASK</h2>
                    <span>{total}</span>
                </div>

                <div className='w-50 h-25 rounded-2xl  bg-slate-400 flex flex-col p-2'>
                    <h2>COMPELETED</h2>
                    <span>{completed}</span>
                </div>

                <div className='w-50 h-25 rounded-2xl  bg-slate-400 flex flex-col p-2 '>
                    <h2>REMAINING</h2>
                    <span>{remain}</span>
                </div>

                <div className='w-50 h-25 rounded-2xl  bg-slate-400 flex flex-col p-2'>
                     <h2>OVERROLL</h2>
                    <span>{overoll}%</span>
                </div>
            </div>
            {/* phan tram task cong viec va viec ca nhan */}
            <div className='w-full h-25 flex space-x-5 justify-center'> 
                <div className="w-80 h-50 bg-slate-600 rounded-2xl flex flex-col p-3 relative">
                    <span>WORK TASK</span>
                    <svg className="w-fulln transform -rotate-90" viewBox="0 0 200 200">
                        <circle 
                            cx='100' 
                            cy='100' 
                            r={radius}
                            fill='transparent'
                            className='stroke-white transition-all duration-500 ease-in'
                            strokeWidth={strokew}
                            strokeDasharray={circumference}
                            strokeDashoffset={bgdashoffset}
                            />
                        <circle
                            r={radius}
                            cx='100'
                            cy='100'
                            fill="transparent"
                            strokeWidth={strokew}
                            className="stroke-[#5792F6] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
                            strokeDasharray={circumference}
                            strokeDashoffset={cir1dashoffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className='mx-auto'>{workdone} of {worktasksleght} done</span>
                </div>

                <div className="w-80 h-50 bg-slate-600 rounded-2xl flex flex-col p-3 relative">
                    <span>PERSONALS TASK</span>
                    <svg className="w-fulln transform -rotate-90" viewBox="0 0 200 200">
                        <circle 
                            cx='100' 
                            cy='100' 
                            r={radius}
                            fill='transparent'
                            className='stroke-white transition-all duration-500 ease-in'
                            strokeWidth={strokew}
                            strokeDasharray={circumference}
                            strokeDashoffset={bgdashoffset}
                            />
                        <circle
                            r={radius}
                            cx='100'
                            cy='100'
                            fill="transparent"
                            strokeWidth={strokew}
                            className="stroke-[#5792F6] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
                            strokeDasharray={circumference}
                            strokeDashoffset={cir2dashoffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className='mx-auto'>{personaldone} of {personaltasksleght} done</span>

                </div>
                <div className="w-80 h-50 bg-slate-600 rounded-2xlflex flex-col p-3 relative"> 
                    <p>lich tuan suat lam viec tim hieu sau</p>

                </div>
            </div>
        </div>
    )
}

export default Overview;