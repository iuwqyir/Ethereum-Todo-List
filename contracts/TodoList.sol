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

	constructor() public {
		createTodoItem("MyFirstTodoItem", "Do it fast!");
	}

	function createTodoItem(string memory _title, string memory _content) public {
		todoItems[todoItemCount] = TodoItem(todoItemCount, _title, _content, false);
		todoItemCount++;
	}
}

