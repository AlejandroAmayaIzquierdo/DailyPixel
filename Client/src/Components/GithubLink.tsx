import { Github } from "lucide-react";

interface GithubLinkProps {
  url?: string;
}

const GithubLink: React.FC<GithubLinkProps> = ({
  url = "https://github.com/AlejandroAmayaIzquierdo/DailyPixel",
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute top-5 left-20 rounded-full bg-gray-500/20 backdrop-blur-sm border-2 border-gray-200 p-2 text-white font-semibold hover:bg-gray-500/30 transition-all cursor-pointer"
      title="View on GitHub"
    >
      <Github size={24} />
    </a>
  );
};

export default GithubLink;
