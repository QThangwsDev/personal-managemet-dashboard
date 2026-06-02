import {  MenuOutlined} from '@ant-design/icons';
const SidebarMoblie = ({navItems}) => {

   

    return (
        <div className='w-full h-full text-black flex items-center justify-around '>
            {/* icon tac vu dieu huong navigate */}
            <div className='w-full h-full bg-white text-black flex items-center justify-around rounded-sm'>
                {/* doi sang navlink khi chinh sua */}
               {navItems.map(item => (
                <div key={item.id} className='flex flex-col items-center cursor-pointer justify-center space-y-1'>
                    {item.icon} {item.label}
                </div>
               ))}
            </div>


            {/* nut mo Menu cai dat*/}
            <button className='w-25 h-full bg-white text-black cursor-pointer rounded-sm flex flex-col items-center justify-center'>
                <MenuOutlined />
                <span className='ml-1'>Menu</span>
            </button>
        </div>
    
    )

}

export default SidebarMoblie;