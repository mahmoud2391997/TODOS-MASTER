interface User {
  id: string
  name: string
  email: string
  password: string
  phone: string
  todoList: ToDoItem[]
}
interface ToDoItem {
  id: string
  title: string
  description: string
  status: "completed" | "pending"
  dueDate: Date
  createdAt: Date
}
