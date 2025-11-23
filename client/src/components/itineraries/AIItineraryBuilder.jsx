// client/src/components/itineraries/AIItineraryBuilder.jsx
import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Sparkles, Loader2, Check, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import api from '../../api/client';

export default function AIItineraryBuilder({ onItineraryCreated }) {
  const [formData, setFormData] = useState({
    destination: '',
    duration: 7,
    budget: 'moderate',
    travelers: 2,
    interests: [],
    accommodation_type: 'hotels',
    client_id: null
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const interestOptions = [
    'Sightseeing', 'Adventure', 'Culture', 'Food', 'Beach',
    'History', 'Nature', 'Shopping', 'Nightlife', 'Relaxation'
  ];

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleGenerate = async () => {
    if (!formData.destination || !formData.duration) {
      alert('Please fill in destination and duration');
      return;
    }

    setLoading(true);
    setGeneratedItinerary(null);

    try {
      const response = await api.post('/itineraries/generate', formData);
      setGeneratedItinerary(response.data.itinerary);

      if (onItineraryCreated) {
        onItineraryCreated(response.data.itinerary);
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      alert(error.response?.data?.error || 'Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedItinerary) return;

    alert('Itinerary saved successfully!');
    // Reset form
    setFormData({
      destination: '',
      duration: 7,
      budget: 'moderate',
      travelers: 2,
      interests: [],
      accommodation_type: 'hotels',
      client_id: null
    });
    setGeneratedItinerary(null);
  };

  return (
    <div className="space-y-6">
      {!generatedItinerary ? (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Itinerary Builder</h2>
              <p className="text-sm text-gray-600">Let Tono create a perfect itinerary</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Destination */}
            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Destination *
              </Label>
              <Input
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g., Paris, France"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Duration */}
              <div>
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Duration (days) *
                </Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  min="1"
                  max="30"
                  className="mt-1"
                />
              </div>

              {/* Travelers */}
              <div>
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Travelers
                </Label>
                <Input
                  type="number"
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                  min="1"
                  max="20"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget Level
              </Label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              >
                <option value="budget">Budget ($)</option>
                <option value="moderate">Moderate ($$)</option>
                <option value="luxury">Luxury ($$$)</option>
                <option value="ultra-luxury">Ultra Luxury ($$$$)</option>
              </select>
            </div>

            {/* Accommodation Type */}
            <div>
              <Label>Accommodation Type</Label>
              <select
                value={formData.accommodation_type}
                onChange={(e) => setFormData({ ...formData, accommodation_type: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              >
                <option value="hotels">Hotels</option>
                <option value="resorts">Resorts</option>
                <option value="apartments">Apartments</option>
                <option value="hostels">Hostels</option>
                <option value="villas">Villas</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            {/* Interests */}
            <div>
              <Label>Interests & Activities</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${formData.interests.includes(interest)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                  >
                    {formData.interests.includes(interest) && (
                      <Check className="w-3 h-3 inline mr-1" />
                    )}
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Client Selection */}
            <div>
              <Label>Assign to Client (Optional)</Label>
              <select
                value={formData.client_id || ''}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value || null })}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              >
                <option value="">No client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !formData.destination || !formData.duration}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Your Perfect Itinerary...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Itinerary
                </>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Itinerary Saved Successfully!</h2>
                <p className="text-sm text-gray-600">
                  {generatedItinerary.destination} • {generatedItinerary.duration} days
                </p>
              </div>
            </div>
            <Button onClick={() => setGeneratedItinerary(null)} variant="outline">
              Create Another
            </Button>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {/* Summary */}
            {generatedItinerary.ai_generated_json?.summary && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm">
                {generatedItinerary.ai_generated_json.summary}
              </div>
            )}

            {/* Daily Plans */}
            {generatedItinerary.ai_generated_json?.daily && generatedItinerary.ai_generated_json.daily.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg">Daily Itinerary</h3>
                {generatedItinerary.ai_generated_json.daily.map((day, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-white">
                    <div className="flex gap-3">
                      <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold mb-2">{day.title || `Day ${day.day}`}</h4>
                        {day.morning && <div className="text-sm mb-1"><span className="font-semibold text-orange-600">🌅 Morning:</span> {day.morning}</div>}
                        {day.afternoon && <div className="text-sm mb-1"><span className="font-semibold text-yellow-600">☀️ Afternoon:</span> {day.afternoon}</div>}
                        {day.evening && <div className="text-sm mb-1"><span className="font-semibold text-purple-600">🌙 Evening:</span> {day.evening}</div>}
                        {day.activities && day.activities.length > 0 && (
                          <div className="mt-2 text-sm">
                            <div className="font-semibold text-gray-600">Activities:</div>
                            <ul className="list-disc list-inside ml-2">
                              {day.activities.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Travel Tips */}
            {generatedItinerary.ai_generated_json?.travel_tips && generatedItinerary.ai_generated_json.travel_tips.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <h4 className="font-bold text-green-900 mb-2">💡 Travel Tips</h4>
                <ul className="list-disc list-inside text-sm text-green-800">
                  {generatedItinerary.ai_generated_json.travel_tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t">
            <Button onClick={() => {
              alert('Itinerary saved to your itineraries list!');
              setGeneratedItinerary(null);
              setFormData({ destination: '', duration: 7, budget: 'moderate', travelers: 2, interests: [], accommodation_type: 'hotels', client_id: null });
            }} className="flex-1">
              Done
            </Button>
            <Button variant="outline" onClick={() => {
              const content = JSON.stringify(generatedItinerary.ai_generated_json, null, 2);
              const blob = new Blob([content], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `itinerary-${generatedItinerary.destination.replace(/\s+/g, '-').toLowerCase()}.json`;
              a.click();
            }}>
              Download
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}