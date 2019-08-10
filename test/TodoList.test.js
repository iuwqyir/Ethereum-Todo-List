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

	it('creates tasks', async () => {
		const result = await this.todoList.createTodoItem('Go shopping', 'Buy apples & oranges');
		const todoCount = await this.todoList.todoItemCount();
		assert.equal(todoCount, 2);
		const event = result.logs[0].args;
		assert.equal(event.id.toNumber(), 1);
		assert.equal(event.title, 'Go shopping');
		assert.equal(event.content, 'Buy apples & oranges');
		assert.equal(event.isCompleted, false);
	});
});