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
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    let listening = false;
    let finalTranscript = "";

    startButton.addEventListener("click", () => {

        if (listening) {
            return;
        }

        listening = true;
        startButton.textContent = "🔴 Listening...";

        try {
            recognition.start();
        } catch (error) {
            console.log(error);
        }
    });

    recognition.onresult = (event) => {

        for (let i = event.resultIndex; i < event.results.length; i++) {

            if (event.results[i].isFinal) {

                const text =
                    event.results[i][0].transcript.trim();

                if (text) {
                    finalTranscript += text + " ";
                }
            }
        }

        transcriptBox.textContent =
            finalTranscript.trim();
    };

    recognition.onend = () => {

        listening = false;
        startButton.textContent = "🎙️ Start Listening";
    };

    recognition.onerror = (event) => {

        console.log(
            "Speech recognition error:",
            event.error
        );

        listening = false;
        startButton.textContent = "🎙️ Start Listening";
    };

    clearButton.addEventListener("click", () => {

        finalTranscript = "";

        transcriptBox.innerHTML =
            '<span class="placeholder">Your words will appear here...</span>';
    });
}
