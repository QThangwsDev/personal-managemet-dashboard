const Avatar = ({ collapse}) => {
  return (
    
    <div className={`flex items-center border-b border-gray-700 py-3 ${collapse ? 'justify-center' : 'space-x-3 px-5'}`}>
      <div>
          {/* Giữ nguyên SVG hình tròn đại diện của bạn */}
          <svg className='w-12 h-12 text-gray-400 fill-current' viewBox="0 0 100 100">
              <circle cy='50' cx='50' r='35' />
          </svg>
      </div>

      {/* Thong tin ng dung */}
      {!collapse && (
        <div className='flex flex-col text-white'>
          <h2 className="font-semibold text-sm whitespace-nowrap">Mir Melody</h2>
          <p className='font-light italic text-xs text-gray-400'>Khong nao</p>
      </div>
      )}
      
      
    </div>
  );
}

export default Avatar;