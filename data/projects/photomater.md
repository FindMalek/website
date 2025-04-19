---
id: 7
image: "/project/photomater.png"
name: "Photomater"
overview: "An automation tool designed to streamline the process of updating text layers in Adobe Photoshop files, featuring a rich CLI for easy interaction and customization."
status: "active"
link: "https://github.com/FindMalek/Photomater"
href: "/projects/photomater"
---

### Photomater: Streamlining Photoshop Automation

**Photomater** is a Python-based automation tool designed to simplify the process of updating text layers in Adobe Photoshop files. Inspired by the need to save time and reduce repetitive tasks, this tool is perfect for graphic designers looking to streamline their workflow and enhance productivity.

#### **Project Inspiration**

The idea for **Photomater** came from my experience working as a graphic designer for companies like FitFome, Forme Plus, Move U, and Challenge GYM. The repetitive task of updating text layers in Photoshop files was time-consuming and tedious. To address this, I created **Photomater** to automate these updates, saving valuable time and allowing designers to focus on more creative aspects of their work.

#### **Features**

- **Automated Text Layer Updates:**

  - Automatically update text layers in Photoshop files, tailored for weekly dates or other recurring updates.
  - Handle multiple files and artboards, customizable for different clients and date formats.

- **Rich Command-Line Interface (CLI):**

  - A user-friendly CLI allows for easy interaction, supporting various commands for managing client data and automation tasks.
  - Commands include adding, editing, and removing clients, updating text layers, and exporting files.

- **Extendable Architecture:**

  - The tool’s architecture is designed to be extendable, allowing for additional Photoshop automation functionalities as needed.

- **Customizable and Scalable:**
  - Easily customize the tool to fit specific workflows and client requirements.
  - Scalable to handle multiple projects and clients efficiently.

#### **Technical Implementation**

The platform is built using a modern tech stack to ensure performance, scalability, and security:

- **Frontend:**
  - **Python:** For building the core automation logic and CLI.
  - **Adobe Photoshop Scripting:** For interacting with Photoshop files and updating text layers.
- **Backend:**
  - **Python:** For handling the automation logic and CLI commands.
  - **JSON:** For storing client data and configurations.
- **Hosting and Services:**
  - **GitHub:** For version control and collaboration.
  - **Adobe Photoshop:** For designing and updating graphic files.

#### **Getting Started**

To get started with **Photomater**, follow these steps:

1. **Prerequisites:**

   - Ensure you have **Adobe Photoshop** (with scripting support) and **Python 3.x** installed.
   - A basic understanding of Python and JavaScript (for Adobe Photoshop scripting) is recommended.

