// Function to attach event listeners to the question name for editing
export function attachQuestionNameEventListeners(questionContainer) {
	const questionName = questionContainer.querySelector("#selected-question-name")
	if (questionName) {
		addLongPressListener(questionName) // long press to edit
	}
}

// Function to attach event listeners to the answer items for toggling and editing
export function attachAnswerEventListeners(questionContainer) {
	const answerItems = questionContainer.querySelectorAll(".answer")
	answerItems.forEach((answerItem) => {
		if (answerItem.parentElement) {
			addLongPressListener(answerItem) // Long press to edit the answer text
			answerItem.parentElement.addEventListener("click", () => {
				toggleRightWrong(answerItem.parentElement) // Toggle right/wrong class on the answer container
			})
			answerItem.parentElement.addEventListener("touchend", () => {
				// Touchend event for mobile devices
				toggleRightWrong(answerItem.parentElement)
			})
		}
	})
}

// Function to edit the text title of a question or answer
export function editTextTitle(questionItem) {
	const currentTitle = questionItem.textContent // Get the current text title
	const input = document.createElement("input") // Create an input element to edit the text title
	input.type = "text"
	input.value = currentTitle
	input.className = "edit-question-input"
	questionItem.replaceWith(input) // Replace the question item with the input element
	input.focus()
	input.select()

	const saveTitle = () => saveTextTitle(input, questionItem)

	input.addEventListener("blur", saveTitle) // Save the edited text title on blur
	input.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			input.removeEventListener("blur", saveTitle) // Remove the blur event listener
			saveTitle() // Save the edited text title
		}
	})
}

// Function to save the edited text title and re-attach event listeners
function saveTextTitle(input, questionItem) {
	const newTitle = input.value // Get the new text title
	questionItem.textContent = newTitle // Set the text title to the new value

	input.replaceWith(questionItem) // Replace the input element with the question item

	const questionContainer = questionItem.closest(".certain-question")
	const questionIndex = questionContainer?.id.match(/selectedQuestion(\d+)/)?.[1]

	if (questionIndex) {
		const keyPrefix = `question${questionIndex}_` // Prefix for local storage key
		const itemId = questionItem.id.replace("selected-question-name", "questionName") // Get the item id
		localStorage.setItem(`${keyPrefix}${itemId}`, newTitle) // Save the new text title to local storage

		if (itemId === "questionName") {
			// Update the question title in the modal
			const questionModalItem = document.querySelector(
				`#question-list .question-item:nth-child(${questionIndex})`
			)
			if (questionModalItem) {
				questionModalItem.textContent = newTitle // Set the text title to the new value
			}
		}
	}
}

// Function to add long press event listener to an element
function addLongPressListener(element) {
	let pressTimer

	// Start and clear the press timer on touch/mouse events
	function startPressTimer(e) {
		pressTimer = setTimeout(() => editTextTitle(element), 300)
		if (e.cancelable) e.preventDefault() // Prevent the default action
	}

	function clearPressTimer(e) {
		clearTimeout(pressTimer)
		if (e.cancelable) e.preventDefault()
	}

	element.addEventListener("touchstart", startPressTimer)
	element.addEventListener("touchend", clearPressTimer)
	element.addEventListener("touchmove", clearPressTimer)
	element.addEventListener("mousedown", startPressTimer)
	element.addEventListener("mouseup", clearPressTimer)
	element.addEventListener("mousemove", clearPressTimer)
}

// Function to toggle the right/wrong class on an answer container
let isToggling = false // Flag to prevent multiple toggles

function toggleRightWrong(element) {
	if (isToggling) return // If a toggle is already in progress, return early
	isToggling = true // Set the flag to indicate a toggle is in progress

	if (element.classList.contains("answer-container")) {
		if (element.classList.contains("right")) {
			element.classList.remove("right")
			element.classList.add("wrong")
		} else {
			element.classList.remove("wrong")
			element.classList.add("right")
		}
	}

	setTimeout(() => {
		isToggling = false
	}, 300) // Reset the flag after a short delay
}