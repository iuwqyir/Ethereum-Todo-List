App = {
	loading: false,
	contracts: {},

	load: async () => {
		await App.loadWeb3();
		await App.loadAccount();
		await App.loadContract();
		await App.render();
	},

	//https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
	loadWeb3: async () => {
		if (typeof web3 !== 'undefined') {
			App.web3Provider = web3.currentProvider;
			web3 = new Web3(web3.currentProvider);
		} else {
			window.alert('Please connect to Metamask');
		}
		// Modern dapp browsers...
	    if (window.ethereum) {
	        window.web3 = new Web3(ethereum);
	        try {
	            // Request account access if needed
	            await ethereum.enable();
	            // Acccounts now exposed
	            web3.eth.sendTransaction({/* ... */});
	        } catch (error) {
	            // User denied account access...
	        }
	    }
	    // Legacy dapp browsers...
	    else if (window.web3) {
	        window.web3 = new Web3(web3.currentProvider);
	        // Acccounts always exposed
	        web3.eth.sendTransaction({/* ... */});
	    }
	    // Non-dapp browsers...
	    else {
	        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
	    }
	},

	loadAccount: async () => {
		App.account = web3.eth.accounts[0];
	},

	loadContract: async () => {
		const todoList = await $.getJSON('TodoList.json');
		App.contracts.TodoList = TruffleContract(todoList);
		App.contracts.TodoList.setProvider(App.web3Provider);
		App.todoList = await App.contracts.TodoList.deployed();
	},

	render: async () => {
		//prevent double render
		if (App.loading) {
			return;
		}

		App.setLoading(true);
		$('#account').html(App.account);
		await App.renderTodoItems();
		App.setLoading(false);
	},

	renderTodoItems: async () => {
		const todoCount = await App.todoList.todoItemCount();
		const $todoTemplate = $('.todoTemplate');

		for (var i = 0; i < todoCount; i++) {
			const todoItem = await App.todoList.todoItems(i);
			const id = todoItem[0].toNumber();
			const title = todoItem[1];
			const content = todoItem[2];
			const isCompleted = todoItem[3];
			
			const $newTodoTemplate = $todoTemplate.clone();
			$newTodoTemplate.find('.todo-title').html(title);
			$newTodoTemplate.find('.todo-content').html(content);
			$newTodoTemplate.find('input')
							.prop('name', id)
							.prop('checked', isCompleted)
							.on('click', App.toggleCompleted)
			
			if (isCompleted) {
				$('#completedTodoList').append($newTodoTemplate);
			} else {
				$('#todoList').append($newTodoTemplate);
			}

			$newTodoTemplate.show();
		}

	},

	createTodoItem: async () => {
		App.setLoading(true);
		const title = $('#newTodoItemTitle').val();
		const content = $('#newTodoItemContent').val();
		await App.todoList.createTodoItem(title, content);
		window.location.reload();
	},

	toggleCompleted: async (e) => {
		App.setLoading(true);
		const itemId = e.target.name;
		await App.todoList.toggleCompleted(itemId);
		window.location.reload();
	},

	setLoading: (boolean) => {
		App.loading = boolean;
		const loader = $('#loader');
		const content = $('#content');
		if (boolean) {
			loader.show();
			content.hide();
		} else {
			loader.hide();
			content.show();
		}
	}
}

$(() => {
	$(window).load(() => {
		App.load();
	})
})