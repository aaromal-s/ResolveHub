import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

const AboutContactPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Premium Hero Banner */}
      <div className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-tealbrand-600 py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-[12px] border-white/20"></div>
          <div className="absolute top-1/2 right-12 w-64 h-64 rounded-full border-8 border-white/30 rotate-45"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            About <span className="text-brand-100">ResolveHub</span>
          </h1>
          <p className="text-brand-50 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between citizens and authorities through digitized tracking, transparency, and accountability.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-20 pb-24 flex flex-col gap-8">
        
        {/* About Section - Lifted Card */}
        <section className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-2xl shadow-brand-900/5">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-brand-500 rounded-full inline-block"></span> Our Mission
          </h2>
          <div className="grid md:grid-cols-2 gap-10 text-slate-600 text-sm md:text-base leading-relaxed">
            <p>
              ResolveHub is a next-generation E-Governance platform designed to establish a direct, digital link between citizens and public authorities. By introducing digitized complaint tracking, automated department routing, and strict Service Level Agreements (SLAs), we aim to replace outdated paperwork systems with modern accountability.
            </p>
            <p>
              Our technology stack is built to ensure speed and stability. Automatic SLA tracking notifications send priority warnings when task deadlines approach, ensuring citizen concerns are not ignored or lost in administrative delays. We empower the community to build better cities, together.
            </p>
          </div>
        </section>

        {/* SLA Policy Table */}
        <section className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                <FiClock className="text-brand-600" /> SLA Policy Guidelines
              </h2>
              <p className="text-slate-500 text-sm">
                Strict departmental resolution timelines based on grievance severity.
              </p>
            </div>
            <div className="mt-4 md:mt-0 px-4 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-bold border border-brand-100">
              Automated Tracking
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/80 uppercase tracking-wider text-xs">
                  <th className="py-4 px-6">Priority Level</th>
                  <th className="py-4 px-6">Maximum Timeline</th>
                  <th className="py-4 px-6">Definition & Examples</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-6 font-extrabold text-rose-600">Critical</td>
                  <td className="py-5 px-6 font-semibold">24 Hours</td>
                  <td className="py-5 px-6 text-slate-500">Hazards endangering lives or severe property threats (e.g., live broken wires).</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-6 font-extrabold text-orange-500">High</td>
                  <td className="py-5 px-6 font-semibold">3 Days</td>
                  <td className="py-5 px-6 text-slate-500">Major localized outages or service stops (e.g., water pipe bursts).</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-6 font-extrabold text-amber-500">Medium</td>
                  <td className="py-5 px-6 font-semibold">7 Days</td>
                  <td className="py-5 px-6 text-slate-500">Standard service maintenance reports (e.g., street light repairs).</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-6 font-extrabold text-sky-500">Low</td>
                  <td className="py-5 px-6 font-semibold">14 Days</td>
                  <td className="py-5 px-6 text-slate-500">Minor cosmetic or non-disruptive reports (e.g., roadside trash dump).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Contact/Support Info */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/40 flex flex-col gap-6 relative overflow-hidden group hover:border-brand-200 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            
            <h3 className="font-bold text-slate-800 text-xl relative z-10">Contact Channels</h3>
            <div className="flex flex-col gap-5 text-slate-600 text-sm relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
                  <FiPhone className="text-xl" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-1">Citizen Helpline (Toll Free)</p>
                  <p className="text-brand-600 font-semibold">1800-111-222</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
                  <FiMail className="text-xl" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-1">Administrative Support</p>
                  <p className="text-brand-600 font-semibold">support@resolvehub.gov.in</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
                  <FiMapPin className="text-xl" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-1">Central Office Address</p>
                  <p className="text-slate-500 leading-relaxed">Grievance Redressal HQ, Secretariat Wing, City Center</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/20 flex flex-col gap-6 text-white relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
            
            <h3 className="font-bold text-white text-xl relative z-10">Escalation & Feedback</h3>
            <p className="text-slate-300 text-sm leading-relaxed relative z-10">
              If your complaint has significantly exceeded the SLA limits and you have received no updates from the assigned department, you can report it to the state ombudsman directly for immediate intervention.
            </p>
            <div className="mt-auto bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl relative z-10">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Ombudsman Desk</p>
              <p className="font-medium text-white break-all mb-1">escalations@resolvehub.gov.in</p>
              <p className="font-medium text-white">+91 11-2334455</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutContactPage;
