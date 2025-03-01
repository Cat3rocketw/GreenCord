let lastMessageTime = null;
let userColorCache = {};

async function checkLocalPfp(username) {
    const extensions = ["png", "jpg", "gif", "webp", "jpeg"];
    for (let ext of extensions) {
        let localPath = `pfp/${username}.${ext}`;
        let exists = await imageExists(localPath);
        if (exists) return localPath;
    }
    return null;
}

async function imageExists(imageUrl) {
    try {
        const response = await fetch(imageUrl, { method: "HEAD" });
        return response.ok;
    } catch (error) {
        return false;
    }
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 156) + 100;
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;
    return `rgb(${r}, ${g}, ${b})`;
}

async function fetchMessages() {
    try {
      const response = await fetch("/messages");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const messages = await response.json();
      const messagesContainer = document.getElementById("messageList");
  
      if (!messagesContainer) {
        console.error("Error: Could not find #messages container in the DOM.");
        return;
      }
  
      const newMessages = messages.reverse();
      const messagesToAdd = newMessages.filter(
        (msg) => !lastMessageTime || new Date(msg.timestamp) > lastMessageTime
      );
  
      if (messagesToAdd.length === 0) return;
  
      // Remove the oldest message if there are more than 10 messages
      if (messagesContainer.children.length >= 10) {
        messagesContainer.removeChild(messagesContainer.children[0]); // Remove the oldest message (first one)
      }
  
      const fragment = document.createDocumentFragment();
  
      for (let msg of messagesToAdd) {
        const li = document.createElement("li");
        li.classList.add("message");
  
        let cleanMessage = msg.content.replace(/<@!?\\d+>/g, "").trim().replace(/\*/g, "");
        let hasColon = cleanMessage.includes(":");
        let msgContent = hasColon ? cleanMessage.split(":").slice(1).join(":").trim() : cleanMessage;
        let msgAuthor2 = hasColon ? cleanMessage.split(":")[0].trim() : msg.author.username;
        let msgAuthor = msgAuthor2.replace(/<@!?(\d+)>/, "");
  
        if (!userColorCache[msgAuthor]) {
          userColorCache[msgAuthor] = getRandomColor();
        }
  
        let avatarSrc = await checkLocalPfp(msgAuthor);
        if (!avatarSrc) {
          avatarSrc =
            msg.author.avatar
              ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
              : "default-avatar.png";
        }
  
        const avatar = document.createElement("img");
        avatar.src = avatarSrc;
        avatar.alt = msgAuthor;
        avatar.style.width = "40px";
        avatar.style.height = "40px";
        avatar.style.objectFit = "cover";
        avatar.style.objectPosition = "center";
        avatar.classList.add("avatar");
  
        const messageContainer = document.createElement("span");
  
        const usernameSpan = document.createElement("span");
        usernameSpan.textContent = `${msgAuthor}: `;
        usernameSpan.style.color = userColorCache[msgAuthor];
        usernameSpan.style.fontWeight = "bold";
  
        const contentSpan = document.createElement("span");
        contentSpan.textContent = msgContent;
  
        messageContainer.appendChild(usernameSpan);
        messageContainer.appendChild(contentSpan);
        li.appendChild(avatar);
        li.appendChild(messageContainer);
  
        // Handle attachments (images, videos, audio, etc.)
        const attachmentContainer = document.createElement("div");
        attachmentContainer.style.marginTop = "5px";
  
        // Process Discord attachments
        if (msg.attachments.length > 0) {
          for (let attachment of msg.attachments) {
            const fileType = attachment.url.split(".").pop().toLowerCase();
  
            if (fileType.match(/jpg|jpeg|png|gif|webp/i)) {
              // Image or GIF
              const img = document.createElement("img");
              img.src = attachment.url;
              img.alt = "Sent Image/GIF";
              img.style.maxWidth = "300px";
              img.style.borderRadius = "5px";
              attachmentContainer.appendChild(img);
            } else if (fileType.match(/mp4|mov|avi|mkv/i)) {
              // Video
              const video = document.createElement("video");
              video.src = attachment.url;
              video.controls = true;
              video.style.maxWidth = "300px";
              video.style.borderRadius = "5px";
              attachmentContainer.appendChild(video);
            } else if (fileType.match(/mp3|wav|ogg/i)) {
              // Audio
              const audio = document.createElement("audio");
              audio.src = attachment.url;
              audio.controls = true;
              attachmentContainer.appendChild(audio);
            } else {
              // Other file types (download link)
              const a = document.createElement("a");
              a.href = attachment.url;
              a.textContent = `Download ${attachment.filename}`;
              a.target = "_blank";
              attachmentContainer.appendChild(a);
              attachmentContainer.appendChild(document.createElement("br"));
            }
          }
        }
  
        // Process external GIF links in message content
        const gifRegex = /https?:\/\/\S+\.(gif)/gi; // Matches GIF URLs
        const matches = msg.content.match(gifRegex);
        if (matches && matches.length > 0) {
          for (let gifUrl of matches) {
            const img = document.createElement("img");
            img.src = gifUrl;
            img.alt = "External GIF";
            img.style.maxWidth = "300px";
            img.style.borderRadius = "5px";
            attachmentContainer.appendChild(img);
          }
        }
  
        if (attachmentContainer.childElementCount > 0) {
          li.appendChild(attachmentContainer);
        }
  
        fragment.appendChild(li);
      }
  
      messagesContainer.appendChild(fragment);
      lastMessageTime = new Date(messagesToAdd[messagesToAdd.length - 1].timestamp);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }
// Auto-refresh messages every 2 seconds
setInterval(fetchMessages, 2000);

// Add hover animation with CSS
const style = document.createElement("style");

document.head.appendChild(style);
