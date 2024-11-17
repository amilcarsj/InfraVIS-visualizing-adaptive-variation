/**
 * @fileoverview Robot assistant interface module
 * Provides an interactive help system for users
 * @module robot
 */

/**
 * Initializes the robot assistant interface
 * Sets up event listeners and interaction handlers
 * @returns {void}
 */
export const robotInit = () => {
  // Get DOM elements
  const robotFace = document.getElementById('robotFace');
  const qaContainer = document.getElementById('qaContainer');
  const answerBox = document.getElementById('answerBox');
  const closeChat = document.getElementById('closeChat');
  
  // Define answers
  const answers = {
      purpose: "Answer 1",
      work: "Answer 2",
      learn: "Answer 3"
  };

  let isQAVisible = false;

  // Open chat when clicking robot
  robotFace.addEventListener('click', () => {
      robotFace.classList.add('rotating');
      isQAVisible = true;
      qaContainer.classList.add('visible');
      
      setTimeout(() => {
          robotFace.classList.remove('rotating');
      }, 1000);
  });

  // Close chat when clicking close button
  if (closeChat) {
      closeChat.addEventListener('click', () => {
          isQAVisible = false;
          qaContainer.classList.remove('visible');
          if (answerBox) {
              answerBox.classList.remove('visible');
              answerBox.textContent = '';
          }
      });
  }

  // Handle question clicks
  const questionButtons = document.querySelectorAll('.question-button');
  questionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
          const question = e.target.getAttribute('data-question');
          if (answers[question] && answerBox) {
              answerBox.textContent = answers[question];
              answerBox.classList.add('visible');
          }
      });
  });

  // Close modal when clicking outside
  qaContainer.addEventListener('click', (e) => {
      if (e.target === qaContainer) {
          isQAVisible = false;
          qaContainer.classList.remove('visible');
          if (answerBox) {
              answerBox.classList.remove('visible');
              answerBox.textContent = '';
          }
      }
  });

  // Prevent clicks inside the chat interface from closing the modal
  const chatInterface = document.querySelector('.chat-interface');
  if (chatInterface) {
      chatInterface.addEventListener('click', (e) => {
          e.stopPropagation();
      });
  }
};

// To make sure the DOM is fully loaded before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', robotInit);
} else {
  robotInit();
}