import { Users } from 'lucide-react'

const defaultClubs = [
  { 
    name: "Robotics & Automation Society", 
    members: 92, 
    description: "Hands-on robotics projects and automation research",
    activities: ["Robot Competitions", "Build Sessions", "Research Projects"],
    established: "2019",
    image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "IEEE Student Branch",
    members: 120,
    description: "A global community of engineering professionals and students",
    activities: ["Workshops", "Tech Seminars", "Conferences"],
    established: "2018",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Electronics & Innovation Club",
    members: 85,
    description: "Fostering innovation in hardware and electronic systems",
    activities: ["Hardware Hackathons", "Circuit Design", "IoT Projects"],
    established: "2020",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
  }
];

export default function Clubs({ clubs = [] }: { clubs?: any[] }) {
  const displayClubs = clubs.length > 0 ? clubs : defaultClubs;
  return (
    <section className="md:py-20 py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Professional Societies & Clubs
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join specialized student organizations to enhance your technical skills, build professional networks, and participate in meaningful projects.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayClubs.map((club, index) => (
            <div
              key={index}
              className="bg-white rounded-sm overflow-hidden border border-slate-200 shadow-sm flex flex-col"
            >
              {/* Image header */}
              <div className="relative h-40 sm:h-44 overflow-hidden">
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/10 border border-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-100">
                    <p className="font-medium">{club.members}+ active members</p>
                    <p className="text-slate-200/80">Student-led society</p>
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                  {club.name}
                </h3>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                  {club.description}
                </p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
