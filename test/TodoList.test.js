const TodoList = artifacts.require('./TodoList.sol');

contract('TodoList', (accounts) => {
	before(async () => {
		this.todoList = await TodoList.deployed();
	});

	it('deploys successfully', async () => {
		const address = await this.todoList.address;
		assert.notEqual(address, 0x0);
		assert.notEqual(address, '');
		assert.notEqual(address, null);
		assert.notEqual(address, undefined);
	});

	it('lists todo items', async () => {
		const todoItemCount = await this.todoList.todoItemCount();
		const todoItem = await this.todoList.todoItems(todoItemCount - 1);
		assert.equal(todoItem.id.toNumber() + 1, todoItemCount.toNumber());
		assert.equal(todoItem.title, 'MyFirstTodoItem');
		assert.equal(todoItem.content, 'Do it fast!');
		assert.equal(todoItem.isCompleted, false);
		assert.equal(todoItemCount.toNumber(), 1);
	});
});