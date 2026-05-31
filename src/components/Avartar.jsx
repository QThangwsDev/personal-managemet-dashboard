

// Nhận vào prop 'isOpen' từ Aside cha để biết đang mở rộng hay thu nhỏ
export default function Avatar({ isOpen = true }) {
  return (
    <div className={`flex items-center space-x-3 transition-all duration-300
      ${isOpen ? 'justify-start px-4 opacity 100' : 'justify-center px-0 '}`}
    >
      {/* Vòng tròn Avatar - Luôn hiển thị */}
      <div className="w-10 h-10 rounded-full bg-amber-200 flex-shrink-0">
        {/* Có thể thêm ảnh <img> ở đây */}
      </div>

      {/* Vùng chứa Tên + Slogan - Ẩn khi aside thu nhỏ */}
      <div className={`flex flex-col transition-opacity duration-600
        ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}
      >
        <p className="text-white text-base font-medium whitespace-nowrap">Mirna Koloba</p>
        <p className="text-slate-400 text-xs font-light whitespace-nowrap">slogan myself</p>
      </div>
    </div>
  );
}