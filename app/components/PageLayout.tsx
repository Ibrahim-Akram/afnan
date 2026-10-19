import {AnnouncementBar} from './AnnouncementBar';
import {Header} from './Header';
import {Footer} from './Footer';

export function PageLayout({children}: {children?: React.ReactNode}) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
