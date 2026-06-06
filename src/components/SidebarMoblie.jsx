import {  MenuOutlined} from '@ant-design/icons';
import { NavLink } from 'react-router-dom';


const SidebarMoblie = ({navItems}) => {

   

    return (
        <div className='w-full h-full text-black flex items-center justify-around '>
            {/* icon tac vu dieu huong navigate */}
            <div className='w-full h-full bg-white text-black flex items-center justify-around rounded-sm'>
                {/* doi sang navlink khi chinh sua */}
               {navItems.map(item => (
                <NavLink to={item.to} key={item.id}
                        end={item.to === '/'}
                        className={({isActive}) =>
                        `flex flex-col items-center cursor-pointer justify-center space-y-1 ${isActive ? 'scale-1.2 font-bold text-[#ff7300]': ''}`
                         }>
                    {item.icon} {item.label}
                </NavLink>
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