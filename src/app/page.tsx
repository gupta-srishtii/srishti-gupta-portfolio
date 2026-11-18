import Experience from '@/components/Experience';
import { profile } from '@/data/portfolio';
export default function Home() {
  return (
    <>
      <Experience />
      <noscript>
        <main className="no-script">
          <h1>{profile.name}</h1>
          <p>{profile.bio}</p>
          <p>Work is being curated. Resume and contact details have not been supplied.</p>
          <p>Enable JavaScript to explore the atelier.</p>
        </main>
      </noscript>
    </>
  );
}
