import { SponsorImage } from "@/components/SponsorImage";

interface Sponsor {
  name: string;
  logoUrl: string;
}

interface SponsorCategory {
  title: string;
  sponsors: Sponsor[];
}

const sponsorData: SponsorCategory[] = [
  {
    title: "Title Sponsor",
    sponsors: [
      {
        name: "HCL Tech",
        logoUrl: "https://cdn.a2ys.dev/images/hcl.jpg",
      },
    ],
  },
  {
    title: "FM Partner",
    sponsors: [
      {
        name: "Hello FM",
        logoUrl: "https://cdn.a2ys.dev/images/hellofm.jpg",
      },
    ],
  },
  {
    title: "Other Sponsors",
    sponsors: [
      {
        name: "Elcon",
        logoUrl: "https://cdn.a2ys.dev/images/elcon.jpg",
      },
      {
        name: "MGM Healthcare",
        logoUrl: "https://cdn.a2ys.dev/images/mgm.jpg",
      },
      {
        name: "Indian Bank",
        logoUrl: "https://cdn.a2ys.dev/images/ib.jpg",
      },
    ],
  },
];

const Sponsors = () => {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {sponsorData.map((category) => (
          <section key={category.title} className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-white bg-clip-text text-transparent">
              {category.title}
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {category.sponsors.map((sponsor) => {
                const isTitleSponsor = category.title === "Title Sponsor";
                return (
                  <SponsorImage
                    key={sponsor.name}
                    src={sponsor.logoUrl}
                    alt={`${sponsor.name} logo`}
                    className={isTitleSponsor ? "w-96 h-48" : "w-64 h-32"}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Sponsors;
