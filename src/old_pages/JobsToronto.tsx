"use client";

import React from 'react';
import Link from 'next/link';

const JobsToronto: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-700 to-violet-500 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Career Opportunities
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Jobs in Toronto<br />Find Your Next Career
          </h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-10 font-medium">
            Search thousands of job listings in Toronto and across the GTA. Find full-time, part-time, contract, and remote positions across all industries on HitAds.ca.
          </p>
          <Link href="/search?cat=Jobs" className="bg-white text-indigo-700 font-black px-10 py-5 rounded-2xl hover:bg-slate-50 transition-all shadow-xl text-sm uppercase tracking-widest inline-block">
            Browse Jobs
          </Link>
        </div>
      </section>

      <main className="w-full px-4 sm:px-6 lg:px-10 py-16 md:py-24">
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Toronto's Growing Job Market</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Toronto is the economic powerhouse of Canada, home to hundreds of thousands of businesses spanning finance, technology, healthcare, construction, hospitality, and retail. The Greater Toronto Area offers one of the most diverse and dynamic job markets in North America, with new opportunities posted every day across every industry and skill level.
            </p>
            <p>
              HitAds.ca connects job seekers with local employers, staffing agencies, and entrepreneurs looking to hire. Whether you're a recent graduate searching for your first role, an experienced professional looking for a career change, or a newcomer to Canada exploring opportunities in Toronto, our job board makes it easy to find positions that match your skills and location.
            </p>
            <p>
              Unlike generic job boards that focus only on corporate positions, HitAds.ca covers the full spectrum of Toronto's employment landscape — from general labour and construction roles to IT positions, healthcare jobs, and remote work opportunities. Many of our listings come from small businesses and independent employers that you won't find on traditional job sites.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Popular Job Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'General Labour', icon: 'engineering' },
              { name: 'Construction', icon: 'construction' },
              { name: 'Driving', icon: 'local_shipping' },
              { name: 'IT & Tech', icon: 'code' },
              { name: 'Healthcare', icon: 'local_hospital' },
              { name: 'Hospitality', icon: 'restaurant' },
              { name: 'Sales', icon: 'trending_up' },
              { name: 'Remote Jobs', icon: 'laptop_mac' },
            ].map(job => (
              <Link key={job.name} href={`/search?cat=Jobs&sub=${encodeURIComponent(job.name)}`} className="bg-white p-6 rounded-2xl border border-slate-100 text-center hover:border-indigo-500 hover:shadow-lg transition-all group">
                <span className="material-icons text-3xl text-slate-400 group-hover:text-indigo-600 mb-3 block">{job.icon}</span>
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{job.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">For Employers: Post Jobs for Free</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Hiring in Toronto can be expensive with traditional job boards charging per listing or monthly subscriptions. HitAds.ca offers a completely free alternative — post your job listing with detailed descriptions, salary ranges, and requirements at no cost.
            </p>
            <p>
              Our platform reaches thousands of active job seekers across the GTA, many of whom prefer local listings over national job boards. Whether you're a small business owner looking for your next team member or a staffing agency filling multiple positions, HitAds.ca gives you direct access to Toronto's diverse talent pool.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/post-ad" className="bg-indigo-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl text-sm uppercase tracking-widest inline-block">
              Post a Job for Free
            </Link>
          </div>
        </section>

        <section className="bg-indigo-50 rounded-3xl p-10 md:p-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Job Search Tips for Toronto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Tailor your resume for each position you apply to',
              'Research the company and neighborhood before interviews',
              'Network through community events and local organizations',
              'Consider contract roles as a stepping stone to permanent positions',
              'Check HitAds.ca daily — new jobs are posted every hour',
              'Set up search alerts for your preferred categories and locations',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="material-icons text-indigo-600 text-lg mt-0.5">check_circle</span>
                <span className="text-sm text-slate-600 font-medium">{tip}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default JobsToronto;
