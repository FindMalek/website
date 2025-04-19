---
id: 8
image: "/project/syncify.png"
name: "Syncify"
overview: "An open-source application to download tracks, albums, and playlists from Spotify, converting them to various audio formats with full metadata and cover art."
status: "active"
link: "https://github.com/FindMalek/Syncify"
href: "/projects/syncify"
---

### Syncify: Download Spotify Music with Ease

**Syncify** is an open-source application designed to download tracks, albums, and playlists from Spotify, converting them into various audio formats while preserving full metadata and cover art. This project was born out of the need for a solution to access Spotify music in regions where subscription payments were not available, such as Tunisia.

#### **Project Inspiration**

The idea for **Syncify** came from the lack of payment options for Spotify subscriptions in Tunisia. To address this, I created **Syncify**, an application that allows users to download their favorite Spotify tracks, albums, and playlists with all the metadata and album cover art, ensuring the best audio quality possible.

#### **Features**

- **Spotify Downloads:**

  - Download tracks, albums, and playlists from Spotify with a simple link.
  - Convert downloaded tracks to various audio formats, including MP3, AAC, FLAC, M4A, OPUS, VORBIS, and WAV.
  - Preserve full metadata and cover art for all downloaded content.

- **High-Quality Audio:**

  - Ensure the best audio quality possible for all downloaded tracks.

- **Metadata and Cover Art:**

  - Automatically include full metadata and cover art for all downloaded tracks, albums, and playlists.

- **Playlist Support:**

  - Download personal Spotify playlists by setting their visibility to 'Public'.
  - Use the Spotify API to retrieve song details from playlists.

- **Environment Variables:**
  - Securely manage Spotify API credentials using environment variables (`SYNCIFY_CLIENT_ID` and `SYNCIFY_CLIENT_SECRET`).

#### **Technical Implementation**

The platform is built using a modern tech stack to ensure performance, scalability, and security:

- **Backend:**
  - **Python:** For handling the core logic and interactions with the Spotify API.
  - **FFmpeg:** For converting and writing metadata to the downloaded songs.
- **Hosting and Services:**
  - **GitHub:** For version control and collaboration.
  - **Spotify API:** For retrieving song details and metadata.

#### **Getting Started**

To get started with **Syncify**, follow these steps:

1. **Prerequisites:**

   - Ensure you have **Ubuntu/Debian/Windows** and **Python 3.6 or higher** installed.
   - Install the required Python modules listed in `requirements.txt`.
   - Install **FFmpeg** and add it to your system PATH.

2. **Installation:**

   - Clone the repository:
     ```bash
     git clone https://github.com/FindMalek/Syncify.git
     cd Syncify
     ```
   - Install the required Python dependencies:
     ```bash
     sudo python3 -m pip install -r requirements.txt
     ```

3. **Spotify Application:**

   - Create a Spotify developer application to access the Spotify API. Sign up [here](https://developer.spotify.com/).
   - Note your client ID and secret, and set them as environment variables:
     ```bash
     export SYNCIFY_CLIENT_ID="your_client_id"
     export SYNCIFY_CLIENT_SECRET="your_client_secret"
     ```

4. **Running Syncify:**
   - Run the application:
     ```bash
     python3 main.py
     ```

#### **Usage**

1. **Download Tracks, Albums, and Playlists:**

   - Enter the link to a Spotify track, album, or playlist, and Syncify will download it with all the metadata and album cover art in the best audio quality possible.

2. **Environment Variables:**
   - Ensure your Spotify client ID and secret are set as environment variables to securely manage your API credentials.
