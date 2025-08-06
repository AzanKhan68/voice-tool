document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const playButton = document.getElementById('play-btn');
    const downloadButton = document.getElementById('download-btn');

    const elevenLabsApiKey = 'sk_3df14090020fb58c645580a163f08ab279a719c656d9d268';
    const elevenLabsApiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/';

    let audioBlob = null;
    let audio = new Audio();

    // The welcome message is prepended to the user's input
    const welcomeMessage = "Welcome to the Ultimate World of Azan. ";

    /**
     * Plays the audio generated from the text input.
     * @param {string} text - The text to be converted to speech.
     * @param {string} voiceId - The ID of the voice character to use.
     */
    const playAudio = async (text, voiceId) => {
        try {
            // Disable buttons during API call
            playButton.disabled = true;
            playButton.textContent = 'Generating...';
            downloadButton.disabled = true;

            const response = await fetch(`${elevenLabsApiUrl}${voiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': elevenLabsApiKey,
                    'Accept': 'audio/mpeg'
                },
                body: JSON.stringify({
                    text: text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || `HTTP error! status: ${response.status}`);
            }

            audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            audio.src = audioUrl;
            audio.play();

            // Enable download button once audio is ready
            downloadButton.disabled = false;
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            // Re-enable buttons after API call
            playButton.disabled = false;
            playButton.textContent = 'Play';
        }
    };

    /**
     * Handles the play button click event.
     * It ensures the input is not empty before calling the playAudio function.
     */
    playButton.addEventListener('click', () => {
        const userInput = textInput.value.trim();
        if (userInput === '') {
            alert('Please enter some text to generate speech.');
            return;
        }
        
        const fullText = welcomeMessage + userInput;
        const selectedVoiceId = voiceSelect.value;
        playAudio(fullText, selectedVoiceId);
    });

    /**
     * Handles the download button click event.
     * It creates a temporary anchor tag to trigger the download of the audio blob.
     */
    downloadButton.addEventListener('click', () => {
        if (audioBlob) {
            const url = URL.createObjectURL(audioBlob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'azan-world-voice.mp3';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            alert('No audio to download. Please play the voice first.');
        }
    });
});
