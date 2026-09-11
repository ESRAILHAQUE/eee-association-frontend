import { Users } from 'lucide-react'

const defaultClubs = [
  { 
    name: "Robotics & Automation Society", 
    members: 92, 
    description: "Hands-on robotics projects and automation research",
    activities: ["Robot Competitions", "Build Sessions", "Research Projects"],
    established: "2019",
    image: "https://plus.unsplash.com/premium_photo-1663091699742-70ca6f835197?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9ib3RpY3MlMjBmb3IlMjBraWRzfGVufDB8fDB8fHww",
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

                <button className="mt-auto inline-flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-2 rounded-sm font-medium text-sm shadow-lg shadow-slate-900/10 cursor-pointer hover:bg-slate-800 transition-colors">
                  Join Society
              
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