2. **Installation:**

   - Clone the repository:
     ```bash
     git clone https://github.com/FindMalek/Photomater.git
     cd Photomater
     ```
   - Install any necessary Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```

3. **Setting Up:**
   - Run `python main.py` to start the CLI. If the `data/client_data.json` file is empty or does not exist, the CLI will guide you through adding a new client with file paths and configurations.
   - Use the CLI commands to manage clients, update text layers, and export files. For guidance, use the `--help` command:
     ```bash
     python main.py --help
     ```

#### **CLI Commands**

**Photomater’s CLI** offers a variety of commands to manage client data, update Photoshop files, and export artboards. Here’s a detailed overview of each command and its arguments:

1. **Add Client:**

   - Add a new client with their specific Photoshop file settings.
   - Command: `add-client`
   - Base Arguments:
     - `--name (required)`: Name of the client.
   - Example:
     ```bash
     python main.py add-client --name "CLIENT_NAME" --file-name "FILE_NAME" --psd-path "/path/to/psd" --export-path "/path/to/export" --google-drive-path "/path/to/drive" --start-date-path "folder/text_layer" --end-date-path "folder/text_layer" --supported-artboards "Artboard1,Artboard2" --layer-path "Date - * (EditText)"
     ```

2. **Edit Client:**

   - Edit an existing client’s details.
   - Command: `edit-client`
   - Arguments:
     - `--name (required)`: Name of the client.
     - `--new_name (optional)`: New name for the client.
     - `--new_file_location (optional)`: New file location path.
     - `--new_export_location (optional)`: New export location path.
     - `--new_google_drive_location (optional)`: New Google Drive path for the file.
     - `--new_start_date_path (optional)`: New path for the start date text layer.
     - `--new_end_date_path (optional)`: New path for the end date text layer.
     - `--new_supported_artboards (optional)`: New artboard names, comma-separated.
   - Example:
     ```bash
     python main.py edit-client --name "CLIENT_NAME" --new_name "NEW_CLIENT_NAME" --new_file_location "/new/path/to/psd"
     ```

3. **Remove Client:**

   - Remove an existing client from the system.
   - Command: `remove-client`
   - Arguments:
     - `--name (required)`: Name of the client to be removed.
   - Example:
     ```bash
     python main.py remove-client --name "Client1"
     ```

4. **List Clients:**

   - List all clients currently stored in the system.
   - Command: `list-clients`
   - No arguments required.
   - Example:
     ```bash
     python main.py list-clients
     ```

5. **Update File:**

   - Update text layers in Photoshop files and save the changes.
   - Command: `update-file`
   - Arguments:
     - `--client (required)`: Name of the client.
     - `--all-files (optional)`: Flag to process all files for the client.
     - `--file (optional)`: Specify a single file name to process.
   - Example:
     ```bash
     python main.py update-file --client "Client1" --file "FileName"
     ```

6. **Export File:**
   - Update text layers in Photoshop files, save the changes, and export the files.
   - Command: `export`
   - Arguments:
     - `--client (required)`: Name of the client.
     - `--all-files (optional)`: Flag to process all files for the client.
     - `--file (optional)`: Specify a single file name to process.
   - Example:
     ```bash
     python main.py export --client "Client1" --all-files
     ```

These commands provide a comprehensive interface for managing and automating tasks in Photoshop files, making **Photomater** a powerful tool for graphic designers. For more detailed information on each command, use the `--help` flag.

#### **Client Data Structure**

**Photomater** manages client data with a comprehensive structure to accommodate various project requirements and workflows. Here is an overview of the client data structure:

- **Client Object:**
  - Each client object consists of a name and a list of files associated with that client.
  - Example:
    ```json
    {
      "name": "MoveU",
      "files": [
        {
          "name": "Daily Plan",
          "paths": {
            "PSD": "/path/to/project1.psd",
            "Export": "/path/to/export/project1",
            "Google Drive": "https://drive.google.com/drive/folders/project1"
          },
          "path_object": {
            "Main": {
              "start": "Main/Text/Week Date/Start Date (EditText)",
              "end": "Main/Text/Week Date/End Date (EditText)"
            },
            "Layers": {
              "Supported": true,
              "Path": "Main/Text/Week Date/(EditText)"
            }
          },
          "artboards": {
            "Supported": true,
            "Boards": [
              "Lundi",
              "Mardi",
              "Mercredi",
              "Jeudi",
              "Vendredi",
              "Samedi",
              "Dimanche"
            ]
          }
        },
        {
          "name": "Weekly Plan",
          "paths": {
            "PSD": "/path/to/project2.psd",
            "Export": "/path/to/export/project2",
            "Google Drive": "https://drive.google.com/drive/folders/project2"
          },
          "path_object": {
            "Main": {
              "start": "Main/Text/Week Date/Start Date (EditText)",
              "end": "Main/Text/Week Date/End Date (EditText)"
            },
            "Layers": {
              "Supported": false,
              "Path": ""
            }
          },
          "artboards": {
            "Supported": false,
            "Boards": []
          }
        }
      ]
    }
    ```

This structure provides flexibility for managing different types of projects and their specific requirements. It is crucial to maintain this format for the application to function correctly.

#### **Project Structure**

The project is organized into several directories:

- **Photomater/**
  - **app/**: Core application code, including controllers for business logic and models for data structures.
  - **cli/**: CLI-related code, housing individual commands and the main CLI application.
  - **data/**: Data storage, including the JSON file for client data.
  - **scripts/**: JavaScript scripts for Photoshop.
  - **main.py**: Main script to run the CLI application.
  - **requirements.txt**: Required Python dependencies.
