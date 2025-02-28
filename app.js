// Generate a secret key for encryption
let encryptionKey;

window.onload = async () => {
    // Generate a secret key once when the app is loaded
    encryptionKey = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true, // whether the key is extractable (not important here)
        ["encrypt", "decrypt"]
    );
};

// Encrypt a message before sending
async function encryptMessage(message) {
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);

    // Generate a random initialization vector (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedMessage = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        encryptionKey,
        encodedMessage
    );

    // Return both encrypted message and IV for decryption
    return { encryptedMessage, iv };
}

// Decrypt an encrypted message
async function decryptMessage(encryptedMessage, iv) {
    const decryptedMessage = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        encryptionKey,
        encryptedMessage
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedMessage);
}

// Display a message in the chat
function displayMessage(message, isEncrypted = false) {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.style.marginBottom = '10px';

    if (isEncrypted) {
        messageElement.textContent = `Encrypted: ${message}`;
    } else {
        messageElement.textContent = `You: ${message}`;
    }
    
    chatBox.appendChild(messageElement);
}

// Handle sending a message
document.getElementById('sendButton').addEventListener('click', async () => {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message) {
        // Encrypt the message
        const { encryptedMessage, iv } = await encryptMessage(message);
        
        // Simulate sending the encrypted message to the other user
        displayMessage(encryptedMessage, true);
        
        // Simulate receiving and decrypting the message after a short delay
        setTimeout(async () => {
            const decryptedMessage = await decryptMessage(encryptedMessage, iv);
            displayMessage(decryptedMessage);
        }, 2000);
        
        // Clear the message input
        messageInput.value = '';
    }
});
