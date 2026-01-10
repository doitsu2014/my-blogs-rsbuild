const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content">
      <aside>
        <p className="font-bold">
          Duc Tran's Blog
          <br />
          Sharing knowledge about web development and technology
        </p>
        <p>Copyright © {currentYear} - All rights reserved</p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover"
          >
            Twitter
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover"
          >
            LinkedIn
          </a>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
