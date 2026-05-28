import Overview from "../components/overview";
import { useState } from "react";

function Userlayout() {
    const [collapse, setCollapse] = useState(true);

    const handletoggle = (e) => {
        e.stopPropagation(); // Chặn sủi bọt để không kích hoạt click của main
        setCollapse(!collapse);
    }

    const handlecollapse = () => {
        if(collapse){
            setCollapse(false);
        }
    }


  return (
    <div className='w-full h-full bg-amber-900 text-white flex overflow-hidden'>
        <aside className={`${collapse? 'w-80' : 'w-20'} h-full bg-[#40240E] transition-all duration-200 ease-in-out relative overflow-hidden`}>
            {/* logo va ten app */}
            <div className='w-full h-[100px] flex justify-center items-center text-2xl font-bold text-white border-b-1 border-gray-500'>
                <h1 className='text-3xl font-bold text-center py-5'>Logo</h1>  
            </div>
            <div className='w-full h-[100px] flex justify-center items-center text-2xl font-bold border-b-1 border-gray-500'>Information User</div>
            
            <button className='p-2 bg-amber-300 rounded-2xl absolute bottom-0' 
                    onClick={handletoggle}>dong</button>
        </aside>
        {/* noi dung hien thi */}
        <div className='w-full bg-amber-800 h-full flex flex-col'
             onClick={handlecollapse}>
            <header className='w-full h-20 flex justify-center items-center text-2xl font-bold border-b-1 border-gray-500'>loi chao va thong tin ngay thang</header>
            <main className='w-full h-[calc(100%-120px)]'>
                <Overview/>
            </main>
        </div>
    </div>
  )
}

export default Userlayout;