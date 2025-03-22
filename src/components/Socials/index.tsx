import githubLogo from "@assets/githubLogo.svg";
import linkedinLogo from "@assets/linkedinLogo.png";

const Socials = () => (
  <div className="flex flex-row justify-between absolute z-10 w-screen bottom-0">
    <a className="m-6" href="https://github.com/FrissA/alepio" target="_blank">
      <img
        className="w-12 h-12 opacity-20 hover:opacity-100 cursor-pointer"
        src={githubLogo}
      />
    </a>
    <a
      className="m-6"
      href="https://www.linkedin.com/in/alexisfriss/"
      target="_blank"
    >
      <img
        className="w-12 h-12 opacity-20 hover:opacity-100 cursor-pointer"
        src={linkedinLogo}
      />
    </a>
  </div>
);

export default Socials;
