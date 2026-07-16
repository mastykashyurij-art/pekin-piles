import Preloader from './components/Preloader';
import ToonHub from './components/ToonHub';
import BreedPage from './components/BreedPage';
import ContactPage from './components/ContactPage';

export default function App() {
  return (
    <>
      <Preloader />
      <ToonHub />
      <div id="breed">
        <BreedPage />
      </div>
      <div id="contact">
        <ContactPage />
      </div>
    </>
  );
}
