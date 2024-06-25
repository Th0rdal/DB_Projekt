class Stack {
  constructor() {
    this.items = [];
  }

  // Add an element to the top of the stack
  push(element) {
    this.items.push(element);
  }

  // Remove and return the top element of the stack
  async pop() {
    if (this.isEmpty()) {
      throw new Error('Stack underflow');
    }
    return this.items.pop();
  }

  // Return the top element of the stack without removing it
  peek() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty');
    }
    return this.items[this.items.length - 1];
  }

  // Check if the stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Return the size of the stack
  size() {
    return this.items.length;
  }

  // Empty the stack
  clear() {
    this.items = [];
  }
}

module.exports = Stack;
