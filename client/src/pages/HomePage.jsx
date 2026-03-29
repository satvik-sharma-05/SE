import { useEffect, useState } from "react";
import { ArrowRight, Users, Zap, Sparkles, TrendingUp, Award } from "lucide-react";
import Hero from "../components/layout/Hero";
import EventCard from "../components/events/EventCard";
import { getRecommendedTeammates, fetchLiveEvents } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import SendInvitationModal from "../components/invitaions/SendInvitationModal";

export default function HomePage() {
  const { user: currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [recommendedTeammates, setRecommendedTeammates] = useState([]);
  const [loadingTeammates, setLoadingTeammates] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLiveEvents()
      .then(data => {
        const list = data.events || [];
        setEvents(list.slice(0, 6));
      })
      .catch(err => console.error("Failed to fetch events:", err));
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchRecommendedTeammates();
    }
  }, [currentUser]);

  const fetchRecommendedTeammates = async () => {
    setLoadingTeammates(true);
    try {
      const recs = await getRecommendedTeammates();
      setRecommendedTeammates(recs.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    } finally {
      setLoadingTeammates(false);
    }
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleInvitationSuccess = () => {
    console.log("Invitation sent successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400/50 transition-all hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl group-hover:bg-cyan-500/30 transition-all">
                <TrendingUp className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">500+</h3>
                <p className="text-cyan-300/70">Active Hackathons</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400/50 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-all">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">10K+</h3>
                <p className="text-purple-300/70">Active Users</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 hover:border-green-400/50 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-all">
                <Award className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">2K+</h3>
                <p className="text-green-300/70">Teams Formed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Hackathons Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-semibold">TRENDING NOW</span>
          </div>
          <h2 className="text-6xl font-bold mb-6">
            <span className="text-white">Featured </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Hackathons
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the most exciting hackathons happening right now
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {events.map((event, index) => (
            <div key={index} className="transform hover:scale-105 transition-transform duration-300">
              <EventCard event={event} />
            </div>
          ))}
        </div>

        <div className="text-center mb-24">
          <Link
            to="/events"
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] transition-all transform hover:scale-105"
          >
            <span>Explore All Hackathons</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* AI Recommendations Section */}
        {currentUser && (
          <div className="mt-24">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
                <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-purple-300 text-sm font-semibold">AI-POWERED</span>
              </div>
              <h2 className="text-6xl font-bold mb-6">
                <span className="text-white">Your Perfect </span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                  Teammates
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                AI-powered matching based on skills and compatibility
              </p>
            </div>

            {loadingTeammates ? (
              <div className="text-center py-20">
                <div className="relative inline-block">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-cyan-400 opacity-20"></div>
                </div>
                <p className="text-cyan-300 mt-6 text-lg font-semibold animate-pulse">Analyzing profiles...</p>
              </div>
            ) : recommendedTeammates.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {recommendedTeammates.map((user, index) => (
                  <div
                    key={user._id}
                    className="group relative bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 rounded-3xl p-8 hover:border-cyan-400/60 transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,255,255,0.4)] hover:scale-105"
                  >
                    <div className="absolute -top-4 -right-4 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 text-black rounded-full text-lg font-bold shadow-[0_0_20px_rgba(0,255,255,0.6)] z-10">
                      #{index + 1}
                    </div>

                    <div className="absolute top-6 right-6">
                      <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-xl backdrop-blur-sm">
                        <span className="text-cyan-300 text-sm font-bold">{(user.score * 100).toFixed(0)}% Match</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-0.5">
                          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-2xl font-bold text-cyan-400">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        {user.xp > 0 && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black border-2 border-gray-900">
                            {user.level}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {user.name}
                        </h3>
                        {user.xp > 0 && (
                          <p className="text-sm text-cyan-300/70 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {user.xp} XP
                          </p>
                        )}
                      </div>
                    </div>

                    {user.bio && (
                      <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                        {user.bio}
                      </p>
                    )}

                    <div className="space-y-3 mb-6">
                      {user.college && (
                        <div className="flex items-center gap-2 text-cyan-300/80">
                          <span>🎓</span>
                          <span className="text-sm truncate">{user.college}</span>
                        </div>
                      )}
                      {user.location && (
                        <div className="flex items-center gap-2 text-cyan-300/80">
                          <span>📍</span>
                          <span className="text-sm">{user.location}</span>
                        </div>
                      )}
                    </div>

                    {user.skills?.length > 0 && (
                      <div className="mb-6">
                        <p className="text-xs font-bold text-cyan-400 mb-3 uppercase">Top Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1.5 bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 rounded-lg text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-6 border-t border-cyan-400/20">
                      <button
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all"
                        onClick={() => handleOpenModal(user)}
                      >
                        Send Invite
                      </button>
                      <Link
                        to={`/user/${user._id}`}
                        className="px-4 py-3 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/10 rounded-xl text-sm font-bold transition-all"
                      >
                        Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-cyan-400/30">
                <div className="text-8xl mb-6">🤖</div>
                <h3 className="text-3xl font-bold text-white mb-4">No Recommendations Yet</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Complete your profile to unlock AI recommendations
                </p>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Complete Profile
                </Link>
              </div>
            )}

            {recommendedTeammates.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  to="/recommendations"
                  className="inline-flex items-center gap-3 px-10 py-5 border-2 border-cyan-400 text-cyan-300 rounded-xl font-bold hover:bg-cyan-500/10 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all group"
                >
                  <Zap className="w-5 h-5" />
                  View All Recommendations
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        )}

        {!currentUser && (
          <div className="text-center py-24 bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-cyan-400/30 relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-8xl mb-6">🚀</div>
              <h3 className="text-4xl font-bold text-white mb-6">Ready to Build Something Amazing?</h3>
              <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-xl">
                Join thousands of developers finding their perfect teammates
              </p>
              <div className="flex gap-6 justify-center">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white px-10 py-4 rounded-xl font-bold hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-cyan-400 text-cyan-400 px-10 py-4 rounded-xl font-bold hover:bg-cyan-400/10 transition-all"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        )}

        {selectedUser && (
          <SendInvitationModal
            user={selectedUser}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSuccess={handleInvitationSuccess}
          />
        )}
      </main>
    </div>
  );
}
