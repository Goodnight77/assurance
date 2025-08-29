import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";

const socialLinks = [
  {
    href: "https://www.facebook.com/BHAssurance",
    icon: <FaFacebookF size={22} color="#fff" />,
    label: "Facebook",
  },
  {
    href: "https://www.linkedin.com/company/bh-assurance/posts/?feedView=all",
    icon: <FaLinkedinIn size={22} color="#fff" />,
    label: "LinkedIn",
  },
  {
    href: "https://www.instagram.com/bhassurance/",
    icon: <FaInstagram size={22} color="#fff" />,
    label: "Instagram",
  },
  {
    href: "https://www.youtube.com/@bhassurance1806",
    icon: <FaYoutube size={22} color="#fff" />,
    label: "YouTube",
  },
];

const SocialBar: React.FC = () => (
  <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
    {socialLinks.map((link) => (
      <a
        key={link.label}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={link.label}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        {link.icon}
      </a>
    ))}
  </div>
);

export default SocialBar;
