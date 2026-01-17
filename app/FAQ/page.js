'use client';

import { useState } from 'react';
import { Collapse, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { poppins } from '@/lib/font';
import Layout from '@/components/Layout';

const { Panel } = Collapse;

const faqData = [
  {
    question: 'What documents do I need to sell my car?',
    answer: [
      'Original RC (Registration Certificate)',
      'Valid insurance papers',
      'Pollution certificate',
      'Owner’s ID proof',
      'Bank NOC (if car was financed)',
    ],
  },
  {
    question: 'Do you provide car inspection services?',
    answer: [
      'Yes, we offer both in-person and doorstep inspection.',
      'Inspection covers engine, body, tires, brakes, etc.',
      'Free of cost in selected cities.',
    ],
  },
  {
    question: 'How long does it take to sell a car?',
    answer: [
      'Usually 24-48 hours after inspection.',
      'Depends on condition, brand, and paperwork readiness.',
      'Instant payment available for verified sellers.',
    ],
  },
  {
    question: 'What is the process to exchange my car?',
    answer: [
      'Schedule an inspection of your current car.',
      'We evaluate and offer a value.',
      'Use that value towards your next car purchase.',
    ],
  },
  {
    question: 'Are there any hidden charges?',
    answer: [
      'No hidden fees for selling your car.',
      'Evaluation and listing are completely free.',
      'Any charges are disclosed upfront.',
    ],
  },
  {
    question: 'Do you offer financing for buyers?',
    answer: [
      'Yes, we have tie-ups with multiple banks.',
      'Finance options for both salaried and self-employed.',
      'EMI calculator available on request.',
    ],
  },
  {
    question: 'How do I know the car value offered is fair?',
    answer: [
      'We use AI-powered valuation based on market trends.',
      'You receive multiple offers from verified dealers.',
      'You are free to accept or decline.',
    ],
  },
  {
    question: 'Is test drive available before selling?',
    answer: [
      'Yes, test drives are available for buyers.',
      'All test drives are scheduled and supervised.',
    ],
  },
  {
    question: 'Can I sell a financed car?',
    answer: [
      'Yes, just provide the loan account statement.',
      'We assist with foreclosure and NOC issuance.',
    ],
  },
  {
    question: 'What if I change my mind after inspection?',
    answer: [
      'No obligation to sell after inspection.',
      'You can cancel or reschedule anytime.',
    ],
  },
  {
    question: 'Do you buy commercial vehicles?',
    answer: [
      'Yes, we deal in both private and commercial vehicles.',
      'Submit your details via our commercial vehicle form.',
    ],
  },
  {
    question: 'Can I list more than one car?',
    answer: [
      'Absolutely, there’s no limit.',
      'We offer special support for car dealers too.',
    ],
  },
  {
    question: 'How secure is the payment process?',
    answer: [
      'Payments are done via NEFT/IMPS same day.',
      'All transactions are legally documented.',
    ],
  },
  {
    question: 'Do you help with RTO work?',
    answer: [
      'Yes, we take care of ownership transfer and RTO formalities.',
      'No need for seller to visit RTO physically.',
    ],
  },
  {
    question: 'Where are your service centers located?',
    answer: [
      'We are available across major cities in India.',
      'Use our locator tool to find the nearest branch.',
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
          Everything you need to know about selling, buying, and exchanging your car.
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
