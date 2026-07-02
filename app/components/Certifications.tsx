import SectionHeading from "./SectionHeading";
import CredentialsGallery from "./CredentialsGallery";

export default function Certifications() {
  return (
    <section id="certifications" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <SectionHeading
          file="FILE 05"
          eyebrow="CREDENTIALS"
          title="Certifications"
        />
        <CredentialsGallery />
      </div>
    </section>
  );
}
