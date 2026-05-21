'use client';

import { useState } from 'react';
import { Collapse, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { poppins } from '@/lib/font';
import Layout from '@/components/Layout';

const { Panel } = Collapse;

const faqData = [
  {
    question: 'What types of video production services do you offer?',
    answer: [
      'Commercials and brand films',
      'Social media content (Reels, TikToks, etc.)',
      'Corporate videos and interviews',
      'Product showcase and motion design',
      'Event coverage and documentaries',
    ],
  },
  {
    question: 'How long does a typical video project take?',
    answer: [
      'Timelines vary based on project complexity.',
      'Social media content: 3-5 business days.',
      'Full brand films: 2-4 weeks.',
      'Concept to delivery, we keep you updated throughout.',
    ],
  },
  {
    question: 'Do you provide scriptwriting and concept development?',
    answer: [
      'Yes, we offer full-service production.',
      'We help with ideation, scripting, and storyboarding.',
      'Collaborative approach to match your brand voice.',
    ],
  },
  {
    question: 'What is your pricing structure?',
    answer: [
      'Project-based pricing tailored to your needs.',
      'Retainer packages for ongoing content needs.',
      'Transparent quotes with no hidden costs.',
    ],
  },
  {
    question: 'Do you offer monthly content packages?',
    answer: [
      'Yes, we have specialized packages for social media.',
      'Regular content delivery to keep your brand active.',
      'Consistent quality across all platforms.',
    ],
  },
  {
    question: 'Can you work with clients remotely?',
    answer: [
      'Absolutely, we handle post-production for clients worldwide.',
      'Remote feedback and revision process via specialized tools.',
      'We can also travel for on-site shoots if required.',
    ],
  },
  {
    question: 'What information do I need to provide for a quote?',
    answer: [
      'Project goals and target audience.',
      'Estimated duration or number of deliverables.',
      'Reference videos or style preferences.',
      'Preferred timeline and budget range.',
    ],
  },
  {
    question: 'How many rounds of revisions do you offer?',
    answer: [
      'Standard projects include 2 rounds of revisions.',
      'Major structural changes after approval may incur costs.',
      'Our goal is your 100% satisfaction.',
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const filteredFAQs = faqData.filter(({ question }) =>
    question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fff] to-gray-500">
      {/* Header Section */}
      <div className="relative flex flex-col items-center justify-center text-center py-16 px-6">
        <h1 className={`${poppins.className} mt-[50px]  text-4xl md:text-5xl font-bold text-gray-900 mb-4`}>
          Frequently Asked Questions
        </h1>
        <p className="text-gray-700 mb-6 max-w-xl">
          Everything you need to know about our video production and creative services.
        </p>
        <Input
          size="large"
          placeholder="Search a question..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-md shadow-sm border border-gray-300 bg-white text-black"
        />
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <Collapse
          accordion
          bordered={false}
          right
          className="bg-transparent"
        >
          {filteredFAQs.map(({ question, answer }, idx) => (
            <Panel
              header={<span className="font-semibold text-gray-900">{question}</span>}
              key={idx}
              className="bg-white rounded-md shadow-sm border border-gray-300 mb-4"
            >
              <ul className="list-disc list-inside space-y-2 text-gray-800">
                {answer.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
    </Layout>

  );
}
