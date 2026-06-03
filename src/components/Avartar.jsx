const Avatar =() => {
  return (
    <div className={`flex items-center border-b-1 space-x-3 `}>
      <div>
          <svg className='w-15 h-15 '  viewBox="0 0 100 100">
              <circle 
                  cy='50'
                  cx='50'
                  r='35'
                  />
          </svg>
      </div>
    {/* Thong tin nguoi dung */}
      <div className="flex flex-col">
        <h2>Mir Melody</h2>
        <p className='font-light italic'>Khong nao</p>
      </div>
    </div>
  );
}

export default Avatar;