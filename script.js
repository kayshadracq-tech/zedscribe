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

            try {
                recognition.start();
                startButton.textContent = "🔴 Listening...";
            } catch (error) {
                console.log("Recognition already running.");
            }
        }

    });

    recognition.onresult = (event) => {

        let currentTranscript = "";

        for (let i = 0; i < event.results.length; i++) {

            const transcript =
                event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                currentTranscript += transcript + " ";
            }
        }

        /*
         * Only update the permanent transcript
         * with final speech.
         */
        if (currentTranscript.trim() !== "") {
            finalTranscript += currentTranscript;
        }

        /*
         * Show the permanent transcript.
         */
        transcriptBox.textContent = finalTranscript.trim();
    };

    recognition.onend = () => {

        /*
         * Keep listening automatically.
         */
        if (listening) {

            setTimeout(() => {

                try {
                    recognition.start();
                } catch (error) {
                    console.log("Recognition restart:", error);
                }

            }, 100);
        }
    };

    recognition.onerror = (event) => {

        console.log(
            "Speech recognition error:",
            event.error
        );

        /*
         * Ignore normal temporary errors
         * while continuing to listen.
         */
        if (
            event.error === "no-speech" ||
            event.error === "aborted"
        ) {
            return;
        }
    };

    clearButton.addEventListener("click", () => {

        finalTranscript = "";

        transcriptBox.innerHTML =
            '<span class="placeholder">Your words will appear here...</span>';
    });
}
