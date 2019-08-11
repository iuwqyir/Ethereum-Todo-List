pragma solidity ^0.5.0;

/**
 * The TodoList contract
 */
contract TodoList {
	struct TodoItem {
		uint id;
		string title;
		string content;
		bool isCompleted;
	}
	uint public todoItemCount = 0;
	mapping (uint => TodoItem) public todoItems;

	event TodoItemCreated(
		uint id,
		string title,
		string content,
		bool isCompleted
	);

	event TodoItemToggled(
		uint id,
		bool completed
	);

	constructor() public {
		createTodoItem("MyFirstTodoItem", "Do it fast!");
	}

	function createTodoItem(string memory _title, string memory _content) public {
		todoItems[todoItemCount] = TodoItem(todoItemCount, _title, _content, false);
		emit TodoItemCreated(todoItemCount, _title, _content, false);
		todoItemCount++;
	}

	function toggleCompleted(uint _id) public {
		TodoItem memory _item = todoItems[_id];
		_item.isCompleted = !_item.isCompleted;
		todoItems[_id] = _item;
		emit TodoItemToggled(_id, _item.isCompleted);
	}
}

