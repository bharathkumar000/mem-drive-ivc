'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Badge } from '../ui/Badge';

export default function SubmissionsView() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      // Fetch answers and relevant stats from the DB
      // Assuming a view or a join to get the AI probability per submission.
      // Wait, answers have ai_generated_probability, but the requirement: 
      // "Store results in `submissions` table: `similarity_score`, `ai_generated_probability`, `flagged`"
      // Looking at the schema, they are in the `answers` table, OR wait, user says:
      // "Store results in `submissions` table: `similarity_score`, `ai_generated_probability`, `flagged`." 
      // AND "In the admin submissions tab, show a colored badge".
      
      const { data, error } = await supabase
        .from('submissions') 
        .select(`
          id,
          ai_generated_probability,
          similarity_score,
          flagged,
          profiles!inner(full_name, email)
        `);
        
      if (!error && data) {
        setSubmissions(data);
      }
      setLoading(false);
    }
    fetchSubmissions();
  }, []);

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">AI Analysis & Flags</h2>
      <table className="min-w-full divide-y divide-gray-200 shadow sm:rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Similarity Rank</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Likelihood</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {submissions.map((ans) => {
            const aiProb = ans.ai_generated_probability || 0;
            
            // green (< 40%), amber (40–74%), red (≥ 75%).
            let badgeVariant = 'green';
            if (aiProb >= 75) badgeVariant = 'red';
            else if (aiProb >= 40) badgeVariant = 'amber';

            return (
              <tr key={ans.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ans.profiles?.full_name || 'Anonymous User'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ans.similarity_score != null ? `${ans.similarity_score}%` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Badge variant={badgeVariant}>
                    {aiProb.toFixed(1)}% ({badgeVariant})
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {ans.flagged ? (
                    <span className="text-red-600 font-semibold">Flagged</span>
                  ) : (
                    <span className="text-green-600">Clean</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
