

const HeaderMobile = ({headerRef}) => {
    return (
        <div ref={headerRef} className='w-full h-full flex items-center justify-between px-4'>
            {/* Logo hoặc tên ứng dụng */}
            <div className='text-lg font-bold tracking-wide'>Per</div>

            {/* Ten trang hien tai */}
            <div className='text-sm tracking-wide'>Home</div>

             {/* icon Avartar */}
            <div className='w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                JD
            </div>            
        </div>
    )

};

export default HeaderMobile;