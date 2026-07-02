import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { profile } from "../data/portfolio";

export default function About() {
  return (
    <section id="profile" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <SectionHeading
          file="FILE 02"
          eyebrow="SUBJECT PROFILE"
          title="Profile"
        />
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-lg leading-relaxed text-muted">
              {profile.summary}
            </p>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {profile.role}. Every finding is documented into a reproducible
              writeup — from exploitation steps to mitigation recommendations
              you can apply right away.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
