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
		const newItemIndex = await this.todoList.newItemIndex();
		const todoItemCount = await this.todoList.todoItemCount();
		const todoItem = await this.todoList.todoItems(newItemIndex - 1);
		assert.equal(todoItem.id.toNumber() + 1, newItemIndex.toNumber());
		assert.equal(todoItem.title, 'MyFirstTodoItem');
		assert.equal(todoItem.content, 'Do it fast!');
		assert.equal(todoItem.isCompleted, false);
		assert.equal(newItemIndex.toNumber(), 1);
		assert.equal(todoItemCount.toNumber(), 1);
	});

	it('creates todo items', async () => {
		const result = await this.todoList.createTodoItem('Go shopping', 'Buy apples & oranges');
		const newItemIndex = await this.todoList.newItemIndex();
		const todoItemCount = await this.todoList.todoItemCount();
		assert.equal(newItemIndex.toNumber(), 2);
		assert.equal(todoItemCount.toNumber(), 2);
		const event = result.logs[0].args;
		assert.equal(event.id.toNumber(), 1);
		assert.equal(event.title, 'Go shopping');
		assert.equal(event.content, 'Buy apples & oranges');
		assert.equal(event.isCompleted, false);
	});

	it('toggles todo item completed', async () => {
		const result = await this.todoList.toggleCompleted(1);
		const todoItem = await this.todoList.todoItems(1);
		assert.equal(todoItem.isCompleted, true);
		const event = result.logs[0].args;
		assert.equal(event.id.toNumber(), 1);
		assert.equal(event.completed, true);
	});

	it('deletes todo item', async () => {
		const result = await this.todoList.deleteTodoItem(1);
		const todoItemCount = await this.todoList.todoItemCount();
		const newItemIndex = await this.todoList.newItemIndex();
		assert.equal(newItemIndex.toNumber(), 2);
		assert.equal(todoItemCount.toNumber(), 1);
	});
});