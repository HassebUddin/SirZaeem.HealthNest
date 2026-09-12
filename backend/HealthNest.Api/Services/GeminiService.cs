using System.Text;
using System.Text.Json;

namespace HealthNest.Api.Services;

public class GeminiService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;

    private static readonly string[] KnownSpecializations =
    [
        "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
        "Orthopedic", "Pediatrician", "ENT Specialist", "Gynecologist",
        "Psychiatrist", "Gastroenterologist", "Ophthalmologist", "Dentist"
    ];

    public GeminiService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _config = config;
    }

    public async Task<(string specialization, string explanation)> AnalyzeSymptomsAsync(string symptoms)
    {
        var apiKey = _config["Gemini:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return FallbackAnalysis(symptoms);
        }

        var prompt = $$"""
            A patient describes these symptoms: "{{symptoms}}"

            From this exact list of specializations, pick the single most appropriate one:
            {{string.Join(", ", KnownSpecializations)}}

            Respond ONLY with valid JSON in this exact format, no markdown, no extra text:
            {"specialization": "<one of the list above>", "explanation": "<one short friendly sentence explaining why, max 30 words>"}
            """;

        var requestBody = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = prompt } } }
            }
        };

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}";

        try
        {
            var response = await _http.PostAsync(url,
                new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json"));

            if (!response.IsSuccessStatusCode)
                return FallbackAnalysis(symptoms);

            var responseJson = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseJson);

            var text = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString() ?? string.Empty;

            var cleaned = text.Trim().Trim('`').Replace("json", "", StringComparison.OrdinalIgnoreCase).Trim();
            using var resultDoc = JsonDocument.Parse(cleaned);

            var specialization = resultDoc.RootElement.GetProperty("specialization").GetString() ?? "General Physician";
            var explanation = resultDoc.RootElement.GetProperty("explanation").GetString() ?? string.Empty;

            if (!KnownSpecializations.Contains(specialization))
                specialization = "General Physician";

            return (specialization, explanation);
        }
        catch
        {
            return FallbackAnalysis(symptoms);
        }
    }

    private static (string, string) FallbackAnalysis(string symptoms)
    {
        var lower = symptoms.ToLowerInvariant();

        var rules = new (string[] keywords, string specialization)[]
        {
            (["heart", "chest pain", "palpitation"], "Cardiologist"),
            (["skin", "rash", "acne", "itch"], "Dermatologist"),
            (["headache", "migraine", "seizure", "numbness"], "Neurologist"),
            (["bone", "joint", "fracture", "back pain"], "Orthopedic"),
            (["child", "baby", "infant"], "Pediatrician"),
            (["ear", "nose", "throat", "sinus"], "ENT Specialist"),
            (["pregnan", "period", "menstrual"], "Gynecologist"),
            (["anxiety", "depression", "stress", "sleep"], "Psychiatrist"),
            (["stomach", "digestion", "nausea", "vomit"], "Gastroenterologist"),
            (["eye", "vision", "blurry"], "Ophthalmologist"),
            (["tooth", "teeth", "gum"], "Dentist")
        };

        foreach (var (keywords, specialization) in rules)
        {
            if (keywords.Any(lower.Contains))
                return (specialization, $"Based on your symptoms, a {specialization} would be best suited to help.");
        }

        return ("General Physician", "A General Physician can evaluate your symptoms and refer you further if needed.");
    }
}
