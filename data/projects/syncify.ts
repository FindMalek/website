import { ProjectType } from "@/types/project";
import { BiLogoSpotify, BiLogoPython } from "react-icons/bi";
import { SiFfmpeg } from "react-icons/si";

const syncify = {
	name: "Syncify",
	description:
		"Syncify is an open-source application. It allows you to download your Spotify Playlists, Albums and Tracks with full meta-data.",
	icon: BiLogoSpotify,
	details: {
		about:
			"Syncify was created to allow users to download their Spotify Playlists, Albums and Tracks with full meta-data. It is an open-source application that is available on Windows, macOS and Linux. It is build with Python, FFMPEG and Spotify API.",
		tech: [
			{
				name: "Python",
				icon: BiLogoPython,
			},
			{
				name: "FFMPEG",
				icon: SiFfmpeg,
			},
			{
				name: "Spotify API",
				icon: BiLogoSpotify,
			},
		],
	},
	accordion: [
		{
			question: "How to install Syncify?",
			answer:
				"You can install Syncify from the Releases Page. First download the latest version of Syncify for your operating system. Then, follow the instructions on the README.md file.",
		},
		{
			question: "How to use Syncify?",
			answer:
				"You can use Syncify by following the instructions on the README.md file. Put the environment variables in a .env file, then run the main.py file.",
		},
		{
			question: "How to contribute to Syncify?",
			answer:
				"You can contribute to Syncify by forking the repository and creating a pull request, or by creating an issue on the Issues Page.",
		},
	],
	github: {
		name: "Syncify",
		description:
			"Syncify is an open-source application. It allows you to download your Spotify Playlists, Albums and Tracks with full meta-data.",
		date: "Created on September 2021",
		href: "https://github.com/FindMalek/Syncify",
		iconSrc: "https://github.com/spotify.png",
	},
};

export default syncify as ProjectType;
