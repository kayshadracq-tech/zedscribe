const startButton = document.querySelector(".start-btn");
const clearButton = document.querySelector(".clear-btn");
const transcriptBox = document.querySelector(".transcript");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    startButton.disabled = true;
    startButton.textContent = "Speech recognition not supported";
} else {

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let listening = false;
    let finalTranscript = "";

    startButton.addEventListener("click", () => {

        if (!listening) {
            listening = true;
            recognition.start();
            startButton.textContent = "🔴 Listening...";
        }

    });

    recognition.onresult = (event) => {

        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {

            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                finalTranscript += transcript + " ";
            } else {
                interimTranscript += transcript;
            }
        }

        transcriptBox.textContent =
            finalTranscript + interimTranscript;
    };

    recognition.onend = () => {

        if (listening) {
            recognition.start();
        }

    };

    recognition.onerror = (event) => {
        console.log("Speech recognition error:", event.error);
    };

    clearButton.addEventListener("click", () => {

        finalTranscript = "";

        transcriptBox.innerHTML =
            '<span class="placeholder">Your words will appear here...</span>';
    });
                                 }
