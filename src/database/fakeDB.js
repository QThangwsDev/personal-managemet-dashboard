// src/database.js


let todoStorage = [
  { id: 1, text: "Học Front-End nâng cao với React Vite", isCompleted: false },
  { id: 2, text: "Cấu hình thành công Tailwind v4 và Ant Design", isCompleted: true },
  { id: 3, text: "Đẩy toàn bộ source code dự án lên GitHub", isCompleted: true },
  { id: 4, text: "Hoc Back-end di nhat la java ay", isCompleted: false },
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
  create: async (text) => {
    await delay(600);
    const newTodo = {
      id: Date.now(), // Tạo ID duy nhất bằng timestamp
      text: text,
      isCompleted: false
    };
    todoStorage.push(newTodo);
    return newTodo;
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