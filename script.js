document.addEventListener('DOMContentLoaded', () => {

    // --- Dynamic GitHub Profile Picture Fetch ---
    const githubUsername = 'Krishnabora1';
    const profilePicElements = document.querySelectorAll('#profile-picture');
    
    fetch(`https://api.github.com/users/${githubUsername}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.avatar_url) {
                profilePicElements.forEach(img => img.src = data.avatar_url);
            }
        })
        .catch(error => {
            console.error('Failed to fetch GitHub profile picture:', error);
        });
    
    // --- Live Footer Clock ---
    const clockElementFooter = document.getElementById('live-clock-footer');
    function updateFooterClock() {
        if (clockElementFooter) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            const dateString = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            clockElementFooter.textContent = `© ${now.getFullYear()} Krishna Bora | ${dateString} | ${timeString}`;
        }
    }
    updateFooterClock();
    setInterval(updateFooterClock, 1000);
    
    // --- Skill Bars Animation ---
    const skillsSection = document.querySelector('#skills');
    const skillBars = document.querySelectorAll('.skill-bar');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => bar.style.width = bar.dataset.width);
                observer.unobserve(skillsSection);
            }
        });
    }, { threshold: 0.2 });
    
    if (skillsSection) observer.observe(skillsSection);

    // --- Smooth Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                document.getElementById('mobile-menu').classList.add('hidden');
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // --- Futuristic AI Chat Logic ---
    const chatContainer = document.getElementById('chat-container');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
        
        // Auto-link URLs
        let formattedText = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="underline font-bold hover:text-pink-600 transition">$1</a>');
        messageElement.innerHTML = formattedText;
        
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Initial AI message
    addMessage("Hello! I'm princess Krishna's AI Assistant. You can ask me for her resume, contact details, or project information. How can I assist you?", 'ai');

    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        const lowerCaseUserMessage = userMessage.toLowerCase();
        if (!userMessage) return;

        addMessage(userMessage, 'user');
        chatInput.value = '';

        // Intent Navigation Shortcuts
        if (lowerCaseUserMessage.includes('contact') || lowerCaseUserMessage.includes('email') || lowerCaseUserMessage.includes('phone') || lowerCaseUserMessage.includes('instagram')) {
            addMessage("Sure, scrolling to the connect section where you can find Krishna's email, phone number, GitHub, and Instagram.", 'ai');
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
            return; 
        }
        if (lowerCaseUserMessage.includes('resume') || lowerCaseUserMessage.includes('cv')) {
            addMessage("You can view Krishna's interactive CV at https://krishnabora1.github.io/cv/ or download his resume from the top of the page.", 'ai');
            document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
            return; 
        }

        // Loading state
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('ai-message', 'chat-message', 'flex', 'items-center', 'space-x-2');
        loadingElement.innerHTML = `
            <svg class="animate-spin h-5 w-5 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm font-medium">Processing request...</span>
        `;
        chatContainer.appendChild(loadingElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        try {
            const prompt = `You are a helpful and futuristic AI assistant for Krishna Bora's personal portfolio website. Answer questions about Krishna, his skills, and his projects using only the context provided below. Keep your tone professional, concise, and friendly.

Krishna's Context:
- **Name:** Krishna Bora
- **Role:** Computer Science Undergraduate specializing in Full Stack Web Development, Machine Learning, and Cyber Security.
- **Education:** B.Tech in Computer Science and Engineering from Jorhat Engineering College. 
- **Technical Skills:** C, C++, JavaScript, React.js, Electron.js, Node.js, MongoDB, HTML, CSS, Data Structures & Algorithms, Full Stack Development, Machine Learning, Cyber Security.
- **Projects & Experience:**
    - **Hotel Management System (Desktop App):** Built using React, Electron.js, Node.js, and MongoDB.
    - **Internship at IIT Guwahati:** Developed an OpenCV ML pipeline in Python for dust-level classification of solar panels.
    - **Cyber Security Intern:** Handled vulnerability assessments, log analysis, and network monitoring.
- **Contact:** 
    - Email: krishnabora7640@gmail.com
    - Phone: +91 9394694468
    - Instagram: @KRISHNA_BORA1
- **Links:**
    - Interactive CV: https://krishnabora1.github.io/cv/
    - GitHub: https://github.com/Krishnabora1

User's Question:
"${userMessage}"
                
Your Answer:`;

            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
            // Ensure you add your valid Gemini API Key here for deployment
            const apiKey = ""; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            chatContainer.removeChild(loadingElement);

            if (result.candidates && result.candidates[0].content) {
                const aiAnswer = result.candidates[0].content.parts[0].text;
                addMessage(aiAnswer, 'ai');
            } else {
                addMessage("System Error: I couldn't generate a response at this moment.", 'ai');
            }
        } catch (error) {
            if (chatContainer.contains(loadingElement)) chatContainer.removeChild(loadingElement);
            addMessage("Connection Error: Please verify the API key and network connection.", 'ai');
        }
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
