// src/database.js

// 1. Thêm mốc thời gian createdAt (giả lập số mili giây tăng dần để phân biệt trước/sau)
let todoStorage = [
    { id: 1, nametask: "Review Q2 marketing brief", kind: "Work", iscompleted: true, level: "Medium", createdAt: 1717658400000 },
    { id: 2, nametask: "Finalize Milo Creative proposal", kind: "Work", iscompleted: false, level: "High", createdAt: 1717658410000 },
    { id: 3, nametask: "Send invoice to Westfield Co.", kind: "Work", iscompleted: true, level: "Medium", createdAt: 1717658420000 },
    { id: 4, nametask: "tiet kiem tien nuoi em", kind: "Personal", iscompleted: false, level: "Low", createdAt: 1717658430000 },
    { id: 5, nametask: "Mua machca latte", kind: "Personal", iscompleted: false, level: "Low", createdAt: 1717658440000 },
    { id: 6, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false, level: "Medium", createdAt: 1717658450000 },
    { id: 7, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false, level: "High", createdAt: 1717658460000 },
    { id: 8, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false, level: "Low", createdAt: 1717658470000 },
    { id: 9, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false, level: "Low", createdAt: 1717658480000 },
    { id: 10, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false, level: "Low", createdAt: 1717658490000 },
    { id: 11, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false, level: "Low", createdAt: 1717658500000 },
    { id: 12, nametask: "Mua đồ ăn tối", kind: "Personal", iscompleted: false, level: "Low", createdAt: 1717658510000 },
    { id: 13, nametask: "vat thu 13", kind: "Personal", iscompleted: false, level: "Low", createdAt: 1717658520000 },
];


// Hàm tiện ích tạo độ trễ mạng ngẫu nhiên từ 300ms - 800ms cho giống API thật
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 2. Các hàm "Giả Lập API" (Mock API endpoints)
export const todoAPI = {
  
  // LẤY DANH SÁCH: GET /api/todos
  getAll: async () => {
    await delay(500); 
    // Trả về một bản sao của mảng để tránh component chỉnh sửa trực tiếp vào gốc
    return [...todoStorage];
  },

  // THÊM MỚI: POST /api/todos
  // Nhận vào full Object newTask từ client truyền lên (gồm id tự tăng, nametask, kind, level, createdAt)
  create: async (newTask) => {
    await delay(600);
    
    // Đẩy Object chuẩn từ Client gửi lên thẳng vào mảng lưu trữ
    todoStorage.push(newTask);
    return newTask;
  },

  // CẬP NHẬT (Sửa chữ hoặc Bật/Tắt Hoàn thành): PUT /api/todos/:id
  update: async (id, updatedFields) => {
    await delay(400);
    todoStorage = todoStorage.map(todo => 
      todo.id === id ? { ...todo, ...updatedFields } : todo
    );
    // Trả về item sau khi đã sửa xong
    return todoStorage.find(todo => todo.id === id);
  },

  // XÓA: DELETE /api/todos/:id
  delete: async (id) => {
    await delay(500);
    todoStorage = todoStorage.filter(todo => todo.id !== id);
    return { success: true, id };
  }
};